import { FaRegThumbsUp, FaRegCommentDots, FaShare } from 'react-icons/fa';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.userAvatar || "https://placehold.co/100x100"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{post.userName || 'Không rõ'}</p>
          <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <p className="text-gray-800 mb-3">{post.content}</p>

      {post.image && (
        <img src={post.image} className="w-full max-h-96 object-cover rounded-lg mb-3" />
      )}

      <div className="flex justify-around border-t pt-2 text-gray-500">
        <button className="flex items-center gap-1 hover:text-blue-500"><FaRegThumbsUp /> Thích</button>
        <button className="flex items-center gap-1 hover:text-blue-500"><FaRegCommentDots /> Bình luận</button>
        <button className="flex items-center gap-1 hover:text-blue-500"><FaShare /> Chia sẻ</button>
      </div>
    </div>
  );
};

export default PostCard;
