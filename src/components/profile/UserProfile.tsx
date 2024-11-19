import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchUserProfile } from '../../store/slices/userSlice';
import { Loading } from '../shared/Loading';
import { ErrorMessage } from '../shared/ErrorMessage';
import { Camera, Edit, MessageSquare, Phone, Github, Linkedin, Globe } from 'lucide-react';
import { EditCoverPhotoModal } from './EditCoverPhotoModal';
import { EditAvatarModal } from './EditAvatarModal';
import { EditProfileModal } from './EditProfileModal';

export const UserProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, profile, loading, error } = useSelector((state: RootState) => state.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditCoverOpen, setIsEditCoverOpen] = useState(false);
  const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.uid && !profile) {
      dispatch(fetchUserProfile(currentUser.uid));
    }
  }, [currentUser, profile, dispatch]);

  const handleWhatsAppClick = () => {
    const phone = profile.whatsapp?.replace(/\D/g, '') || '';
    const whatsappUrl = `https://wa.me/55${phone}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!currentUser || !profile) {
    return <ErrorMessage message="Usuário não encontrado" />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Banner com gradiente e botão de editar capa */}
      <div 
        className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg mb-16 relative"
        style={{
          backgroundImage: profile.coverPhotoURL ? `url(${profile.coverPhotoURL})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Botão de editar capa */}
        <button
          onClick={() => setIsEditCoverOpen(true)}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm"
        >
          <Camera className="w-4 h-4 inline-block mr-2" />
          Editar Capa
        </button>
        
        {/* Container da foto de perfil com botão de edição */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative group">
            <img
              src={profile.photoURL || '/default-avatar.png'}
              alt={profile.displayName}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            {/* Botão de editar foto de perfil */}
            <button
              onClick={() => setIsEditAvatarOpen(true)}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Informações do Perfil com botão de edição geral */}
      <div className="px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.displayName}</h1>
            <p className="text-gray-600">{profile.isAdmin ? 'Administrador' : 'Usuário'}</p>
            <p className="text-gray-500 flex items-center mt-1">
              <Globe className="w-4 h-4 mr-1" />
              {profile.location || 'São Paulo, SP'}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center">
                <span className="font-semibold text-gray-900">{profile.rating || '4.9'}</span>
                <span className="text-gray-500 ml-1">({profile.ratingCount || '48'} avaliações)</span>
              </div>
              {profile.availableForProjects && (
                <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                  Disponível para projetos
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <MessageSquare className="w-4 h-4 inline-block mr-2" />
              Mensagem
            </button>
            <button 
              onClick={handleWhatsAppClick}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Phone className="w-4 h-4 inline-block mr-2" />
              WhatsApp
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 inline-block mr-2" />
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Grid de Links e Sobre */}
        <div className="grid grid-cols-3 gap-6">
          {/* Links */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Links</h2>
            <div className="space-y-3">
              <a href={profile.links?.github} className="flex items-center text-gray-700 hover:text-blue-600">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </a>
              <a href={profile.links?.linkedin} className="flex items-center text-gray-700 hover:text-blue-600">
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </a>
              <a href={profile.links?.portfolio} className="flex items-center text-gray-700 hover:text-blue-600">
                <Globe className="w-5 h-5 mr-2" />
                Portfolio
              </a>
            </div>
          </div>

          {/* Sobre */}
          <div className="col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Sobre</h2>
            <p className="text-gray-600">
              {profile.about || 'Desenvolvedora Full Stack com mais de 8 anos de experiência em desenvolvimento web e mobile. Especializada em React, Node.js e arquitetura de microsserviços. Apaixonada por criar soluções escaláveis e de alta performance.'}
            </p>
          </div>
        </div>

        {/* Habilidades */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Habilidades</h2>
          <div className="grid grid-cols-2 gap-4">
            {(profile.skills || [
              { name: 'React', level: 95 },
              { name: 'Node.js', level: 90 },
              { name: 'TypeScript', level: 88 }
            ]).map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">{skill.name}</span>
                  <span className="text-gray-600">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modais de Edição */}
      <EditCoverPhotoModal
        isOpen={isEditCoverOpen}
        onClose={() => setIsEditCoverOpen(false)}
        profile={profile}
        userId={currentUser.uid}
      />

      <EditAvatarModal
        isOpen={isEditAvatarOpen}
        onClose={() => setIsEditAvatarOpen(false)}
        profile={profile}
        userId={currentUser.uid}
      />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        userId={currentUser.uid}
      />
    </div>
  );
};