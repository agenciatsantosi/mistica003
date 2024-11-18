import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { MapPin, Clock, Heart, Navigation, Phone, Info, Video, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';
import ShareButtons from '../social/ShareButtons';
import CommentForm from '../comments/CommentForm';
import CommentList from '../comments/CommentList';
import NotificationPreferences from '../notifications/NotificationPreferences';
import PlaceGallery from './PlaceGallery';
import EventCalendar from './EventCalendar';
import Scheduling from './Scheduling';

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const place = useSelector((state: RootState) => 
    state.places.items.find(p => p.id === id)
  );

  const [activeTab, setActiveTab] = useState<'about' | 'gallery' | 'events' | 'schedule'>('about');

  // Dados simulados para a galeria
  const galleryImages = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1545494097-1545e22ee878',
      description: 'Salão principal durante cerimônia'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1548867476-842c697e8378',
      description: 'Jardim zen'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1519677584237-752f8853252e',
      description: 'Área de meditação'
    }
  ];

  // Dados simulados para eventos
  const events = [
    {
      id: '1',
      title: 'Meditação Guiada',
      date: new Date(),
      time: '19:00',
      location: 'Salão Principal',
      description: 'Sessão de meditação com mestre zen',
      type: 'class' as const,
      maxParticipants: 20,
      currentParticipants: 12
    },
    {
      id: '2',
      title: 'Cerimônia do Chá',
      date: new Date(),
      time: '15:00',
      location: 'Jardim Zen',
      description: 'Tradicional cerimônia do chá',
      type: 'ceremony' as const
    }
  ];

  useEffect(() => {
    if (!place) {
      navigate('/');
    }
  }, [place, navigate]);

  if (!place) return null;

  const isFavorite = favorites.includes(place.id);

  const handleFavoriteToggle = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    dispatch(toggleFavorite({
      userId: currentUser.uid,
      placeId: place.id,
      isFavorite
    }));
  };

  const handleEventClick = (event: any) => {
    // Implementar lógica de detalhes do evento
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Image */}
          <div className="relative h-96 rounded-xl overflow-hidden mb-8">
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{place.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {place.location}
                </span>
                <span className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  {place.hours}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleFavoriteToggle}
                variant={isFavorite ? 'primary' : 'outline'}
                icon={<Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />}
              >
                {isFavorite ? 'Favoritado' : 'Favoritar'}
              </Button>
              <Button
                variant="outline"
                icon={<Navigation size={20} />}
                onClick={() => window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`,
                  '_blank'
                )}
              >
                Como Chegar
              </Button>
              {place.liveStream && (
                <Button
                  variant="outline"
                  icon={<Video size={20} />}
                  onClick={() => window.open(place.liveStream, '_blank')}
                >
                  Transmissão ao Vivo
                </Button>
              )}
              {place.shop && (
                <Button
                  variant="outline"
                  icon={<ShoppingBag size={20} />}
                  onClick={() => window.open(place.shop, '_blank')}
                >
                  Loja Virtual
                </Button>
              )}
            </div>
            <ShareButtons
              url={window.location.href}
              title={`Conheça ${place.name} no Místico`}
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-8">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'about'
                  ? 'text-rose-500 border-b-2 border-rose-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sobre
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'gallery'
                  ? 'text-rose-500 border-b-2 border-rose-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Galeria
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'events'
                  ? 'text-rose-500 border-b-2 border-rose-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Eventos
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'schedule'
                  ? 'text-rose-500 border-b-2 border-rose-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Agendar
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="md:col-span-2 space-y-8">
              {activeTab === 'about' && (
                <>
                  <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Sobre</h2>
                    <p className="text-gray-600">{place.description}</p>
                  </section>

                  <section className="space-y-6">
                    <h2 className="text-2xl font-semibold">Avaliações</h2>
                    <CommentForm placeId={place.id} />
                    <CommentList placeId={place.id} />
                  </section>
                </>
              )}

              {activeTab === 'gallery' && (
                <PlaceGallery images={galleryImages} />
              )}

              {activeTab === 'events' && (
                <EventCalendar
                  events={events}
                  onEventClick={handleEventClick}
                />
              )}

              {activeTab === 'schedule' && (
                <Scheduling
                  placeId={place.id}
                  placeName={place.name}
                />
              )}
            </div>

            {/* Right Column - Info & Notifications */}
            <div className="space-y-6">
              {/* Info Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Informações</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Clock size={20} className="mr-3" />
                    <div>
                      <p className="font-medium">Horário de Funcionamento</p>
                      <p>{place.hours}</p>
                    </div>
                  </div>
                  {place.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone size={20} className="mr-3" />
                      <div>
                        <p className="font-medium">Telefone</p>
                        <p>{place.phone}</p>
                      </div>
                    </div>
                  )}
                  {place.address && (
                    <div className="flex items-center text-gray-600">
                      <MapPin size={20} className="mr-3" />
                      <div>
                        <p className="font-medium">Endereço</p>
                        <p>{place.address}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Info size={20} className="mr-3" />
                    <div>
                      <p className="font-medium">Categoria</p>
                      <p>{place.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              {currentUser && (
                <NotificationPreferences
                  placeId={place.id}
                  placeName={place.name}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;