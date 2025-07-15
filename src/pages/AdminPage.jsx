import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "../components/Zustand";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

function AdminPage() {
  const { role, jwt } = useStore();
  const navigate = useNavigate();
  const [allNoti, setAllNoti] = useState([]);
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const queryClient = useQueryClient();

  const API = axios.create({
    baseURL: "https://haicode.fcstoys.cloud/api",
    headers: { Authorization: `Bearer ${jwt}` },
  });

  const fetchAllNotifications = async () => {
    try {
      const res = await API.get("/notification/get-all?offset=0&limit=100");
      const data = res.data?.data?.data || [];
      setAllNoti(data);
    } catch (err) {
      toast.error("Lỗi khi lấy danh sách thông báo");
    }
  };
const { setTriggerRefetchNoti } = useStore(); 

  const handleCreateNoti = async (e) => {
    e.preventDefault();
    try {
      await API.post("/notification/create-for-user", {
        userId: Number(userId),
        title,
        content,
        url,
      });
      toast.success("✅ Tạo thông báo thành công!");
      setTriggerRefetchNoti(true);

      await fetchAllNotifications();

      queryClient.invalidateQueries({queryKey: ["notifications"]});

      

      setUserId("");
      setTitle("");
      setContent("");
      setUrl("");
    } catch {
      toast.error("Tạo thông báo thất bại");
    }
  };

  useEffect(() => {
    if (role === "admin") {
      fetchAllNotifications();
    }
  }, [role]);

  if (role !== "admin") {
    navigate("/");
    return null;
  }

  return (
    <div className="p-6 space-y-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">🔐 Trang Quản Trị (Admin)</h1>

      <form onSubmit={handleCreateNoti} className="space-y-4 bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold">Tạo thông báo cho người dùng</h2>
        <input
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Nội dung"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="URL (nếu có)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Gửi thông báo
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">📋 Danh sách tất cả thông báo</h2>
        {allNoti.length === 0 ? (
          <p className="text-gray-500">Không có thông báo nào.</p>
        ) : (
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {allNoti.map((noti) => (
              <li key={noti.id} className="border p-3 rounded hover:bg-gray-50">
                <div className="font-bold">{noti.title}</div>
                <div>{noti.content}</div>
                <div className="text-sm text-gray-500">
                  👤 User ID: {noti.userId}
                  {noti.url && <> | 🔗 <a href={noti.url}>{noti.url}</a></>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
