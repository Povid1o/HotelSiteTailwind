import React, { useContext, useState } from "react";
import Navbar from "./components/Navbar";
import { login, registration } from "./components/http/userAPI";
import { useLocation, NavLink } from "react-router-dom";
import { Context } from "./index";

const Auth = () => {
  const { user } = useContext(Context);
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (isLogin) {
        data = await login(email, password);
      } else {
        data = await registration(email, password);
      }
      user.setUser(data);
      user.setIsAuth(true);
    } catch (error) {
      setError(error.response.data.message);
    }
};
  
if (!user.isAuth) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen bg-[url('../public/images/Wine_Background2_AI.png')] bg-no-repeat bg-cover">
        <div className="grid place-items-center mx-2 my-20 sm:my-auto">
          <div className="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 px-6 py-10 sm:px-10 sm:py-6 bg-white rounded-lg shadow-md lg:shadow-lg">
            
            <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
              {isLogin ? "Login" : "Registration"}
            </h2>

            <form onSubmit={handleSubmit}>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-600 uppercase">
                E-mail
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                name="email"
                placeholder="e-mail address"
                autoComplete="email"
                className="block w-full py-3 px-1 mt-2 text-gray-800 appearance-none border-b-2 border-gray-100 focus:text-gray-500 focus:outline-none focus:border-gray-200"
                required
              />

              <label htmlFor="password" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                name="password"
                placeholder="password"
                autoComplete="current-password"
                className="block w-full py-3 px-1 mt-2 mb-4 text-gray-800 appearance-none border-b-2 border-gray-100 focus:text-gray-500 focus:outline-none focus:border-gray-200"
                required
              />

              {error && (
                <div className="text-red-500 text-sm mb-2">{error}</div>
              )}

              <button
                type="submit"
                className="w-full py-3 mt-10 bg-gray-800 rounded-sm font-medium text-white uppercase focus:outline-none hover:bg-gray-700 hover:shadow-none"
              >
                {isLogin ? "Войти" : "Зарегистрироваться"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}else {
    return(
    <>
      <Navbar />
      <div className="flex flex-col h-screen bg-[url('../public/images/Wine_Background2_AI.png')] bg-no-repeat bg-cover">
        <div className="grid place-items-center mx-2 my-20 sm:my-auto">
          <div className="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 px-6 py-10 sm:px-10 sm:py-6 bg-white rounded-lg shadow-md lg:shadow-lg">
            
            <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
              Вы вошли!
            </h2>

          </div>
        </div>
      </div>
    </>
    );
 }
};

export default Auth;