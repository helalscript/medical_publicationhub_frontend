# Opportunity Direct Enrollment — Frontend Integration Guide

> **Feature:** Application system replace করে **Direct Payment → Auto Chat Group Enrollment**
> **Date:** 2026-07-29
> **Base URL:** `{{base_url}}/api`

---

## 📋 Overview / কী পরিবর্তন হয়েছে

আগে researcher opportunity তে **apply** করতো, admin approve করতো।
এখন researcher সরাসরি **pay** করলেই opportunity র chat group এ **automatically add** হয়ে যাবে।

```
পুরনো flow:   Researcher → Apply → Admin Approve → Chat Group
নতুন flow:   Researcher → Pay → Webhook → Auto Chat Group Add ✅
```

---

## 🔑 Authentication

সব researcher route এ **Bearer Token** লাগবে:
```
Authorization: Bearer {researcher_token}
```

---

## 📌 New API Endpoints

### 1. Opportunity List (Public — unchanged)

```
GET /api/opportunities
GET /api/opportunities/{id}
```

**Response এ নতুন fields:**
```json
{
  "id": 1,
  "title": "AI Research Program",
  "price": "199.00",
  "total_seats": 20,
  "available_seats": 15,
  "status": "active"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `total_seats` | integer \| null | Total capacity. **null = unlimited** |
| `available_seats` | integer \| null | Remaining seats. **null = unlimited** |

> ⚠️ **Frontend check:** `available_seats === null` হলে "Unlimited" দেখাও। `available_seats === 0` হলে "Seats Full" দেখাও।

---

### 2. Enroll in Opportunity (Paid)

```
POST /api/researcher/opportunities/{id}/enroll
Authorization: Bearer {researcher_token}
```

**Request Body (paid opportunity):**
```json
{
  "callback_url": "https://yourapp.com/payment/callback",
  "source": {
    "type": "creditcard",
    "name": "John Doe",
    "number": "4111111111111111",
    "cvc": "123",
    "month": "12",
    "year": "2026"
  }
}
```

**Request Body (free opportunity — price = 0):**
```json
{}
```
> Free opportunity তে `callback_url` ও `source` লাগবে না।

---

#### Response Cases:

**✅ Paid — Payment Initiated (201)**
```json
{
  "success": true,
  "message": "Payment initiated. Awaiting confirmation.",
  "data": {
    "status": "pending",
    "payment": {
      "id": 5,
      "user_id": 12,
      "payable_type": "App\\Models\\Opportunity",
      "payable_id": 1,
      "amount": "199.00",
      "payment_gateway": "moyasar",
      "payment_gateway_id": "pay_abc123",
      "status": "pending",
      "created_at": "2026-07-29T..."
    },
    "moyasar_payment": {
      "id": "pay_abc123",
      "status": "initiated",
      "source": {
        "transaction_url": "https://api.moyasar.com/..."
      }
    }
  }
}
```

> 💡 **Frontend:** `moyasar_payment.source.transaction_url` এ user কে redirect করো payment complete করতে।

---

**✅ Free — Enrolled Immediately (200)**
```json
{
  "success": true,
  "message": "Successfully enrolled in this opportunity.",
  "data": {
    "status": "enrolled",
    "chat_id": 7
  }
}
```

> 💡 **Frontend:** সরাসরি `chat_id` দিয়ে chat screen এ navigate করো।

---

**⚠️ Already Pending (200)**
```json
{
  "success": true,
  "message": "You have a pending enrollment payment.",
  "data": {
    "status": "pending",
    "payment": { ... },
    "message": "Payment is being processed. Please wait or complete the payment."
  }
}
```

---

**❌ Already Enrolled (422)**
```json
{
  "success": false,
  "message": "You are already enrolled in this opportunity."
}
```

**❌ No Seats Available (422)**
```json
{
  "success": false,
  "message": "No seats available for this opportunity."
}
```

**❌ Opportunity Inactive (422)**
```json
{
  "success": false,
  "message": "This opportunity is not currently accepting enrollments."
}
```

---

### 3. Check Enrollment Status

```
GET /api/researcher/opportunities/{id}/enrollment-status
Authorization: Bearer {researcher_token}
```

**Response — Enrolled ✅**
```json
{
  "success": true,
  "message": "You are enrolled in this opportunity.",
  "data": {
    "status": "enrolled",
    "chat_id": 7
  }
}
```

**Response — Payment Pending ⏳**
```json
{
  "success": true,
  "message": "Enrollment payment is pending.",
  "data": {
    "status": "pending",
    "payment": { ... },
    "chat_id": null,
    "message": "Your payment is being processed. You will be added to the group once confirmed."
  }
}
```

**Response — Not Enrolled**
```json
{
  "success": true,
  "data": {
    "status": "not_enrolled",
    "chat_id": null
  }
}
```

**Response — Failed/Cancelled**
```json
{
  "success": true,
  "data": {
    "status": "failed",
    "payment": { ... },
    "chat_id": null
  }
}
```

---

## 🔄 Complete Frontend Flow

```
1. GET /api/opportunities/{id}
   └─ দেখাও: price, available_seats, status

