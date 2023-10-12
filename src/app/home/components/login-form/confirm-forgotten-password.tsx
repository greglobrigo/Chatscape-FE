import axios from 'axios';
import { useState, useRef } from 'react';

type confirmForgottenPassword = {
    emailRef: React.RefObject<HTMLInputElement>;
    setAction: React.Dispatch<React.SetStateAction<{
        login: boolean;
        register: boolean;
        forgotPassword: boolean;
        confirmEmail: boolean;
        confirmForgottenPassword: boolean;
    }>>;
}

export default function ConfirmForgottenPassword({ emailRef, setAction }: confirmForgottenPassword) {
    const email = localStorage.getItem('email') || '';

    const [errormessage, setErrorMessage] = useState<string>('');
    const [successmessage, setSuccessMessage] = useState<string>('');
    const codeRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const [disabled, setDisabled] = useState<boolean>(false);



    const handleConfirmForgottenPassword = () => {
        const auth_token = codeRef.current?.value;
        const password = passwordRef.current?.value;
        const password_confirmation = confirmPasswordRef.current?.value;
        if (password !== password_confirmation) {
            setErrorMessage('Passwords do not match');
            return;
        } else if (password && password.length < 8) {
            setErrorMessage('Password must be at least 8 characters');
            return;
        } else if (!auth_token) {
            setErrorMessage('Code is required');
            return;
        } else {
            axios({
                method: 'post',
                url: 'http://localhost:3001/users/confirm-forgotten-password',
                data: {
                    email,
                    forgot_password_token: auth_token,
                    new_password: password,
                    new_password_confirmation: password_confirmation
                }
            }).then((response) => {
                if (response.data.status === 'success') {
                    setSuccessMessage(response.data.message);
                    setDisabled(true);
                    setTimeout(() => {
                        setAction({ login: true, register: false, forgotPassword: false, confirmEmail: false, confirmForgottenPassword: false });
                        setDisabled(false);
                    }, 3000);
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
            {
                successmessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{successmessage}</span>
                </div>
            }
            <div className="w-full max-w-xs bg-gradient-to-r from-blue-600 via-blue-400 to-white">
                <h2 className="mb-4 text-center">Confirm Forgotten Password</h2>
                <form onClick={() => errormessage !== '' ? setErrorMessage('') : null} className="bg-white shadow-md rounded px-8 pt-1 pb-8">
                    <p className="mb-4">
                        Enter the code we sent to your email address below, together with your new password.
                    </p>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input ref={emailRef} name="email" disabled value={email}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Email" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Code
                        </label>
                        <input ref={codeRef} name="code"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Code" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            New Password
                        </label>
                        <input ref={passwordRef} name="password"
                            className="shadow appearance-none borde rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            New Password Confirmation
                        </label>
                        <input ref={confirmPasswordRef} name="password_confirmation"
                            className="shadow appearance-none borde rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                    </div>
                    <div className="flex flex-col items-center justify-between mb-4">
                        <button onClick={handleConfirmForgottenPassword} disabled={disabled} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
                            Submit
                        </button>
                    </div>
                    <div onClick={() => setAction({ login: true, register: false, forgotPassword: false, confirmEmail: false, confirmForgottenPassword: false })} className="flex items-center justify-center cursor-pointer">
                        <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                            Don&apos;t have an account? Sign Up
                        </a>
                    </div>
                </form>
            </div>
        </>
    )
}