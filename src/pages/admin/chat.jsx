import { useState, useEffect } from 'react';
import { useLocalStorage } from "@uidotdev/usehooks"
import { Centrifuge } from 'centrifuge';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [, setNavs] = useLocalStorage("navs", [])

    useEffect(() => {
        // Allocate Subscription to a channel.
        const centrifuge = new Centrifuge('ws://localhost:8083/connection/websocket');
        const sub = centrifuge.newSubscription('news');

        setNavs([
            { name: "在线客服", url: "/admin" },
            { name: "用户咨询", url: "/admin/chat" },
        ])

        // React on `news` channel real-time publications.
        sub.on('publication', function(ctx) {
            setMessages(prevMessages => [...prevMessages, ctx.data]);
            console.log(ctx.data);
        });

        // Trigger subscribe process.
        sub.subscribe();

        // Trigger actual connection establishement.
        centrifuge.connect();
    });

    return (
        <div>
            <h1>聊天室</h1>
            {messages.map((msg, index) => (
                <div key={index}>{msg}</div>
            ))}
        </div>
    )
}