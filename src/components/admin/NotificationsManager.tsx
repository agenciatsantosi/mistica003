import React, { useState } from 'react';
import { Bell, Send, Search, Users, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const NotificationsManager = () => {
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Notificações</h2>
        <Button onClick={handleSendNotification}>
          <Send className="w-4 h-4 mr-2" />
          Nova Notificação
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar notificações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {notification.type === 'event' ? (
                    <Calendar className="w-6 h-6 text-blue-500" />
                  ) : (
                    <Bell className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.content}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {notification.target === 'all' ? 'Todos os usuários' : 'Usuários selecionados'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {notification.scheduledFor}
                    </div>
                  </div>
                </div>
              </div>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  notification.status === 'sent'
                    ? 'bg-green-100 text-green-800'
                    : notification.status === 'scheduled'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {notification.status === 'sent'
                  ? 'Enviada'
                  : notification.status === 'scheduled'
                  ? 'Agendada'
                  : 'Rascunho'}
              </span>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma notificação encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando uma nova notificação.
            </p>
          </div>
        )}
      </div>

      {/* New Notification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Notificação"
      >
        <form className="space-y-4">
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
              Tipo
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
              <option value="event">Evento</option>
              <option value="announcement">Anúncio</option>
              <option value="alert">Alerta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Destinatários
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
              <option value="all">Todos os usuários</option>
              <option value="admins">Apenas administradores</option>
              <option value="selected">Usuários selecionados</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data e hora de envio
            </label>
            <input
              type="datetime-local"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Enviar Notificação
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};