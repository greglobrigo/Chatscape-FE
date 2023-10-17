'use client'
import axios from 'axios';
import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import Image from 'next/image'


type LeftSideBarProps = {
    chats: React.ComponentProps<any>[];
    user_id: string;
    token: string;
    tokenSecret: string;
    messages: React.ComponentProps<any>[];
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
    defaultHome: boolean;
    setDefaultHome: React.Dispatch<React.SetStateAction<boolean>>;
    setChatId: React.Dispatch<React.SetStateAction<number>>;
    chatID: number;
};

//const ws = new WebSocket('ws://localhost:3001/cable');


const refreshMessages = (message: any) => {
    console.log('triggered')
}

// ws.onmessage = (e: any) => {
//     const data = JSON.parse(e.data);
//     if (data.type === 'ping') return
//     if (data.type === 'welcome') return
//     if (data.type === 'confirm_subscription') return
//     const message = data.message;
//     console.log(message)
//     setMessages([...messages, message]);
// }

export default function LeftSideBar({ chats, user_id, token, tokenSecret, messages, setMessages, defaultHome, setDefaultHome, setChatId, chatID }: LeftSideBarProps) {


    const connectToWebSocket = async () => {
        const ws = new WebSocket('ws://localhost:3001/cable');
        ws.onopen = () => {
            console.log('Connected to Web Socket Server')
            ws.send(
                JSON.stringify({
                    command: 'subscribe',
                    identifier: JSON.stringify({
                        channel: 'MessagesChannel',
                        chat_id: chatID,
                    }),
                })
            )
        }

        ws.onmessage = (e: any) => {
            const data = JSON.parse(e.data);
            if (data.type === 'ping') return
            if (data.type === 'welcome') return
            if (data.type === 'confirm_subscription') return
            const message = data.message;
            console.log(message)
            setMessages([...messages, message]);
        }

        ws.onclose = () => {
            console.log('Disconnected from Web Socket Server')
        }
    }


    const handleGetMessages = async (chatID: any) => {
     await connectToWebSocket();
    setDefaultHome(false);
     await axios({
            method: 'post',
            url: 'http://localhost:3001/messages/get',
            data: {
                chat_id: chatID,
                user_id: user_id,
            },
            headers: {
                Authorization: `Bearer ${token}|${tokenSecret}`,
            }
        }).then((response) => {
            if (response.data.status === 'success') {
                setMessages(response.data.messages)
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <div id="r-sidebar" className="hidden sm:flex sm:flex-col sm:min-w-[100px] md:flex md:flex-col md:min-w-[300px] lg:w-2/6 bg-gray-300 h-[90vh]">

            <div className="flex flex-col w-full border-r-2">

                <div className="border-b-2 py-4 px-2">
                    <h1 className="text-lg font-semibold text-center">Chats</h1>
                </div>
            </div>
            <div className='overflow-y-auto'>
                {chats.length > 0 ? chats.map((chat) => (
                    <div key={chat.id} onClick={() => { handleGetMessages(chat.id); setChatId(chat.id) }}
                        className="flex flex-row py-4 px-2 justify-around items-center border-b-2 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out">
                        <div className="w-1/2 2xl:w-1/2 3xl:w-1/2.5 4xl:w-1/3 5xl:w-1/4">
                            {
                                chat.chat_type === 'direct' &&
                                <div className="pr-2">
                                    <Image width={50} height={50}
                                        src={`/${chat.members.find((member: any) => member.id !== user_id)?.avatar}.png`}
                                        className="object-fit rounded-full border-4 border-[#FFFFFF]"
                                        alt="avatar"
                                    />
                                </div>
                            }
                            {
                                chat.chat_type === 'group' || chat.chat_type === 'public' &&
                                <div className="flex flex-row pr-2">
                                    {chat.members.map((member: any, index: number) => (
                                        <Image key={index} width={50} height={50}
                                            src={`/${member.avatar}.png`}
                                            className="object-fit rounded-full border-4 border-[#FFFFFF]" {...(index > 0 ? { style: { marginLeft: '-35px' } } : {})}
                                            alt="avatar"
                                        />
                                    ))}
                                </div>
                            }
                        </div>
                        <div className="w-full">
                            {
                                chat.chat_type === 'direct' &&
                                <span className="text-md font-semibold">{chat.members.find((member: any) => member.id !== user_id)?.name}</span>
                            }
                            {
                                chat.chat_type === 'group' || chat.chat_type === 'public' &&
                                <span className="text-md font-semibold">{chat.chat_name}</span>
                            }
                            <div className="flex flex-row justify-between items-end">
                                {
                                    chat.chat_type === 'direct' && chat.messages &&
                                    <span className="text-gray-500 text-md">{chat.messages.user_id === user_id ? 'You: ' : null} {chat.messages.message_text}</span>
                                }
                                {
                                    chat.chat_type === 'group' || chat.chat_type === 'public' && chat.messages &&
                                    <span className="text-gray-500 text-md">{chat.messages.user_id === user_id ? 'You: ' : chat.messages.sender === 'System' ? null : chat.messages.sender} {chat.messages.message_text}</span>
                                }
                                {
                                    chat.messages &&
                                    <span className="text-xs text-gray-500">{moment(chat.messages.created_at).fromNow()}</span>
                                }
                            </div>
                        </div>
                    </div>
                ))
                    : <div className="flex flex-row py-4 px-2 justify-center items-center border-b-2">
                        <div className="w-full">
                            <div className="text-lg font-semibold text-center">Empty</div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}