import axios from 'axios';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type ConfirmEmailProps = {
    emailRef: React.RefObject<HTMLInputElement>;
    setAction: React.Dispatch<React.SetStateAction<{
        login: boolean;
        register: boolean;
        forgotPassword: boolean;
        confirmEmail: boolean;
        confirmForgottenPassword: boolean;
    }>>;
}

export default function ConfirmEmail({ emailRef, setAction }: ConfirmEmailProps) {
    const email = localStorage.getItem('email') || '';

    const router = useRouter();
    const [errormessage, setErrorMessage] = useState<string>('');
    const codeRef = useRef<HTMLInputElement>(null);

    const handleConfirmEmail = async () => {
        const auth_token = codeRef.current?.value;
        const email = emailRef.current?.value;
        if (!auth_token) {
            setErrorMessage('Code is required');
            return;
        } else {
            axios({
                method: 'post',
                url: 'http://localhost:3001/users/confirm-email',
                data: {
                    email,
                    auth_token
                }
            }).then((response) => {
                if (response.data.status === 'success') {
                    router.push('/chat');
                } else {
                    setErrorMessage(response.data.error);
                }
            }).catch((error) => {
                setErrorMessage(error.message);
            })
        }
    }

return (
    <>
    {
        errormessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errormessage}</span>
        </div>
    }
    <div className="w-full max-w-xs bg-gradient-to-r from-blue-600 via-blue-400 to-white">
        <h2 className="mb-2 text-center">Confirm Email</h2>
        <form onClick={() => errormessage !== '' ? setErrorMessage('') : null} className="bg-white shadow-md rounded px-8 pt-1 pb-8">
            <p className="mb-4">
                We have sent an email to {email}. Please check your inbox and enter the code below to activate your account.
            </p>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                </label>
                <input ref={emailRef} name="email" disabled value={email}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200" id="username" type="text" placeholder="Email" />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Code
                </label>
                <input ref={codeRef} name="code"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="code" type="text" placeholder="Code" />
            </div>
            <div className="flex flex-col items-center justify-between mb-4">
                <button onClick={handleConfirmEmail}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
                    Submit
                </button>
            </div>
            <div onClick={() => setAction({ login: true, register: false, forgotPassword: false, confirmEmail: false, confirmForgottenPassword: false })} className="flex items-center justify-center cursor-pointer">
                <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                    Already have an account? Sign In
                </a>
            </div>
        </form>
    </div>
    </>
)}