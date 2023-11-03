'use client'
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import RightSideBar from './components/right-side-bar';
import Header from './components/header';
import MainChat from './components/main-chat';
import LeftSideBar from './components/left-side-bar';
import { UUID } from 'crypto';
import Modal from './components/create-group-modal';

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
    const [scrollUp, setScrollUp] = useState<boolean>(false);
    const [errormessage, setErrorMessage] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);

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
                    id: chatID,
                }),
            }))
            ws.onmessage = (event) => {
                if (!chatID) return
                const data = JSON.parse(event.data);
                const message = data.message
                console.log(data, 'data')
                if (data.type === 'ping') {
                    handleGetMessagesAndChats(chatID);
                    clearTimeout(pingTimeout);
                    pingTimeout = setTimeout(() => {
                        ws.close();
                    }, 60000 * 5);
                    return;
                } else if (data.type === 'welcome') { return }
                else if (data.type === 'confirm_subscription') { console.log(data, 'data'); return }
                else if (data.type === 'reject_subscription') { return }
            }
        }
        return () => {
            ws.close();
        }
    }, [chatID]);

    const handleGetMessagesAndChats = async (chatID: any) => {
        setDefaultHome(false);
        await axios({
            method: 'post',
            url: 'http://localhost:3001/messages/chats-and-messages',
            data: {
                chat_id: chatID,
                user_id: user_id,
            },
            headers: {
                Authorization: `Bearer ${token}|${tokenSecret}`,
            }
        }).then((response) => {
            if (response.data.status === 'success') {
                setChats(response.data.chats);
                setMessages(response.data.messages)
                if (!scrollUp) {
                    //@ts-ignore
                    messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
                }
            } else {
                setErrorMessage(response.data.error);
                setTimeout(() => {
                    setErrorMessage('')
                }, 3000)
            }
        }).catch((error) => {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage('')
            }, 3000)
        })
    }

    return (
        <>
            {showModal && <Modal
                user_id={user_id}
                token={token}
                tokenSecret={tokenSecret}
                setShowModal={setShowModal}
            />}
            <div className='flex flex-col wrapper min-h-[10vh] max-h-[10vh]'>
                <Header
                    currentUser={currentUser}
                    user_id={user_id}
                    token={token}
                    tokenSecret={tokenSecret}
                />
                <div className="flex bg-white min-h-[90vh]">
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
                        setShowModal={setShowModal}
                    />
                    {errormessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center w-screen fixed top-0 z-10" role="alert">
                        <p>{errormessage}</p>
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
                        setScrollUp={setScrollUp}
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
                        setChatId={setChatId}
                    />
                </div>
            </div>
        </>
    )
}

