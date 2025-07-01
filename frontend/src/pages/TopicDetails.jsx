import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { marked } from "marked"; 

function TopicDetails({ token, loggedInUserId }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderedContent, setRenderedContent] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);

  useEffect(() => {
    fetchTopic();
  
  }, [id, token, loggedInUserId]); 

  
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (isModalOpen) {
          closeModal();
        }
        if (showModal) {
          closeNotificationModal();
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen, showModal]);

  useEffect(() => {
    if (topic && topic.content) {
      console.log("Conteúdo bruto do tópico antes da conversão Markdown (vindo do backend):", topic.content);

      marked.setOptions({
        breaks: true, 
        gfm: true, 
      });

      const htmlContent = marked(topic.content);
      setRenderedContent(htmlContent); 
      console.log("Conteúdo HTML gerado pelo marked.js:", htmlContent); 
    }
  }, [topic]); 

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

  const closeNotificationModal = () => {
    setShowModal(false);
    setModalAction(null);
  };

  const handleModalConfirm = () => {
    if (modalAction) {
      modalAction();
    }
    closeNotificationModal();
  };

  const fetchTopic = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Buscando tópico com ID:", id);

      const resTopic = await axios.get(`/topics/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Dados do tópico:", resTopic.data);
      setTopic(resTopic.data);

      const resFiles = await axios.get(`/topics/${id}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Arquivos encontrados:", resFiles.data);
      setFiles(resFiles.data);
    } catch (err) {
      console.error("Erro ao buscar detalhes do tópico ou arquivos:", err);
      setError(
        "Erro ao carregar os detalhes do tópico ou seus arquivos. Verifique a conexão com o servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async () => {
    const deleteAction = async () => {
      setLoading(true);
      try {
        await axios.delete(`/topics/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSuccessModal("Sucesso!", "Tópico excluído com sucesso!");
        setTimeout(() => {
          navigate("/"); 
        }, 2000);
      } catch (err) {
        console.error("Erro ao excluir tópico:", err.response || err);
        showErrorModal("Erro!", "Erro ao excluir o tópico. Você pode não ter permissão.");
      } finally {
        setLoading(false);
      }
    };

    showConfirmModal(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este tópico e todos os seus arquivos?",
      deleteAction
    );
  };

  
  const openModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageUrl("");
  };

  
  const NotificationModal = () => {
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
                    onClick={closeNotificationModal}
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
                  onClick={closeNotificationModal}
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

  const renderFile = (file) => {
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
          onClick={() => openModal(file.file_url)}
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-blue-600 text-lg font-semibold">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-lg">
          <p className="text-center">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Tópico não encontrado</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isOwner = loggedInUserId && topic.user_id === parseInt(loggedInUserId);

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          {topic.title}
        </h1>
        <p className="text-gray-600 text-lg mb-6 text-center italic">
          {topic.summary}
        </p>

        {/* Linha separadora após o resumo */}
        <hr className="my-6 border-gray-300" />

        {/* Seção de Palavras-chave */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Palavras-chave:
          </h3>
          <div className="flex flex-wrap gap-2">
            {topic.keywords && topic.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Linha separadora após as palavras-chave */}
        <hr className="my-6 border-gray-300" />

        <div className="prose max-w-none text-gray-700 leading-relaxed mb-8 prose-p:mt-4 prose-p:mb-4">
          {/* Agora usa o conteúdo já convertido para HTML */}
          <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
        </div>

        {/* Linha separadora após o conteúdo principal */}
        <hr className="my-6 border-gray-300" />

        {/* Seção de Arquivos */}
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
                  {renderFile(file)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow transition duration-200"
          >
            Voltar para a lista
          </button>
          {isOwner && (
            <>
              <button
                onClick={() => navigate(`/topics/${id}/edit`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition duration-200"
                disabled={loading}
              >
                Editar Tópico
              </button>
              <button
                onClick={handleDeleteTopic}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded shadow transition duration-200"
                disabled={loading}
              >
                Excluir Tópico
              </button>
            </>
          )}
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closeModal} 
          >
            <div
              className="relative max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} 
            >
              <img
                src={modalImageUrl}
                alt="Visualização expandida"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/800x600/E0E0E0/6C757D?text=Imagem+Não+Disponível";
                  console.error("❌ Erro ao carregar imagem no modal:", modalImageUrl);
                }}
              />
              <button
                onClick={closeModal}
                className="fixed top-0 right-0 text-white text-4xl font-bold cursor-pointer transition-opacity duration-200 hover:opacity-75 px-2" 
                title="Fechar"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Modal de Notificação */}
        <NotificationModal />
      </div>
    </div>
  );
}

export default TopicDetails;