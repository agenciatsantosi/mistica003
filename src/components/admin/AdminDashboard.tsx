import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  Users, 
  MapPin, 
  Calendar, 
  MessageSquare,
  TrendingUp,
  Activity
} from 'lucide-react';

export const AdminDashboard = () => {
  const places = useSelector((state: RootState) => state.places.items);
  const users = useSelector((state: RootState) => state.user.totalUsers || 0);
  const comments = useSelector((state: RootState) => state.comments.items);

  const stats = [
    {
      label: 'Total de Usuários',
      value: users,
      icon: <Users className="text-blue-500" />,
      change: '+12%'
    },
    {
      label: 'Lugares Cadastrados',
      value: places.length,
      icon: <MapPin className="text-rose-500" />,
      change: '+5%'
    },
    {
      label: 'Agendamentos',
      value: '156',
      icon: <Calendar className="text-green-500" />,
      change: '+18%'
    },
    {
      label: 'Comentários',
      value: comments.length,
      icon: <MessageSquare className="text-purple-500" />,
      change: '+8%'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'user',
      message: 'Novo usuário registrado',
      time: '5 minutos atrás'
    },
    {
      id: 2,
      type: 'place',
      message: 'Novo local adicionado',
      time: '10 minutos atrás'
    },
    {
      id: 3,
      type: 'comment',
      message: 'Novo comentário em Igreja São José',
      time: '15 minutos atrás'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Bem-vindo ao painel administrativo</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-gray-50">
                {stat.icon}
              </div>
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Atividade Recente
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-6 flex items-center">
              <div className="mr-4">
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {activity.message}
                </p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};