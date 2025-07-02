import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useStore } from "../components/Zustand";

const SignUpPage = () => {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("signup_form");
    return saved ? JSON.parse(saved) : {
      username: "",
      password: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      country: ""
    };
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(() => {
    return parseInt(localStorage.getItem("signup_step")) || 1;
  });
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  useEffect(() => {
    localStorage.setItem("signup_form", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    localStorage.setItem("signup_step", step.toString());
  }, [step]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const formatDOB = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}${mm}${yyyy}`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    try {
      const formattedForm = {
        ...form,
        dateOfBirth: formatDOB(form.dateOfBirth),
      };

      const registerRes = await axios.post(
        'https://haicode.fcstoys.cloud/api/users/register',
        formattedForm
      );

      if (registerRes.status === 200 || registerRes.status === 201) {
        await axios.post("https://haicode.fcstoys.cloud/api/users/resend-code", {
          email: form.email,
        });

        toast.success(" Đăng ký thành công. Token đã được gửi.");
        setStep(2);
      }
    } catch (error) {
      const backendMessage = error.response?.data?.message || "";
      let newErrors = {};

      if (backendMessage.includes("user_email_unique")) {
        newErrors.email = "Email đã được sử dụng.";
      } else if (backendMessage.includes("user_username_unique")) {
        newErrors.username = "Tên người dùng đã tồn tại.";
      } else if ( backendMessage.includes("user_phone_unique")) {
        newErrors.phone = "Số điện thoại đã được sử dụng";
      }
       else {
        toast.error(backendMessage || "Có lỗi xảy ra.");
      }

      setErrors(newErrors);
    }
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`https://haicode.fcstoys.cloud/api/users/verify-email?email=${form.email}&token=${token}`);
      if (res.status === 200) {
        toast.success("✅ Xác minh email thành công!");

        const loginRes = await axios.post(
          'https://haicode.fcstoys.cloud/api/users/login',
          {
            username: form.username,
            password: form.password,
          }
        );

        const jwt = loginRes.data?.data?.jwt;
        if (jwt) {
          login(jwt, form.username);
          localStorage.removeItem("signup_form");
          localStorage.removeItem("signup_step");
          navigate("/");
        } else {
          toast.error("Không thể đăng nhập sau khi xác minh.");
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Token không hợp lệ hoặc đã hết hạn.";
      toast.error(`Lỗi xác minh: ${msg}`);
      console.error("❗ Lỗi xác minh token:", err.response?.data || err);
    }
  };

  const handleResendToken = async () => {
    try {
      await axios.post("https://haicode.fcstoys.cloud/api/users/resend-code", {
        email: form.email,
      });
      toast.success("📬 Token mới đã được gửi lại đến email của bạn.");
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể gửi lại token.";
      toast.error(msg);
    }
  };

  const handleCancelVerification = () => {
    localStorage.removeItem("signup_form");
    localStorage.removeItem("signup_step");
    setForm((prev) => ({
      username: "",
      password: "",
      email: prev.email,
      phone: "",
      dateOfBirth: "",
      country: ""
    }));
    setStep(1);
    setToken("");
    toast("Đã quay lại bước đăng ký");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-base">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Sign Up</h2>

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700">User Name</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Phone number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Register
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyToken} className="space-y-4">
            <input
              type="text"
              name="token"
              placeholder="Nhập token từ email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
            >
              Xác minh email
            </button>
            <button
              type="button"
              onClick={handleResendToken}
              className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-md hover:bg-yellow-600 transition"
            >
              Gửi lại token
            </button>
            <button
              type="button"
              onClick={handleCancelVerification}
              className="w-full bg-gray-300 text-gray-800 font-semibold py-2 rounded-md hover:bg-gray-400 transition"
            >
              ❌ Hủy xác minh & quay lại đăng ký
            </button>
          </form>
        )}

        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}

       

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
