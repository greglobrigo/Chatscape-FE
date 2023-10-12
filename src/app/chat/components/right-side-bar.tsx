import Image from 'next/image'


type LeftSideBarProps = {
    activeUsers: React.ComponentProps<any>[];
};

export default function RightSideBar({ activeUsers }: LeftSideBarProps) {
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
                    <h1 className="text-lg font-semibold text-center">Active Users</h1>
                </div>
            </div>
            <div className='overflow-y-auto'>
                {
                    activeUsers.length > 0 ? activeUsers.map((user) => (
                        <div key={user.id} className="flex flex-row py-4 px-2 justify-center items-center border-b-2 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out">
                            <div className="w-1/4">
                                <Image width={50} height={50}
                                    src={`/${user.avatar}.png`}
                                    className="object-fit rounded-full border-4 border-[#FFFFFF]"
                                    alt="avatar"
                                />
                            </div>
                            <div className="w-full">
                                <div className="text-lg font-semibold">{user.name}</div>
                                <span className="text-gray-500">{user.handle}</span>
                            </div>
                        </div>
                    ))
                        : <div className="flex flex-row py-4 px-2 justify-center items-center border-b-2">
                            <div className="w-full">
                                <h1 className="text-lg font-semibold">No Active Users</h1>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}
