import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "../components/Zustand";

const fetchUserInfor = async (jwt) => {
  if (!jwt) throw new Error("Không có token");
  const res = await axios.get("https://haicode.fcstoys.cloud/api/users/me", {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res.data;
};

function UserIn4() {
  const navigate = useNavigate();
  const { isLoggedIn, jwt, user: storedUser } = useStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", {replace:true});
    }}, [isLoggedIn,navigate])

  const { data: user, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUserInfor(jwt),
    enabled: !!jwt && !storedUser,
    initialData: storedUser || undefined,
  });

  const containerClass = `p-6 min-h-screen  bg-gradient-to-br from-indigo-100 via-white to-indigo-200`;

  if (error) return <p className="text-red-500">{error.message}</p>;
  if (isLoading) return <p>Đang tải thông tin người dùng...</p>;

  return (
    <div className={containerClass}>
      <h1 className="text-[40px] font-bold mb-4 text-black">User information</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}

export default UserIn4;
