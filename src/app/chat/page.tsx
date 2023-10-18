'use client'
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import RightSideBar from './components/right-side-bar';
import Header from './components/header';
import MainChat from './components/main-chat';
import LeftSideBar from './components/left-side-bar';
import { UUID } from 'crypto';

interface Chat {
    id: number;
    chat_type: string;
    chat_name: string;
    messages: {
        id: number;
        chat_id: number;
        user_id: UUID;
        message_text: string;
        event_message: boolean;
        sender: string;
    };
}

interface ActiveUser {
    user_id: number;
    user_name: string;
}

export default function Page() {

    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [chatID, setChatId] = useState<number>(0);
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [user_id, setUserId] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [tokenSecret, setTokenSecret] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<ActiveUser>({} as ActiveUser);
    const [defaultHome, setDefaultHome] = useState<boolean>(true);
    const messagesContainer = useRef<HTMLDivElement>(null);

    const [errormessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const id = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        const tokenSecret = process.env.NEXT_PUBLIC_TOKEN_SECRET;
        if (!id || !token || !tokenSecret) {
            router.push('/');
        }
        setUserId(id || '');
        setToken(token || '');
        setTokenSecret(tokenSecret || '');
        axios({
            method: 'post',
            url: 'http://localhost:3001/users/get-profile',
            data: {
                user_id: id,
            },
            headers: {
                Authorization: `Bearer ${token}|${tokenSecret}`,
            }
        }).then((response) => {
            if (response.data.status === 'success') {
                setChats(response.data.chats);
                setActiveUsers(response.data.active_users);
                setCurrentUser(response.data.user);
            } else {
                setErrorMessage(response.data.error);
            }
        }).catch((error) => {
            console.log(error);
        })
    }, [router]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001/cable');
        let pingTimeout: NodeJS.Timeout;
        ws.onopen = () => {
            ws.send(JSON.stringify({
                command: 'subscribe',
                identifier: JSON.stringify({
                    channel: 'MessagesChannel',
                }),
            }))
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                const message = data.message
                if (data.type !== 'ping' && data.message.chat_id === chatID) {
                    setMessages((messages) => [...messages, message])
                    setTimeout(() => {
                        //@ts-ignore
                        messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
                    }, 100)
                } else if (data.type === 'ping') {
                    clearTimeout(pingTimeout);
                    pingTimeout = setTimeout(() => {
                        ws.close();
                    }, 10 * 60 * 1000);
                    return;
                } else if (data.type === 'welcome') { return }
                else if (data.type === 'confirm_subscription') { console.log(data, 'data'); return }
                else if (data.type === 'reject_subscription') { return }
                console.log(data, 'data')
            }

            ws.onclose = () => {
                ws.send(JSON.stringify({
                    command: 'unsubscribe',
                    identifier: JSON.stringify({
                        channel: 'MessagesChannel',
                        id: chatID,
                    }),
                }))
            }
        }
        return () => {
            ws.close();
        }
    }, [chatID]);


    return (
        <>
            <div className='flex flex-col wrapper'>
                <Header
                    currentUser={currentUser}
                />
                <div className="flex shadow-lg rounded-lg bg-white">
                    <LeftSideBar
                        chats={chats}
                        user_id={user_id}
                        token={token}
                        tokenSecret={tokenSecret}
                        messages={messages}
                        setMessages={setMessages}
                        defaultHome={defaultHome}
                        setDefaultHome={setDefaultHome}
                        setChatId={setChatId}
                        chatID={chatID}
                        messagesContainer={messagesContainer}
                    />
                    {errormessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{errormessage}</span>
                    </div>
                    }
                    <MainChat
                        token={token}
                        tokenSecret={tokenSecret}
                        messages={messages}
                        setMessages={setMessages}
                        user_id={user_id}
                        defaultHome={defaultHome}
                        setDefaultHome={setDefaultHome}
                        chatID={chatID}
                        chats={chats}
                        setChats={setChats}
                        messagesContainer={messagesContainer}
                    />
                    <RightSideBar
                        activeUsers={activeUsers}
                        user_id={user_id}
                        token={token}
                        tokenSecret={tokenSecret}
                        messages={messages}
                        setMessages={setMessages}
                        defaultHome={defaultHome}
                        setDefaultHome={setDefaultHome}
                        messagesContainer={messagesContainer}
                    />
                </div>
            </div>
        </>
    )
}

