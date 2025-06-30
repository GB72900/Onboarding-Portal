import React from 'react';

interface Props {
  url: string;
}

const SASLink: React.FC<Props> = ({ url }) => {
  if (!url) return null;

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>One-Time Access Link</h3>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    </div>
  );
};

export default SASLink;
