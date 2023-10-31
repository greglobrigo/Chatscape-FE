import { useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';


type ModalProps = {
     user_id: string;
     token: string;
     tokenSecret: string;
     setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}



export default function Modal({ setShowModal, user_id, token, tokenSecret }: ModalProps) {

     const [errormessage, setErrorMessage] = useState<string>('');
     const [searchTerm, setSearchTerm] = useState<string>('');
     const [searchResults, setSearchResults] = useState<any[]>([]);
     const [loading, setLoading] = useState<boolean>(false);
     const [timer, setTimer] = useState<any>(null);
     const grouNameRef = useRef<HTMLInputElement>(null);
     const [groupMembers, setGroupMembers] = useState<string[]>([]);

     const handleSearchUsers = async (searchString: string) => {
          setSearchTerm(searchString);
          setSearchResults([]);
          if (!searchString) return setSearchResults([]);
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
                         console
                         setSearchResults(response.data.users.splice(0, 5));
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

     return (
          <div className="fixed z-10 inset-0 overflow-y-auto h-screen w-screen bg-black bg-opacity-50 flex justify-center items-center">
               <div className="bg-white rounded-lg w-1/4 h-1/2">
                    <form className="flex flex-col justify-center items-center">
                         <h1 className="text-2xl font-semibold my-8">Create New Group Chat</h1>
                         <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                   Group Name
                              </label>
                              <input name="email" onKeyDown={(e) => e.key === 'Enter' ? null : null}
                                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Group Name" />
                         </div>
                         <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                   Group Members
                              </label>
                              <input onChange={(e) => handleSearchUsers(e.target.value)} name="text" onKeyDown={(e) => e.key === 'Enter' ? null : null} value={searchTerm}
                                   className="shadow appearance-none borde rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Members" />
                         </div>
                         <div className='relative'>
                              <div className='overflow-y-auto z-10 w-full relative'>
                                   {
                                        searchTerm && searchResults && searchResults.length > 0 &&
                                        <div onClick={() => {setSearchTerm(''); setSearchResults([])}} className="flex flex-row py-2 justify-center items-center cursor-pointer bg-blue-500">
                                            <h1 className="text-md text-center font-semibold">Clear <FaTimes className="inline-block" />
                                            </h1>
                                        </div>
                                   }
                                   {
                                        searchTerm && searchResults && searchResults.length > 0 && searchResults.map((user) => (
                                             <div key={user.id} onClick={() => setGroupMembers([...groupMembers, user.id])}
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
                                        <button onClick={() => setShowModal(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
                                             Cancel
                                        </button>
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
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