import React from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import TopicsGrid from './TopicsGrid';

const DashboardContent = ({
  loading,
  filteredTopics,
  searchTerm,
  filterOption,
  onTopicClick
}) => {
  if (loading) {
    return <LoadingSpinner message="Carregando tópicos..." />;
  }

  if (filteredTopics.length === 0 && searchTerm === "") {
    if (filterOption === 'mine') {
      return (
        <EmptyState
          icon="👀"
          title="Você ainda não criou nenhum tópico."
          description="Clique em 'Criar Novo Tópico' para começar!"
        />
      );
    } else {
      return (
        <EmptyState
          icon="🌍"
          title="Nenhum tópico criado por outros usuários."
          description="No momento, não há tópicos de outros usuários para exibir."
        />
      );
    }
  }

  if (filteredTopics.length === 0 && searchTerm !== "") {
    return (
      <EmptyState
        icon="🔍"
        title="Nenhum tópico encontrado com sua busca."
        description="Ajuste seus termos de busca e tente novamente."
      />
    );
  }

  return (
    <TopicsGrid 
      topics={filteredTopics} 
      onTopicClick={onTopicClick} 
    />
  );
};

export default DashboardContent;