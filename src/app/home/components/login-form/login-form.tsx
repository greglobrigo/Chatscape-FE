'use client'
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AxiosResponse, AxiosError } from 'axios';

function LoginForm() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

   const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log('clicked')
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    await axios({
      method: 'post',
      url: 'http://localhost:3001/users/login',
      data: {
        email: email,
        password: password
      }
    }).then((res:AxiosResponse) => {
      if (res.data.status === 'success' && res.data.token && res.data.message === 'Login Successful') {
        console.log(res.data);
        console.log('passed')
        router.push('/chat');
      }
    }).catch((err:AxiosError) => {
      console.log(err.response?.data);
    })
  }

    return (
        <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input ref={emailRef} name="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input ref = {passwordRef} name="password"
            className="shadow appearance-none borde rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"/>
          </div>
          <div className="flex items-center justify-between">
            <button onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Sign In
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    );
}

export default LoginForm;