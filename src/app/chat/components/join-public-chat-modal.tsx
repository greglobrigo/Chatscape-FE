import { useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { BsFillTrashFill } from 'react-icons/bs';


type ModalProps = {
     user_id: string;
     token: string;
     tokenSecret: string;
    setJoinPublicChatModal: (value: boolean) => void;
}



export default function JoinPublicChatModal({ setJoinPublicChatModal, user_id, token, tokenSecret }: ModalProps) {

     const [errormessage, setErrorMessage] = useState<string>('');
     const [successmessage, setSuccessMessage] = useState<string>('');
     const [searchTerm, setSearchTerm] = useState<string>('');
     const [searchResults, setSearchResults] = useState<any[]>([]);
     const [loading, setLoading] = useState<boolean>(false);
     const [timer, setTimer] = useState<any>(null);
     const grouNameRef = useRef<HTMLInputElement>(null);
     const [groupType, setGroupType] = useState<string>('');
     const [groupMembers, setGroupMembers] = useState<any[]>([]);


     const handleJoinPublicChat = (searchString: any) => {

     }

     return (
        <div className="fixed z-10 inset-0 overflow-y-auto h-screen w-screen bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg min-w-[350px] min-h-[450px]">
            <div className="flex justify-between items-center p-5 border-b">
                <p className="text-xl">Join Public Chat</p>
                <button onClick={() => setJoinPublicChatModal(false)}>
                    <Image
                        src="/icons/close.svg"
                        width={20}
                        height={20}
                        alt="Close Icon"
                    />
                </button>
            </div>
            </div>
        </div>
            )

}