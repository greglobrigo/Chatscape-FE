type ForgotPasswordProps = {
    emailRef: React.RefObject<HTMLInputElement>;
    handleSubmit: React.MouseEventHandler<HTMLButtonElement>;
    setAction: React.Dispatch<React.SetStateAction<{
        login: boolean;
        register: boolean;
        forgotPassword: boolean;
    }>>;
}

export default function ForgotPassword({ emailRef, handleSubmit, setAction }: ForgotPasswordProps) {
    return (
        <div className="w-full max-w-xs">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input ref={emailRef} name="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Email" />
                </div>
                <div className="flex flex-col items-center justify-between mb-4">
                    <button onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
                        Send Email
                    </button>
                </div>
                <div onClick={() => setAction({ login: true, register: false, forgotPassword: false })} className="flex items-center justify-center">
                    <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        Don't have an account? Sign Up
                    </a>
                </div>
            </form>
        </div>
    )
}