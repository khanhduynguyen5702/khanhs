import MQTTComponents from './MqttClan'
import {toast} from 'react-hot-toast'
import { useStore } from './Zustand'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
  useQuery, useMutation, useQueryClient
} from "@tanstack/react-query";
import { Bell } from "lucide-react";

 function Notification () {
  const navigate = useNavigate();
  const { isLoggedIn, username, logout, role, triggerRefetchNoti, setTriggerRefetchNoti } = useStore();

  const [showNoti, setShowNoti] = useState(false);
  const notiRef  = useRef (null);

  const queryClient = useQueryClient();

  const API = axios.create({
    baseURL: "https://haicode.fcstoys.cloud/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });

  const getMyNotifications = () => API.get("/notification/me");

  const markAsRead = (id) => API.put(`/notification/read/${id}`);
  const markAllAsRead = () => API.put("/notification/read-all");

  const {
    data: notiData,
    isLoading: notiLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getMyNotifications,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const readOneMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const readAllMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const handleRead = (id) => readOneMutation.mutate(id);
  const handleReadAll = () => readAllMutation.mutate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

   useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setShowNoti(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (triggerRefetchNoti) {
      refetch();
      setTriggerRefetchNoti(false);
    }
  }, [triggerRefetchNoti, refetch, setTriggerRefetchNoti]);

  const raw = notiData?.data?.data?.data;
  const notifications = Array.isArray(raw)
    ? [...raw].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];


  return (
    <div className="relative" ref={notiRef}>
                <MQTTComponents
                  onMessageCallback={(parsed) => {
                    const { type, fromUser, postTitle, content } = parsed;
                    console.log("fromUser", fromUser);
                    console.log("📥 Notifications raw data:", raw);

                    let message = "";
                    if (type === "like") {
                      message = `❤️ ${fromUser} đã thích bài viết "${postTitle}"`;
                    } else if (type === "comment") {
                      message = `💬 ${fromUser} đã bình luận: "${content}" trên bài viết "${postTitle}"`;
                    } else if (type === "reply") {
                      message = `↩️ ${fromUser} đã phản hồi: "${content}" trong bài viết "${postTitle}"`;
                    } else {
                      message = `🔔 Bạn có thông báo mới từ ${fromUser}`;
                    }

                    // Hiển thị thông báo dạng toast
                    toast(message);

                    // Gọi refetch lại dữ liệu notification
                    refetch();
                  }}
                />

                <Bell
                  onClick={() => setShowNoti((prev) => !prev)}
                  className="cursor-pointer text-gray-600 hover:text-blue-600"
                />
                {showNoti && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg z-50">
                    <div className="flex justify-between items-center px-4 py-2 border-b">
                      <h3 className="font-semibold text-gray-700">Thông báo</h3>
                      <button
                        onClick={handleReadAll}
                        className="text-blue-500 text-sm"
                      >
                        Đánh dấu tất cả đã đọc
                      </button>
                    </div>
                    {notiLoading ? (
                      <div className="p-4 text-sm text-gray-500">
                        Đang tải...
                      </div>
                    ) : (
                      <ul className="max-h-64 overflow-y-auto divide-y">
                        {notifications.map((noti) => (
                          <li
                            key={noti.id}
                            onClick={() => handleRead(noti.id)}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${noti.isRead ? "text-gray-500" : "font-semibold text-black"
                              }`}
                          >
                            <div>
                              <span className="text-blue-600">
                                {noti?.user?.username || noti?.userName || "Người lạ"}
                              </span>{" "}
                              {noti.title}
                            </div>

                            <div className="text-sm">{noti.content}</div>
                          </li>
                        ))}

                      </ul>
                    )}
                  </div>
                )}
              </div>
  )
}

export default Notification
