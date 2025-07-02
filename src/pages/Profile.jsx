import { useState, useEffect } from 'react';
import { FaFacebook, FaGithub, FaEnvelope, FaInstagram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../components/Zustand';

const Pic = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const handleFacebook = () =>
    window.open('https://www.facebook.com/duykhasnh.nguyen.5702/', '_blank');

  const handleGitHub = () =>
    window.open('https://github.com/khanhduynguyen5702', '_blank');

  const handleInstagram = () =>
    window.open('https://www.instagram.com/_duykhasnh._/', '_blank');

  const imageUrl =
    'https://pbs.twimg.com/media/E6lMdBAUUAUGNeH?format=jpg&name=medium';

  return (
    <div className="flex flex-col items-center mt-8">
      <img
        src={imageUrl}
        alt="Profile"
        onClick={toggleModal}
        className="w-48 h-48 object-cover rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform"
      />

      <div className="flex gap-6 mt-6 text-3xl">

        <button
          onClick={handleInstagram}
          className="text-black hover:text-gray-600 transition"
        >
          <FaInstagram />
        </button>

        <button
          onClick={handleFacebook}
          className="text-blue-600 hover:text-blue-400 transition"
        >
          <FaFacebook />
        </button>

        <button
          onClick={handleGitHub}
          className="text-black hover:text-gray-600 transition"
        >
          <FaGithub />
        </button>

        <button
          onClick={() => setShowEmail(!showEmail)}
          className="text-gray-800 hover:text-gray-600 transition"
        >
          <FaEnvelope />
        </button>

      </div>

      {showEmail && (
        <p className="mt-4 text-black text-lg">📧 khanhnd5702@gmail.com</p>
      )}

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt="Zoomed"
              className="max-w-[90vw] max-h-[90vh] rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default function Profile() {
  const containerClass = `text-center p-6 min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200`;
  const navigate = useNavigate();
  const { isLoggedIn } = useStore();

  useEffect(() => { 
    if (!isLoggedIn) navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return (
    <div className={containerClass}>
      <h1 className="text-4xl font-bold mb-6 text-indigo-700">Profile Page</h1>
      <Pic />
    </div>
  );
}
