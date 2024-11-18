import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { fetchUserProfile, updateUserProfile } from '../../store/slices/userSlice';
import { User, Settings, Bell, Globe, Moon } from 'lucide-react';
import { Button } from '../ui/Button';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, profile, loading } = useSelector((state: RootState) => state.user);
  const favorites = useSelector((state: RootState) => state.favorites.items);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser?.uid && !profile) {
      dispatch(fetchUserProfile(currentUser.uid));
    }
  }, [currentUser, profile, dispatch, navigate]);

  if (!currentUser) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  const handlePreferenceChange = (key: string, value: any) => {
    if (!currentUser) return;

    dispatch(updateUserProfile({
      userId: currentUser.uid,
      data: {
        preferences: {
          ...profile?.preferences,
          [key]: value
        }
      }
    }));
  };

  const defaultPreferences = {
    notifications: true,
    language: 'pt',
    theme: 'light' as const
  };

  const userPreferences = profile?.preferences || defaultPreferences;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 to-teal-400 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'Usuário'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{currentUser.displayName || 'Usuário'}</h1>
                <p className="opacity-90">{currentUser.email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-6 border-b">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{favorites?.length || 0}</div>
              <div className="text-sm text-gray-600">Favoritos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{profile?.visitedPlaces?.length || 0}</div>
              <div className="text-sm text-gray-600">Lugares Visitados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">4.8</div>
              <div className="text-sm text-gray-600">Avaliação Média</div>
            </div>
          </div>

          {/* Settings */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings size={20} className="mr-2" /> Configurações
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Bell size={20} className="text-gray-600 mr-3" />
                  <span>Notificações</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userPreferences.notifications}
                    onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Globe size={20} className="text-gray-600 mr-3" />
                  <span>Idioma</span>
                </div>
                <select
                  value={userPreferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="bg-white border border-gray-300 rounded-md px-3 py-1"
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Moon size={20} className="text-gray-600 mr-3" />
                  <span>Tema</span>
                </div>
                <select
                  value={userPreferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value as 'light' | 'dark')}
                  className="bg-white border border-gray-300 rounded-md px-3 py-1"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;