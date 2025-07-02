import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://haicode.fcstoys.cloud/api/users/resend-code", {
        email,
      });
      toast.success("📩 Mã xác minh đã được gửi tới email của bạn.");
      setStep(2);
      setCooldown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể gửi yêu cầu.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("❗ Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      await axios.post("https://haicode.fcstoys.cloud/api/users/reset-password", {
        email,
        code,
        newPassword,
      });
      toast.success("🔐 Đặt lại mật khẩu thành công. Đang chuyển đến trang đăng nhập...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể đặt lại mật khẩu.");
    }
  };

  const handleCancel = () => {
    setStep(1);
    setEmail("");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setCooldown(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-base">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Quên mật khẩu
        </h2>

        {step === 1 ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <input
              type="email"
              placeholder="Nhập email đã đăng ký"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={cooldown > 0}
                className={`flex-1 py-2 rounded-md transition text-white ${cooldown > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {cooldown > 0 ? `Gửi lại mã sau ${cooldown}s` : 'Gửi mã xác minh'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="text"
              placeholder="Mã xác minh từ email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              >
                Đặt lại mật khẩu
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
