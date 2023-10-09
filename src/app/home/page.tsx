import Navbar from "./components/navbar/navbar";
import './home.css';
import { Fade } from 'react-awesome-reveal'
import Image from 'next/image'
import LoginForm from "./components/login-form/login-form";


export default function Page() {

    return (
        <>
            <div className="home__header section__padding gradient__bg" id="home">
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