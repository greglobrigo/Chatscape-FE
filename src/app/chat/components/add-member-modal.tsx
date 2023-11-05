import { useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiFillCloseCircle } from 'react-icons/ai';
import { AiOutlineClose } from 'react-icons/ai';

type AddMemberModalProps = {
    user_id: string,
    token: string,
    tokenSecret: string,
    setAddMemberModal: (value: boolean) => void
    chatID: number,
}


export default function AddMemberModal({ user_id, token, tokenSecret, setAddMemberModal, chatID }: AddMemberModalProps) {

    const [errormessage, setErrorMessage] = useState<string>('');
    const [successmessage, setSuccessMessage] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<any>(null);
    const grouNameRef = useRef<HTMLInputElement>(null);
    const [groupMembers, setGroupMembers] = useState<any[]>([]);

    const handleSearchUsers = async (searchString: string) => {
        setSearchTerm(searchString);
        setSearchResults([]);
        if (!searchString) return;
        setLoading(true);
        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            await axios({
                method: 'post',
                url: 'http://localhost:3001/users/search-users-all-or-direct',
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
                    if (groupMembers.length > 0) {
                        const filteredUsers = response.data.users.filter((user: any) => {
                            return !groupMembers.some((member) => member.id === user.id)
                        })
                        setSearchResults(filteredUsers.splice(0, 1));
                    } else if (response.data.users.length === 0) {
                        setSearchResults([]);
                    } else {
                        setSearchResults(response.data.users.splice(0, 1));
                    }
                } else {
                    setLoading(false);
                    setErrorMessage(response.data.error);
                }
            }).catch((error) => {
                setLoading(false);
                setErrorMessage(error.message);
            })
        }, 1000);
        setTimer(newTimer);
    }

    const handleAddMember = () => {

    }

    return (
        <div className="fixed z-40 inset-0 overflow-y-auto h-screen w-screen bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg min-w-[350px] min-h-[450px]">
                <form className="flex flex-col justify-center items-center">
                    <h1 className="text-2xl font-semibold mt-4 text-center">Add a member to the chat</h1>
                    {errormessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 mt-2 rounded relative" role="alert">
                        <span className="block sm:inline text-center text-sm">{errormessage} <AiOutlineClose onClick={() => setErrorMessage('')} className="inline-block ml-2 cursor-pointer" /></span>
                    </div>}
                    {successmessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 mt-2 rounded relative" role="alert">
                        <span className="block sm:inline text-center text-sm">{successmessage}</span>
                    </div>}
                    <div className="mb-4 mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
                            Group Type
                        </label>
                        {/* <div className="flex flex-row justify-start items-center gap-[10px]">
                            <input onClick={() => setGroupType('group')} type="radio" name="groupType" value="group" />
                            <label htmlFor="group">Group</label>
                            <input onClick={() => setGroupType('public')} type="radio" name="groupType" value="public" />
                            <label htmlFor="public">Public</label>
                        </div> */}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Group Name
                        </label>
                        <input name="email" onKeyDown={(e) => e.key === 'Enter' ? null : null} ref={grouNameRef}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Group Name" />
                    </div>
                    {
                        groupMembers.length > 0 &&
                        <span className="text-blue-500">Members:</span>
                    }
                    {
                        groupMembers.length > 0 &&
                        <div className="flex flex-row justify-start items-center gap-[10px] mb-4">
                            {
                                groupMembers.map((member) => (
                                    <div key={member.id} onClick={() => setGroupMembers(groupMembers.filter((groupMember) => groupMember.id !== member.id))} className="flex flex-row justify-start items-center gap-[10px] bg-blue-500 px-2 cursor-pointer hover:bg-red-500 transition duration-100 ease-in-out">
                                        <span className="text-white">
                                            {groupMembers.length === 1 ? `${member.name}` : groupMembers.length > 1 && groupMembers[groupMembers.length - 1].id === member.id ? `${member.name}` : `${member.name},`}
                                        </span>
                                        <AiFillCloseCircle className="text-white" />
                                    </div>
                                ))
                            }

                        </div>
                    }
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Group Members
                        </label>
                        <input onChange={(e) => handleSearchUsers(e.target.value)} name="text" onKeyDown={(e) => e.key === 'Enter' ? null : null} value={searchTerm}
                            className="shadow appearance-none borde rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Search members" />
                    </div>
                    <div className='relative w-full flex justify-center items-center'>
                        <div className='overflow-y-auto z-10 relative'>
                            {
                                searchTerm && searchResults && searchResults.length > 0 &&
                                <div onClick={() => { setSearchTerm(''); setSearchResults([]) }} className="flex flex-row py-2 justify-center items-center cursor-pointer bg-red-500 gap-2">
                                    <h1 className="text-md text-center font-semibold">Clear</h1>
                                    <BsFillTrashFill className="inline-block" />
                                </div>
                            }
                            {
                                searchTerm && searchResults && searchResults.length > 0 && searchResults.map((user) => (
                                    <div key={user.id} onClick={() => {
                                        groupMembers.some((member) => member.id === user.id) ? null :
                                            groupMembers.length >= 3 ? setErrorMessage('Max of 3 members reached, you can add more members after creating the group') :
                                                setGroupMembers([...groupMembers, user]);
                                        setSearchTerm('');
                                        setSearchResults([])
                                    }}
                                        className="w-[320px] flex flex-row py-4 px-2 items-start bg-gray-100 border-b-2 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out">
                                        <div className='pr-2 pt-4'>
                                            <Image width={50} height={50}
                                                src={`/${user.avatar}.png`}
                                                className="object-fit rounded-full border-4 border-[#FFFFFF]"
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-md font-semibold">{user.name}</span>
                                            <span className="text-gray-500">{user.handle}</span>
                                            <span className="text-gray-500">{user.email}</span>

                                        </div>
                                    </div>
                                ))
                            }
                            {
                                searchTerm && loading ?
                                    <div className="flex flex-row pt-4 pb-4 justify-center items-center bg-white">
                                        <div className="w-full">
                                            <h1 className="text-md text-center font-semibold">Loading...</h1>
                                        </div>
                                    </div>
                                    : searchTerm && !loading && searchResults.length === 0 &&
                                    <div className="flex flex-row pt-4 pb-4 justify-center items-center bg-white">
                                        <div className="w-full">
                                            <h1 className="text-md text-center font-semibold">No Results</h1>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                    <div className="flex flex-row justify-between gap-[25px] mt-4">

                        {searchResults.length === 0 &&

                            <>
                                <button onClick={() => setAddMemberModal(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
                                    Cancel
                                </button>
                                <button onClick={handleAddMember} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
                                    Create
                                </button>
                            </>
                        }

                    </div>
                </form>
            </div>
        </div >
    )


}