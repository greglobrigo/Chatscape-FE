import Navbar from "./components/navbar/navbar";
import './home.css';
import { Fade } from 'react-awesome-reveal'
import home from './home.svg'
import Image from 'next/image'
import LoginForm from "./components/login-form/login-form";


export default function Page() {

    return (
        <>
            <Navbar />
            <div className="home__header section__padding" id="home">
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

                <div className="home__header-content">
                    <h1 className="mb-4">Login</h1>
                    <LoginForm />
                </div>
            </div>
        </>
    )
}