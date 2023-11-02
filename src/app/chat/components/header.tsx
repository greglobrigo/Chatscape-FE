import Image from 'next/image'

export default function Header({ currentUser }: any) {

    const handleSearchPublicChats = (e: any) => {
        console.log(e);
    }


    return (
        <div id="header" className='px-5 py-5 flex justify-between items-center bg-white border-b-2 shadow-lg rounded-lg'>
            <div className="font-semibold text-2xl">Chatscape</div>
            <div className="w-1/2">
                <input onChange={(e) => handleSearchPublicChats(e.target.value)}
                    type="text"
                    name=""
                    id=""
                    placeholder="search public chats"
                    className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
                />
            </div>
            <div className="flex">
                <div className="flex flex-col items-center">
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
                </div>
            </div>
        </div>
    )
}