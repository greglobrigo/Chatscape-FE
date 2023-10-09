'use client'
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AxiosResponse, AxiosError } from 'axios';
import Login from '../login-form/login';
import Register from '../login-form/register';
import ForgotPassword from '../login-form/forgot-password';

function LoginForm() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const handleRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [action, setAction] = useState({
    login: true,
    register: false,
    forgotPassword: false
  })

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
    }).then((res: AxiosResponse) => {
      if (res.data.status === 'success' && res.data.token && res.data.message === 'Login Successful') {
        router.push('/chat');
      }
    }).catch((err: AxiosError) => {
      console.log(err.response?.data);
    })
  }

  return (
    <>
      {
        action.forgotPassword ?
          <ForgotPassword emailRef={emailRef} handleSubmit={handleSubmit} setAction={setAction} />
          : action.register ?
            <Register emailRef={emailRef} passwordRef={passwordRef} confirmPasswordRef={confirmPasswordRef} nameRef={nameRef} handleRef={handleRef} handleSubmit={handleSubmit} />
            : <Login emailRef={emailRef} passwordRef={passwordRef} handleSubmit={handleSubmit} setAction={setAction}/>
      }
    </>
  );
}

export default LoginForm;