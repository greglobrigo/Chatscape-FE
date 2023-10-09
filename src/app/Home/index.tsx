import Navbar from "./components/navbar/navbar";
import './home.css';
import { Fade } from 'react-awesome-reveal'
import home from './home.svg'
import Image from 'next/image'
import LoginForm from "./components/login-form/login-form";


export default function Home() {

    return (
        <>
            <Navbar />
            <div className="home__header section__padding" id="home">
                <div className="home__header-content">
                    <div className="bg color-[black] text-center">
                        <h1>Welcome to Chatscape!</h1>
                        <div className="justify-center">
                        <Image src="/home.svg" alt="home" width={500} height={500} />
                        </div>
                    </div>
                </div>

                <div className="home__header-content">
                    <h1>Login</h1>
                    {/* write me a login and logout input */}
                    <LoginForm />
                </div>
            </div>
        </>
    )
    //<a href="https://storyset.com/people">People illustrations by Storyset</a>
}