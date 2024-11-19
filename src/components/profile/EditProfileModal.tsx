import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../store/slices/userSlice';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  userId: string;
}

export const EditProfileModal = ({ isOpen, onClose, profile, userId }: EditProfileModalProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [location, setLocation] = useState({
    city: profile.location?.split(',')[0]?.trim() || '',
    state: profile.location?.split(',')[1]?.trim() || ''
  });

  const [formData, setFormData] = useState({
    displayName: profile.displayName || '',
    role: profile.role || '',
    location: profile.location || 'São Paulo, SP',
    about: profile.about || '',
    links: {
      github: profile.links?.github || '',
      linkedin: profile.links?.linkedin || '',
      portfolio: profile.links?.portfolio || ''
    },
    photoURL: profile.photoURL || '',
    coverPhotoURL: profile.coverPhotoURL || '',
    whatsapp: profile.whatsapp || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile({ userId, data: formData })).unwrap();
      toast.success('Perfil atualizado com sucesso!');
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleLocationChange = (field: 'city' | 'state', value: string) => {
    setLocation(prev => {
      const newLocation = { ...prev, [field]: value };
      setFormData(prev => ({
        ...prev,
        location: `${newLocation.city}, ${newLocation.state}`
      }));
      return newLocation;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Editar Perfil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Imagens */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
              <input
                type="url"
                value={formData.photoURL}
                onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                placeholder="URL da foto de perfil"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Foto de Capa</label>
              <input
                type="url"
                value={formData.coverPhotoURL}
                onChange={(e) => setFormData({ ...formData, coverPhotoURL: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                placeholder="URL da foto de capa"
              />
            </div>
          </div>

          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Função</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Links</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub</label>
              <input
                type="url"
                value={formData.links.github}
                onChange={(e) => setFormData({
                  ...formData,
                  links: { ...formData.links, github: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
              <input
                type="url"
                value={formData.links.linkedin}
                onChange={(e) => setFormData({
                  ...formData,
                  links: { ...formData.links, linkedin: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Portfolio</label>
              <input
                type="url"
                value={formData.links.portfolio}
                onChange={(e) => setFormData({
                  ...formData,
                  links: { ...formData.links, portfolio: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Sobre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Sobre</label>
            <textarea
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            />
          </div>

          {/* Localização */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Localização</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                <input
                  type="text"
                  value={location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  placeholder="Ex: São Paulo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select
                  value={location.state}
                  onChange={(e) => handleLocationChange('state', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                >
                  <option value="">Selecione um estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
            </div>
          </div>

          {/* Campo WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              placeholder="(00) 00000-0000"
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