2. User "Enroll Now" button click করলে:
   └─ POST /api/researcher/opportunities/{id}/enroll
      ├─ status === "enrolled"  → Chat screen এ navigate করো (chat_id ব্যবহার করে)
      ├─ status === "pending"   → Pending screen দেখাও + polling করো
      └─ error 422              → Error message দেখাও

3. Moyasar Payment redirect হলে:
   └─ callback_url এ return করলে:
      └─ GET /api/researcher/opportunities/{id}/enrollment-status
         ├─ status === "enrolled"  → Chat screen এ navigate করো ✅
         ├─ status === "pending"   → আরও কিছুক্ষণ wait করো (webhook এ confirm হবে)
         └─ status === "failed"    → Failed screen দেখাও ❌

4. Optional polling (payment pending থাকলে):
   └─ প্রতি 5 সেকেন্ডে GET enrollment-status call করো
      └─ "enrolled" হলে polling বন্ধ করে chat এ নিয়ে যাও
```

---

## 🎨 UI States Guide

| Condition | UI দেখাবে |
|-----------|-----------|
| `available_seats === null` | "Unlimited Seats" badge |
| `available_seats > 0` | "X seats remaining" |
| `available_seats === 0` | "Seats Full" — Enroll button disable |
| `status === "inactive"` | "Not Accepting" — Enroll button hide |
| `price === "0.00"` | "Free" badge — No payment needed |
| Enrollment status: `enrolled` | "You are enrolled" + "Open Chat" button |
| Enrollment status: `pending` | "Payment Pending" spinner |
| Enrollment status: `failed` | "Payment Failed" + Retry button |
| Enrollment status: `not_enrolled` | "Enroll Now" button |

---

## 💬 After Enrollment — Chat Access

Enrollment confirm হলে researcher automatically chat group এ add হয়।
Chat access করতে existing chat API use করো:

```
GET /api/researcher/chats
GET /api/researcher/chats/{chat_id}
POST /api/researcher/chats/{chat_id}/messages
```

---

## 🔧 Payment Webhook (Backend Only — No Frontend Action Needed)

Moyasar payment complete হলে backend automatically:
1. Payment status → `paid` mark করে
2. Researcher কে opportunity chat group এ add করে
3. Available seats decrement করে

Frontend এ শুধু `enrollment-status` poll করলেই হবে।

---

## 📦 Postman Collection Update

নতুন endpoints test করতে `docs/postman/api_collection.json` এ এই ২টা request add করো:

**Enroll:**
```json
{
  "name": "Enroll in Opportunity",
  "request": {
    "method": "POST",
    "header": [
      { "key": "Authorization", "value": "Bearer {{researcher_token}}" },
      { "key": "Accept", "value": "application/json" }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"callback_url\": \"https://yourapp.com/callback\",\n  \"source\": {\n    \"type\": \"creditcard\",\n    \"name\": \"Test User\",\n    \"number\": \"4111111111111111\",\n    \"cvc\": \"123\",\n    \"month\": \"12\",\n    \"year\": \"2026\"\n  }\n}",
      "options": { "raw": { "language": "json" } }
    },
    "url": "{{base_url}}/researcher/opportunities/1/enroll"
  }
}
```

**Status:**
```json
{
  "name": "Check Enrollment Status",
  "request": {
    "method": "GET",
    "header": [
      { "key": "Authorization", "value": "Bearer {{researcher_token}}" }
    ],
    "url": "{{base_url}}/researcher/opportunities/1/enrollment-status"
  }
}
```

---

## ⚠️ Important Notes for Frontend

1. **Seat check:** Enroll button click করার আগে `available_seats > 0 || available_seats === null` check করো
2. **Duplicate prevention:** একই opportunity তে দুইবার enroll call করলে backend `pending` status return করবে — এটা handle করো
3. **Webhook delay:** Payment confirm হতে 1-10 seconds লাগতে পারে — polling দরকার
4. **Free opportunities:** `price === "0.00"` হলে `source` ও `callback_url` ছাড়াই POST করো
5. **Error handling:** সব 422 error এর `message` field দেখিয়ে দাও user কে
