import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// Componentes UI
import TopicFormContainer from "../components/ui/TopicFormContainer";
import FormField from "../components/ui/FormField";
import FileUploadField from "../components/ui/FileUploadField";
import ExistingFilesSection from "../components/ui/ExistingFilesSection";
import FormActions from "../components/ui/FormActions";
import ErrorMessage from "../components/ui/ErrorMessage";
import Modal from "../components/ui/Modal";

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

  const handleCancel = () => {
    navigate(isEditing ? `/topics/${id}` : "/");
  };

  return (
    <TopicFormContainer title={isEditing ? "Editar Tópico" : "Novo Tópico"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Título"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <FormField
          label="Resumo"
          type="textarea"
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          rows={3}
        />

        <FormField
          label="Conteúdo Completo"
          type="textarea"
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={8}
        />

        <FormField
          label="Palavras-chave (separadas por vírgula)"
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Ex: tecnologia, programação, javascript"
          required
        />

        {/* Seção de Arquivos Existentes (apenas em modo de edição) */}
        {isEditing && (
          <ExistingFilesSection
            existingFiles={existingFiles}
            onDeleteFile={handleDeleteExistingFile}
            loading={loading}
          />
        )}

        <FileUploadField
          files={files}
          onChange={handleFilesChange}
        />

        <ErrorMessage error={error} />

        <FormActions
          onCancel={handleCancel}
          loading={loading}
          isEditing={isEditing}
        />
      </form>

      {/* Modal Component */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleModalConfirm}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </TopicFormContainer>
  );
}

export default TopicForm;