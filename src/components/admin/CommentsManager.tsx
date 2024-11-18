import React, { useState } from 'react';
import { MessageSquare, Search, ThumbsUp, Flag, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

const CommentsManager = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Simulação de comentários
  const comments = [
    {
      id: '1',
      userId: '1',
      userName: 'João Silva',
      userPhoto: 'https://via.placeholder.com/40',
      placeId: '1',
      placeName: 'Igreja Nossa Senhora',
      content: 'Lugar muito acolhedor e tranquilo.',
      rating: 5,
      createdAt: '2024-03-01',
      status: 'approved',
      likes: 12,
      flags: 0
    },
    // Adicione mais comentários conforme necessário
  ];

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
      // Implementar lógica de exclusão
    }
  };

  const handleStatusChange = (commentId: string, status: string) => {
    // Implementar lógica de mudança de status
  };

  const filteredComments = comments.filter(comment =>
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.placeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Comentários</h2>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="search"
            placeholder="Buscar comentários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <img
                  src={comment.userPhoto}
                  alt={comment.userName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{comment.userName}</h3>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{comment.createdAt}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Comentou em: {comment.placeName}
                  </p>
                  <div className="mt-2">
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <ThumbsUp size={16} className="mr-1" />
                      {comment.likes} curtidas
                    </span>
                    <span className="flex items-center">
                      <Flag size={16} className="mr-1" />
                      {comment.flags} denúncias
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={comment.status}
                  onChange={(e) => handleStatusChange(comment.id, e.target.value)}
                  className="text-sm border border-gray-300 rounded-md"
                >
                  <option value="pending">Pendente</option>
                  <option value="approved">Aprovado</option>
                  <option value="rejected">Rejeitado</option>
                </select>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsManager;