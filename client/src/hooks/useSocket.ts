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
    if (!accessToken || !userId) return;

    const chatUrl = process.env.NEXT_PUBLIC_BACK_API_CHAT_URL;
    if (!chatUrl) {
      setError('NEXT_PUBLIC_BACK_API_CHAT_URL environment variable is not set');
      return;
    }

    console.log('Attempting to connect to:', chatUrl);
    console.log('User ID:', userId);
    console.log('Access Token available:', !!accessToken);
    console.log('Access Token', accessToken);

    try {
      // 네임스페이스 방식으로 연결
      const socket = io(`${chatUrl}/chat`, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
        timeout: 10000,
        forceNew: true,
        autoConnect: true,
        query: {
          id: userId,
        },
        auth: {
          token: accessToken,
        },
      });

      socketRef.current = socket;

      const handleConnect = () => {
        console.log('✅ Socket connected successfully');
        setIsConnected(true);
        setError(null);
      };

      const handleDisconnect = (reason: string) => {
        console.log('❌ Socket disconnected:', reason);
        setIsConnected(false);
      };

      const handleConnectError = (error: any) => {
        console.error('🔴 Socket connection error:', error);
        setError(`Connection error: ${error.message || error.toString()}`);
        setIsConnected(false);
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnectError);

      // 연결 시도 로그
      socket.on('connecting', () => {
        console.log('🔄 Socket connecting...');
      });

      return () => {
        console.log('🧹 Cleaning up socket listeners');
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnectError);
        socket.disconnect();
        socketRef.current = null;
      };
    } catch (error) {
      console.error('Error initializing socket:', error);
      setError('Failed to initialize socket.');
    }
  }, [accessToken, userId]);

  const reconnectSocket = useCallback(() => {
    console.log('🔄 Manual reconnection attempt');
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  return {
    socket: socketRef.current,
    reconnect: reconnectSocket,
    connected: isConnected,
    error,
    userId,
    accessToken: !!accessToken,
  };
}
