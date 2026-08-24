import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import {ScaleLoader} from "react-spinners";
import { apiFetch } from "./api.js";

function ChatWindow() {
    const {prompt, setPrompt, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");

    const getReply = async () => {
        const message = prompt.trim();
        if (!message || loading) return;

        setLoading(true);
        setNewChat(false);
        setError("");

        try {
            const res = await apiFetch("/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, threadId: currThreadId }) });
            setReply(res.reply);
            setPrevChats((chats) => [...chats, { role: "user", content: message }, { role: "assistant", content: res.reply }]);
            setPrompt("");
        } catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>FastGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>
            {error && <p className="errorMessage" role="alert">{error}</p>}
            
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && getReply()}
                        disabled={loading}
                    >
                           
                    </input>
                    <button id="submit" type="button" onClick={getReply} disabled={loading} aria-label="Send message"><i className="fa-solid fa-paper-plane"></i></button>
                </div>
                <p className="info">
                    FastGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;
