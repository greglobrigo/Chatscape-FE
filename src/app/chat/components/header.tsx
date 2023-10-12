import Image from 'next/image'

export default function Header({currentUser}: any) {
    return (
        <div id="header" className='h-[10vh] px-5 py-5 flex justify-between items-center bg-white border-b-2 shadow-lg rounded-lg'>
            <div className="font-semibold text-2xl">Chatscape</div>
            <div className="w-1/2">
                <input
                    type="text"
                    name=""
                    id=""
                    placeholder="search IRL"
                    className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
                />
            </div>
            <div className="flex flex-row">
                <div className="flex flex-col">
                    <Image width={50} height={50}
                        src={`/${currentUser.avatar}.png`}
                        className="object-fit rounded-full border-4 border-[#FFFFFF]"
                        alt="avatar"
                    />
                </div>
            </div>
        </div>
    )
}