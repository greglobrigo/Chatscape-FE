import axios from 'axios';
import { useState, useRef } from 'react';
import Image from 'next/image'


type RegisterProps = {
    emailRef: React.RefObject<HTMLInputElement>;
    nameRef: React.RefObject<HTMLInputElement>;
    passwordRef: React.RefObject<HTMLInputElement>;
    confirmPasswordRef: React.RefObject<HTMLInputElement>;
    handleRef: React.RefObject<HTMLInputElement>;
    setAction: React.Dispatch<React.SetStateAction<{
        login: boolean;
        register: boolean;
        forgotPassword: boolean;
        confirmEmail: boolean;
        confirmForgottenPassword: boolean;
    }>>;
}

export default function Register({ emailRef, passwordRef, nameRef, handleRef, confirmPasswordRef, setAction }: RegisterProps) {
    const [errormessage, setErrorMessage] = useState<string>('');
    const [avatar, setAvatar] = useState<any>(null);
    const avatarList = [1, 2, 3, 4, 5, 6]

    const handleRegister = async () => {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        const name = nameRef.current?.value;
        const handle = handleRef.current?.value;
        const password_confirmation = confirmPasswordRef.current?.value;
        const regexEmailFormat = /\S+@\S+\.\S+/;
        const regexHandleFormat = /^@[a-zA-Z0-9_]{3,30}$/;
        const setEmail = (email: string) => {
            localStorage.setItem('email', email);
        }
        if (!email) {
            setErrorMessage('Email is required');
            return;
        } else if (email && !regexEmailFormat.test(email)) {
            setErrorMessage('Email is not valid');
            return;
        } else if (!name) {
            setErrorMessage('Name is required');
            return;
        } else if (!handle) {
            setErrorMessage('Handle is required');
            return;
        } else if (!regexHandleFormat.test(handle)) {
            setErrorMessage('Handle must be at least 3 characters, contain one @ at the beginning, and only contain letters, numbers, and underscores');
            return;
        } else if (!password) {
            setErrorMessage('Password is required');
            return;
        } else if (password && password.length < 8) {
            setErrorMessage('Password must be at least 8 characters');
            return;
        } else if (password !== password_confirmation) {
            setErrorMessage('Passwords do not match');
            return;
        } else if (!avatar) {
            setErrorMessage('Please choose an avatar');
            return;
        } else {
            axios({
                method: 'post',
                url: process.env.NEXT_PUBLIC_API_URL + '/users/register',
                data: {
                    email,
                    password,
                    name,
                    handle,
                    password_confirmation,
                    avatar
                }
            }).then((response) => {
                if (response.data.status === 'success') {
                    setEmail(email);
                    setAction({ login: false, register: false, forgotPassword: false, confirmEmail: true, confirmForgottenPassword: false });
                } else {
                    console.log(response)
                    setErrorMessage(response.data.error);
                }
            }).catch((error) => {
                console.log(error.message)
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
            <span className="w-full flex items-center justify-center text-4xl text-center py-2">Register</span>
                <form onClick={() => errormessage !== '' ? setErrorMessage('') : null} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input ref={emailRef} name="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Email" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Name
                        </label>
                        <input ref={nameRef} name="name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Name" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Handle
                        </label>
                        <input ref={handleRef} name="handle"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="@handle" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input ref={passwordRef} name="password"
                            className="shadow appearance-none borde rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password Confirmation
                        </label>
                        <input ref={confirmPasswordRef} name="password_confirmation"
                            className="shadow appearance-none borde rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Choose your avatar
                        </label>
                        <div className="flex flex-row justify-center">
                            {
                                avatarList.map((avatarNumber) => (
                                    <div key={avatarNumber} className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center">
                                            <Image width={50} height={50} src={`/${avatarNumber}.png`} className="border-4 border-[#FFFFFF] rounded-full mb-2" alt="avatar" />
                                            <input onClick={() => setAvatar(avatarNumber)} type="radio" className="form-radio" name="avatar" />
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-between mb-4">
                        <button onClick={handleRegister}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
                            Sign Up
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