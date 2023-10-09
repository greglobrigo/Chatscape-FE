'use client'
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AxiosResponse, AxiosError } from 'axios';
import Login from '../login-form/login';
import Register from '../login-form/register';
import ForgotPassword from '../login-form/forgot-password';
import ConfirmEmail from './confirm-email';
import ConfirmForgottenPassword from './confirm-forgotten-password';

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
    forgotPassword: false,
    confirmEmail: false,
    confirmForgottenPassword: false
  })

  return (
    <>
      {
        action.forgotPassword ?
          <ForgotPassword emailRef={emailRef} setAction={setAction} />
          : action.register ?
            <Register emailRef={emailRef} passwordRef={passwordRef} confirmPasswordRef={confirmPasswordRef} nameRef={nameRef} handleRef={handleRef} setAction={setAction} />
            : action.confirmEmail ?
              <ConfirmEmail emailRef={emailRef} setAction={setAction} />
              : action.confirmForgottenPassword ?
                <ConfirmForgottenPassword emailRef={emailRef} setAction={setAction} />
                : <Login emailRef={emailRef} passwordRef={passwordRef} setAction={setAction} />
      }
    </>
  );
}

export default LoginForm;