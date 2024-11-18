import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchNotificationPreferences, updateNotificationPreferences } from '../../store/slices/notificationsSlice';
import { Bell, Settings, Calendar, Book, User } from 'lucide-react';
import { toast } from 'react-toastify';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'ritual' | 'consultation' | 'system';
  createdAt: number;
  read: boolean;
  placeId?: string;
  link?: string;
}

const NotificationCenter: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { preferences, loading } = useSelector((state: RootState) => state.notifications);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      dispatch(fetchNotificationPreferences(currentUser.uid));
    }
  }, [currentUser, dispatch]);

  const handleNotificationClick = (notification: Notification) => {
    // Marcar como lida
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Redirecionar se tiver link
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const handlePreferenceChange = (placeId: string, type: keyof NotificationPreference) => {
    if (!currentUser?.uid) return;

    dispatch(updateNotificationPreferences({
      userId: currentUser.uid,
      placeId,
      preferences: {
        [type]: !preferences[placeId]?.[type]
      }
    }));

    toast.success('Preferências atualizadas com sucesso!');
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'ritual':
        return <Book className="w-5 h-5 text-purple-500" />;
      case 'consultation':
        return <User className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-3 shadow-lg"
        >
          <Bell className="w-6 h-6" />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Notificações</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        notification.read
                          ? 'bg-gray-50 hover:bg-gray-100'
                          : 'bg-indigo-50 hover:bg-indigo-100'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma notificação no momento</p>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="font-medium text-gray-900 mb-4">
                  Preferências de Notificação
                </h3>
                {Object.entries(preferences).map(([placeId, prefs]) => (
                  <div key={placeId} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">
                      {placeId}
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={prefs.events}
                          onChange={() => handlePreferenceChange(placeId, 'events')}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Eventos
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={prefs.rituals}
                          onChange={() => handlePreferenceChange(placeId, 'rituals')}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Rituais
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={prefs.consultations}
                          onChange={() => handlePreferenceChange(placeId, 'consultations')}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Consultas
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
