import Image from 'next/image'
import { useState, useRef } from 'react'
import axios from 'axios'
import { BsFillTrashFill } from 'react-icons/bs';
import { useRouter } from 'next/navigation';

export default function Header({ currentUser, token, tokenSecret, user_id, setJoinPublicChatModal, setPublicChat, autoFetch }: any) {

    const router = useRouter();
    const [errormessage, setErrorMessage] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<any>(null);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLInputElement>(null);


    const handleSearchPublicChats = (searchString: any) => {
        setSearchTerm(searchString);
        setSearchResults([]);
        if (!searchString) return setSearchResults([]);
        setLoading(true);
        clearTimeout(timer);

        const newTimer = setTimeout(async () => {
            await axios({
                method: 'post',
                url: 'http://localhost:3001/chats/search-public',
                data: {
                    user_id: user_id,
                    searchTerm: searchString,
                },
                headers: {
                    Authorization: `Bearer ${token}|${tokenSecret}`,
                }
            }).then((response) => {
                if (response.data.status === 'success') {
                    setLoading(false);
                    setSearchResults(response.data.chats);
                } else {
                    setLoading(false);
                    setErrorMessage(response.data.error);
                    setTimeout(() => {
                        setErrorMessage('');
                    }, 3000)
                }
            }).catch((error) => {
                setLoading(false);
                setErrorMessage(error.message);
                setTimeout(() => {
                    setErrorMessage('');
                }, 3000)
            })
        }, 1000);
        setTimer(newTimer);
    }

    const logout = () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('tokenSecret');
        router.push('/home');
    }

    return (
        <>
            {
                errormessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center w-screen fixed top-0 z-10" role="alert">
                    <p>{errormessage}</p>
                </div>
            }
            <div id="header" className='px-5 py-5 flex justify-between items-center bg-white border-b-2 shadow-lg rounded-lg'>
                <div className="font-semibold text-2xl">Chatscape</div>
                <div className="w-1/2">
                    <input onChange={(e) => handleSearchPublicChats(e.target.value)} ref={searchInputRef}
                        type="text"
                        name=""
                        id=""
                        placeholder="search public chats"
                        className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
                    />
                    <div className="flex justify-center items-center pt-2 bg-white">
                        <span className="text-sm text-center font-semibold">Websocket status: {
                            autoFetch ? <span className="text-green-500">ON</span> : <span className="text-red-500">OFF</span>
                        }</span>
                    </div>
                    <div className='relative'>
                        <div className='overflow-y-auto z-30 flex flex-col w-full absolute'>
                            {
                                searchTerm && searchResults && searchResults.length > 0 &&
                                <div onClick={() => { setSearchTerm(''); setSearchResults([]); searchInputRef.current!.value = ''; }} className="flex flex-row py-2 justify-center items-center cursor-pointer bg-red-500 gap-2">
                                    <h1 className="text-md text-center font-semibold">Clear</h1>
                                    <BsFillTrashFill className="inline-block" />
                                </div>
                            }
                            {
                                searchTerm && searchResults && searchResults.map((chat: any) => {
                                    return (
                                        <div key={chat.id} onClick={() => { setPublicChat(chat); setJoinPublicChatModal(true); setSearchTerm(''); setSearchResults([]); searchInputRef.current!.value = ''; }}
                                        className="flex items-center justify-between px-5 py-3 bg-white hover:bg-gray-100 cursor-pointer">
                                            <div className="flex items-center">
                                                <div className="flex flex-row pr-2">
                                                    {chat.members.map((member: any, index: number) => (
                                                        <Image key={index} width={50} height={50}
                                                            src={`/${member.avatar}.png`}
                                                            className="object-fit rounded-full border-4 border-[#FFFFFF]" {...(index > 0 ? { style: { marginLeft: '-35px' } } : {})}
                                                            alt="avatar"
                                                        />
                                                    ))}
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span className="text-sm font-semibold">{chat.chat_name}</span>
                                                    <span className="text-xs text-green-500">{chat.isMember ? 'Already a member' : 'Join'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {
                                searchTerm && loading ?
                                    <div className="flex flex-row py-4 px-2 justify-center items-center bg-white border-b-2">
                                        <div className="w-full">
                                            <h1 className="text-md font-semibold">Loading...</h1>
                                        </div>
                                    </div>
                                    : searchTerm && searchResults.length === 0 &&
                                    <div className="flex flex-row py-4 px-2 justify-center items-center bg-white border-b-2">
                                        <div className="w-full">
                                            <h1 className="text-md font-semibold">No Results</h1>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div onClick={() => setShowOptions(!showOptions)} className="flex flex-col items-center cursor-pointer">
                        <div className="border-2 rounded-full border-[#1d2bcd95] w-max">
                            <Image width={50} height={50}
                                src={`/${currentUser.avatar}.png`}
                                className="object-fit rounded-full border-4 border-[#FFFFFF]"
                                alt="avatar"
                            />
                        </div>
                        <div className='flex flex-col'>
                            <span className="text-sm font-semibold text-center">{currentUser.name}</span>
                            <span className="text-xs text-gray-500 text-center">{currentUser.handle}</span>
                        </div>
                    {
                        showOptions &&
                        <div className="flex flex-col absolute top-[4.5rem] right-4 bg-white rounded-lg shadow-lg">
                            <div className="flex flex-row justify-center items-center py-2 px-5 hover:bg-gray-100 cursor-pointer border-b-2" onClick={() => logout()}>
                                <span className="text-md font-semibold">Logout</span>
                            </div>
                        </div>
                    }
                    </div>
                </div>
            </div>
        </>)
}