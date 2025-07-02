import React from 'react';

const TopicContent = ({ content }) => {
  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed mb-8 prose-p:mt-4 prose-p:mb-4">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default TopicContent;