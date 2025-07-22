import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const FriendList = ({ userId }) => {
  const { data: friends } = useQuery({
  queryKey: ['friends', userId],
  queryFn: () =>
    axios.get(`/api/users/${userId}/friends`).then(res => res.data?.data || []),
  enabled: !!userId,
});

  if (!friends || friends.length === 0) {
    return <p className="text-gray-500">Chưa có bạn bè</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {friends.map(f => (
        <div key={f._id} className="text-center">
          <img src={f.avatar} className="w-20 h-20 rounded-full mx-auto" />
          <p className="mt-2">{f.fullName}</p>
        </div>
      ))}
    </div>
  );
};

export default FriendList;
