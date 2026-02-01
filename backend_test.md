# 🚀 Chatterly Backend API Test Points

## 🏥 Health Check
**GET** `http://localhost:3000/`
(Returns 200 OK if server is alive)

## 🔐 Authentication

### Signup
**POST** `http://localhost:3000/signup`
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### Login
**POST** `http://localhost:3000/login`
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Logout
**POST** `http://localhost:3000/logout`
*(Needs Auth Token)*

---

## 👥 Users

### List All Users
**GET** `http://localhost:3000/users`

### Update User Privacy Settings
**PATCH** `http://localhost:3000/users/me/privacy`
```json
{
  "isPublic": true
}
```

### 🚫 Blocking
- **Get Blocked Users**: **GET** `http://localhost:3000/users/me/blocked`
- **Block User**: **POST** `http://localhost:3000/users/{userId}/block`
- **Unblock User**: **DELETE** `http://localhost:3000/users/{userId}/block`

### 📩 Message Requests
- **Get My Requests**: **GET** `http://localhost:3000/users/me/message-requests`
- **Send Request**: **POST** `http://localhost:3000/users/{userId}/message-request`
- **Accept Request**: **POST** `http://localhost:3000/users/{userId}/message-request/accept`
- **Decline/Cancel Request**: **DELETE** `http://localhost:3000/users/{userId}/message-request`

### 📦 Archiving Rooms
- **Get Archived Rooms**: **GET** `http://localhost:3000/users/me/archived-rooms`
- **Archive Room**: **POST** `http://localhost:3000/users/rooms/{roomId}/archive`
- **Unarchive Room**: **DELETE** `http://localhost:3000/users/rooms/{roomId}/archive`



---

## 🏠 Chat Rooms

### Create Room (Group or Private)
**POST** `http://localhost:3000/rooms`
```json
{
  "type": "group",
  "name": "Testing Group",
  "members": ["user_id_1", "user_id_2"]
}
```

### Get My Rooms
**GET** `http://localhost:3000/rooms`

### Get Room Messages (History)
**GET** `http://localhost:3000/rooms/{roomId}/messages?page=1&limit=50`

### Add Member to Room
**POST** `http://localhost:3000/rooms/{roomId}/members`
```json
{
  "userId": "target_user_id"
}
```

---

## ☁️ Multimedia

### Get S3 Upload URL
**POST** `http://localhost:3000/api/upload/presign`
```json
{
  "filename": "test_image.jpg",
  "contentType": "image/jpeg",
  "fileSize": 102400
}
```

---

## 🔌 Socket.io Events (Real-time)
*Server URL:* `http://localhost:3000`

### Send Message
**EMIT** `message:send`
```json
{
  "roomId": "{roomId}",
  "content": "Hello World!",
  "type": "text"
}
```

### Chat with AI
**EMIT** `chat:ai_message`
```json
{
  "personalityId": "code_sage",
  "message": "Write a hello world in Python",
  "stream": true
}
```
