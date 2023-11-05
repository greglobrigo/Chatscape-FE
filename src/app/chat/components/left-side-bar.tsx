'use client'
import axios from 'axios';
import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import Image from 'next/image'
import { FaPlus } from 'react-icons/fa'
import { BsPersonFillAdd } from 'react-icons/bs'


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
    messagesContainer: React.RefObject<HTMLDivElement>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LeftSideBar({ chats, user_id, token, tokenSecret, messages, setMessages, defaultHome, setDefaultHome, setChatId, chatID, messagesContainer, setShowModal }: LeftSideBarProps) {

    const [chatType, setChatType] = useState<string>('');

    const handleGetMessages = async (chatID: any) => {
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
                setTimeout(() => {
                    //@ts-ignore
                    messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
                }, 100)
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <div id="r-sidebar" className="hidden sm:flex sm:flex-col sm:min-w-[100px] md:flex md:flex-col md:min-w-[300px] lg:w-2/6 bg-gray-300">
            <div className="flex flex-col w-full border-r-2">
                <div className="flex flex-row justify-between items-center border-b-2 py-4 px-2">
                    <h1 className="text-lg font-semibold text-center">Chats</h1>
                    <div>
                        {
                            (chatType === 'public' || chatType === 'group') &&
                                <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-full mr-2">
                                    Add Member <BsPersonFillAdd className="inline-block mb-1" />
                                </button>

                        }
                        <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-full">
                            New Group <FaPlus className="inline-block" />
                        </button>
                    </div>
                </div>
            </div>
            <div className='overflow-y-auto'>
                {chats.length > 0 ? chats.map((chat) => (
                    <div key={chat.id} onClick={() => { setChatId(chat.id); handleGetMessages(chat.id); setChatType(chat.chat_type); }}
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
                                (chat.chat_type === 'group' || chat.chat_type === 'public') &&
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
                                (chat.chat_type === 'group' || chat.chat_type === 'public') &&
                                <span className="text-md font-semibold">{chat.chat_name}</span>
                            }
                            <div className="flex flex-row justify-between items-end">
                                {
                                    chat.chat_type === 'direct' && chat.messages &&
                                    <span className="text-gray-500 text-md">{chat.messages.user_id === user_id ? 'You: ' : null} {chat.messages.message_text}</span>
                                }
                                {
                                    (chat.chat_type === 'group' || chat.chat_type === 'public') && chat.messages &&
                                    <span className="text-gray-500 text-md">{chat.messages.sender === 'System' ? null : chat.messages.user_id === user_id ? 'You: ' : chat.messages.sender} {chat.messages.message_text}</span>
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