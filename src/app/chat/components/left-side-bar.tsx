'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';
import Image from 'next/image'


type LeftSideBarProps = {
    chats: React.ComponentProps<any>[];
    user_id: string;
};

export default function LeftSideBar({ chats, user_id }: LeftSideBarProps) {

    return (
        <div id="r-sidebar" className="hidden sm:flex sm:flex-col sm:min-w-[100px] md:flex md:flex-col md:min-w-[300px] lg:w-2/6 bg-gray-300 h-[90vh]">

            <div className="flex flex-col w-full border-r-2">

                <div className="border-b-2 py-4 px-2">
                    <h1 className="text-lg font-semibold text-center">Chat groups</h1>
                </div>
            </div>
            <div className='overflow-y-auto'>
                {chats.length > 0 ? chats.map((chat) => (
                    <div key={chat.id} className="flex flex-row py-4 px-2 justify-center items-center border-b-2 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out">
                        <div className="w-1/4">
                            {
                                chat.chat_type === 'direct' &&
                                <Image width={50} height={50}
                                    src={`/${chat.members.find((member: any) => member.id !== user_id)?.avatar}.png`}
                                    className="object-fit rounded-full border-4 border-[#FFFFFF]"
                                    alt="avatar"
                                />
                            }
                            {
                                chat.chat_type === 'group' || chat.chat_type === 'public' &&
                                <div className="flex flex-row">
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
                                <div className="text-lg font-semibold">{chat.members.find((member: any) => member.id !== user_id)?.name}</div>
                            }
                            {
                                chat.chat_type === 'group' || chat.chat_type === 'public' &&
                                <div className="text-lg font-semibold">{chat.chat_name}</div>
                            }
                            <span className="text-gray-500">{chat.messages.message_text}</span>
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