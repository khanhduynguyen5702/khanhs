import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PostCard from './PostCard';

const PostList = ({ userId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['userPosts', userId],
    queryFn: async () => {
      if (!userId) throw new Error('Missing userId');
      const res = await axios.get(`/api/posts/user/${userId}?page=1&limit=10`);
      return res.data?.data || [];
    },
    enabled: !!userId, // tránh gọi khi chưa có userId
  });

  if (isLoading) return <p className="text-center">Đang tải bài viết...</p>;
  if (isError) return <p className="text-center text-red-500">Không thể tải bài viết của người dùng.</p>;
  if (!data || data.length === 0) return <p className="text-center text-gray-500">Người dùng này chưa có bài viết.</p>;

  return (
    <div className="space-y-4">
      {data.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
