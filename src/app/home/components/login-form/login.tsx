import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


type LoginProps = {
  emailRef: React.RefObject<HTMLInputElement>;
  passwordRef: React.RefObject<HTMLInputElement>;
  setAction: React.Dispatch<React.SetStateAction<{
    login: boolean;
    register: boolean;
    forgotPassword: boolean;
    confirmEmail: boolean;
    confirmForgottenPassword: boolean;
  }>>;
}

export default function Login({ emailRef, passwordRef, setAction }: LoginProps) {
  const setToken = (token: string) => localStorage.setItem('token', token);
  const setUserID = (userID: string) => localStorage.setItem('user_id', userID);
  const router = useRouter();
  const [errormessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleLogin = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (email && password) {
      axios({
        method: 'post',
        url: process.env.NEXT_PUBLIC_API_URL + '/users/login',
        data: {
          email,
          password
        }
      }).then((response) => {
        if (response.data.status === 'success') {
          if (response.data.message.includes('Login Successful!')) {
            setUserID(response.data.user);
            setToken(response.data.token);
            setSuccessMessage(response.data.message);
            setTimeout(() => {
              router.push('/chat');
            }, 3000);
          } else if (response.data.message.includes('For email validation')) {
            setErrorMessage(response.data.message + ' redirecting...');
            setTimeout(() => {
              setAction({ login: false, register: false, forgotPassword: false, confirmEmail: true, confirmForgottenPassword: false });
            }, 3000);
          }
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
        successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      }
      {
        errormessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errormessage}</span>
        </div>
      }
      <div className="w-full max-w-xs bg-gradient-to-r from-blue-600 via-blue-400 to-white">
        <h1 className="mb-4 text-center">Login</h1>
        <form onClick={() => errormessage !== '' ? setErrorMessage('') : null} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input ref={emailRef} name="email" onKeyDown={(e) => e.key === 'Enter' ? handleLogin() : null}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input ref={passwordRef} name="password" onKeyDown={(e) => e.key === 'Enter' ? handleLogin() : null}
              className="shadow appearance-none borde rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
          </div>
          <div className="flex flex-col items-center justify-center mb-4 cursor-pointer">
            <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
              Sign In
            </button>
            <div onClick={() => setAction({ login: false, register: false, forgotPassword: true, confirmEmail: false, confirmForgottenPassword: false })} className="flex items-center justify-center cursor-pointer">
              <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Forgot Password?
              </a>
            </div>
          </div>
          <div onClick={() => setAction({ login: false, register: true, forgotPassword: false, confirmEmail: false, confirmForgottenPassword: false })} className="flex items-center justify-center cursor-pointer">
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Don&apos;t have an account? Sign Up
            </a>
          </div>
        </form>
      </div>
    </>
  )
}
