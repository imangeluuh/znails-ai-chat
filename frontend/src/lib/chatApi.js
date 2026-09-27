// Base URL of your FastAPI backend. Set VITE_API_BASE_URL in a .env file
// (see .env.example) once you deploy — falls back to local dev here.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// NOTE: adjust this path if your `chat` router is mounted with an extra
// prefix in your FastAPI app (e.g. app.include_router(chat_router, prefix="/api")
// would make this "/api/chat/"). As given, router = APIRouter(prefix="/chat")
// with a POST "/" route means the full path is "/chat/".
const CHAT_ENDPOINT = `${API_BASE_URL}/chat/`;

export class ChatApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ChatApiError";
    this.status = status;
  }
}

/**
 * Sends a message to the FastAPI /chat endpoint.
 * Matches ChatRequest { session_id, message } -> ChatResponse { response }.
 */
export async function sendChatMessage({ sessionId, message }) {
  let res;
  try {
    res = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, message }),
    });
  } catch {
    throw new ChatApiError(
      "Can't reach the server right now — is the backend running?",
      0
    );
  }

  if (res.status === 429) {
    throw new ChatApiError(
      "You're sending messages a bit too fast — please wait a moment and try again.",
      429
    );
  }

  if (!res.ok) {
    throw new ChatApiError(
      "Something went wrong on our end. Please try again in a moment.",
      res.status
    );
  }

  const data = await res.json();
  return data.response;
}
