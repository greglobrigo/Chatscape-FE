import Image from 'next/image'

export default function MainChat() {
    return (
        <div id="chat-main" className="w-full flex flex-col bg-gray-200 h-[90vh]">
            <div className="h-full px-5 flex flex-col justify-between">
                <div>
                    <div className="flex flex-col h-full w-full mt-5 justify-center items-center
                    ">

                        {/* Add default image first */}
                        <Image width={500} height={500}
                            src="/chat-default.svg"
                            className="object-fit"
                            alt="avatar"
                        />
                        <h1 className="text-2xl font-semibold text-center mt-5">Welcome back!</h1>
                        <h1 className="text-2xl font-semibold text-center mt-5">Select a chat group or friend to start messaging!</h1>
                    </div>
                    <div className="flex flex-col mt-5">
                        {/* <div className="flex justify-end mb-4">
                            <div
                                className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                            >
                                Welcome to group everyone !
                            </div>
                            <img
                                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                className="object-cover h-8 w-8 rounded-full"
                                alt=""
                            />
                        </div>
                        <div className="flex justify-start mb-4">
                            <img
                                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                className="object-cover h-8 w-8 rounded-full"
                                alt=""
                            />
                            <div
                                className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                            >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
                                at praesentium, aut ullam delectus odio error sit rem. Architecto
                                nulla doloribus laborum illo rem enim dolor odio saepe,
                                consequatur quas?
                            </div>
                        </div>
                        <div className="flex justify-end mb-4">
                            <div>
                                <div
                                    className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                >
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                    Magnam, repudiandae.
                                </div>

                                <div
                                    className="mt-4 mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                >
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Debitis, reiciendis!
                                </div>
                            </div>
                            <img
                                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                className="object-cover h-8 w-8 rounded-full"
                                alt=""
                            />
                        </div>
                        <div className="flex justify-start mb-4">
                            <img
                                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                className="object-cover h-8 w-8 rounded-full"
                                alt=""
                            />
                            <div
                                className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                            >
                                happy holiday guys!
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className="justify-end">

                    <div className="py-5">
                        <input
                            className="w-full bg-gray-300 py-5 px-3 rounded-xl"
                            type="text"
                            placeholder="type your message here..."
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}
