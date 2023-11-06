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
import JoinPublicChatModal from './components/join-public-chat-modal';
import AddMemberModal from './components/add-member-modal';

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
    user_id: string;
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
    const [successmessage, setSuccessmessage] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [joinPublicChatModal, setJoinPublicChatModal] = useState<boolean>(false);
    const [addMemberModal, setAddMemberModal] = useState<boolean>(false);
    const [publicChat, setPublicChat] = useState<any[]>([]);
    const [autoFetch, setAutoFetch] = useState<boolean>(true);
    const [chatType, setChatType] = useState<string>('');
    const [selectedChat, setSelectedChat] = useState<any>({});

    useEffect(() => {
        const id = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        const tokenSecret = process.env.NEXT_PUBLIC_TOKEN_SECRET;
        if (!id || !token || !tokenSecret) {
            router.push('/');
            return;
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
                setTimeout(() => {
                    setErrorMessage('');
                }, 3000)
            }
        }).catch((error) => {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage('');
            }, 3000)
        })
    }, [router]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001/cable');
        ws.onopen = () => {
            ws.send(JSON.stringify({
                command: 'subscribe',
                identifier: JSON.stringify({
                    channel: 'MessagesChannel',
                    id: chatID,
                }),
            }))
            setAutoFetch(true);
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                const message = data.message
                console.log(data, 'data')
                if (data.type === 'ping') {
                    handleGetMessagesAndChats(chatID);
                    return;
                } else if (data.type === 'welcome') { return }
                else if (data.type === 'confirm_subscription') { console.log(data, 'data'); return }
                else if (data.type === 'reject_subscription') { return }
            }
        }
        // setTimeout(() => {
        //     ws.close();
        //     setAutoFetch(false);
        // }, 60000 * 5);
        setTimeout(() => {
            ws.close();
            setAutoFetch(false);
        }, 5000);
        return () => {
            ws.close();
        }
    }, [chatID]);

    const handleGetMessagesAndChats = async (chatID: any) => {
        const user_id = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        const tokenSecret = process.env.NEXT_PUBLIC_TOKEN_SECRET;
        await axios({
            method: 'post',
            url: 'http://localhost:3001/messages/chats-and-messages',
            data: {
                chat_id: chatID,
                user_id: user_id
            },
            headers: {
                Authorization: `Bearer ${token}|${tokenSecret}`,
            }
        }).then((response) => {
            if (response.data.status === 'success') {
                setChats(response.data.chats);
                setMessages(response.data.messages)
            } else if (response.data.status === 'failed') {
                setErrorMessage(response.data.error);
                setTimeout(() => {
                    setErrorMessage('');
                    if (response.data.error === 'Session expired, please login again.') {
                        router.push('/home');
                    }
                }, 3000)
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
            {
                showModal && <Modal
                    user_id={user_id}
                    token={token}
                    tokenSecret={tokenSecret}
                    setShowModal={setShowModal} />
            }
            {
                joinPublicChatModal && <JoinPublicChatModal
                    user_id={user_id}
                    token={token}
                    tokenSecret={tokenSecret}
                    setJoinPublicChatModal={setJoinPublicChatModal}
                    publicChat={publicChat}
                    setSuccessmessage={setSuccessmessage}
                    setErrorMessage={setErrorMessage}
                    setChats={setChats}
                    setMessages={setMessages}
                    setChatId={setChatId}
                    messagesContainer={messagesContainer}
                    setDefaultHome={setDefaultHome}
                    setChatType={setChatType}
                />
            }
            {
                addMemberModal && <AddMemberModal
                    user_id={user_id}
                    token={token}
                    tokenSecret={tokenSecret}
                    setAddMemberModal={setAddMemberModal}
                    selectedChat={selectedChat} 
                />
            }
            {
                errormessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center w-screen fixed top-0 z-10" role="alert">
                    <p>{errormessage}</p>
                </div>
            }
            {
                successmessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center w-screen fixed top-0 z-10" role="alert">
                    <p>{successmessage}</p>
                </div>
            }
            <div className='flex flex-col wrapper min-h-[10vh] max-h-[10vh]'>
                <Header
                    currentUser={currentUser}
                    user_id={user_id}
                    token={token}
                    tokenSecret={tokenSecret}
                    setJoinPublicChatModal={setJoinPublicChatModal}
                    setPublicChat={setPublicChat}
                    autoFetch={autoFetch}
                    setSelectedChat={setSelectedChat}
                />
                <div className="flex bg-white min-h-[90vh]">
                    <LeftSideBar
                        chats={chats}
                        user_id={user_id}
                        token={token}
                        tokenSecret={tokenSecret}
                        setMessages={setMessages}
                        setDefaultHome={setDefaultHome}
                        setChatId={setChatId}
                        messagesContainer={messagesContainer}
                        setShowModal={setShowModal}
                        chatType={chatType}
                        setChatType={setChatType}
                        setAddMemberModal={setAddMemberModal}
                        setSelectedChat={setSelectedChat}
                    />
                    <MainChat
                        token={token}
                        tokenSecret={tokenSecret}
                        messages={messages}
                        setMessages={setMessages}
                        user_id={user_id}
                        defaultHome={defaultHome}
                        chatID={chatID}
                        messagesContainer={messagesContainer}
                    />
                    <RightSideBar
                        activeUsers={activeUsers}
                        user_id={user_id}
                        token={token}
                        tokenSecret={tokenSecret}
                        setMessages={setMessages}
                        setDefaultHome={setDefaultHome}
                        messagesContainer={messagesContainer}
                        setChatId={setChatId}
                        setChatType={setChatType}
                    />
                </div>
            </div>
        </>
    )
}

