import { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useStore } from '../components/Zustand';
import toast from 'react-hot-toast';
import api from '../components/Api';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, username } = useStore();
  const formRef = useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(() => {
    const stored = localStorage.getItem('likedPosts');
    return stored ? JSON.parse(stored) : {};
  });

  const [commentPosts, setCommentPosts] = useState(() => {
    const stored = localStorage.getItem('commentPosts');
    return stored ? JSON.parse(stored) : {};
  });

const [replyCmt, setReplyCmt] = useState(() => {
  const stored = localStorage.getItem('replyCmt');
  return stored ? JSON.parse(stored) : {};
});
  const [replyVisible, setReplyVisible] = useState({});

  useEffect(() => {
    if (!isLoggedIn) navigate('/login', { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/posts/?page=${page}&limit=5`);
        const newPosts = await Promise.all(
          (res.data?.data || []).map(async (post) => {
            const postDetails = await api.get(`/posts/${post.id}`);
            return postDetails.data?.data || post;
          })
        );

        setAllPosts((prevPosts) => {
          let updatedPosts;
          if (page === 1) {
            updatedPosts = newPosts;
          } else {
            const existing = prevPosts || [];
            const merged = [...existing, ...newPosts];
            updatedPosts = merged.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
          }

          const sorted = updatedPosts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          localStorage.setItem('cachedPosts', JSON.stringify(sorted));
          return sorted;
        });
      } catch (err) {
        console.error('Lỗi fetch posts:', err?.response?.data || err.message);
        toast.error('Không thể tải bài viết.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  useEffect(() => {
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  }, [likedPosts]);

  useEffect(() => {
    localStorage.setItem('commentPosts', JSON.stringify(commentPosts));
  }, [commentPosts]);

  useEffect(() => {
    localStorage.setItem('replyCmt', JSON.stringify(replyCmt));
  }, [replyCmt]);

  const handlePost = async () => {
    if (!title.trim()) return toast.error('Vui lòng nhập nội dung');

    const payload = { title, description, image: imageUrl };

    try {
      const res = await api.post('/posts/create', payload);
      toast.success('Đăng bài thành công!');
      const newPost = res.data?.data;
      if (newPost) {
        setAllPosts(prevPosts => [newPost, ...prevPosts]);
      }
      setTitle('');
      setDescription('');
      setImageUrl('');
      setIsExpanded(false);
    } catch (err) {
      console.error('Lỗi khi tạo bài viết:', err?.response?.data || err.message);
      toast.error('Đăng bài thất bại.');
    }
  };

  const handleCommentPosts = async (postId) => {
    const content = commentPosts[postId]?.trim();
    if (!content) return toast.error('Nhập bình luận');

    try {
     await api.post('/posts/comment', {id:postId, content});

     const res = await api.get(`/posts/${postId}`);
     const updatedPosts = res.data?.data;

     setAllPosts((prev) => 
      prev.map((post) => (post.id === postId ? updatedPosts : post)));
      
      setCommentPosts((prev) => ({ ...prev, [postId]: '' }));
      toast.success('Đã bình luận!');
    } catch (err) {
      console.error('Lỗi bình luận:', err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || 'Không thể gửi bình luận');
    }
  };

  const handleReplyCmt = async (postId, commentId) => {
  const content = replyCmt[commentId]?.trim();
  if (!content) return toast.error('Vui lòng nhập phản hồi');

  
  try {
    const postRes = await api.get(`/posts/${postId}`);
    const post = postRes.data?.data;
    if (!post?.id) return toast.error('Không tìm thấy bài viết');

    const response = await api.post('/posts/reply-comment', {
      content,
      postId,
      commentId,
    });

    const newReply = response.data?.data;
    if (!newReply?.id) return toast.error('Server không trả về phản hồi hợp lệ');

    setAllPosts((prevPosts) => {
      const updated = prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.comments.map((cmt) =>
            cmt.id === commentId
              ? { ...cmt, replies: [...(cmt.replies || []), newReply] }
              : cmt
          );
          return { ...post, comments: updatedComments };
        }
        return post;
      });

      // ✅ Lưu lại vào localStorage sau khi cập nhật thành công
      localStorage.setItem('cachedPosts', JSON.stringify(updated));

      return updated;
    });

    setReplyCmt((prev) => ({ ...prev, [commentId]: '' }));
    setReplyVisible((prev) => ({ ...prev, [commentId]: false }));
    toast.success('Đã phản hồi!');
  } catch (err) {
    console.error('Lỗi phản hồi:', err?.response?.data || err.message);
    toast.error(err?.response?.data?.message || 'Không thể gửi phản hồi');
  }
};


  const handleDeleteComment = async (postId, commentId) => {
  try {
    await api.delete(`/posts/${commentId}/comment`);
    toast.success('Đã xóa bình luận');

    setAllPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter((c) => c.id !== commentId),
          };
        }
        return post;
      })
    );
  } catch (err) {
    console.error('Lỗi khi xóa bình luận:', err?.response?.data || err.message);
    toast.error('Không thể xóa bình luận');
  }
};

  const handleLikeToggle = async (postId) => {
    const isLiked = likedPosts[postId];
    try {
      if (!isLiked) {
        await api.post(`/posts/${postId}/like`);
        toast.success('Đã thích bài viết');
      } else {
        await api.delete(`/posts/${postId}/like`);
        toast.success('Đã bỏ thích bài viết');
      }
      const updatedLikes = { ...likedPosts, [postId]: !isLiked };
      setLikedPosts(updatedLikes);
    } catch (err) {
      console.error('Lỗi khi tương tác bài viết:', err?.response?.data || err.message);
      toast.error('Không thể tương tác bài viết.');
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', { hour12: false });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {isLoading && page === 1 && <p className="text-center text-gray-500">Đang tải bài viết...</p>}
      {!isLoading && allPosts.length === 0 && <p className="text-center text-gray-400">Chưa có bài viết nào.</p>}

      <div ref={formRef} onClick={() => setIsExpanded(true)} className="max-w-xl mx-auto bg-white rounded-xl shadow p-4 mb-6 cursor-text">
        <div className="flex gap-3 items-start">
          <NavLink to="/userin4" className="hover:bg-gray-100 p-1 rounded-full">
            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </NavLink>
          <div className="flex-1">
            <textarea 
              rows={isExpanded ? 3 : 1} 
              placeholder="Bạn đang nghĩ gì?" 
              className="w-full resize-none rounded-lg border border-gray-300 p-2" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
            {isExpanded && (
              <>
                <input 
                  type="text" 
                  placeholder="Mô tả" 
                  className="w-full mt-2 border p-2 rounded" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
                <input 
                  type="text" 
                  placeholder="URL ảnh (tuỳ chọn)" 
                  className="w-full mt-2 border p-2 rounded" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                />
              </>
            )}
            <div className="text-right mt-2">
              <button 
                onClick={handlePost} 
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
              >
                Đăng
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        {allPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow p-4">
            <NavLink to="/userin4" className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition">
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {post.user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-gray-800 font-semibold">{post.user?.username || 'Ẩn danh'}</div>
            </NavLink>
            {post.createdAt && <p className="text-xs text-gray-400 mb-1">{formatDate(post.createdAt)}</p>}
            <p className="text-gray-800 font-bold text-lg mb-1 break-words whitespace-pre-line">{post.title}</p>
            {post.description && <p className="text-sm text-gray-600 italic break-words whitespace-pre-line">{post.description}</p>}
            {post.image && <img src={post.image} alt="Post" className="mt-3 rounded max-h-96 object-cover w-full" />}
            
            <div className="mt-2 flex items-center gap-2">
              <button 
                onClick={() => handleLikeToggle(post.id)} 
                className={`text-sm px-4 py-1 rounded-full transition ${
                  likedPosts[post.id] 
                    ? 'bg-red-100 text-red-600 font-bold' 
                    : 'bg-gray-200 text-gray-700 font-normal'
                }`}
              >
                {likedPosts[post.id] ? '❤️ Đã thích' : '🤍 Thích'}
              </button>
            </div>
            
            <div className="mt-4">
              <input 
                type="text" 
                placeholder="Viết bình luận..." 
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2" 
                value={commentPosts[post.id] || ''} 
                onChange={(e) => setCommentPosts(prev => ({ ...prev, [post.id]: e.target.value }))} 
              />
              <button 
                onClick={() => handleCommentPosts(post.id)} 
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded"
              >
                Gửi
              </button>
              
              {Array.isArray(post.comments) && post.comments.length > 0 && (
                <div className="mt-3 border-t pt-3 space-y-2">
                  {post.comments.map((cmt) => (
                    <div key={cmt.id} className="bg-gray-100 p-3 rounded-lg text-sm text-gray-800 space-y-1">
  <div className="flex justify-between items-center">
    <div className="font-semibold text-blue-600">{cmt.user?.username || 'Ẩn danh'}</div>
    <div className="text-xs text-gray-500">{formatDate(cmt.createdAt)}</div>
  </div>
  <div className="ml-1">{cmt.content}</div>

  <div className="flex gap-3 mt-1 ml-1 text-xs">
    <button
      onClick={() => setReplyVisible(prev => ({ ...prev, [cmt.id]: !prev[cmt.id] }))}
      className="text-blue-500 hover:underline"
    >
      {replyVisible[cmt.id] ? 'Ẩn phản hồi' : 'Phản hồi'}
    </button>
    <button
      onClick={() => handleDeleteComment(post.id, cmt.id)}
      className="text-red-500 hover:underline"
    >
      Xóa
    </button>
  </div>

  {replyVisible[cmt.id] && (
    <div className="mt-2 pl-4">
      <input
        type="text"
        placeholder="Phản hồi..."
        className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-1"
        value={replyCmt[cmt.id] || ''}
        onChange={(e) =>
          setReplyCmt(prev => ({
            ...prev,
            [cmt.id]: e.target.value,
          }))
        }
      />
      <button
        onClick={() => handleReplyCmt(post.id, cmt.id)}
        className="bg-blue-400 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded"
      >
        Gửi phản hồi
      </button>
    </div>
  )}

  {Array.isArray(cmt.replies) && cmt.replies.length > 0 && (
    <div className="mt-2 pl-4 space-y-1">
      {cmt.replies.map((reply) => (
        <div key={reply.id} className="bg-white border border-gray-200 p-2 rounded text-xs">
          <div className="font-semibold text-blue-600">{reply.user?.username || 'Ẩn danh'}</div>
          <div className="ml-1 mt-1">{reply.content}</div>
          <div className="text-gray-500 text-right text-xs mt-1">{formatDate(reply.createdAt)}</div>
        </div>
      ))}
    </div>
  )}
</div>

                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="text-center mt-6">
          <button 
            onClick={() => setPage(prev => prev + 1)} 
            className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded" 
            disabled={isLoading}
          >
            {isLoading ? 'Đang tải...' : 'Tải thêm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;