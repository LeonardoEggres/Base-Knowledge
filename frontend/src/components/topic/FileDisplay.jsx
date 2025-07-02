import React from 'react';

const FileDisplay = ({ file, onImageClick }) => {
  if (!file.file_url) {
    console.warn("URL do arquivo ausente:", file);
    return (
      <div className="flex items-center space-x-2 text-red-500">
        <span>⚠️</span>
        <span>{file.file_name} - URL do arquivo não disponível.</span>
      </div>
    );
  }

  const isImage = (type) =>
    ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"].includes(type);

  if (isImage(file.file_type)) {
    return (
      <div
        onClick={() => onImageClick(file.file_url)}
        className="block w-full h-[24rem] overflow-hidden flex items-center justify-center group transform transition-transform duration-200 hover:scale-105 cursor-pointer"
        title={`Clique para expandir ${file.file_name}`}
      >
        <img
          src={file.file_url}
          alt={file.file_name}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/300x180/E0E0E0/6C757D?text=Imagem+Não+Carregada";
            console.error("❌ Erro ao carregar imagem:", file.file_url);
          }}
        />
      </div>
    );
  } else if (file.file_type === "application/pdf") {
    return (
      <a
        href={file.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center w-full h-[24rem] group transform transition-transform duration-200 hover:scale-105 p-2"
        title={`Clique para abrir ${file.file_name}`}
      >
        <span className="text-[12rem] text-red-500 mb-2">📄</span>
        <span className="text-center text-sm font-medium text-gray-700 break-all px-1">{file.file_name}</span>
        <span className="text-lg text-gray-500">(PDF)</span>
      </a>
    );
  } else {
    return (
      <a
        href={file.file_url}
        target="_blank"
        rel="noopener noreferrer"
        download={file.file_name}
        className="flex flex-col items-center justify-center w-full h-[24rem] group transform transition-transform duration-200 hover:scale-105 p-2"
        title={`Clique para baixar ${file.file_name}`}
      >
        <span className="text-[12rem] text-blue-500 mb-2">🔗</span>
        <span className="text-lg text-gray-500">({file.file_type || "Arquivo"})</span>
      </a>
    );
  }
};

export default FileDisplay;