'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RightSideBar from './components/right-side-bar';
import Header from './components/header';
import MainChat from './components/main-chat';
import LeftSideBar from './components/left-side-bar';

interface Chat {
    chat_id: number;
    chat_name: string;
}

interface ActiveUser {
    user_id: number;
    user_name: string;
}

export default function Page() {
    const router = useRouter();
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

    useEffect(() => {
        const id = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        const tokenSecret = process.env.NEXT_PUBLIC_TOKEN_SECRET;
        if (!id || !token || !tokenSecret) {
            router.push('/');
        }
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
            }
        }).catch((error) => {
            console.log(error);
        })
    }, []);


    return (
        <>
            <div className='flex flex-col'>
                <Header />
                <div className="flex shadow-lg rounded-lg bg-white">
                    <RightSideBar />
                    <MainChat />
                    <LeftSideBar />
                </div>
            </div>
        </>
    )
}

