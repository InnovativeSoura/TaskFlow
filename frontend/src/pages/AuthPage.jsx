import { useState } from "react";
import { User, Mail, Lock, ImageIcon } from "lucide-react";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">

      <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl border border-slate-800">

        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 p-10 text-white">
          <h1 className="text-5xl font-bold mb-4">
            TaskFlow
          </h1>

          <p className="text-center text-lg">
            Smart Collaborative Project Management Platform
          </p>

          <div className="mt-10">
            <img
              src="https://illustrations.popsy.co/white/web-design.svg"
              alt="illustration"
              className="w-72"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-slate-900 p-8 md:p-12">

          <div className="flex bg-slate-800 rounded-xl p-1 mb-8">

            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                isLogin
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                !isLogin
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400"
              }`}
            >
              Register
            </button>

          </div>

          {isLogin ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>

              <p className="text-slate-400 mb-8">
                Login to continue managing your projects.
              </p>

              <form className="space-y-5">

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-slate-800 text-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-700 focus:border-indigo-500"
                  />
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-slate-800 text-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-700 focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all text-white py-4 rounded-xl font-semibold"
                >
                  Login
                </button>

              </form>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white mb-2">
                Create Account
              </h2>

              <p className="text-slate-400 mb-8">
                Register and start collaborating today.
              </p>

              <form className="space-y-5">

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-slate-800 text-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-700 focus:border-indigo-500"
                  />
                </div>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-slate-800 text-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-700 focus:border-indigo-500"
                  />
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-slate-800 text-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-700 focus:border-indigo-500"
                  />
                </div>

                <div className="relative">
                  <ImageIcon
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    type="file"
                    className="w-full bg-slate-800 text-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all text-white py-4 rounded-xl font-semibold"
                >
                  Register
                </button>

              </form>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default AuthPage;