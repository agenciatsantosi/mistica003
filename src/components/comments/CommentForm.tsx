import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addComment } from '../../store/slices/commentsSlice';
import { Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-toastify';

interface CommentFormProps {
  placeId: string;
}

const CommentForm = ({ placeId }: CommentFormProps) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Você precisa estar logado para comentar');
      return;
    }

    if (rating === 0) {
      toast.error('Selecione uma avaliação');
      return;
    }

    if (!content.trim()) {
      toast.error('Digite seu comentário');
      return;
    }

    setLoading(true);
    try {
      await dispatch(addComment({
        placeId,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Usuário',
        userPhoto: currentUser.photoURL || 'https://via.placeholder.com/40',
        rating,
        content: content.trim(),
      }));
      setContent('');
      setRating(0);
      toast.success('Comentário adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar comentário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm text-gray-600">Sua avaliação:</span>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              className="text-yellow-400 hover:scale-110 transition-transform"
            >
              <Star
                size={24}
                fill={i < rating ? 'currentColor' : 'none'}
              />
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Compartilhe sua experiência..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 min-h-[100px]"
      />

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          loading={loading}
          disabled={!currentUser}
        >
          Publicar Comentário
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;