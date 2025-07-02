import React, { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import Button from "../components/ui/Button";
import DashboardActions from "../components/dashboard/DashboardActions";
import DashboardContent from "../components/dashboard/DashboardContent";

function Dashboard({ token, onLogout, loggedInUserId }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filterOption, setFilterOption] = useState('others');

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    let currentFiltered = topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(lowerSearch) ||
        (topic.keywords &&
          topic.keywords.some((kw) => kw.toLowerCase().includes(lowerSearch)))
    );

    if (filterOption === 'mine') {
      currentFiltered = currentFiltered.filter(
        (topic) => topic.user_id === parseInt(loggedInUserId)
      );
    } else if (filterOption === 'others') {
      currentFiltered = currentFiltered.filter(
        (topic) => topic.user_id !== parseInt(loggedInUserId)
      );
    }

    setFilteredTopics(currentFiltered);
  }, [searchTerm, topics, filterOption, loggedInUserId]);

  async function fetchTopics() {
    setLoading(true);
    try {
      const res = await axios.get("/topics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopics(res.data);
    } catch (error) {
      console.error("Erro ao buscar tópicos:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleFilter = () => {
    setFilterOption(prev => {
      return prev === 'mine' ? 'others' : 'mine';
    });
  };

  const handleTopicClick = (topicId) => {
    window.location.assign(`/topics/${topicId}`);
  };

  const handleCreateTopic = () => {
    window.location.assign("/topics/new");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative">
      <PageHeader
        title="Base de Conhecimentos Tech"
        subtitle="Explore tópicos relevantes para tecnologia"
      />

      <DashboardActions
        filterOption={filterOption}
        onToggleFilter={handleToggleFilter}
        loggedInUserId={loggedInUserId}
        onLogout={onLogout}
      />

      <SearchInput
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Buscar tópicos por título ou palavra-chave..."
      />

      <Button
        onClick={handleCreateTopic}
        variant="primary"
        className="mb-6 !w-full max-w-xs"
      >
        Criar Novo Tópico
      </Button>

      <DashboardContent
        loading={loading}
        filteredTopics={filteredTopics}
        searchTerm={searchTerm}
        filterOption={filterOption}
        onTopicClick={handleTopicClick}
      />
    </div>
  );
}

export default Dashboard;