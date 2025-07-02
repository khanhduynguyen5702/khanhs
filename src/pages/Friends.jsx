import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../components/Zustand";


function Friends() {
  const navigate = useNavigate();
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null; 

  return <div>Friends</div>;
}

export default Friends;
