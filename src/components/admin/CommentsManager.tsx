import React, { useEffect, useState } from 'react';
import { MessageSquare, Search, ThumbsUp, Flag, Trash2, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchComments, 
  moderateComment, 
  deleteComment,
  setFilters,
  clearComments 
} from '../../store/slices/commentsSlice';
import { Button } from '../ui/Button';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CommentsManager = () => {
  const dispatch = useAppDispatch();
  const { items: comments, loading, hasMore, filters } = useAppSelector(state => state.comments);
  const currentUser = useAppSelector(state => state.user.currentUser);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch comments when filters change
  useEffect(() => {
    dispatch(clearComments());
    dispatch(fetchComments({ pageSize: 10 }));
  }, [dispatch, filters]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const lastComment = comments[comments.length - 1];
      dispatch(fetchComments({ 
        pageSize: 10, 
        lastVisible: lastComment.createdAt 
      }));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
      try {
        await dispatch(deleteComment(commentId)).unwrap();
      } catch (error) {
        console.error('Erro ao excluir comentário:', error);
      }
    }
  };

  const handleStatusChange = async (commentId: string, status: 'approved' | 'rejected') => {
    if (!currentUser?.uid) {
      toast.error('Você precisa estar logado para moderar comentários');
      return;
    }

    try {
      await dispatch(moderateComment({ 
        commentId, 
        status, 
        moderatorId: currentUser.uid,
        note: `Comentário ${status === 'approved' ? 'aprovado' : 'rejeitado'} por ${currentUser.displayName}`
      })).unwrap();
    } catch (error) {
      console.error('Erro ao moderar comentário:', error);
    }
  };

  const handleFilterChange = (status: 'all' | 'pending' | 'approved' | 'rejected') => {
    dispatch(setFilters({ status }));
  };

  const filteredComments = comments.filter(comment =>
    comment.content.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    comment.userName.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Comentários</h2>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-500" />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange(e.target.value as any)}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="approved">Aprovados</option>
            <option value="rejected">Rejeitados</option>
          </select>
        </div>
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
        {loading && comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Carregando comentários...</h3>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum comentário encontrado</h3>
          </div>
        ) : (
          <>
            {filteredComments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={comment.userPhoto || 'https://via.placeholder.com/40'}
                      alt={comment.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{comment.userName}</h3>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">
                          {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), {
                            addSuffix: true,
                            locale: ptBR
                          }) : 'Data desconhecida'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-800">{comment.content}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" 
                          style={{
                            backgroundColor: comment.status === 'approved' ? '#dcfce7' : 
                                          comment.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                            color: comment.status === 'approved' ? '#166534' : 
                                  comment.status === 'rejected' ? '#991b1b' : '#854d0e'
                          }}>
                          {comment.status === 'approved' ? 'Aprovado' : 
                           comment.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                        </span>
                        {comment.moderationNote && (
                          <span className="text-xs text-gray-500">{comment.moderationNote}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {comment.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleStatusChange(comment.id, 'approved')}
                          variant="success"
                          size="sm"
                        >
                          Aprovar
                        </Button>
                        <Button
                          onClick={() => handleStatusChange(comment.id, 'rejected')}
                          variant="destructive"
                          size="sm"
                        >
                          Rejeitar
                        </Button>
                      </>
                    )}
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
            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  disabled={loading}
                >
                  {loading ? 'Carregando...' : 'Carregar mais'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentsManager;