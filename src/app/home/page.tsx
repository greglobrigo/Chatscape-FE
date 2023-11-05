'use client'
import Navbar from "./components/navbar/navbar";
import './home.css';
import { Fade } from 'react-awesome-reveal'
import Image from 'next/image'
import LoginForm from "./components/login-form/login-form";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function Page() {

    const [errormessage, setErrorMessage] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const id = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        const tokenSecret = process.env.NEXT_PUBLIC_TOKEN_SECRET;
        if (id && token && tokenSecret) {
            axios({
                method: 'post',
                url: 'http://localhost:3001/users/validate',
                data: {
                    user_id: id,
                },
                headers: {
                    Authorization: `Bearer ${token}|${tokenSecret}`,
                }
            }).then((response) => {
                if (response.data.status === 'success') {
                    router.push('/chat');
                } else {
                    setErrorMessage(response.data.error);
                    setTimeout(() => {
                        setErrorMessage('');
                    }, 3000)
                }
            }).catch((error) => {
                console.log(error);
            })
        }
    }, [])

    return (
        <>
            {
                errormessage &&
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center w-screen fixed top-0 z-10" role="alert">
                    <p>{errormessage}</p>
                </div>
            }
            <div className="home__header section__padding gradient__bg wrapper" id="home">
                <Navbar />
                <div className="home__header-content">
                    <div className="bg color-[black] text-center">
                        <h1>Welcome to Chatscape!</h1>
                        <div className="flex justify-center">
                            <a href="https://storyset.com/people" target="_blank" rel="noopener noreferrer">
                                <Image src="/home.svg" alt="home" width={500} height={500} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="home__header-content gradient__bg__center">
                    <LoginForm />
                </div>
            </div>
        </>
    )
}