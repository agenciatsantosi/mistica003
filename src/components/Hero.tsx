import React from 'react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-rose-500 to-teal-400 py-24 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
          Explore Lugares Sagrados
        </h1>
        <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto animate-fadeIn">
          Descubra novos templos e Centros espirituais
        </p>
      </div>
    </section>
  );
};

export default Hero;