import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addPlace, approveTemple, rejectTemple, fetchPendingTemples, fetchPlaces } from '../../store/slices/placesSlice';
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
  XCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { LazyImage } from '../ui/Image';
import { toast } from 'react-toastify';

const PlacesManager = () => {
  const dispatch = useDispatch();
  const places = useSelector((state: RootState) => state.places.items);
  const pendingTemples = useSelector((state: RootState) => state.places.pendingTemples || []);
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
    // Carregar tanto os lugares ativos quanto os pendentes
    dispatch(fetchPlaces());
    dispatch(fetchPendingTemples());
  }, [dispatch]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.name || !formData.category || !formData.address) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      const placeData = {
        ...formData,
        latitude: Number(formData.latitude) || 0,
        longitude: Number(formData.longitude) || 0,
        rating: 0,
        reviews: 0,
        createdAt: new Date().toISOString()
      };

      if (selectedPlace) {
        // Implementar edição
        toast.success('Local atualizado com sucesso!');
      } else {
        await dispatch(addPlace(placeData));
        toast.success('Local adicionado com sucesso!');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar local');
    }
  };

  const handleApproveTemple = async (temple: any) => {
    if (!currentUser?.isAdmin) {
      toast.error('Você precisa ser administrador para realizar esta ação');
      return;
    }

    try {
      await dispatch(approveTemple(temple.id));
      toast.success('Templo aprovado com sucesso!');
    } catch (error) {
      toast.error('Erro ao aprovar templo');
    }
  };

  const handleRejectTemple = async (temple: any) => {
    if (!currentUser?.isAdmin) {
      toast.error('Você precisa ser administrador para realizar esta ação');
      return;
    }

    if (window.confirm('Tem certeza que deseja rejeitar este templo?')) {
      try {
        await dispatch(rejectTemple(temple.id));
        toast.success('Templo rejeitado');
      } catch (error) {
        toast.error('Erro ao rejeitar templo');
      }
    }
  };

  const filteredPlaces = places.filter(place => {
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

  useEffect(() => {
    console.log('Places:', places); // Debug
    console.log('Filtered Places:', filteredPlaces); // Debug
    console.log('Active Tab:', activeTab); // Debug
  }, [places, filteredPlaces, activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Lugares</h2>
        <Button onClick={handleAddPlace} icon={<Plus size={20} />}>
          Adicionar Lugar
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'active'
              ? 'text-rose-500 border-b-2 border-rose-500'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Lugares Ativos
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'pending'
              ? 'text-rose-500 border-b-2 border-rose-500'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pendentes de Aprovação {pendingTemples.length > 0 && (
            <span className="ml-2 px-2 py-1 text-xs bg-rose-100 text-rose-600 rounded-full">
              {pendingTemples.length}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="search"
            placeholder="Buscar lugares..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Places List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Local
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTab === 'active' ? (
                filteredPlaces.map((place) => (
                  <tr key={place.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <LazyImage
                            src={place.image}
                            alt={place.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {place.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {place.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-rose-100 text-rose-800">
                        {place.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {place.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedPlace(place);
                          setFormData(place);
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir este local?')) {
                            // Implementar exclusão
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                pendingTemples.map((temple) => (
                  <tr key={temple.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <LazyImage
                            src={temple.image || 'https://via.placeholder.com/100'}
                            alt={temple.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {temple.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {temple.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-rose-100 text-rose-800">
                        {temple.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {temple.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pendente
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleApproveTemple(temple)}
                        className="text-green-600 hover:text-green-900 mr-4"
                        title="Aprovar"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleRejectTemple(temple)}
                        className="text-red-600 hover:text-red-900"
                        title="Rejeitar"
                      >
                        <XCircle size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Place Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPlace ? 'Editar Local' : 'Adicionar Local'}
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

export default PlacesManager;