import React from 'react';

const ButtonPanel = ({ onAdd, onRemove }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 10
      }}
    >
      <button
        style={{
          width: '40px',
          height: '40px',
          fontSize: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          backgroundColor: '#f9f9f9',
          color: '#000',
          cursor: 'pointer'
        }}
        onClick={onAdd}
      >
        +
      </button>
      <button
        style={{
          width: '40px',
          height: '40px',
          fontSize: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          backgroundColor: '#f9f9f9',
          color: '#000',
          cursor: 'pointer'
        }}
        onClick={onRemove}
      >
        –
      </button>
    </div>
  );
};

export default ButtonPanel;