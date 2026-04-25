import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getApiBaseUrl } from '@/lib/api-base';

export const useSocket = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || getApiBaseUrl().replace(/\/api$/, '');
    const nextSocket = io(socketUrl, {
      transports: ['websocket'],
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(nextSocket);

    nextSocket.on('connect', () => {
      console.log('Connected to socket server');
      nextSocket.emit('join_room', { userId });
      nextSocket.emit('join_notifications', { userId });
    });

    nextSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    return () => {
      nextSocket.disconnect();
      setSocket(null);
    };
  }, [userId]);

  return socket;
};
