import Image from 'next/image'
import { useState } from 'react';

type MainChatProps = {
    messages: React.ComponentProps<any>[];
    setMessages: React.Dispatch<React.SetStateAction<never[]>>;
    user_id: string;
};



export default function MainChat({ messages, setMessages, user_id }: MainChatProps) {

    return (
        <div id="chat-main" className="w-full flex flex-col bg-gray-200 h-[90vh]">
            <div className="h-full px-5 flex flex-col justify-between">
                <div className="overflow-y-auto">
                    {
                        messages.length > 0 ? messages.map((message) => (
                            <div key={message.id} className="flex flex-col mt-5">
                                <div className="flex justify-start items center mb-4">
                                    <Image width={50} height={50}
                                        src={`/${message.avatar}.png`}
                                        className="object-fit rounded-full border-4 border-[#FFFFFF]"
                                        alt=""
                                    />
                                    <span
                                        //invert to right side
                                        className="mr-2 py-3 px-4 bg-blue-400 rounded-br-3xl rounded-tr-xl rounded-tl-xl text-white"
                                    >
                                        {message.message_text}
                                    </span>

                                </div>
                            </div>
                        ))
                            : <div className="flex flex-col h-full w-full mt-5 justify-center items-center">
                                <Image width={500} height={500} priority
                                    src="/chat-default.svg"
                                    className="object-fit"
                                    alt="avatar"
                                />
                                <h1 className="text-2xl font-semibold text-center mt-5">Welcome back!</h1>
                                <h1 className="text-2xl font-semibold text-center mt-5">Select a chat group or friend to start messaging!</h1>
                            </div>
                    }
                </div>
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
