import React from 'react';
import Container from '../ui/Container';
import FormHeader from '../ui/FormHeader';
import ErrorMessage from '../ui/ErrorMessage';
import FormLink from '../ui/FormLink';

const AuthForm = ({ 
  title, 
  error, 
  onSubmit, 
  children, 
  linkText, 
  linkHref, 
  linkDescription 
}) => {
  return (
    <Container>
      <FormHeader title={title} />
      <ErrorMessage error={error} />
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
      <FormLink 
        text={linkDescription} 
        linkText={linkText} 
        href={linkHref} 
      />
    </Container>
  );
};

export default AuthForm;