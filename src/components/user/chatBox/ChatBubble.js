import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBubble.css';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

export default function ChatBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Xin chào! CakeShop có thể giúp gì cho bạn?' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:8080/api/ai/chat", { message: input });
            setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: "Xin lỗi, tôi gặp sự cố kết nối." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-bubble-wrapper">
            {/* Khung chat */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span>Hỗ trợ trực tuyến</span>
                        <CloseIcon onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }} />
                    </div>
                    <div className="chat-body" ref={scrollRef}>
                        {messages.map((msg, i) => (
                            <div key={i} className={`message-item ${msg.role}`}>
                                <div className="message-text">{msg.text}</div>
                            </div>
                        ))}
                        {loading && <div className="message-item ai"><div className="message-text">...</div></div>}
                    </div>
                    <div className="chat-footer">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Nhập tin nhắn..."
                        />
                        <SendIcon onClick={handleSendMessage} className="send-icon" />
                    </div>
                </div>
            )}

            {/* Bong bóng chat */}
            <div className="bubble-button" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <CloseIcon /> : <SmartToyIcon />}
            </div>
        </div>
    );
}