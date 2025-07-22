import React, { useState } from 'react';
import ProfileHeader from '../components/UserPage/Profileheader';
import ProfileTabs from '../components/UserPage/ProfileTab';
import PostList from '../components/UserPage/PostList';
import FriendList from '../components/UserPage/Friends';
import PhotoGallery from '../components/UserPage/Photo';
import AboutInfo from '../components/UserPage/About';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchUser = async () => {
  const res = await axios.get('/api/users/me', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
  return res.data?.data?.user;
};

const UserIn4 = () => {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: fetchUser,
  });

  const [activeTab, setActiveTab] = useState('posts');

  if (isLoading) return <p>Đang tải thông tin người dùng...</p>;
  if (isError || !user) return <p>Lỗi khi tải người dùng</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ProfileHeader userId={user._id} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'posts' && <PostList userId={user._id} />}
      {activeTab === 'friends' && <FriendList userId={user._id} />}
      {activeTab === 'photos' && <PhotoGallery userId={user._id} />}
      {activeTab === 'about' && <AboutInfo userId={user._id} />}
    </div>
  );
};

export default UserIn4;
