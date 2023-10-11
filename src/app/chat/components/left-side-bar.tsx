


type LeftSideBarProps = {
    chats: React.ComponentProps<any>[];
};

export default function LeftSideBar({ chats }: LeftSideBarProps) {
    console.log(chats);
    return (
        <div id="r-sidebar" className="hidden sm:flex sm:flex-col sm:min-w-[100px] md:flex md:flex-col md:min-w-[300px] lg:w-2/6 bg-gray-300 h-[90vh] overflow-y-auto
        ">

            <div className="flex flex-col w-full border-r-2 overflow-y-auto">
                <div className="border-b-2 py-4 px-2">
                    <input
                        type="text"
                        placeholder=" Search..."
                        className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                    />
                </div>
            </div>

            {chats.map((chat) => (
                <div key={chat.id} className="flex flex-row py-4 px-2 justify-center items-center border-b-2">
                    <div className="w-1/4">
                        <img
                            src="https://source.unsplash.com/_7LbC5J-jw4/600x600"
                            className="object-cover h-12 w-12 rounded-full"
                            alt=""
                        />
                    </div>
                    <div className="w-full">
                        <div className="text-lg font-semibold">{chat.messages.sender}</div>
                        <span className="text-gray-500">{chat.messages.message_text}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}