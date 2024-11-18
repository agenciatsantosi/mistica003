import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchComments } from '../../store/slices/commentsSlice';
import { Star, ThumbsUp, Share2 } from 'lucide-react';
import { LazyImage } from '../ui/Image';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CommentListProps {
  placeId: string;
}

const CommentList = ({ placeId }: CommentListProps) => {
  const dispatch = useDispatch();
  const { items: comments, loading } = useSelector((state: RootState) => state.comments);

  useEffect(() => {
    dispatch(fetchComments(placeId));
  }, [placeId, dispatch]);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-start space-x-3">
            <LazyImage
              src={comment.userPhoto}
              alt={comment.userName}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{comment.userName}</h4>
                <div className="flex items-center space-x-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < comment.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mt-1">{comment.content}</p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                <span>{formatDistanceToNow(comment.createdAt, { locale: ptBR, addSuffix: true })}</span>
                <button className="flex items-center space-x-1 hover:text-gray-700">
                  <ThumbsUp size={14} />
                  <span>Curtir</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-gray-700">
                  <Share2 size={14} />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;