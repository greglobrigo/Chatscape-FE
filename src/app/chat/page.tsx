'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';
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
        event_message:boolean;
        sender: string;
    };
}

interface ActiveUser {
    user_id: number;
    user_name: string;
}

export default function Page() {
    const router = useRouter();
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [user_id, setUserId] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<ActiveUser>({} as ActiveUser);

    useEffect(() => {
        const id = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        const tokenSecret = process.env.NEXT_PUBLIC_TOKEN_SECRET;
        if (!id || !token || !tokenSecret) {
            router.push('/');
        }
        setUserId(id||'');
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
            }
        }).catch((error) => {
            console.log(error);
        })
    }, [router]);


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
                    />
                    <MainChat />
                    <RightSideBar
                    activeUsers={activeUsers}
                    />
                </div>
            </div>
        </>
    )
}

