import React from 'react';

const KeywordsSection = ({ keywords }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        Palavras-chave:
      </h3>
      <div className="flex flex-wrap gap-2">
        {keywords && keywords.map((kw, idx) => (
          <span
            key={idx}
            className="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
};

export default KeywordsSection;