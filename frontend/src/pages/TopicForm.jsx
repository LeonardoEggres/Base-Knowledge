import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function TopicForm({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState(""); 
  const [keywords, setKeywords] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');  
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchTopicData(id);
      fetchExistingFiles(id);
    } else {
      setIsEditing(false);
      setTitle("");
      setSummary("");
      setContent("");
      setKeywords("");
      setFiles([]);
      setExistingFiles([]);
    }
  }, [id]);

  const showSuccessModal = (title, message) => {
    setModalType('success');
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  const showErrorModal = (title, message) => {
    setModalType('error');
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  const showConfirmModal = (title, message, action) => {
    setModalType('confirm');
    setModalTitle(title);
    setModalMessage(message);
    setModalAction(() => action);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
  };

  const handleModalConfirm = () => {
    if (modalAction) {
      modalAction();
    }
    closeModal();
  };

  const fetchTopicData = async (topicId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/topics/${topicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const topic = res.data;
      setTitle(topic.title);
      setSummary(topic.summary);
      setContent(topic.content);
      setKeywords(topic.keywords ? topic.keywords.join(", ") : "");
    } catch (err) {
      console.error("Erro ao buscar dados do tópico para edição:", err);
      setError("Não foi possível carregar os dados do tópico para edição.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingFiles = async (topicId) => {
    try {
      const res = await axios.get(`/topics/${topicId}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExistingFiles(res.data);
    } catch (err) {
      console.error("Erro ao buscar arquivos existentes:", err);
    }
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    console.log("Arquivos selecionados para upload:", selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const action = async () => {
      setLoading(true);
      setError(null);

      const keywordsArray = keywords
        .split(",")
        .map((kw) => kw.trim())
        .filter((kw) => kw.length > 0);

      try {
        const userId = localStorage.getItem("usuarioId");
        let currentTopicId = id;

        if (!isEditing) {
          console.log("Criando tópico para usuário:", userId);
          const resTopic = await axios.post(
            "/topics",
            {
              user_id: userId,
              title,
              summary,
              content,
              keywords: keywordsArray,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          currentTopicId = resTopic.data.id;
          console.log("Tópico criado com ID:", currentTopicId);
        } else {
          console.log("Atualizando tópico com ID:", currentTopicId);
          await axios.put(
            `/topics/${currentTopicId}`,
            {
              user_id: userId,
              title,
              summary,
              content,
              keywords: keywordsArray,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Tópico atualizado com sucesso!");
        }

        if (files.length > 0) {
          const formData = new FormData();
          formData.append("topic_id", currentTopicId);

          files.forEach((file) => {
            formData.append("files[]", file);
          });

          console.log("FormData antes do envio (para 'files[]'):");
          for (let pair of formData.entries()) {
              console.log(pair[0]+ ': ' + pair[1]);
          }

          await axios.post("/files", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          console.log("Arquivos enviados com sucesso!");
        }

        showSuccessModal(
          'Sucesso!',
          `Tópico ${isEditing ? 'atualizado' : 'criado'} e arquivos enviados com sucesso!`
        );
        
        setTimeout(() => {
          navigate(`/topics/${currentTopicId}`);
        }, 2000);

      } catch (err) {
        console.error("Erro ao processar tópico ou anexar arquivos:", err.response || err);
        let errorMessage = `Erro ao ${isEditing ? 'atualizar' : 'criar'} tópico. Verifique os dados e tente novamente.`;
        
        if (err.response && err.response.data && err.response.data.errors) {
          errorMessage = Object.values(err.response.data.errors).flat().join(" ");
        } else if (err.response && err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        }
        
        showErrorModal('Erro!', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    showConfirmModal(
      'Confirmar Ação',
      `Tem certeza que deseja ${isEditing ? 'atualizar' : 'criar'} este tópico?`,
      action
    );
  };

  const handleDeleteExistingFile = async (fileId) => {
    const deleteAction = async () => {
      setLoading(true);
      try {
        await axios.delete(`/files/${fileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExistingFiles(prev => prev.filter(file => file.id !== fileId));
        showSuccessModal('Sucesso!', 'Arquivo excluído com sucesso!');
      } catch (error) {
        console.error("Erro ao excluir arquivo:", error.response || error);
        showErrorModal('Erro!', 'Erro ao excluir arquivo. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    showConfirmModal(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este arquivo?',
      deleteAction
    );
  };

  const Modal = () => {
    if (!showModal) return null;

    const getModalStyles = () => {
      switch (modalType) {
        case 'success':
          return {
            icon: '✅',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            buttonBg: 'bg-green-600 hover:bg-green-700',
          };
        case 'error':
          return {
            icon: '❌',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            buttonBg: 'bg-red-600 hover:bg-red-700',
          };
        case 'confirm':
          return {
            icon: '❓',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            buttonBg: 'bg-blue-600 hover:bg-blue-700',
          };
        default:
          return {
            icon: 'ℹ️',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            buttonBg: 'bg-blue-600 hover:bg-blue-700',
          };
      }
    };

    const styles = getModalStyles();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 rounded-full ${styles.iconBg} flex items-center justify-center`}>
                <span className={`text-3xl ${styles.iconColor}`}>{styles.icon}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              {modalTitle}
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              {modalMessage}
            </p>
            
            <div className="flex gap-3 justify-center">
              {modalType === 'confirm' ? (
                <>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-semibold transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleModalConfirm}
                    className={`px-6 py-2 ${styles.buttonBg} text-white rounded-xl font-semibold transition duration-200`}
                  >
                    Confirmar
                  </button>
                </>
              ) : (
                <button
                  onClick={closeModal}
                  className={`px-8 py-2 ${styles.buttonBg} text-white rounded-xl font-semibold transition duration-200`}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isEditing ? "Editar Tópico" : "Novo Tópico"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
              Resumo
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            ></textarea>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Conteúdo Completo
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            ></textarea>
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
              Palavras-chave (separadas por vírgula)
            </label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Ex: tecnologia, programação, javascript"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Seção de Arquivos Existentes (apenas em modo de edição) */}
          {isEditing && existingFiles.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Arquivos Atuais:</h3>
              <ul className="space-y-2">
                {existingFiles.map((file) => (
                  <li key={file.id} className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
                    <span className="text-gray-700 text-sm truncate">{file.file_name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingFile(file.id)}
                      disabled={loading}
                      className="ml-4 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                      title="Excluir arquivo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm-1 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-1">
              Anexar Novos Arquivos (PDF, Imagens, Documentos)
            </label>
            <input
              type="file"
              id="files"
              onChange={handleFilesChange}
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

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl">
              {error}
            </div>
          )}

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
              {loading ? (isEditing ? 'Atualizando...' : 'Criando...') : (isEditing ? 'Atualizar Tópico' : 'Criar Tópico')}
            </button>
            <button
              type="button"
              onClick={() => navigate(isEditing ? `/topics/${id}` : "/")}
              disabled={loading}
              className={`px-8 py-3 rounded-xl shadow-md font-semibold text-lg transition duration-200 ease-in-out ${
                loading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400 text-gray-800"
              }`}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Modal Component */}
      <Modal />
    </div>
  );
}

export default TopicForm;