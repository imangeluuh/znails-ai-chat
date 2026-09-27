const SESSION_KEY = "znails_chat_session_id";

// The backend groups messages by session_id (chat_repository.get_or_create_conversation).
// We generate one UUID per browser and keep reusing it via localStorage so a
// visitor's conversation stays continuous across page reloads.
export function getOrCreateSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
