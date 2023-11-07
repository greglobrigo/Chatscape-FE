import { AiOutlineClose } from "react-icons/ai";

type LeaveOrArchiveModalProps = {
    setLeaveOrArchiveModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeaveOrArchiveModal({setLeaveOrArchiveModal}: LeaveOrArchiveModalProps) {
    return (
        <div className="fixed z-40 inset-0 overflow-y-auto h-screen w-screen bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg min-w-[350px] min-h-[250px]">
            <div className="flex justify-end p-5 border-b">
                <AiOutlineClose className="cursor-pointer" onClick={() => setLeaveOrArchiveModal(false)} />
            </div>
            <div className="flex flex-col justify-center items-center p-5">
                <div className="text-xl font-semibold">Leave or Archive</div>
                <div className="text-sm font-semibold text-gray-500">Are you sure you want to leave this chat?</div>
                <div className="flex flex-row justify-center items-center mt-5">
                    <button onClick={() => setLeaveOrArchiveModal(false)} className="bg-red-500 text-white rounded-lg px-3 py-2 mr-2">Leave</button>
                    <button onClick={() => setLeaveOrArchiveModal(false)} className="bg-gray-500 text-white rounded-lg px-3 py-2">Archive</button>
                </div>
                <span className="text-orange-500 mt-2 text-sm">This feature is a work in progress</span>
            </div>
        </div>
    </div>
    )
}