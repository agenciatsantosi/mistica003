import React from 'react';

const Footer = () => {
  const links = {
    Explorar: [
      { name: 'Igrejas', href: '/igrejas' },
      { name: 'Templos', href: '/templos' },
      { name: 'Centros Espirituais', href: '/centros' },
    ],
    Empresa: [
      { name: 'Sobre', href: '/sobre' },
      { name: 'Contato', href: '/contato' },
      { name: 'Blog', href: '/blog' },
    ],
    Legal: [
      { name: 'Privacidade', href: '/privacidade' },
      { name: 'Termos', href: '/termos' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 text-teal-400">
                {category}
              </h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;