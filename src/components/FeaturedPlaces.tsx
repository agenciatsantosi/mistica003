import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedPlaces = () => {
  const navigate = useNavigate();
  const places = [
    {
      id: '1',
      type: 'templo',
      name: 'Templo Zen Luz Divina',
      image: 'https://images.unsplash.com/photo-1545494097-1545e22ee878',
      location: 'São Paulo, SP',
      rating: 5,
      reviews: 128,
      description: 'Um oásis de paz e meditação no coração da cidade. Oferece práticas de meditação e rituais tradicionais.',
      category: 'Budismo',
      hours: 'Aberto • 9:00 - 18:00',
    },
    {
      id: '2',
      type: 'igreja',
      name: 'Catedral Metropolitana',
      image: 'https://images.unsplash.com/photo-1548867476-842c697e8378',
      location: 'São Paulo, SP',
      rating: 5,
      reviews: 256,
      description: 'Marco histórico e espiritual da cidade. Arquitetura gótica impressionante e missas diárias.',
      category: 'Católica',
      hours: 'Aberto • 7:00 - 19:00',
    },
    {
      id: '3',
      type: 'centro',
      name: 'Centro Espiritual Luz e Paz',
      image: 'https://images.unsplash.com/photo-1519677584237-752f8853252e',
      location: 'Cotia, SP',
      rating: 4,
      reviews: 96,
      description: 'Espaço dedicado à meditação e práticas holísticas em meio à natureza.',
      category: 'Holístico',
      hours: 'Aberto • 8:00 - 20:00',
    },
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Lugares em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {places.map((place) => (
          <article
            key={place.id}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/local/${place.id}`)}
          >
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-1" />
                {place.location}
              </div>
              <div className="flex items-center mb-3">
                <div className="text-yellow-400 mr-1">
                  {'★'.repeat(place.rating)}{'☆'.repeat(5 - place.rating)}
                </div>
                <span className="text-gray-600">({place.reviews} avaliações)</span>
              </div>
              <p className="text-gray-600 mb-4">{place.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-sm">
                  {place.category}
                </span>
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm">{place.hours}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturedPlaces;