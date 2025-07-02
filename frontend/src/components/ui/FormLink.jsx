import React from 'react';

const FormLink = ({ text, linkText, href }) => {
  return (
    <p className="text-sm text-center mt-4">
      {text}{" "}
      <a href={href} className="text-blue-600 hover:underline">
        {linkText}
      </a>
    </p>
  );
};

export default FormLink;