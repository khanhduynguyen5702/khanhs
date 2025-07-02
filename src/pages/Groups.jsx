import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useStore } from '../components/Zustand';

export default function Groups() {
    const navigate = useNavigate();
  const {isLoggedIn} = useStore();

  useEffect(() => { 
    if (!isLoggedIn) navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return (
    <h1>hello</h1>
  )
}
