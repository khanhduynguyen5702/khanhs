import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const ProfileHeader = ({ userId }) => {
  const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () =>
    axios.get(`/api/users/${userId}`).then(res => res.data?.data || {}),
  enabled: !!userId,
});

  return (
    <div className="relative h-56 bg-gray-300 rounded-2xl mb-20">
      <div className="absolute -bottom-16 left-6 flex items-center gap-4">
        <img
          src={user?.avatar || "https://placehold.co/100x100"}
          alt="avatar"
          className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-bold">{user?.fullName || 'Chưa có tên'}</h2>
          <p className="text-gray-600">@{user?.username || 'username'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
