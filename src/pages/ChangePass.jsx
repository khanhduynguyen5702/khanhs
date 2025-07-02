import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useStore } from '../components/Zustand';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Eye, EyeOff } from "lucide-react";

const ChangePass = () => {
    const navigate = useNavigate();
    const isLoggedIn = useStore((state) => state.isLoggedIn);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) return null;

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("❗ Mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            const jwt = localStorage.getItem("jwt");

            await axios.post(
                "https://haicode.fcstoys.cloud/api/users/change-password",
                { newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            toast.success("✅ Đổi mật khẩu thành công. Đang chuyển đến trang chủ...");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            console.error("Lỗi change-password:", err.response?.data || err);
            toast.error(err.response?.data?.message || "Không thể đổi mật khẩu.");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-base">
                <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
                    Đổi mật khẩu
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>


                    <input
                        type={showPassword ? "text" : "password"}
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
                    </div>
                </form> 
            </div>
        </div>

    )
}



export default ChangePass;