import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { marked } from "marked";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import Modal from "../components/ui/Modal";
import ImageModal from "../components/ui/ImageModal";
import KeywordsSection from "./KeywordsSection";
import TopicContent from "./TopicContent";
import FilesSection from "./FilesSection";
import TopicActions from "./TopicActions";

function TopicDetails({ token, loggedInUserId }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderedContent, setRenderedContent] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
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
        if (isImageModalOpen) {
          closeImageModal();
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
  }, [isImageModalOpen, showModal]);

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

  const openImageModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageUrl("");
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleEdit = (topicId) => {
    navigate(`/topics/${topicId}/edit`);
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

        <hr className="my-6 border-gray-300" />

        <KeywordsSection keywords={topic.keywords} />

        <hr className="my-6 border-gray-300" />

        <TopicContent content={renderedContent} />

        <hr className="my-6 border-gray-300" />

        <FilesSection files={files} onImageClick={openImageModal} />

        <TopicActions
          onBack={handleBack}
          isOwner={isOwner}
          onEdit={handleEdit}
          onDelete={handleDeleteTopic}
          loading={loading}
          topicId={id}
        />

        <ImageModal
          isOpen={isImageModalOpen}
          imageUrl={modalImageUrl}
          onClose={closeImageModal}
        />

        <Modal
          isOpen={showModal}
          type={modalType}
          title={modalTitle}
          message={modalMessage}
          onClose={closeNotificationModal}
          onConfirm={handleModalConfirm}
        />
      </div>
    </div>
  );
}

export default TopicDetails;