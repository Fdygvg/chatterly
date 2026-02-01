BACKEND = TS + ZOD Validation + MONGODB + EXPRESS + AWS S3
FRONTEND = TSX + SHADCN + CSS + TAILWIND
THEME = LAVENDER
/* CSS HEX */
--lavender-veil: #e5d9f2ff;
--lavender-mist: #f5efffff;
--periwinkle: #cdc1ffff;
--soft-periwinkle: #a594f9ff;
--medium-slate-blue: #7371fcff;

/
WebSocket Security

Authenticate on connection

Revalidate user identity (token/session check)

Authorize every room join

Do not trust client-sent userId or roomId

Rate-limit socket events (message spam, join/leave)

🔑 Authorization (Core Logic)

Can this user read this chat?

Can this user send messages to this room?

Can this user upload files here?

Can this user download this file?

This is the heart of your app’s security.

🧠 Redis Security

Bind Redis to backend private network

No public exposure

Use auth / ACLs

Firewall rules

Redis used only as cache / pub-sub

🍪 Cookie & Session Security

(Only if using cookies)

HttpOnly

Secure

SameSite (Lax or Strict)

CSRF tokens

Double-submit cookie or header validation

📁 File Upload Security

MIME type validation

File size limits

Magic byte validation

Filename randomization

Metadata stripping

Store in cloud object storage

Never execute uploaded files

📥 File Download Security

Authorization before download

Signed URLs

Expiry on links

Access checks per request

🧼 Input Handling

Input parameterization (Mongo-safe queries)

Input sanitization (prevent XSS in chat)

Escape or whitelist HTML

🚦 Rate Limiting

Login attempts

Message sending

File uploads

WebSocket events

🔐 Authentication & Passwords

Strong password policy (length > complexity)

Hash with bcrypt or argon2

Lockout / cooldown on repeated failures

📝 Logging

Auth failures

Upload failures

Permission denials

Suspicious socket behavior
❌ No passwords, tokens, or file contents

☁️ Infrastructure

Cloud storage for uploads

MongoDB URL / query parameter validation

Environment secrets not in code



Performance — organized note (like security)
🔹 Page / Asset Caching

Cache homepage shell

Cache chat page layout only, never messages

Hash JS/CSS for browser caching

🔹 Chat Messages

Load last N messages via API

Skeleton loader for initial perception

WebSocket handles new messages live

Do not TTL-cache live chat content (stale messages)

🔹 Lazy Loading

Infinite scroll for older messages

Load images/files only when visible (Intersection Observer)

Chunk API responses for long histories

🔹 Perceived Performance

Skeleton loaders for messages, avatars

“Connecting…” state for WebSocket

Optimistic UI: show sent messages instantly

Smooth transitions for joins/leaves




FEATURES =
1 ON 1 CHATS WITH SOCKET.IO
GROUP CHATS + AI WITH SOCKET.IO
AI  1 ON 1 CHAT 

FILE UPLOAD
            ATOMIC MESSAGES WITH STATUS
            GRACEFUL DEGRADATION IN UI
            mobile optimization is not a problem
            


INFO BAR TEXT COLOUR BASED ON PROFILE PIC COLOUR AFTER SCAN 

SEARCH FOR CHAT IN MAIN CHAT PAGE AND IN INDIVIDUAL CHATS

CAN PIN MESSAGE AND SPECIAL HIGHLIGHT FOR PINNED MESSAGES

CALL/VIDEO BTN (WILL SHWO COMING SOON WHEN CLICKED ON)

CAN CLICK PROFILE AND VIEW 
        PROFILE
        USERNAME
        DATE JOINED
        ADMIN STATUS(GROUP)
        BOT STATUS()
        DESC(IF BOT)

SIDE BAR BTN TO CLEAR CHAT, BLOCK/REPORT,CHANGE WALLPAPER

INFO BAR -- TYPING, ONLINE, LAST SEEN (EACH HAS OWN ANIMATION)

UNREAD JUMP BTN 

MINI AVATAR STACK FOR GROUPCHAT 

ABILITY FOR AI TO SEND GIFS

?PRESET ONE CLICK MESSAGES BASED ON THE CONVO?

IF UPLOADED FILE DISPLAY SIZE OF FILE UPLOADED

GOOGLE AUTH

MEMORY SYSTEM
        PER-ROOM-MEMORY

MINI GAMES - FLIP A COIN ANIMATION
             TIC-TAC-TOE


ABILITY TO REACT TO MESSAGES AFTER HOLDING THEM FOR A WHILE, AI ALSO HAS THIS ABILITY 

USER HAS TO SEND MESSAGE REQUESTS BEFORE THEY CAN MESSAGE ANY USER





model {
    room
    fileupload
    profilepic-colour
    regex{}
    pinnedmessages
    blocked
    wallpaper
    avatar
    unread
    status: TYPING|ONLINE|LASTSEEN
    gifs
    messagerequests
}





# 💬 Chat App Development Roadmap

## Phase 1: Core Foundation & Authentication
- [x] Initialize Backend Architecture (Express, TypeScript, MongoDB)
- [x] Implement User Authentication (JWT + Zod Validation)
- [x] Set Up Frontend Foundation (Vite, React, shadcn/ui, Tailwind CSS)
- [ ] Implement Lavender Design System & Global Styles
- [ ] Create Login & Registration UI

---

## Phase 2: Real-time Messaging (1-on-1)
- [ ] Set Up Socket.io on Backend
- [ ] Implement Socket.io Connection Security
- [ ] Create Message & Room Database Schemas
- [ ] Build 1-on-1 Chat UI
- [ ] Real-time Data Sync
  - Online Status
  - Typing Indicators

---

## Phase 3: Group Chats & Advanced Features
- [ ] Implement Group Chat Logic & UI
- [ ] Add Reaction System (Hold-to-React)
- [ ] Message Pinning & Highlighting
- [ ] Search Functionality
  - Global Search
  - Room-specific Search
- [ ] Message Request System

---

## Phase 4: Multimedia & AI Integration
- [ ] S3 File Upload Integration
- [ ] File Security
  - MIME Type Validation
  - Signed URLs
- [ ] AI Integration
  - 1-on-1 Chat AI
  - Memory System
- [ ] GIF Support (AI-powered)
- [ ] Mini Games
  - Coin Flip
  - Tic-Tac-Toe

---

## Phase 5: Polishing, Performance & Security
- [ ] Profile Picture Color Scanning (Info Bar Sync)
- [ ] Infinite Scroll & Lazy Loading
- [ ] Skeleton Loaders & Optimistic UI
- [ ] Google Authentication Integration
- [ ] Call / Video Buttons (UI Placeholder)
- [ ] Security Audit
  - Rate Limiting
  - Redis Setup




Good but now i want you to do several things for me , phase 4 + 5 , i want you to split it into frontend and backend , i also have some new plan.md, @cloudserver.md, @email.md, @AI.md files so add those into consideratiosn when making this new plan of backend and fromtend , and also add dark mode to the list of frontend , and then i also want you to link my mongodb URI , so the data can actually besaved to the db  
so jsut two things in general , new plan and link backend to mongodb_uri




MESSAGE
BACKEND
TEST BACKEND




