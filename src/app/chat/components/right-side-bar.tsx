import Image from 'next/image'
import moment from 'moment-timezone';
import axios from 'axios';


type LeftSideBarProps = {
    activeUsers: React.ComponentProps<any>[];
    user_id: string;
    token: string;
    tokenSecret: string;
    messages: React.ComponentProps<any>[];
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function RightSideBar({ activeUsers, user_id, token, tokenSecret, messages, setMessages }: LeftSideBarProps) {


    const handleGetMessages = (user: any) => {

    }


    return (
        <div id="l-sidebar" className="hidden md:flex md:flex-col md:min-w-[100px] lg:w-2/6 bg-gray-300 h-[90vh]">
            <div className="flex flex-col w-full border-r-2">
                <div className="border-b-2 py-4 px-2">
                    <input
                        type="text"
                        placeholder=" Search Users"
                        className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                    />
                </div>
                <div className="border-b-2 py-4 px-2">
                    <h1 className="text-lg font-semibold text-center">Users</h1>
                </div>
            </div>
            <div className='overflow-y-auto'>
                {
                    activeUsers.length > 0 ? activeUsers.map((user) => (
                        <div key={user.id} onClick={()=>handleGetMessages(user)}
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
                                    <span className="text-md font-semibold">{user.name}</span>
                                    <span className="text-xs text-gray-500">Last seen</span>
                                </div>
                                <div className="flex flex-row justify-between items-end">
                                    <span className="text-gray-500">{user.handle}</span>
                                    <span className="text-xs text-gray-500">{moment(user.updated_at).fromNow()}</span>
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
    )
}
