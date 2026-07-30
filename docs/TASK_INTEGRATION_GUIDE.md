# Frontend Integration Guide: Task Assignment, Notifications & Live Broadcasts

This guide explains how the Frontend (Mobile/Web) should integrate the new Task Assignment API, handle real-time Task broadcasts (similar to live chat), and show in-app system notifications.

---

## 1. Task Creation & Assignment API

When a Mentor creates a task, they specify which Opportunity it belongs to, and whether it goes to all members or specific members.

* **Endpoint:** `POST /api/mentor/tasks`
* **Headers:** `Authorization: Bearer <token>`
* **Content-Type:** `application/json`

### Request Body Parameters:
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Yes | Title of the task. |
| `description` | `string` | Yes | Detailed instructions. |
| `deadline` | `string (date)` | Yes | Due date (e.g. `2026-08-15`). |
| `opportunity_id` | `integer` | Yes | The ID of the research opportunity. |
| `assign_type` | `string` | Yes | Must be either `'all'` or `'specific'`. |
| `researcher_ids` | `array of integers`| Yes (if `assign_type` is `specific`) | The user IDs of the selected researchers. |
| `rubric_id` | `integer` | No | Rubric ID (nullable/optional). |
| `video_url` | `string (url)` | No | Optional YouTube/Vimeo tutorial url. |

### Example Request Body (Specific Members):
```json
{
  "title": "Literature Review Draft",
  "description": "Write a draft summarizing 5 resources.",
  "deadline": "2026-08-20",
  "opportunity_id": 4,
  "assign_type": "specific",
  "researcher_ids": [10, 15, 22],
  "rubric_id": 2,
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

### Example Response (201 Created):
```json
{
  "message": "Task created successfully and assignments are processing",
  "data": {
    "id": 8,
    "mentor_id": 2,
    "opportunity_id": 4,
    "title": "Literature Review Draft",
    "description": "Write a draft summarizing 5 resources.",
    "rubric_id": 2,
    "deadline": "2026-08-20T00:00:00.000000Z",
    "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "updated_at": "2026-07-30T17:00:00.000000Z",
    "created_at": "2026-07-30T17:00:00.000000Z"
  }
}
```

---

## 2. Live Task Reception (Websockets / Laravel Echo)

To receive newly assigned tasks in real-time (like live chat), the frontend must subscribe to the logged-in researcher's **Private User Channel** using Laravel Echo.

* **Private Channel Name:** `App.Models.User.{userId}`
* **Websocket Event Name:** `task.assigned`

### JavaScript / React / Next.js Implementation Example:
```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Setup Laravel Echo instance
const echo = new Echo({
    broadcaster: 'reverb', // or 'pusher' depending on configuration
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 80,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 443,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/api/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    },
});

// Subscribe and listen for live task assignments
const userId = currentLoggedInUser.id;

echo.private(`App.Models.User.${userId}`)
    .listen('.task.assigned', (event) => {
        console.log('New Task Assigned Live:', event.task);
        
        // Example actions:
        // 1. Update the state of your Task List UI to show the new task instantly
        // 2. Play a notification sound
        // 3. Show a toast banner
    });
```

### Event Payload Structure:
```json
{
  "task": {
    "id": 8,
    "mentor_id": 2,
    "opportunity_id": 4,
    "title": "Literature Review Draft",
    "description": "Write a draft summarizing 5 resources.",
    "rubric_id": 2,
    "deadline": "2026-08-20T00:00:00.000000Z",
    "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "opportunity": {
      "id": 4,
      "title": "AI in Medical Publications",
      "thumbnail": "https://example.com/uploads/thumbnail.png"
    },
    "rubric": {
      "id": 2,
      "title": "Literature Review Rubric",
      "criteria": [
        {"name": "Sources Coverage", "points": 30},
        {"name": "Critical Analysis", "points": 40},
        {"name": "Structure & Coherence", "points": 30}
      ]
    }
  },
  "userId": 10
}
```

---

## 3. Real-Time System Notifications

A general database and broadcast notification is also sent to the researcher. The frontend can listen to Echo's default notification listener.

* **Broadcasting channel:** `App.Models.User.{userId}`
* **Default Pusher Notification event name:** `Illuminate\Notifications\Events\BroadcastNotificationCreated`

### Listener Example:
```javascript
echo.private(`App.Models.User.${userId}`)
    .notification((notification) => {
        console.log('Received notification:', notification);
        
        // notification.type will be "task_assigned"
        if (notification.type === 'task_assigned') {
            showToastBanner({
                title: notification.title, // "New Task Assigned"
                body: notification.message, // "You have been assigned a new task: Literature Review Draft"
                img: notification.thumbnail
            });
        }
    });
```

### Notification Payload Structure:
```json
{
  "id": "abc-123-uuid",
  "type": "task_assigned",
  "title": "New Task Assigned",
  "message": "You have been assigned a new task: Literature Review Draft",
  "url": "/tasks/8",
  "thumbnail": "https://example.com/uploads/thumbnail.png",
  "task_id": 8
}
```

---

## 4. Assign Researchers Manually (Late / Forgotten Assignment)

If a mentor misses or forgets to assign a researcher during task creation, they can manually assign them using this endpoint.

* **Endpoint:** `POST /api/mentor/tasks/{id}/assign`
* **Headers:** `Authorization: Bearer <token>`
* **Content-Type:** `application/json`

### Request Body Parameters:
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `researcher_ids` | `array of integers` | Yes | List of user IDs of researchers to be assigned. |

### Example Request Body:
```json
{
  "researcher_ids": [12, 19]
}
```

### Example Response (200 OK):
```json
{
  "message": "Researchers assigned successfully",
  "assigned_count": 2
}
```

---

## 5. Frontend UI/UX Guidelines for Mentor Dashboard (Task Management)

To ensure a high-quality experience for mentors, the frontend should implement the following screens and indicators:

### A. Task List Screen (Submission Count)
- In the mentor's task list view, each task card/row must display a summary of submissions.
- **Example Badge:** `Submissions: 5 / 12` (meaning 5 researchers submitted out of 12 assigned researchers).

### B. Task Single View Page
- A dedicated details page for each task (`/tasks/{id}`).
- Show the task Title, Description, Deadline, Video tutorial, and linked Rubric criteria.

### C. Researcher Submission & Non-Submission List (Inside Single View)
- Below the task details, show a full list of all assigned researchers.
- For each researcher, show their submission status:
  - **Submitted:** Show a link/button to view their document and check AI feedback.
  - **Not Submitted (Pending):** If a researcher has not submitted anything yet, display a warning/alert label: `🔴 Not Submitted yet`. This makes it easy for the mentor to identify who is late.
