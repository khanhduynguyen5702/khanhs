import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MQTTComponents = () => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // 👉 Lấy userId từ JWT (nếu có)
  const getUserIdFromJWT = () => {
    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) return null;
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      return payload?.id;
    } catch (err) {
      console.error('❌ Lỗi parse JWT:', err);
      return null;
    }
  };

  const userId = getUserIdFromJWT();
  const topic = `haicode/notification/${userId}`;

  const mqttOptions = {
    clientId: `mqttjs_${Math.random().toString(16).slice(2, 10)}`, // ID client ngẫu nhiên
    username: 'cuonghihi',
    password: '@Cc12312311',
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };

  useEffect(() => {
    if (!userId) return;

    const mqttClient = mqtt.connect(
      'wss://4ab98c3999614bb9993710c6ffb276e7.s1.eu.hivemq.cloud:8884/mqtt',
      mqttOptions
    );

    mqttClient.on('connect', () => {
      console.log('✅ Kết nối MQTT thành công!');
      setClient(mqttClient);
      setIsConnected(true);

      mqttClient.subscribe(topic, (err) => {
        if (!err) {
          console.log(`📡 Đã subscribe topic: ${topic}`);
        } else {
          console.error('❌ Lỗi khi subscribe:', err);
        }
      });
    });

    mqttClient.on('message', (topic, message) => {
      const msg = message.toString();
      console.log(`📥 Nhận tin nhắn từ ${topic}: ${msg}`);
      setMessages((prev) => [...prev, { topic, message: msg }]);
    });

    mqttClient.on('error', (err) => {
      console.error('❌ Lỗi kết nối:', err);
    });

    mqttClient.on('close', () => {
      console.warn('🔌 Mất kết nối MQTT');
      setIsConnected(false);
    });

    return () => {
      mqttClient.end();
      console.log('👋 Đã ngắt kết nối MQTT');
    };
  }, [userId]);

  const publishMessage = () => {
    if (client && isConnected) {
      const payload = JSON.stringify({
        title: '🧡 Có người vừa thích bài viết!',
        content: 'User A đã thả tim bài viết của bạn.',
      });
      client.publish(topic, payload, (err) => {
        if (!err) {
          console.log('📤 Tin nhắn test đã gửi!');
        } else {
          console.error('❌ Lỗi khi gửi:', err);
        }
      });
    } else {
      console.warn('⚠️ Không kết nối với MQTT broker');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-2">MQTT ReactJS Example</h2>
      <p className="text-sm mb-2">
        Trạng thái:{" "}
        <span className={isConnected ? "text-green-600" : "text-red-500"}>
          {isConnected ? "Đã kết nối" : "Chưa kết nối"}
        </span>
      </p>
      <button
        onClick={publishMessage}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        disabled={!isConnected}
      >
        Gửi tin nhắn test
      </button>
      <h3 className="mt-4 font-semibold">Tin nhắn nhận được:</h3>
      <ul className="mt-2 text-sm list-disc pl-5 text-gray-800">
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>Topic:</strong> {msg.topic} <br />
            <strong>Message:</strong> {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MQTTComponents;
