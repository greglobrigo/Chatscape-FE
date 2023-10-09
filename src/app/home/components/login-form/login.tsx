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
  return (
      <div className="w-full max-w-xs bg-gradient-to-r from-blue-600 via-blue-400 to-white">
        <h1 className="mb-4 text-center">Login</h1>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input ref={emailRef} name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input ref={passwordRef} name="password"
              className="shadow appearance-none borde rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
          </div>
          <div onClick={() => setAction({ login: false, register: false, forgotPassword: true, confirmEmail: false, confirmForgottenPassword: false })} className="flex flex-col items-center justify-center mb-4 cursor-pointer">
            <button onClick={()=>console.log('login')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
              Sign In
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Forgot Password?
            </a>
          </div>
          <div onClick={() => setAction({ login: false, register: true, forgotPassword: false, confirmEmail: false, confirmForgottenPassword: false })} className="flex items-center justify-center cursor-pointer">
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Don't have an account? Sign Up
            </a>
          </div>
        </form>
      </div>
  )
}
