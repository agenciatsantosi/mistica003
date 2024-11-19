import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../../store/slices/userSlice';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

interface EditAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  userId: string;
}

export const EditAvatarModal = ({ isOpen, onClose, profile, userId }: EditAvatarModalProps) => {
  const dispatch = useDispatch();
  const [photoURL, setPhotoURL] = useState(profile.photoURL || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile({ 
        userId, 
        data: { photoURL } 
      })).unwrap();
      toast.success('Foto de perfil atualizada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar foto de perfil');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Editar Foto de Perfil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">URL da Foto de Perfil</label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              placeholder="https://exemplo.com/avatar.jpg"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 