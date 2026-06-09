// import  { useEffect, useRef, useState } from "react";
// import "./LandingPage.css";
// import axios from "axios";

// export default function LandingPage() {
//   const [open,setOpen]=useState(false);
//   // const backend_url = import.meta.env.VITE_BACKEND_API_URL;
//   const backend_url = import.meta.env.VITE_BACKEND_API_URL_2;
//   const [text, setText] = useState("")
//     type Message = {
//         role: "user"|"assistant"|"system",
//         content: string
//     }
//   const initialContext: Message[] = [
//     {
//       role: "system",
//       content:
//         "You are a personal assistant chatbot for the company Multiplied Ai. So act like one and answer the customer or employees query whatever they ask."
//     },
//     {
//       role: "assistant",
//       content: "How can I help you?"
//     }
//   ];

//   const [messages, setMessages] = useState<Message[]>(() => {
//     const stored = localStorage.getItem("messageContext");

//     if (stored) {
//       try {
//         return JSON.parse(stored);
//       } catch {
//         return initialContext;
//       }
//     }

//     return initialContext;
//   });

// useEffect(() => {
//   localStorage.setItem(
//     "messageContext",
//     JSON.stringify(messages)
//   );
// }, [messages]);
// const handleClick = async () => {
//   if (!text.trim()) return;

//   const userMessage: Message = {
//     role: "user",
//     content: text,
//   };

//   setMessages((prev) => [...prev, userMessage]);

//   const currentText = text;
//   setText("");

//   try {
//     const response = await axios.post(`${backend_url}/chat`, {
//       message: currentText,
//     });

//     const aiMessage: Message = {
//       role: "assistant",
//       content:
//         response.data.reply ||
//         response.data.response ||
//         response.data.aiResponse ||
//         "No response received.",
//     };

//     setMessages((prev) => [...prev, aiMessage]);
//   } catch (error) {
//     console.error(error);

//     setMessages((prev) => [
//       ...prev,
//       {
//         role: "assistant",
//         content: "Sorry, something went wrong.",
//       },
//     ]);
//   }
// };

//     const bottomRef = useRef<HTMLDivElement>(null);
    
//         useEffect(() => {
//         bottomRef.current?.scrollIntoView({
//             behavior: "smooth"
//         });
//         }, [messages]);
    

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
//           The operating<br/>
//           system for frontline<br/>
//           <em>human intelligence.</em>
//         </h1>
//         <p>
//           We connect AI to the point of decision, turning frontline
//           knowledge into enterprise intelligence.
//         </p>
//       </main>

//       <button className="fab" onClick={()=>setOpen(!open)}>💬</button>

//       {open && (
//         <div className="chatbox">
//           <div className="chatHeader">Company Chatbot</div>
//           <div className="chatBody">
//             {messages.map((m, i) => {
//                 if (m.role === "system") return null;

//                 return (
//                     <div
//                     key={i}
//                     className={m.role === "user" ? "user" : "bot"}
//                     >
//                     {m.content}
//                     </div>
//                 );
//                 })}
//                 <div ref={bottomRef}/>
//           </div>
//           <div className="chatInput">
//             <input
//               value={text}
//               onChange={e=>setText(e.target.value)}
//               placeholder="Ask about the company..."
//               onKeyDown={e=>e.key==="Enter" && handleClick()}
//             />
//             <button onClick={handleClick}>Send</button>
//           </div>
//         </div>
        
//       )}
//     </div>
//   );
// }
import { useEffect, useRef, useState } from "react";
import "./LandingPage.css";
import axios from "axios";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function LandingPage() {
  const [open, setOpen] = useState(false);

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

      <button
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
      )}
    </div>
  );
}