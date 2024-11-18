import React, { useState } from 'react';
import { Bell, Send, Search, Users, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

const NotificationsManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulação de notificações
  const notifications = [
    {
      id: '1',
      title: 'Missa de Domingo',
      content: 'Não perca nossa missa dominical às 10h.',
      type: 'event',
      target: 'all',
      scheduledFor: '2024-03-10 09:00',
      status: 'scheduled'
    },
    // Adicione mais notificações conforme necessário
  ];

  const handleSendNotification = () => {
    setIsModalOpen(true);
  };

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Notificações</h2>
        <Button onClick={handleSendNotification} icon={<Send size={20} />}>
          Nova Notificação
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="search"
            placeholder="Buscar notificações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div key={notification.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Bell className="text-rose-500" size={20} />
                  <h3 className="font-medium">{notification.title}</h3>
                </div>
                <p className="text-gray-600 mt-2">{notification.content}</p>
                <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Users size={16} className="mr-1" />
                    {notification.target === 'all' ? 'Todos os usuários' : 'Usuários selecionados'}
                  </span>
                  <span className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {notification.scheduledFor}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                notification.status === 'scheduled'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {notification.status === 'scheduled' ? 'Agendada' : 'Enviada'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Notification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Notificação"
      >
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Conteúdo
            </label>
            <textarea
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Público-alvo
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
              <option value="all">Todos os usuários</option>
              <option value="subscribers">Inscritos em notificações</option>
              <option value="custom">Seleção personalizada</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data de Envio
              </label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora
              </label>
              <input
                type="time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Agendar Notificação
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NotificationsManager;