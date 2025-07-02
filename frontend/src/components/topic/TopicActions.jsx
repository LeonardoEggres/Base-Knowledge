import React from 'react';

const TopicActions = ({ 
  onBack, 
  isOwner, 
  onEdit, 
  onDelete, 
  loading,
  topicId 
}) => {
  return (
    <div className="mt-8 flex justify-center space-x-4">
      <button
        onClick={onBack}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow transition duration-200"
      >
        Voltar para a lista
      </button>
      {isOwner && (
        <>
          <button
            onClick={() => onEdit(topicId)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition duration-200"
            disabled={loading}
          >
            Editar Tópico
          </button>
          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded shadow transition duration-200"
            disabled={loading}
          >
            Excluir Tópico
          </button>
        </>
      )}
    </div>
  );
};

export default TopicActions;