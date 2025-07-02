import React from 'react';
import FileDisplay from './FileDisplay';

const FilesSection = ({ files, onImageClick }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Arquivos Anexados:
      </h3>
      {files.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum arquivo anexado a este tópico.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex flex-col items-center justify-center text-center p-2"
            >
              <FileDisplay file={file} onImageClick={onImageClick} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilesSection;