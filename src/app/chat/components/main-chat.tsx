'use client'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react';
import moment from 'moment-timezone';
import axios from 'axios';

type MainChatProps = {
    messages: React.ComponentProps<any>[];
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
    user_id: string;
    defaultHome: boolean;
    chatID: number;
    token: string;
    tokenSecret: string;
    messagesContainer: React.RefObject<HTMLDivElement>;
};


export default function MainChat({ messages, setMessages, user_id, defaultHome, chatID, token, tokenSecret, messagesContainer }: MainChatProps) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSendMessage = async () => {
        const message = inputRef.current?.value
        if (!message) return
        const chat_id = chatID
        const sender = user_id
        await axios({
            method: 'post',
            url: process.env.NEXT_PUBLIC_API_URL + '/messages/send',
            data: {
                chat_id: chat_id,
                sender: sender,
                message_text: message,
            },
            headers: {
                Authorization: `Bearer ${token}|${tokenSecret}`,
            }
        }).then((response) => {
            if (response.data.status === 'success') {
                inputRef.current!.value = '';
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
    }

    return (
        <div id="chat-main" className="w-full flex flex-col bg-gray-200">
            <div className="h-full px-5 flex flex-col justify-between">
                {
                    errorMessage &&
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center w-screen fixed top-0 z-10" role="alert">
                        <p>{errorMessage}</p>
                    </div>
                }
                <div className="overflow-y-auto" id="messages-container" ref={messagesContainer}>
                    {
                        messages.length > 0 && messages.map((message, index) => (
                            <div key={index} className="flex flex-col mt-5">
                                {
                                    message.user_id === user_id && message.event_message === false &&
                                    <>
                                        <div className="flex justify-start items center mb-2">
                                            <Image width={50} height={50}
                                                src={`/${message.avatar}.png`}
                                                className="object-fit rounded-full border-4 border-[#FFFFFF]"
                                                alt=""
                                            />
                                            <span className="ml-2 py-3 px-4 bg-blue-400 rounded-br-3xl rounded-tr-xl rounded-tl-xl text-white">
                                                {message.message_text}
                                            </span>
                                        </div>
                                        <div className="flex justify-start items-end">
                                            <span className="text-xs mr-2 text-gray-500 text-right">You</span>
                                            <span className="text-xs text-gray-500 text-right">{moment(message.created_at).fromNow()}</span>
                                        </div>
                                    </>
                                }
                                {
                                    message.event_message === true &&
                                    <div className="flex flex-col mt-10 items-center
                                    before:content-[''] before:h-[1px] before:w-[100%] before:bg-gray-400 before:top-6 before:relative before:z-10">
                                        <div className="flex relative z-20">
                                            <span className="py-3 px-4 bg-gray-400 rounded-3xl text-white mb-2">
                                                {message.message_text}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">{moment(message.created_at).fromNow()}</span>
                                    </div>
                                }
                                {
                                    message.user_id !== user_id && message.event_message === false &&
                                    <>
                                        <div className="flex justify-end items center mb-2 mr-3">
                                            <span
                                                className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tr-xl rounded-tl-xl text-white"
                                            >
                                                {message.message_text}
                                            </span>
                                            <Image width={50} height={50}
                                                src={`/${message.avatar}.png`}
                                                className="object-fit rounded-full border-4 border-[#FFFFFF]"
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex justify-end items-end mr-3">
                                            <span className="text-xs mr-2 text-gray-500 text-right">{message.sender}</span>
                                            <span className="text-xs text-gray-500 text-right">{moment(message.created_at).fromNow()}</span>
                                        </div>
                                    </>
                                }
                            </div>
                        ))
                    }
                </div>
                {
                    defaultHome &&
                    <div className="flex flex-col w-full mt-5 justify-center items-center">
                        <Image width={400} height={400} priority={true}
                            src="/chat-default.svg"
                            className="object-fit"
                            alt="avatar"
                        />
                        <h1 className="text-2xl font-semibold text-center mt-5">Welcome back!</h1>
                        <h1 className="text-2xl font-semibold text-center mt-5">Select a chat group or friend to start messaging!</h1>
                    </div>
                }
                {
                    messages.length === 0 && !defaultHome &&
                    <div className="flex flex-col h-full w-full mt-10 items-center
                    before:content-[''] before:h-[1px] before:w-[100%] before:bg-gray-400 before:top-6 before:relative before:z-10">
                        <div className="flex mb-2 relative z-20">
                            <span className="py-3 px-4 bg-gray-400 rounded-3xl text-white mb-2">
                                This chat currently has no messages
                            </span>
                        </div>
                    </div>
                }
                <div className="justify-end">
                    <div className="py-5 flex">
                        <input ref={inputRef} onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage() : null}
                            className="w-full bg-gray-300 py-5 px-3 rounded-xl"
                            type="text"
                            placeholder="type your message here..."
                        />
                        <button onClick={handleSendMessage} disabled={defaultHome}
                            className={`${defaultHome ? 'bg-gray-400 text-white' : 'bg-blue-400 text-white hover:bg-blue-500 transition duration-300 ease-in-out'} py-3 px-5 rounded-xl`}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
