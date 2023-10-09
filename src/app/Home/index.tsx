"use client"
import Navbar from "./components/navbar/navbar";
import './home.css';
import { Fade } from 'react-awesome-reveal'
import home from './home.svg'
import Image from 'next/image'


export default function Home() {

    return (
        <>
            <Navbar />
            <div className="home__header section__padding" id="home">
                <div className="home__header-content">
                    <div className="bg color-[black]">
                        <h1>Welcome to Chatscape!</h1>
                        <Image src="/home.svg" alt="home" width={500} height={500} />
                    </div>
                </div>

                <div className="home__header-image flex-col">
                </div>
            </div>
        </>
    )
    //<a href="https://storyset.com/people">People illustrations by Storyset</a>
}