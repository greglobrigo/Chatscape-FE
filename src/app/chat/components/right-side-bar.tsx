import Image from 'next/image'
import moment from 'moment-timezone';
import axios from 'axios';
import { useState, useRef } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';


type RightSideBarProps = {
    activeUsers: React.ComponentProps<any>[];
    user_id: string;
    token: string;
    tokenSecret: string;
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
    setDefaultHome: React.Dispatch<React.SetStateAction<boolean>>;
    messagesContainer: React.RefObject<HTMLDivElement>;
    setChatId: React.Dispatch<React.SetStateAction<number>>;
    setChatType: React.Dispatch<React.SetStateAction<string>>;
};

export default function RightSideBar({ activeUsers, user_id, token, tokenSecret, setMessages, setDefaultHome, messagesContainer, setChatId, setChatType }: RightSideBarProps) {

    const [errormessage, setErrorMessage] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<any>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleCreateOrRetrieveMessages = async (userID: any) => {
        setDefaultHome(false);
        const currentUserID = user_id;
        const clickedUserID = userID;
        await axios({
            method: 'post',
            url: process.env.NEXT_PUBLIC_API_URL + '/chats/create-or-retrieve',
            data: {
                sender: currentUserID,
                receiver: clickedUserID,
            },
            headers: {
                Authorization: `Bearer ${token}|${tokenSecret}`,
            }
        }).then((response) => {
            if (response.data.status === 'success') {
                setChatId(response.data.chat_id);
                setMessages(response.data.messages)
                setTimeout(() => {
                    //@ts-ignore
                    messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
                }, 100)
            } else {
                setErrorMessage(response.data.error);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleSearchUsers = async (searchString: string) => {
        setSearchTerm(searchString);
        setSearchResults([]);
        if (!searchString) return setSearchResults([]);
        setLoading(true);
        clearTimeout(timer);

        const newTimer = setTimeout(async () => {
            await axios({
                method: 'post',
                url: process.env.NEXT_PUBLIC_API_URL + '/users/search-users-all-or-direct',
                data: {
                    user_id: user_id,
                    search_string: searchString,
                },
                headers: {
                    Authorization: `Bearer ${token}|${tokenSecret}`,
                }
            }).then((response) => {
                if (response.data.status === 'success') {
                    setLoading(false);
                    setSearchResults(response.data.users);
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

    return (
        <>
            {
                errormessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center w-screen fixed top-0 z-30" role="alert">
                    <p>{errormessage}</p>
                </div>
            }
            <div id="l-sidebar" className="hidden md:flex md:flex-col md:min-w-[100px] lg:w-2/6 bg-gray-300">
                <div className="flex flex-col w-full border-r-2">
                    <div className="border-b-2 py-4 px-2">
                        <input onChange={(e) => handleSearchUsers(e.target.value)} ref={searchInputRef}
                            type="text"
                            placeholder=" Search Users"
                            className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                        />
                    </div>
                    <div className='relative'>
                        <div className='overflow-y-auto z-10 absolute w-full'>
                            {
                                searchTerm && searchResults && searchResults.length > 0 &&
                                <div onClick={() => { setSearchTerm(''); setSearchResults([]); searchInputRef.current!.value = ''}} className="flex flex-row py-2 justify-center items-center cursor-pointer bg-red-500 gap-2">
                                    <h1 className="text-md text-center font-semibold">Clear</h1>
                                    <BsFillTrashFill className="inline-block" />
                                </div>
                            }
                            {
                                searchTerm && searchResults && searchResults.length > 0 && searchResults.map((user) => (
                                    <div key={user.id} onClick={() => { handleCreateOrRetrieveMessages(user.id); setSearchTerm(''); setSearchResults([]); searchInputRef.current!.value = ''; setChatType('direct'); }}
                                        className="flex flex-row py-4 px-2 justify-center items-center bg-white border-b-2 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out">
                                        <div className="w-1/2 2xl:w-1/2 3xl:w-1/3 4xl:w-1/4 5xl:w-1/6">
                                            <Image width={50} height={50}
                                                src={`/${user.avatar}.png`}
                                                className="object-fit rounded-full border-4 border-[#FFFFFF]"
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className="w-full flex flex-col">
                                            <div className="flex flex-row justify-between items-end">
                                                <span className="text-md font-semibold">{user.name}</span>
                                                <span className="text-xs text-gray-500">Last seen</span>
                                            </div>
                                            <div className="flex flex-row justify-between items-end">
                                                <span className="text-gray-500 text-xs">{user.handle}</span>
                                                <span className="text-gray-500 text-xs">{moment(user.updated_at).fromNow()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
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
                    <div className="border-b-2 py-4 px-2">
                        <h1 className="text-lg font-semibold text-center">Users</h1>
                    </div>
                </div>
                <div className='overflow-y-auto'>
                    {
                        activeUsers.length > 0 ? activeUsers.map((user) => (
                            <div key={user.id} onClick={() => {handleCreateOrRetrieveMessages(user.id); setChatType('direct');}}
                                className="flex flex-row py-4 px-2 justify-center items-center border-b-2 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out">
                                <div className="w-1/2 2xl:w-1/2 3xl:w-1/3 4xl:w-1/4 5xl:w-1/6">
                                    <Image width={50} height={50}
                                        src={`/${user.avatar}.png`}
                                        className="object-fit rounded-full border-4 border-[#FFFFFF]"
                                        alt="avatar"
                                    />
                                </div>
                                <div className="w-full flex flex-col">
                                    <div className="flex flex-row justify-between items-end">
                                        <span className="font-semibold">{user.name}</span>
                                        <span className="text-xs text-gray-500">Last seen</span>
                                    </div>
                                    <div className="flex flex-row justify-between items-end">
                                        <span className="text-gray-500 text-xs">{user.handle}</span>
                                        <span className="text-gray-500 text-xs">{moment(user.updated_at).fromNow()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                            : <div className="flex flex-row py-4 px-2 justify-center items-center border-b-2">
                                <div className="w-full">
                                    <h1 className="text-md font-semibold">No Active Users</h1>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}
