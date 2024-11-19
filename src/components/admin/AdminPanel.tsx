import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings,
  Bell
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { PlacesManager } from './PlacesManager';
import { UsersManager } from './UsersManager';
import { EventsManager } from './EventsManager';
import { CommentsManager } from './CommentsManager';
import { NotificationsManager } from './NotificationsManager';
import { SettingsManager } from './SettingsManager';

export const AdminPanel = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Verifica se o usuário é admin
  if (!currentUser?.isAdmin) {
    return <Navigate to="/" />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'places', label: 'Lugares', icon: <MapPin size={20} /> },
    { id: 'users', label: 'Usuários', icon: <Users size={20} /> },
    { id: 'events', label: 'Eventos', icon: <Calendar size={20} /> },
    { id: 'comments', label: 'Comentários', icon: <MessageSquare size={20} /> },
    { id: 'notifications', label: 'Notificações', icon: <Bell size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'places':
        return <PlacesManager />;
      case 'users':
        return <UsersManager />;
      case 'events':
        return <EventsManager />;
      case 'comments':
        return <CommentsManager />;
      case 'notifications':
        return <NotificationsManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-rose-500">Portal da Fé - Admin</h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-rose-50 text-rose-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};