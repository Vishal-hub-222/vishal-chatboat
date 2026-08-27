import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat,
            token, setToken, setUser, user } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const getReply = async () => {
        if (!prompt.trim()) return;
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
            const response = await fetch("http://localhost:8080/api/chat", options);
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

        if (prompt && reply) {
            setPrevChats(prevChats => ([
                ...prevChats,
                { role: "user", content: prompt },
                { role: "assistant", content: reply }
            ]));
        }
        setPrompt("");
    }, [reply]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        navigate("/login");
    };

    const handleProfileClick = () => setIsOpen(!isOpen);

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>VishalGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon">
                        {user?.name?.charAt(0).toUpperCase() || <i className="fa-solid fa-user"></i>}
                    </span>
                </div>
            </div>

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

            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" ? getReply() : ""}
                    />
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">VishalGPT can make mistakes. Check important info.</p>
            </div>
        </div>
    );
}

export default ChatWindow;
