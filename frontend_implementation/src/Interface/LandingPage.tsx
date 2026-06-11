// import { Rnd } from "react-rnd";
// import { useEffect, useRef, useState } from "react";
// import "./LandingPage.css";
// import axios from "axios";

// type Message = {
//   role: "user" | "assistant" | "system";
//   content: string;
// };

// export default function LandingPage() {
//   const [open, setOpen] = useState(false);
//   const FAB_SIZE = 64;

//   const [chatState, setChatState] = useState({
//     x: window.innerWidth - FAB_SIZE - 20,
//     y: window.innerHeight - FAB_SIZE - 20,
//     width: 360,
//     height: 520,
//   });
//   const backend_url = import.meta.env.VITE_BACKEND_API_URL_2;

//   const [text, setText] = useState("");

//   // Backend conversation id
//   const [conversationId, setConversationId] =
//     useState<string | null>(null);

//   const [messages, setMessages] = useState<Message[]>([]);

//   const handleClick = async () => {
//     if (!text.trim()) return;

//     const currentText = text;

//     // Immediately show user message
//     setMessages((prev) => [
//       ...prev,
//       {
//         role: "user",
//         content: currentText,
//       },
//     ]);

//     setText("");

//     try {
//       const response = await axios.post(
//         `${backend_url}/chat`,
//         {
//           conversationId,
//           message: currentText,
//         }
//       );
//       console.log(response)

//       // Save conversation id after first request
//       if (
//         !conversationId &&
//         response.data.reply.conversationId
//       ) {
//         setConversationId(
//           response.data.reply.conversationId
//         );
//       }

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content:
//             response.data.reply.reply ??
//             "No response received.",
//         },
//       ]);
//     } catch (err) {
//       console.error(err);

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content:
//             "Sorry, something went wrong.",
//         },
//       ]);
//     }
//   };

//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages]);

//   return (
//     <div className="page">
//       <header className="nav">
//         <div className="logo">MULTIPLIED</div>

//         <nav>
//           <a>Humantic OS</a>
//           <a>Solutions</a>
//           <a>Company</a>

//           <button>Book a demo</button>
//         </nav>
//       </header>

//       <main className="hero">
//         <h1>
//           The operating
//           <br />
//           system for frontline
//           <br />
//           <em>human intelligence.</em>
//         </h1>

//         <p>
//           We connect AI to the point of decision,
//           turning frontline knowledge into
//           enterprise intelligence.
//         </p>
//       </main>
//       <Rnd
//         size={{
//           width: open ? chatState.width : 64,
//           height: open ? chatState.height : 64,
//         }}
//         position={{
//           x: chatState.x,
//           y: chatState.y,
//         }}
//         bounds="window"
//         minWidth={320}
//         minHeight={open ? 400 : 64}
//         maxWidth={700}
//         maxHeight={800}
//         dragHandleClassName="chatHeader"
//         enableResizing={
//           open
//             ? {
//                 top: true,
//                 right: true,
//                 bottom: true,
//                 left: true,
//                 topRight: true,
//                 bottomRight: true,
//                 bottomLeft: true,
//                 topLeft: true,
//               }
//             : false
//         }
//         onDragStop={(_, d) => {
//           setChatState((prev) => ({
//             ...prev,
//             x: d.x,
//             y: d.y,
//           }));
//         }}
//         onResizeStop={(_, _dir, ref, _delta, position) => {
//           setChatState({
//             x: position.x,
//             y: position.y,
//             width: ref.offsetWidth,
//             height: ref.offsetHeight,
//           });
//         }}
//         style={{
//           zIndex: 9999
//         }}
//       >
//         {!open ? (
//           <button
//             className="fab"
//             onClick={() => setOpen(true)}
//           >
//             💬
//           </button>
//         ) : (
//           <div className="chatbox">
//             <div className="chatHeader">
//               Company Chatbot

//               <button
//                 className="closeBtn"
//                 onClick={() => setOpen(false)}
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="chatBody">
//               {messages.map((m, i) => {
//                 if (m.role === "system") return null;

//                 return (
//                   <div
//                     key={i}
//                     className={
//                       m.role === "user"
//                         ? "user"
//                         : "bot"
//                     }
//                   >
//                     {m.content}
//                   </div>
//                 );
//               })}

//               <div ref={bottomRef} />
//             </div>

//             <div className="chatInput">
//               <input
//                 value={text}
//                 placeholder="Ask about the company..."
//                 onChange={(e) =>
//                   setText(e.target.value)
//                 }
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     handleClick();
//                   }
//                 }}
//               />

//               <button onClick={handleClick}>
//                 Send
//               </button>
//             </div>
//           </div>
//         )}
//       </Rnd>
//     </div>
//   );
// }

import { Rnd } from "react-rnd";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./LandingPage.css";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function LandingPage() {
  const backend_url = import.meta.env.VITE_BACKEND_API_URL_2;

  const [open, setOpen] = useState(false);

  const [chatState, setChatState] = useState({
    x: window.innerWidth - 420,
    y: window.innerHeight - 620,
    width: 380,
    height: 560,
  });

  const [text, setText] = useState("");

  const [conversationId, setConversationId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleClick = async () => {
    if (!text.trim() || loading) return;

    const currentText = text.trim();

    // Show user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentText,
      },
    ]);

    setText("");
    setLoading(true);

    try {
      const response = await axios.post(`${backend_url}/chat`, {
        conversationId,
        message: currentText,
      });

      console.log(response);

      // Save conversation id only once
      if (!conversationId && response.data.reply?.conversationId) {
        setConversationId(response.data.reply.conversationId);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.reply?.reply ?? "No response received.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

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

          <button>Book Demo</button>
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
          We connect AI to the point of decision, turning frontline knowledge
          into enterprise intelligence.
        </p>
      </main>

      {/* Floating FAB */}

      <button className="fab" onClick={() => setOpen((prev) => !prev)}>
        💬
      </button>

      {/* Chat Window */}

      {open && (
        <Rnd
          bounds="window"
          dragHandleClassName="chatHeader"
          size={{
            width: chatState.width,
            height: chatState.height,
          }}
          position={{
            x: chatState.x,
            y: chatState.y,
          }}
          minWidth={320}
          minHeight={450}
          maxWidth={700}
          maxHeight={900}
          onDragStop={(_, d) => {
            setChatState((prev) => ({
              ...prev,
              x: d.x,
              y: d.y,
            }));
          }}
          onResizeStop={(_, __, ref, ___, position) => {
            setChatState({
              x: position.x,

              y: position.y,

              width: ref.offsetWidth,

              height: ref.offsetHeight,
            });
          }}
        >
          <div className="chatbox">
            <div className="chatHeader">
              <span>Company Assistant</span>

              <button className="closeBtn" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="chatBody">
              {messages.map((m, i) => {
                if (m.role === "system") return null;

                return (
                  <div key={i} className={m.role === "user" ? "user" : "bot"}>
                    {m.content}
                  </div>
                );
              })}
              {loading && <div className="bot typing">Thinking...</div>}

              <div ref={bottomRef} />
            </div>

            <div className="chatInput">
              <input
                disabled={loading}
                value={text}
                placeholder="Ask about the company..."
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClick();
                  }
                }}
              />

              <button onClick={handleClick} disabled={loading}>
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </Rnd>
      )}
    </div>
  );
}
