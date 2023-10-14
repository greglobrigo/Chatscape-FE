import Image from 'next/image'
import { useState } from 'react';
import moment from 'moment-timezone';

type MainChatProps = {
    messages: React.ComponentProps<any>[];
    setMessages: React.Dispatch<React.SetStateAction<never[]>>;
    user_id: string;
    defaultHome: boolean;
    setDefaultHome: React.Dispatch<React.SetStateAction<boolean>>;
};



export default function MainChat({ messages, setMessages, user_id, defaultHome, setDefaultHome }: MainChatProps) {

    return (
        <div id="chat-main" className="w-full flex flex-col bg-gray-200 h-[90vh]">
            <div className="h-full px-5 flex flex-col justify-between">
                <div className="overflow-y-auto">
                    {
                        messages.length > 0 && messages.map((message) => (
                            <div key={message.id} className="flex flex-col mt-5">
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
                                            {/* add message.sender */}
                                        </div>
                                        <div className="flex justify-start items-end">
                                            <span className="text-xs mr-2 text-gray-500 text-right">You</span>
                                            <span className="text-xs text-gray-500 text-right">{moment(message.created_at).fromNow()}</span>
                                        </div>
                                    </>
                                }
                                {
                                    message.event_message === true &&
                                    <div className="flex justify-center items-center mb-2 flex-col">
                                        <span className="py-3 px-4 bg-gray-400 rounded-3xl text-white mb-2">
                                            {message.message_text}
                                        </span>
                                        <span className="text-xs text-gray-500 text-right">{moment(message.created_at).fromNow()}</span>
                                    </div>
                                }
                                {
                                    message.user_id !== user_id && message.event_message === false &&
                                    <>
                                        <div className="flex justify-end items center mb-2 mr-3">
                                            <span
                                                className="mr-2 py-3 px-4 bg-gray-400 rounded-bl-3xl rounded-tr-xl rounded-tl-xl text-white"
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
                    <div className="flex flex-col h-full w-full mt-5 justify-center items-center">
                        <Image width={500} height={500} priority
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
                    <div className="flex flex-col h-full w-full mt-10 items-center">
                        <div className="flex mb-2">
                            <span className="py-3 px-4 bg-gray-400 rounded-3xl text-white mb-2">
                                This chat currently has no messages
                            </span>
                        </div>
                    </div>
                }
                <div className="justify-end">
                    <div className="py-5">
                        <input
                            className="w-full bg-gray-300 py-5 px-3 rounded-xl"
                            type="text"
                            placeholder="type your message here..."
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}
