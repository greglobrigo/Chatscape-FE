import axios from 'axios';
import { useState } from 'react';

type ForgotPasswordProps = {
    emailRef: React.RefObject<HTMLInputElement>;
    setAction: React.Dispatch<React.SetStateAction<{
        login: boolean;
        register: boolean;
        forgotPassword: boolean;
        confirmEmail: boolean;
        confirmForgottenPassword: boolean;
    }>>;
}

export default function ForgotPassword({ emailRef, setAction }: ForgotPasswordProps) {
    const [errormessage, setErrorMessage] = useState<string>('');
    const setEmail = (email: string) => localStorage.setItem('email', email);

    const handleForgotPassword = async () => {
        const email = emailRef.current?.value;
        const regexEmailFormat = /\S+@\S+\.\S+/;

        if (!email) {
            setErrorMessage('Email is required');
            return;
        } else if (!regexEmailFormat.test(email)) {
            setErrorMessage('Email is not valid');
            return;
        } else {
            axios({
                method: 'post',
                url: process.env.NEXT_PUBLIC_API_URL + '/users/forgot-password',
                data: {
                    email
                }
            }).then((response) => {
                if (response.data.status === 'success') {
                    setEmail(email);
                    setAction({ login: false, register: false, forgotPassword: false, confirmEmail: false, confirmForgottenPassword: true });
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
                <h2 className="mb-4 text-center">Forgot Password</h2>
                <form onClick={() => errormessage !== '' ? setErrorMessage('') : null} className="bg-white shadow-md rounded px-8 pt-1 pb-8">
                    <p className="mb-4">
                        Enter your email address below and we will send you a code to reset your password.
                    </p>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input ref={emailRef} name="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Email" />
                    </div>
                    <div className="flex flex-col items-center justify-between mb-4">
                        <button onClick={handleForgotPassword}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
                            Send Email
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
    )
}