import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat,
            token, setToken, setUser, user } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    // Keep a ref so the reply useEffect always reads the latest prompt value
    const promptRef = useRef(prompt);
    const dropdownRef = useRef(null);

    // Keep ref in sync with state
    useEffect(() => {
        promptRef.current = prompt;
    }, [prompt]);

    const getReply = async () => {
        if (!prompt.trim() || loading) return;
        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ message: prompt, threadId: currThreadId })
        };

        try {
            const response = await fetch("https://vishal-chatboat.onrender.com/api/chat", options);
            if (response.status === 401) {
                handleLogout();
                return;
            }
            const res = await response.json();
            setReply(res.reply);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!reply) return;

        const currentPrompt = promptRef.current;
        if (currentPrompt && reply) {
            setPrevChats(prevChats => ([
                ...prevChats,
                { role: "user", content: currentPrompt },
                { role: "assistant", content: reply }
            ]));
        }
        setPrompt("");
    }, [reply]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        navigate("/login");
    };

    const handleProfileClick = () => setIsOpen(prev => !prev);

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>VishalGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" ref={dropdownRef}>
                    <span className="userIcon" onClick={handleProfileClick}>
                        {user?.name?.charAt(0).toUpperCase() || <i className="fa-solid fa-user"></i>}
                    </span>

                    {isOpen &&
                        <div className="dropDown">
                            <div className="dropDownItem user-info">
                                <span className="user-name">{user?.name}</span>
                                <span className="user-email">{user?.email}</span>
                            </div>
                            <div className="dropDownItem" onClick={() => { navigate("/profile"); setIsOpen(false); }}>
                                <i className="fa-solid fa-pen"></i> Edit Profile
                            </div>
                            <div className="dropDownItem" onClick={handleLogout}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                            </div>
                        </div>
                    }
                </div>
            </div>

            <Chat />

            <ScaleLoader color="#fff" loading={loading} />

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !loading ? getReply() : ""}
                        disabled={loading}
                    />
                    <div id="submit" onClick={getReply} style={{ opacity: loading ? 0.4 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">VishalGPT can make mistakes. Check important info.</p>
            </div>
        </div>
    );
}

export default ChatWindow;
