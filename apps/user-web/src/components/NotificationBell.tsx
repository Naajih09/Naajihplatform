import { Bell, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { getApiBaseUrl } from '../lib/api-base';

type Notification = {
  id: string;
  isRead: boolean;
  message: string;
  createdAt: string;
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const socket = useSocket(user.id);
  const API_BASE = getApiBaseUrl();
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const authHeaders = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  useEffect(() => {
    if (!user.id) return;

    let active = true;

    const loadNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE}/notifications/${user.id}`, {
          headers: authHeaders,
        });
        const data = (await res.json()) as Notification[];
        if (active) {
          setNotifications(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    void loadNotifications();

    return () => {
      active = false;
    };
  }, [user.id]);

  // 2. Listen for real-time notifications
  useEffect(() => {
    if (socket) {
      socket.on('notification_received', (newNotif: Notification) => {
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
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: authHeaders,
      });
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
        className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-white/5 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/[0.02]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
            <button onClick={() => setShowDropdown(false)} className="text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-gray-500 text-sm space-y-3">
                <p>No notifications yet</p>
                <Link
                  to="/dashboard/opportunities"
                  className="inline-flex items-center rounded-xl bg-primary px-3 py-2 text-xs font-bold text-black transition hover:brightness-110"
                >
                  Explore opportunities
                </Link>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 border-b border-slate-200 dark:border-white/5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                    !notif.isRead ? 'bg-primary/5' : ''
                  }`}
                >
                  <p className={`text-sm ${!notif.isRead ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-gray-400'}`}>
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-gray-600 mt-1 block">
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
