import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatApiError, sendChatMessage } from "@/lib/chatApi";
import { getOrCreateSessionId } from "@/lib/chatSession";

const GREETING_DELAY_MS = 1500;

const INITIAL_MESSAGE = {
  id: "greeting",
  role: "assistant",
  text: "Hi! 👋 I'm the Z Nails assistant. Ask me about services, pricing, or booking a slot.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingDismissed, setGreetingDismissed] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const sessionIdRef = useRef(null);

  if (sessionIdRef.current === null) {
    sessionIdRef.current = getOrCreateSessionId();
  }

  // Show the attention-getting greeting bubble a moment after page load.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open && !greetingDismissed) setShowGreeting(true);
    }, GREETING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [open, greetingDismissed]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isTyping, open]);

  const openChat = () => {
    setOpen(true);
    setShowGreeting(false);
    setGreetingDismissed(true);
  };

  const dismissGreeting = (e) => {
    e.stopPropagation();
    setShowGreeting(false);
    setGreetingDismissed(true);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text }]);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await sendChatMessage({
        sessionId: sessionIdRef.current,
        message: text,
      });
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: reply },
      ]);
    } catch (err) {
      const message =
        err instanceof ChatApiError
          ? err.message
          : "Something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "error", text: message },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-start gap-3">
      {open && (
        <div className="animate-chat-pop flex h-96 w-80 max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border bg-blush-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blush-500 text-white">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">Z Nails Assistant</p>
                <p className="text-xs text-muted-foreground">Usually replies in a few minutes</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "assistant" && "bg-muted text-foreground",
                  m.role === "user" && "ml-auto bg-blush-500 text-white",
                  m.role === "error" &&
                    "border border-red-200 bg-red-50 text-red-700"
                )}
              >
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div className="flex w-fit items-center gap-1 rounded-2xl bg-muted px-3 py-2">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              disabled={isTyping}
              className="h-9 flex-1 rounded-full border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            />
            <Button type="submit" size="icon" aria-label="Send message" disabled={isTyping} className="border-0">
              <Send className="text-blush-500" />
            </Button>
          </form>
        </div>
      )}

      {!open && (
        <div className="relative">
          {showGreeting && (
            <div className="animate-chat-pop absolute bottom-[calc(100%+10px)] right-0 w-56 rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 text-sm shadow-lg">
              <button
                onClick={dismissGreeting}
                aria-label="Dismiss greeting"
                className="absolute right-2 top-2 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              Hi there! 👋 Need help with booking or services?
            </div>
          )}

          <button
            onClick={openChat}
            aria-label="Open chat"
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full bg-blush-500 text-white shadow-lg transition-transform hover:scale-105",
              !greetingDismissed && "animate-chat-pulse"
            )}
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
