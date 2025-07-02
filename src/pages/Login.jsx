import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useStore } from "../components/Zustand";

function Login() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useStore();

  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('https://haicode.fcstoys.cloud/api/users/login', {
        username: userName,
        password: passWord,
      });

      const jwt = res.data?.data?.jwt;
      if (jwt) {
        login(jwt, userName);
        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        toast.error("Đăng nhập thất bại!");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Đăng nhập thất bại.";
      if (msg.toLowerCase().includes("invalid username")) {
        toast.error("Sai tên đăng nhập");
      } else if (msg.toLowerCase().includes("invalid password")) {
        toast.error("Sai mật khẩu");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-base">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="username..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password..."
              value={passWord}
              onChange={(e) => setPassWord(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Đang đăng nhập..." : "Login"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Forgot password?{" "}
            <a href="/forgetpass" className="text-indigo-600 hover:underline">Forgot</a>
          </p>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have account?{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">SignUp</a>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Login;
