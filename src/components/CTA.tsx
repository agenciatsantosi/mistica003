import React from 'react';

const CTA = () => {
  return (
    <section className="bg-gradient-to-r from-rose-500 to-teal-400 py-20 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Comece Sua Jornada Espiritual
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Cadastre-se gratuitamente e descubra lugares incríveis
        </p>
        <a
          href="/cadastro"
          className="inline-block bg-white text-rose-500 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Criar Conta
        </a>
      </div>
    </section>
  );
};

export default CTA;