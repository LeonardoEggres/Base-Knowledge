import React from "react";

const ExistingFilesSection = ({ existingFiles, onDeleteFile, loading }) => {
  if (!existingFiles.length) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        Arquivos Atuais:
      </h3>
      <ul className="space-y-2">
        {existingFiles.map((file) => (
          <li
            key={file.id}
            className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm"
          >
            <span className="text-gray-700 text-sm truncate">
              {file.file_name}
            </span>
            <button
              type="button"
              onClick={() => onDeleteFile(file.id)}
              disabled={loading}
              className="ml-4 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
              title="Excluir arquivo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm-1 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExistingFilesSection;
