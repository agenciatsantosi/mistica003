import React, { useState } from 'react';
import { updateAllPlaces } from '../../scripts/updatePlaces';
import { toast } from 'react-toastify';

export const UpdatePlaces: React.FC = () => {
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const updated = await updateAllPlaces();
      toast.success(`${updated} lugares foram atualizados com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar lugares:', error);
      toast.error('Erro ao atualizar lugares');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4">
      <button
        onClick={handleUpdate}
        disabled={updating}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg disabled:opacity-50"
      >
        {updating ? 'Atualizando...' : 'Atualizar Lugares'}
      </button>
    </div>
  );
};
