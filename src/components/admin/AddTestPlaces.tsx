import { useState } from 'react';
import { addTestPlaces } from '../../scripts/addTestPlaces';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

export const AddTestPlaces = () => {
  const [loading, setLoading] = useState(false);

  const handleAddTestPlaces = async () => {
    try {
      setLoading(true);
      await addTestPlaces();
      toast.success('Lugares de teste adicionados com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar lugares de teste:', error);
      toast.error('Erro ao adicionar lugares de teste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={handleAddTestPlaces}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 text-white bg-rose-500 rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Adicionando...
          </>
        ) : (
          'Adicionar Lugares de Teste'
        )}
      </button>
    </div>
  );
};
