import { useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { AiOutlineClose } from 'react-icons/ai';


type ModalProps = {
    user_id: string;
    token: string;
    tokenSecret: string;
    setJoinPublicChatModal: (value: boolean) => void;
    publicChat: any;
    setSuccessmessage: React.Dispatch<React.SetStateAction<string>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}



export default function JoinPublicChatModal({ setJoinPublicChatModal, user_id, token, tokenSecret, publicChat, setErrorMessage, setSuccessmessage }: ModalProps) {

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<any>(null);
    const grouNameRef = useRef<HTMLInputElement>(null);
    const [groupType, setGroupType] = useState<string>('');
    const [groupMembers, setGroupMembers] = useState<any[]>([]);


    const handleJoinPublicChat = () => {
        axios({
            method: 'post',
            url: 'http://localhost:3001/chats/join-public',
            data: {
                user_id: user_id,
                chat_id: publicChat.id,
            },
            headers: {
                Authorization: `Bearer ${token}|${tokenSecret}`,
            }
        }).then((response) => {
            if (response.data.status === 'success') {
                setSuccessmessage(response.data.message);
                setTimeout(() => {
                    setSuccessmessage('');
                }, 3000)
                setJoinPublicChatModal(false);
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

    const handleLeavePublicChat = () => {
        axios({
            method: 'post',
            url: 'http://localhost:3001/chatmembers/leave',
            data: {
                user_id: user_id,
                chat_id: publicChat.id,
            },
            headers: {
                Authorization: `Bearer ${token}|${tokenSecret}`,
            }
        }).then((response) => {
            if (response.data.status === 'success') {
                setSuccessmessage(response.data.message);
                setTimeout(() => {
                    setSuccessmessage('');
                }, 3000)
                setJoinPublicChatModal(false);
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
            <div className="fixed z-10 inset-0 overflow-y-auto h-screen w-screen bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white rounded-lg min-w-[350px] min-h-[250px]">
                    <div className="flex justify-end p-5 border-b">
                        <AiOutlineClose className="cursor-pointer" onClick={() => setJoinPublicChatModal(false)} />
                    </div>
                    <div className="flex flex-col justify-center items-center py-2">
                        <div className="flex flex-row pr-2 items-center py-2">
                            {publicChat.members.map((member: any, index: number) => (
                                <Image key={index} width={50} height={50}
                                    src={`/${member.avatar}.png`}
                                    className="object-fit rounded-full border-4 border-[#FFFFFF]" {...(index > 0 ? { style: { marginLeft: '-35px' } } : {})}
                                    alt="avatar"
                                />
                            ))}
                            <span className="text-l">{publicChat.chat_name}</span>
                        </div>
                        {
                            publicChat.isMember &&
                            <div className="flex flex-col justify-center items-center">
                                <h1 className="text-md text-center py-2">
                                    You are already a member of this chat
                                </h1>
                                <div className="flex w-full items-center justify-around py-2">
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleLeavePublicChat()}>Leave</button>
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => null}>Open</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
    )

}