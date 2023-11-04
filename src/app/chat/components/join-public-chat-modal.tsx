import { useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { AiOutlineClose } from 'react-icons/ai';


type ModalProps = {
    user_id: string;
    token: string;
    tokenSecret: string;
    setJoinPublicChatModal: (value: boolean) => void;
    publicChat: any[];
}



export default function JoinPublicChatModal({ setJoinPublicChatModal, user_id, token, tokenSecret, publicChat }: ModalProps) {

    const [errormessage, setErrorMessage] = useState<string>('');
    const [successmessage, setSuccessMessage] = useState<string>('');
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
                chat_id: publicChat[0].id,
            },
            headers: {
                Authorization: `Bearer ${token}|${tokenSecret}`,
            }
        }).then((response) => {
            if (response.data.status === 'success') {
                setSuccessMessage(response.data.message);
                setTimeout(() => {
                    setSuccessMessage('');
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
            <div className="bg-white rounded-lg min-w-[350px] min-h-[450px]">
                <div className="flex justify-between items-center p-5 border-b">
                    <p className="text-xl">Join Public Chat</p>
                    <AiOutlineClose className="cursor-pointer" onClick={() => setJoinPublicChatModal(false)} />
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="flex justify-center items-center">
                        <p className="text-xl">Would you like to join this chat?</p>
                    </div>
                    <div className="flex justify-center items-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleJoinPublicChat()}>Join</button>
                    </div>
                </div>
            </div>

        </div>
    )

}