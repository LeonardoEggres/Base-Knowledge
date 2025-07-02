import React from 'react';
import TopicCard from '../ui/TopicCard';

const TopicsGrid = ({ topics, onTopicClick }) => {
  return (
    <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          onClick={() => onTopicClick(topic.id)}
        />
      ))}
    </div>
  );
};

export default TopicsGrid;