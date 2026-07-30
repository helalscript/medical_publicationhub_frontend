# Course Integration & Video Access — Frontend Integration Guide

This guide describes how to integrate course listings, course purchases, access verification, and lesson video playback on the frontend.

---

## 🔑 Authentication

All private endpoints require the user to be authenticated. Send the JWT token in the Authorization header:
```text
Authorization: Bearer {user_token}
```

---

## 📌 API Endpoints

### 1. Public Course Directory
Get a list of all active courses. Supports pagination, searching, and filtering.

```http
GET /api/courses
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `per_page` | integer | Items per page (default: 10, max: 100) |
| `search` | string | Search by title, description, or overview |
| `price_min` | numeric | Minimum price filter |
| `price_max` | numeric | Maximum price filter |
| `category_ids` | array | Array of category IDs |
| `mentor_ids` | array | Array of mentor IDs |

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Courses retrieved successfully.",
  "code": 200,
  "data": [
    {
      "id": 1,
      "title": "Clinical Research Methodology",
      "short_description": "Learn the basics of clinical research design.",
      "price": "199.00",
      "status": "active"
    }
  ]
}
```

---

### 2. Public Course Details & Curriculum
Fetch detailed information about a course, including its modules and lessons.

```http
GET /api/courses/{id}?with_modules=1
```

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Course retrieved successfully.",
  "code": 200,
  "data": {
    "id": 1,
    "title": "Clinical Research Methodology",
    "price": "199.00",
    "modules": [
      {
        "id": 1,
        "title": "Introduction to Clinical Trials",
        "order_by": 1,
        "lessons": [
          {
            "id": 10,
            "title": "Lesson 1: Trial Phases",
            "video": "https://your-video-url.com/lesson1.mp4",
            "attached_file": "files/slide1.pdf",
            "order_by": 1,
            "durations": "15:00"
          }
        ]
      }
    ]
  }
}
```

---

### 3. User Purchased Courses (Private)
Retrieve a list of courses that the logged-in user has purchased and has active access to.

```http
GET /api/my-courses
Authorization: Bearer {user_token}
```

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "My courses retrieved successfully.",
  "code": 200,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "title": "Clinical Research Methodology",
        "price": "199.00"
      }
    ]
  }
}
```

---

### 4. Direct Course Purchase / Payment Integration

#### Step A: Initiate Payment via Moyasar
Send a request to create a payment request. Make sure `payable_type` is set to `course` (or `App\Models\Course`).

```http
POST /api/payments
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "payable_type": "course",
  "payable_id": 1,
  "amount": 199.00,
  "currency": "SAR",
  "description": "Enrollment in Clinical Research Methodology",
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

**Response Example (201 Created):**
```json
{
  "success": true,
  "message": "Payment request created successfully.",
  "code": 201,
  "data": {
    "payment": {
      "id": 54,
      "status": "pending",
      "amount": "199.00"
    },
    "moyasar_payment": {
      "id": "pay_abc123",
      "status": "initiated",
      "source": {
        "transaction_url": "https://api.moyasar.com/v1/payments/pay_abc123/3ds"
      }
    }
  }
}
```

> 💡 **Action:** Redirect the user to the `moyasar_payment.source.transaction_url` to complete 3D-Secure authentication.

#### Step B: Verification (Callback / Webhook)
Upon completing payment, Moyasar will redirect to the `callback_url`. The frontend should trigger the manual verification:
```http
POST /api/payments/{paymentId}/verify
Authorization: Bearer {user_token}
```
If verified successfully, the backend automatically registers the access in the database, allowing the user to play lessons.

---

## 🎬 Video Access & Playing Logic

### How to Check if a User has Access
To prevent unauthorized users from viewing course videos, the frontend must implement the following check:

1. **Verify Purchases:** Check if the course ID is present in the list returned by `GET /api/my-courses`.
2. **If Present:** Display the video player using the `video` link inside the nested `lessons` array from the `GET /api/courses/{id}` response.
3. **If Absent:** Display the "Buy Course" or "Enroll Now" CTA card instead of the video player.
