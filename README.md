# VishalGPT

<div align="center">

```text
██╗   ██╗██╗███████╗██╗  ██╗ █████╗ ██╗      ██████╗ ██████╗ ████████╗
██║   ██║██║██╔════╝██║  ██║██╔══██╗██║     ██╔════╝ ██╔══██╗╚══██╔══╝
██║   ██║██║███████╗███████║███████║██║     ██║  ███╗██████╔╝   ██║
╚██╗ ██╔╝██║╚════██║██╔══██║██╔══██║██║     ██║   ██║██╔═══╝    ██║
 ╚████╔╝ ██║███████║██║  ██║██║  ██║███████╗╚██████╔╝██║        ██║
  ╚═══╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝        ╚═╝
```

### A full-stack, Gemini-powered chat experience

**React · Vite · Express · MongoDB · Gemini**

</div>

---

## ◢◤ What is VishalGPT? ◥◣

VishalGPT is an authenticated chat application that lets people start conversations, receive Gemini-generated answers, revisit previous threads, and manage their profile. Its responsive client is paired with an Express API that persists accounts and chat history in MongoDB.

```text
                         ┌────────────────────┐
                         │  React + Vite UI   │
                         └─────────┬──────────┘
                                   │ HTTPS + JWT
                 ┌─────────────────▼─────────────────┐
                 │           Express API              │
                 └───────┬───────────────────┬────────┘
                         │                   │
              ┌──────────▼──────────┐ ┌──────▼────────────┐
              │       MongoDB       │ │   Gemini API      │
              │ users + chat threads│ │ AI chat responses │
              └─────────────────────┘ └───────────────────┘
```

## ✦ Highlights

| Capability | What it does |
| --- | --- |
| **Secure accounts** | Register, sign in, and maintain a JWT-authenticated session. |
| **Gemini chat** | Sends prompts to Gemini and saves both sides of each conversation. |
| **Thread history** | Creates a separate thread per conversation, with retrieval and deletion controls. |
| **Markdown answers** | Renders assistant responses with syntax highlighting for code blocks. |
| **Profile controls** | Lets signed-in users update their name or password and log out. |

## ◢◤ Tech stack ◥◣

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite, React Router, React Markdown, Rehype Highlight |
| Backend | Node.js, Express 5, Mongoose, JSON Web Tokens, bcryptjs |
| AI | Google Gemini (`gemini-2.5-flash`) |
| Data | MongoDB |

## ◢◤ Run it locally ◥◣

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure the API

Create `backend/.env` with your own values:

```env
PORT=8080
MONGOOSE_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace-with-a-long-random-secret
GEMINI_API_KEY=your-google-ai-api-key
```

> **Keep secrets private.** `.env` files should never be committed to source control.

### 3. Start the backend

```bash
cd backend
npm run dev
```

The API starts on `http://localhost:8080` unless `PORT` is changed.

### 4. Start the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Vite prints the local address to open in your browser.

> **Local API note:** the current frontend requests the deployed API at `https://vishal-chatboat.onrender.com`. To run the entire stack locally, replace that base URL in the frontend fetch calls with `http://localhost:8080` (or introduce a Vite environment variable).

## ◢◤ API at a glance ◥◣

All thread and chat routes require `Authorization: Bearer <token>`.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account and receive a token. |
| `POST` | `/api/auth/login` | Authenticate and receive a token. |
| `GET` | `/api/auth/me` | Get the signed-in profile. |
| `PUT` | `/api/auth/profile` | Update the signed-in user's name or password. |
| `POST` | `/api/chat` | Submit `{ threadId, message }` and receive a Gemini reply. |
| `GET` | `/api/thread` | List the current user's chat threads. |
| `GET` | `/api/thread/:threadId` | Load the messages in one thread. |
| `DELETE` | `/api/thread/:threadId` | Delete one thread. |

## ◢◤ Project map ◥◣

```text
vishal-chatboat/
├── backend/
│   ├── config/          # MongoDB and Gemini integrations
│   ├── controllers/     # Authentication and chat request handlers
│   ├── middleware/      # JWT protection
│   ├── models/          # User and conversation schemas
│   ├── routes/          # API route definitions
│   └── server.js        # Express entry point
└── frontend/
    └── src/             # React views, state context, and styles
```

## ◢◤ Quality checks ◥◣

```bash
cd frontend && npm run lint
cd frontend && npm run build
```

---

<div align="center">

Built by **Vishal** ♥

</div>
