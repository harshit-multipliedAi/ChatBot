import {useEffect, useRef, useState} from "react";
import axios from "axios";
import "./box.css";

function Box(){
    const [text, setText] = useState("");
    const backend_url = import.meta.env.VITE_BACKEND_API_URL;
    type Message = {
        role: "user"|"assistant"|"system",
        content: string
    }
    const initialContext: Message[] = [
        {
            role: "system",
            content:
                "You are a helpful assistant. Answer the user's questions to the best of your ability. If you don't know the answer, say you don't know. Be concise and clear in your responses. Also you will be given a conversation history, so use that to provide better answers. Do not make up answers if you don't know the answer. Always be honest and helpful."
        }
    ];
    const [messages,setMessages] = useState<Message[]>(initialContext)
    useEffect(()=>{
        localStorage.setItem(
            "messageContext",
            JSON.stringify(initialContext)
        );
    },)

    useEffect(()=>{
        localStorage.setItem(
            "messageContext",
            JSON.stringify(messages)
        )
    },[messages]);

    const handleClick = async ()=>{
        if(!text.trim()) return;
        const userMessage: Message = {
            role: "user",
            content: text
        }

        const updatedMessage = [...messages,userMessage];

        setMessages(updatedMessage);
        setText("");
        try{
            const response = await axios.post(`${backend_url}/ask`,{data:updatedMessage});
            const aiMessage: Message = {
                role: "assistant",
                content: response?.data?.aiResponse || ""
            }
            setMessages(prev => [...prev, aiMessage]);
        } catch(error) {
            console.error(error);
        }

    }
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    bottomRef.current?.scrollIntoView({
        behavior: "smooth"
    });
    }, [messages]);



    return (
        <div className="chat-container">
        <div className="header">
            <h1>Multiplied AI</h1>
        </div>

        <div className="messages">
            {messages.filter(msg => msg.role!=="system").map((msg, index) => (
            <div
                key={index}
                className={
                msg.role === "user"
                    ? "message user-message"
                    : "message ai-message"
                }
            >
                {msg.content}
            </div>
            ))}
            <div ref={bottomRef}/>
        </div>

        <div className="input-section">
            <input
            type="text"
            placeholder="Ask something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
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
        
        );
    }

export default Box;