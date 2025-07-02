import React from 'react';

const FileUploadField = ({ files, onChange }) => {
  return (
    <div>
      <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-1">
        Anexar Novos Arquivos (PDF, Imagens, Documentos)
      </label>
      <input
        type="file"
        id="files"
        onChange={onChange}
        multiple
        className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />
      {files.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          <p className="font-semibold mb-1">Arquivos selecionados para upload:</p>
          <ul className="list-disc list-inside">
            {files.map((file, index) => (
              <li key={index} className="flex items-center gap-2">
                <span>📎</span>
                <span>{file.name}</span>
                <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploadField;