import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MQTTComponents = ({ onMessageCallback }) => {
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
    clientId: `mqttjs_${Math.random().toString(16).slice(2, 10)}`,
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

      if (onMessageCallback) {
        try {
          const parsed = JSON.parse(msg);
          onMessageCallback(parsed); // Gửi về cha
        } catch (err) {
          console.warn('⚠️ Không thể parse JSON MQTT message:', msg);
        }
      }
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
  }, [userId, onMessageCallback]);

  return null; // Không hiển thị UI
};

export default MQTTComponents;
