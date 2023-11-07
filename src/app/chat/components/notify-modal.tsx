

type NotifyModalProps = {
    setNotifyModal: React.Dispatch<React.SetStateAction<boolean>>;
    autoFetch: boolean;
}

export default function NotifyModal({ setNotifyModal, autoFetch }: NotifyModalProps) {
    return (
        <>
            { autoFetch &&
                <div className="fixed z-40 inset-0 overflow-y-auto h-screen w-screen bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg max-w-[350px] max-h-[450px]">
                        <div className="flex flex-col justify-center items-center px-2">
                            <div className="mt-4">
                                <h1 className="text-lg font-semibold text-center text-blue-500">
                                    Welcome to Chatscape!
                                </h1>
                            </div>
                            <div className="border-b-2 border-gray-200 w-full mt-4"></div>
                            <div className="mt-4">
                                <h1 className="text-sm font-semibold text-center">
                                    To save on server costs, real time updates are turned off after
                                    <span className="text-green-500"> 5 minutes </span> of inactivity,
                                    as indicated by the Websocket status: <span className="text-green-500">ON</span> {` or `} <span className="text-red-500">OFF</span>.
                                </h1>
                            </div>
                            <div className="border-b-2 border-gray-200 w-full mt-4"></div>
                            <div className="flex justify-center items-center mt-4">
                                <h1 className="text-sm font-semibold text-center">
                                    To turn real time updates back on, refresh the page or click on a chat channel.
                                </h1>
                            </div>
                        </div>
                        <div className="border-b-2 border-gray-200 w-full mt-4"></div>
                        <div className="flex justify-center items-center mt-4 mb-4">
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                                onClick={() => setNotifyModal(false)}>
                                Ok
                            </button>
                        </div>
                    </div>
                </div> }
            { !autoFetch &&
                <div className="fixed z-40 inset-0 overflow-y-auto h-screen w-screen bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg max-w-[350px] max-h-[450px]">
                        <div className="flex flex-col justify-center items-center px-2">
                            <div className="mt-4">
                                <h1 className="text-sm font-semibold text-center">
                                    Real time updates are now turned off due to inactivity.
                                </h1>
                            </div>
                            <div className="border-b-2 border-gray-200 w-full mt-4"></div>
                            <div className="flex justify-center items-center mt-4">
                                <h1 className="text-sm font-semibold text-center">
                                    To turn real time updates back on, refresh the page or click on a chat channel.
                                </h1>
                            </div>
                        </div>
                        <div className="border-b-2 border-gray-200 w-full mt-4"></div>
                        <div className="flex justify-center items-center mt-4 mb-4">
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                                onClick={() => setNotifyModal(false)}>
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}