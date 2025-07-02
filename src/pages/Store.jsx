import React, { useEffect, useState } from 'react';
import { useStore } from '../components/Zustand';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Store() {
  const navigate = useNavigate();
  const { isLoggedIn, jwt } = useStore();

  useEffect(() => {
    if (!isLoggedIn) navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const [form, setForm] = useState({
    title: '',
    description: '',
    images: ['', '', ''],
    price: '',
    location: '',
    review: '',
    amenities: [''],
    amenitiesDescription: '',
    notes: ''
  });

  const [successData, setSuccessData] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);

  const handleChange = (e, index = null, isArray = false) => {
    const { name, value } = e.target;
    if (isArray && index !== null) {
      const updatedArray = [...form[name]];
      updatedArray[index] = value;
      setForm({ ...form, [name]: updatedArray });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://haicode.fcstoys.cloud/api/homestay/create', form, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        }
      });
      toast.success('🎉 Tạo homestay thành công!');
      setSuccessData(res.data?.data || form);
      setForm({
        title: '',
        description: '',
        images: ['', '', ''],
        price: '',
        location: '',
        review: '',
        amenities: [''],
        amenitiesDescription: '',
        notes: ''
      });
      fetchStore(page);
    } catch (err) {
      toast.error('❌ Lỗi khi tạo homestay');
      console.error(err.response?.data || err.message);
    }
  };

  const fetchStore = async (pageNumber = 1, location = '') => {
    setLoading(true);
    try {
      const res = await axios.get('https://haicode.fcstoys.cloud/api/homestay', {
        params: {
          page: pageNumber,
          limit: 6,
          location: location || undefined,
        },
      });
      setStores(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Lỗi fetch homestay:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore(page);
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">🏡 Tạo Homestay</h1>

      {successData && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
          <h2 className="text-xl font-semibold text-green-700">✅ Homestay đã được tạo:</h2>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="border-l-4 border-blue-500 pl-4">
          <h2 className="text-lg font-semibold text-blue-600">Thông tin cơ bản</h2>
          <div className="flex flex-col gap-2 mt-2">
            <input className="input" placeholder="Tiêu đề" name="title" value={form.title} onChange={handleChange} />
            <textarea className="input" placeholder="Mô tả" name="description" value={form.description} onChange={handleChange} />
          </div>
        </div>

        {/* Images */}
        <div className="border-l-4 border-yellow-400 pl-4">
          <h2 className="text-lg font-semibold text-yellow-600">Ảnh Homestay</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {form.images.map((img, i) => (
              <div key={i} className="space-y-2">
                <input
                  className="input"
                  placeholder={`Ảnh ${i + 1} (URL)`}
                  name="images"
                  value={img}
                  onChange={(e) => handleChange(e, i, true)}
                />
                {img && img.startsWith("http") ? (
                  <img src={img} alt={`preview-${i}`} className="w-full h-32 object-cover rounded-lg border" />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Price + Location */}
        <div className="border-l-4 border-green-500 pl-4">
          <h2 className="text-lg font-semibold text-green-600">Chi phí & Địa điểm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <input className="input" placeholder="Giá" name="price" value={form.price} onChange={handleChange} />
            <input className="input" placeholder="Địa điểm" name="location" value={form.location} onChange={handleChange} />
            <input className="input" placeholder="Đánh giá" name="review" value={form.review} onChange={handleChange} />
          </div>
        </div>

        {/* Amenities */}
        <div className="border-l-4 border-purple-500 pl-4">
          <h2 className="text-lg font-semibold text-purple-600">Tiện nghi</h2>
          <div className="flex flex-col gap-2 mt-2">
            <input
              className="input"
              placeholder="Tiện nghi (VD: Wifi, TV)"
              name="amenities"
              value={form.amenities[0]}
              onChange={(e) => handleChange(e, 0, true)}
            />
            <textarea
              className="input"
              placeholder="Mô tả tiện nghi"
              name="amenitiesDescription"
              value={form.amenitiesDescription}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="border-l-4 border-gray-400 pl-4">
          <h2 className="text-lg font-semibold text-gray-700">Ghi chú thêm</h2>
          <textarea className="input mt-2" placeholder="Ghi chú" name="notes" value={form.notes} onChange={handleChange} />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold text-lg"
        >
          Gửi Homestay
        </button>
      </form>

      {/* Danh sách homestay */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Danh sách Homestay</h2>

        {loading ? (
          <p className="text-gray-500">Đang tải danh sách...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelected(item)}
                className="cursor-pointer border rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition"
              >
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt="Homestay"
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md mb-3">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <h2 className="text-xl font-semibold text-blue-800">{item.title}</h2>
                <p className="text-gray-600 text-sm">{item.location}</p>
                <p className="text-green-600 font-bold mt-1">{item.price} đ</p>
                <p className="text-sm mt-2 line-clamp-2">{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 text-gray-600">Trang {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Tiếp
          </button>
        </div>
      </div>

      {/* Modal chi tiết */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-xl w-full relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-2">{selected.title}</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {selected.images?.map((img, i) =>
                img ? (
                  <img
                    key={i}
                    src={img}
                    alt={`img-${i}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ) : null
              )}
            </div>
            <p className="text-gray-600">{selected.description}</p>
            <p className="text-green-600 font-semibold mt-2">Giá: {selected.price} đ</p>
            <p className="text-gray-500">Địa điểm: {selected.location}</p>
            <p className="text-gray-500 mt-1">Tiện nghi: {selected.amenities?.join(", ")}</p>
            <p className="text-gray-500 mt-1">{selected.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
