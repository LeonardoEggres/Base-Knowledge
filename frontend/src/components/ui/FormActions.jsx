import React from 'react';

const FormActions = ({ 
  onSubmit, 
  onCancel, 
  loading, 
  isEditing,
  submitText,
  cancelText = "Cancelar"
}) => {
  return (
    <div className="flex justify-center gap-4">
      <button
        type="submit"
        disabled={loading}
        className={`px-8 py-3 rounded-xl shadow-md font-semibold text-lg transition duration-200 ease-in-out ${
          loading
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? 
          (isEditing ? 'Atualizando...' : 'Criando...') : 
          (submitText || (isEditing ? 'Atualizar Tópico' : 'Criar Tópico'))
        }
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className={`px-8 py-3 rounded-xl shadow-md font-semibold text-lg transition duration-200 ease-in-out ${
          loading
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-gray-300 hover:bg-gray-400 text-gray-800"
        }`}
      >
        {cancelText}
      </button>
    </div>
  );
};

export default FormActions;