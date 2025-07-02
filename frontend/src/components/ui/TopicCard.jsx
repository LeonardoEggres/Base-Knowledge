import React from 'react';

const TopicCard = ({ topic, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
      title="Clique para ver detalhes"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
        {topic.title}
      </h2>
      <p className="text-gray-600 text-sm line-clamp-3">
        {topic.summary}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {topic.keywords &&
          topic.keywords.map((kw, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded"
            >
              {kw}
            </span>
          ))}
      </div>
    </div>
  );
};

export default TopicCard;