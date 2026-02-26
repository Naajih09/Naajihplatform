import { Bell, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const socket = useSocket(user.id);

  // 1. Fetch initial notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/notifications/${user.id}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user.id) {
      fetchNotifications();
    }
  }, [user.id]);

  // 2. Listen for real-time notifications
  useEffect(() => {
    if (socket) {
      socket.on('notification_received', (newNotif: any) => {
        setNotifications((prev) => [newNotif, ...prev]);
        // Optional: Play sound or show toast
      });

      return () => {
        socket.off('notification_received');
      };
    }
  }, [socket]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1d1d20] border border-white/5 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            <button onClick={() => setShowDropdown(false)} className="text-gray-500 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${
                    !notif.isRead ? 'bg-primary/5' : ''
                  }`}
                >
                  <p className={`text-sm ${!notif.isRead ? 'text-white font-medium' : 'text-gray-400'}`}>
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-gray-600 mt-1 block">
                    {new Date(notif.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
