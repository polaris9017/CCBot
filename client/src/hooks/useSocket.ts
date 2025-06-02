import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getSession } from '@/serverActions/auth';

export default function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        if (session?.user?.accessToken) {
          setAccessToken(session.user.accessToken);
          setUserId(session.user.uid);
        } else {
          setError('Access token from session is missing.');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setError('Failed to fetch session.');
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    try {
      const socket = io(`${process.env.BACK_API_CHAT_URL!}/chat`, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        query: {
          id: userId,
        },
        extraHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      socketRef.current = socket;

      const handleConnect = () => {
        setIsConnected(true);
        setError(null);
      };

      const handleDisconnect = () => setIsConnected(false);

      const handleConnectError = (error: Error) => {
        setError(`Connection error: ${error.message}`);
        setIsConnected(false);
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnectError);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnectError);
        socket.disconnect();
      };
    } catch (error) {
      console.error('Error initializing socket:', error);
      setError('Failed to initialize socket.');
      return;
    }
  }, [accessToken, userId]);

  const reconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  return { socket: socketRef.current, reconnect: reconnectSocket, connected: isConnected, error };
}
