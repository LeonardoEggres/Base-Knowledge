import React from 'react';

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-full max-h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Visualização expandida"
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/800x600/E0E0E0/6C757D?text=Imagem+Não+Disponível";
            console.error("❌ Erro ao carregar imagem no modal:", imageUrl);
          }}
        />
        <button
          onClick={onClose}
          className="fixed top-0 right-0 text-white text-4xl font-bold cursor-pointer transition-opacity duration-200 hover:opacity-75 px-2"
          title="Fechar"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ImageModal;