import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Church, Building2, Flower2 } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      icon: <Church className="w-12 h-12 text-rose-500" />,
      title: 'Igrejas',
      description: 'Encontre igrejas de diversas denominações',
      type: 'igreja'
    },
    {
      icon: <Building2 className="w-12 h-12 text-rose-500" />,
      title: 'Templos',
      description: 'Explore templos budistas, hinduístas e mais',
      type: 'templo'
    },
    {
      icon: <Flower2 className="w-12 h-12 text-rose-500" />,
      title: 'Centros Espirituais',
      description: 'Conheça centros de meditação e espiritualidade',
      type: 'centro'
    },
  ];

  const handleCategoryClick = (type: string) => {
    navigate(`/categoria/${type}`);
  };

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Categorias</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow cursor-pointer text-center"
            onClick={() => handleCategoryClick(category.type)}
          >
            <div className="flex justify-center mb-6">{category.icon}</div>
            <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
            <p className="text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;