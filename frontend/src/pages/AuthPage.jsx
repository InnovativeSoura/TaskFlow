import { useState } from "react";
import { User, Mail, Lock, ImageIcon } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [profilePic, setProfilePic] =
    useState(null);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      if (profilePic) {
        formData.append(
          "profilePic",
          profilePic
        );
      }

      const res = await axios.post(
        `${API_URL}/api/auth/register`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert("Registration Successful!");

      console.log(res.data);

      setIsLogin(true);

      setName("");
      setEmail("");
      setPassword("");
      setProfilePic(null);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      alert("Login Successful!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl border border-slate-800">
        
        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 p-10 text-white">
          <h1 className="text-5xl font-bold mb-4">
            TaskFlow
          </h1>

          <p className="text-center text-lg">
            Smart Collaborative Project
            Management Platform
          </p>

          <div className="mt-10">
            <img
              src="https://illustrations.popsy.co/white/web-design.svg"
              alt="illustration"
              className="w-72"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-slate-900 p-8 md:p-12">
          <div className="flex bg-slate-800 rounded-xl p-1 mb-8">
            <button
              onClick={() =>
                setIsLogin(true)
              }
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                isLogin
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400"
              }`}
            >
              Login
            </button>

            <button
              onClick={() =>
                setIsLogin(false)
              }
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
                Login to continue managing
                your projects.
              </p>

              <form
                className="space-y-5"
                onSubmit={handleLogin}
              >
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    id="loginEmail"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
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
                    id="loginPassword"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
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
                Register and start
                collaborating today.
              </p>

              <form
                className="space-y-5"
                onSubmit={handleRegister}
              >
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
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
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
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
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
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
                    id="profilePic"
                    name="profilePic"
                    type="file"
                    onChange={(e) =>
                      setProfilePic(
                        e.target.files[0]
                      )
                    }
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
