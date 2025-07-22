const ProfileTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex justify-around border-b mb-4 mt-20">
    {['posts', 'photos', 'friends', 'about'].map(tab => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`p-2 font-semibold capitalize ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
      >
        {tab === 'posts' && 'Bài viết'}
        {tab === 'photos' && 'Ảnh'}
        {tab === 'friends' && 'Bạn bè'}
        {tab === 'about' && 'Giới thiệu'}
      </button>
    ))}
  </div>
);

export default ProfileTabs;
