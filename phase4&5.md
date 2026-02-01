# Implementation Plan: Phase 4 & Phase 5  
**Frontend / Backend Split**

This document outlines the implementation of advanced features including **Multimedia**, **AI**, **Email Services**, and **Security Enhancements**, organized by phase and technical domain.

---

## Phase 4: Multimedia & AI Integration

### 🛠️ Backend (Express + Node.js)

#### 1. AWS S3 File Uploads
**Configuration**
- Set up `aws-sdk` using credentials from `.env`
- Reference: `cloudserver.md`

**Security Middleware**
- Implement `getExtension` and `checkMimeType` utilities
- Enforce:
  - Max file size: **10MB**
  - Allowed extensions: `.jpg`, `.png`, `.js`, `.json`, `.ts`, etc.
- Sanitize filenames before upload

**API Endpoints**
- `POST /api/upload/presign`
  - Generate presigned URLs for client-side uploads  
  - OR support server-side streaming uploads
- Strip or validate metadata where possible

---

#### 2. AI Integration (Groq + Personalities)

**Service Layer**
- Create `AIService` class using `groq-sdk`
- Initialize Groq client with `GROQ_API_KEY`
- Reference: `AI.md`

**Personalities Engine**
Define system prompts for each AI personality:

- **Code Sage**  
  - Model: `qwen/qwen3-32b`  
  - Personality: Tech-obsessed, serious  
  - Theme: Blue

- **Anime Playmate**  
  - Model: `openai/gpt-oss-120b`  
  - Personality: Hyper-energetic  
  - Theme: Vibrant purple

- **Lavender Companion**  
  - Model: `meta-llama/llama-4-scout-17b-16e-instruct`  
  - Personality: Calm, supportive  
  - Theme: Lavender

**Context Management**
- Maintain last **10 messages** per session
- Inject user context:
  - `"You're talking to ${username}"`

**GIF System**
- Store GIF mappings as JSON: `Mood -> GIF[]` per personality
- Parse AI response mood
- Append a random GIF URL based on detected mood

**Socket Events**
- Listen for `chat:ai_message`
- Emit:
  - Streaming responses **or**
  - Chunked/full responses back to client

---

### 🎨 Frontend (React + Vite + Tailwind)

#### 1. File Upload UI
**Upload Component**
- Drag & drop zone
- Upload progress bar
- Image preview before sending
- File size labels

**Integration**
- Connect to backend upload API / S3 presigned URLs

---

#### 2. Chat Interface Enhancements

**AI Chat View**
- Distinct visual identity per AI personality:
  - Avatar
  - Color scheme
  - Animations

**Personality Styles**
- **Code Sage**
  - Terminal-style UI
  - Monospaced fonts

- **Anime Playmate**
  - Vibrant animations
  - Bouncing message bubbles

- **Lavender Companion**
  - Soft gradients
  - Glassmorphism effects

**GIF Rendering**
- Component to render AI-sent GIFs
- Responsive sizing

**Interactivity**
- “Hold to React” on messages (AI can react too)
- AI status indicators:
  - Typing animations unique per personality

---

## Phase 5: Polishing, Performance & Security

### 🛠️ Backend (Express + Node.js)

#### 1. Email Service (SMTP)

**Configuration**
- Set up `nodemailer` with SMTP credentials
- Reference: `email.md`

**Email Templates**
- Welcome email (post-signup)
- Security alert (new login)
- Password reset flow

**Triggers**
- Hook email sending into Auth controller logic

---

#### 2. Security & Infrastructure

**Rate Limiting**
- Redis-backed rate limiting
- Strict limits for Auth routes
- General API throttling

**Database**
- Ensure `MONGODB_URI` is correctly used across all environments  
- Status: **Completed**

**Socket Security**
- Validate socket handshake authentication
- Event-level rate limiting

---

### 🎨 Frontend (React + Vite + Tailwind)

#### 1. Design System & Theming

**Dark Mode**
- Implement `ThemeContext` or Tailwind `dark:` utilities
- Define **“Deep Night”** palette (complements Lavender theme)
- Settings toggle switch

**Profile Features**
- Color extraction from user avatar to style Info Bar
- Profile modal includes:
  - Username
  - Join date
  - Badges (Admin / Bot)

---

#### 2. UX Polish

**Performance**
- Infinite scroll for chat history (virtualization)
- Skeleton loaders for initial fetch
- Optimistic UI for instant message rendering

**Mini-Games**
- Interactive coin flip animation
- Tic-Tac-Toe (socket-based)

**Navigation**
- Sidebar actions:
  - Clear chat
  - Block / Report user
  - Change wallpaper
