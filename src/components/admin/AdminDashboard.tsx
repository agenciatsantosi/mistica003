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

const AdminDashboard = () => {
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
      label: 'Eventos Ativos',
      value: 24,
      icon: <Calendar className="text-green-500" />,
      change: '+18%'
    },
    {
      label: 'Novos Comentários',
      value: comments.length,
      icon: <MessageSquare className="text-purple-500" />,
      change: '+8%'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
              <span className="flex items-center text-sm text-green-600">
                <TrendingUp size={16} className="mr-1" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Atividade Recente</h3>
          <div className="flex items-center text-gray-600">
            <Activity size={20} className="mr-2" />
            Últimos 30 dias
          </div>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Gráfico de atividades será implementado aqui
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Últimos Usuários</h3>
          <div className="space-y-4">
            {/* Lista de usuários recentes aqui */}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Comentários Recentes</h3>
          <div className="space-y-4">
            {/* Lista de comentários recentes aqui */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;