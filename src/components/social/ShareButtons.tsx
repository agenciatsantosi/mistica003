import React from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Link } from 'lucide-react';
import { toast } from 'react-toastify';

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copiado para a área de transferência!');
    } catch (err) {
      toast.error('Erro ao copiar link');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-600 flex items-center">
        <Share2 size={16} className="mr-2" /> Compartilhar:
      </span>
      
      <a
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
        aria-label="Compartilhar no Facebook"
      >
        <Facebook size={20} />
      </a>

      <a
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sky-500 hover:bg-sky-50 p-2 rounded-full transition-colors"
        aria-label="Compartilhar no Twitter"
      >
        <Twitter size={20} />
      </a>

      <a
        href={shareUrls.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors"
        aria-label="Compartilhar no WhatsApp"
      >
        <MessageCircle size={20} />
      </a>

      <button
        onClick={copyToClipboard}
        className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
        aria-label="Copiar link"
      >
        <Link size={20} />
      </button>
    </div>
  );
};

export default ShareButtons;