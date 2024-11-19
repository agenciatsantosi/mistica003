import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addPlace, approveTemple, rejectTemple, deletePlace, updatePlace, fetchPendingTemples, fetchPlaces, clearPlaces } from '../../store/slices/placesSlice';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  MapPin,
  Phone,
  Clock,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Church,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { LazyImage } from '../ui/Image';
import { toast } from 'react-toastify';

export const PlacesManager = () => {
  const dispatch = useDispatch();
  const { items: places, pendingTemples, loading } = useSelector((state: RootState) => state.places);
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    address: '',
    phone: '',
    hours: '',
    latitude: '',
    longitude: '',
    image: '',
    type: 'igreja',
    status: 'active'
  });

  useEffect(() => {
    console.log('Iniciando carregamento de lugares...'); // Debug
    dispatch(clearPlaces());
    dispatch(fetchPlaces())
      .unwrap()
      .then((places) => {
        console.log('Lugares carregados com sucesso:', places); // Debug
      })
      .catch((error) => {
        console.error('Erro ao carregar lugares:', error); // Debug
        toast.error('Erro ao carregar lugares');
      });
    
    dispatch(fetchPendingTemples())
      .unwrap()
      .then((temples) => {
        console.log('Templos pendentes carregados:', temples); // Debug
      })
      .catch((error) => {
        console.error('Erro ao carregar templos pendentes:', error); // Debug
        toast.error('Erro ao carregar templos pendentes');
      });
  }, [dispatch]);

  const filteredPlaces = useMemo(() => {
    console.log('Filtrando lugares...', { places, searchTerm, activeTab }); // Debug
    return places.filter(place => {
      const matchesSearch = 
        place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.address?.toLowerCase().includes(searchTerm.toLowerCase());

      if (activeTab === 'active') {
        return matchesSearch && place.status === 'active';
      } else {
        return matchesSearch && place.status === 'pending' && place.type === 'templo';
      }
    });
  }, [places, searchTerm, activeTab]);

  const handleAction = async (action: () => Promise<any>) => {
    try {
      await action();
    } catch (error) {
      console.error('Erro na ação:', error);
      toast.error('Ocorreu um erro. Por favor, tente novamente.');
    }
  };

  const handleAddPlace = () => {
    setSelectedPlace(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      location: '',
      address: '',
      phone: '',
      hours: '',
      latitude: '',
      longitude: '',
      image: '',
      type: 'igreja',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleEditPlace = (place: any) => {
    setSelectedPlace(place);
    setFormData(place);
    setIsModalOpen(true);
  };

  const handleDeletePlace = async (placeId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lugar?')) {
      await handleAction(async () => {
        await dispatch(deletePlace(placeId)).unwrap();
        toast.success('Lugar excluído com sucesso!');
      });
    }
  };

  const handleApproveTemple = async (temple: any) => {
    if (window.confirm('Tem certeza que deseja aprovar este templo?')) {
      await handleAction(async () => {
        await dispatch(approveTemple(temple.id)).unwrap();
        toast.success('Templo aprovado com sucesso!');
      });
    }
  };

  const handleRejectTemple = async (temple: any) => {
    if (window.confirm('Tem certeza que deseja rejeitar este templo?')) {
      await handleAction(async () => {
        await dispatch(rejectTemple(temple.id)).unwrap();
        toast.success('Templo rejeitado com sucesso!');
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await handleAction(async () => {
      if (selectedPlace) {
        await dispatch(updatePlace({ id: selectedPlace.id, ...formData })).unwrap();
        toast.success('Lugar atualizado com sucesso!');
      } else {
        await dispatch(addPlace(formData)).unwrap();
        toast.success('Lugar adicionado com sucesso!');
      }
      setIsModalOpen(false);
    });
  };

  const handleAddTestPlace = async () => {
    try {
      const testPlace = {
        type: 'igreja',
        name: 'Igreja Nossa Senhora da Glória',
        images: ['https://images.unsplash.com/photo-1577164213863-69dd2a20cda8'],
        description: 'Uma bela igreja histórica',
        address: 'Rua da Igreja, 123',
        latitude: -23.550520,
        longitude: -46.633308,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const placeRef = await dispatch(addPlace(testPlace));
      console.log('Lugar de teste adicionado com ID:', placeRef);
      toast.success('Lugar de teste adicionado com sucesso!');
      dispatch(fetchPlaces());
    } catch (error) {
      console.error('Erro ao adicionar lugar de teste:', error);
      toast.error('Erro ao adicionar lugar de teste');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Lugares</h2>
        <div className="space-x-4">
          <Button onClick={handleAddPlace} icon={<Plus size={20} />}>
            Adicionar Lugar
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <>
              <Button 
                onClick={handleAddTestPlace} 
                variant="secondary"
                icon={<RefreshCw size={20} />}
              >
                Adicionar Dados de Teste
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'active'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => setActiveTab('active')}
        >
          Lugares Ativos
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'pending'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Templos Pendentes
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar lugares..."
          className="w-full px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {activeTab === 'active' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <div key={place.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 flex-shrink-0">
                        <LazyImage
                          src={place.images?.[0] || place.image || 'https://via.placeholder.com/100'}
                          alt={place.name || 'Local'}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {place.name || 'Sem nome'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {place.type || 'Sem tipo'}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {typeof place.address === 'string' 
                        ? place.address 
                        : place.address?.street 
                          ? `${place.address.street}, ${place.address.number} - ${place.address.city}, ${place.address.state}`
                          : 'Endereço não disponível'
                      }
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleEditPlace(place)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePlace(place.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <MapPin size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg mb-2">Nenhum lugar encontrado</p>
                  <p className="text-gray-400">
                    {searchTerm 
                      ? 'Tente buscar com outros termos'
                      : 'Clique em "Adicionar Lugar" para começar'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingTemples.length > 0 ? (
                pendingTemples.map((temple) => (
                  <div key={temple.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 flex-shrink-0">
                        <LazyImage
                          src={temple.images?.[0] || temple.image || 'https://via.placeholder.com/100'}
                          alt={temple.name || 'Templo'}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {temple.name || 'Sem nome'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {temple.email || 'Email não disponível'}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {typeof temple.address === 'string' 
                        ? temple.address 
                        : temple.address?.street 
                          ? `${temple.address.street}, ${temple.address.number} - ${temple.address.city}, ${temple.address.state}`
                          : 'Endereço não disponível'
                      }
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleApproveTemple(temple)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleRejectTemple(temple)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <Church size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg mb-2">Nenhum templo pendente</p>
                  <p className="text-gray-400">
                    Todos os templos foram processados
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPlace ? 'Editar Lugar' : 'Adicionar Lugar'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome do Local
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                required
              >
                <option value="igreja">Igreja</option>
                <option value="templo">Templo</option>
                <option value="centro">Centro Espiritual</option>
                <option value="terreiro">Terreiro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="text"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="text"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Horário de Funcionamento
            </label>
            <input
              type="text"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              placeholder="Ex: Segunda a Sexta, 8h às 18h"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL da Imagem
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
              {selectedPlace ? 'Salvar Alterações' : 'Adicionar Local'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};