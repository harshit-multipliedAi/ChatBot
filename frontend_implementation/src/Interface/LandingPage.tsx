import { useEffect, useRef, useState } from "react";
import "./LandingPage.css";
import axios from "axios";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - 100,
    y: window.innerHeight - 100,
  });
    const CHAT_WIDTH = 360;
    const CHAT_HEIGHT = 520;

    const showLeft =
      position.x + 64 + CHAT_WIDTH > window.innerWidth;

    const showTop =
      position.y + 64 + CHAT_HEIGHT > window.innerHeight;

    const dragRef = useRef<{
      isDragging: boolean;
      hasDragged: boolean;
      offsetX: number;
      offsetY: number;
    }>({
      isDragging: false,
      hasDragged: false,
      offsetX: 0,
      offsetY: 0,
    });

    const handlePointerDown = (e: React.PointerEvent) => {
      dragRef.current.isDragging = true;
      dragRef.current.hasDragged = false;

      dragRef.current.offsetX = e.clientX - position.x;
      dragRef.current.offsetY = e.clientY - position.y;

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    };

    const BUTTON_SIZE = 64;

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current.isDragging) return;

      let x = e.clientX - dragRef.current.offsetX;
      let y = e.clientY - dragRef.current.offsetY;

      if(
        Math.abs(x-position.x)>5||
        Math.abs(y-position.y)>5
      ){
        dragRef.current.hasDragged = true;
      }


      x = Math.max(
        0,
        Math.min(x, window.innerWidth - BUTTON_SIZE)
      );

      y = Math.max(
        0,
        Math.min(y, window.innerHeight - BUTTON_SIZE)
      );

      setPosition({ x, y });
    };

    const handlePointerUp = () => {
      dragRef.current.isDragging = false;

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  const backend_url = import.meta.env.VITE_BACKEND_API_URL_2;

  const [text, setText] = useState("");

  // Backend conversation id
  const [conversationId, setConversationId] =
    useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const handleClick = async () => {
    if (!text.trim()) return;

    const currentText = text;

    // Immediately show user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentText,
      },
    ]);

    setText("");

    try {
      const response = await axios.post(
        `${backend_url}/chat`,
        {
          conversationId,
          message: currentText,
        }
      );
      console.log(response)

      // Save conversation id after first request
      if (
        !conversationId &&
        response.data.reply.conversationId
      ) {
        setConversationId(
          response.data.reply.conversationId
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            response.data.reply.reply ??
            "No response received.",
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong.",
        },
      ]);
    }
  };

  const bottomRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="page">
      <header className="nav">
        <div className="logo">MULTIPLIED</div>

        <nav>
          <a>Humantic OS</a>
          <a>Solutions</a>
          <a>Company</a>

          <button>Book a demo</button>
        </nav>
      </header>

      <main className="hero">
        <h1>
          The operating
          <br />
          system for frontline
          <br />
          <em>human intelligence.</em>
        </h1>

        <p>
          We connect AI to the point of decision,
          turning frontline knowledge into
          enterprise intelligence.
        </p>
      </main>
      <div
          className="chatWrapper"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {/* {!open && ( */}
            <button
              className="fab"
              onPointerDown={handlePointerDown}
              onClick={() => {
                if(dragRef.current.hasDragged)return;
                setOpen(!open)
              }}
            >
              💬
            </button>
          {/* )} */}

          {open && (
            <div className="chatbox" 
              style={{
                left: showLeft? -CHAT_WIDTH -12 :76,
                top: showTop? -CHAT_HEIGHT + 64 :0
              }}
            >
              <div
                className="chatHeader"
                onPointerDown={handlePointerDown}
              >
                Company Chatbot
              </div>

              <div className="chatBody">
                {messages.map((m, i) => {
                  if (m.role === "system") return null;

                  return (
                    <div
                      key={i}
                      className={m.role === "user" ? "user" : "bot"}
                    >
                      {m.content}
                    </div>
                  );
                })}

                <div ref={bottomRef} />
              </div>

              <div className="chatInput">
                <input
                  value={text}
                  placeholder="Ask about the company..."
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleClick();
                    }
                  }}
                />

                <button onClick={handleClick}>Send</button>
              </div>
            </div>
          )}
        </div>

        {/* <button
          className="fab"
          onClick={() => setOpen(!open)}
          >
          💬
        </button>

      {open && (
        <div className="chatbox">
          <div className="chatHeader">
            Company Chatbot
          </div>

          <div className="chatBody">
            {messages.map((m, i) => {
              if (m.role === "system")
                return null;

              return (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "user"
                      : "bot"
                  }
                >
                  {m.content}
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>

          <div className="chatInput">
            <input
              value={text}
              placeholder="Ask about the company..."
              onChange={(e) =>
                setText(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleClick();
                }
              }}
            />

            <button onClick={handleClick}>
              Send
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}