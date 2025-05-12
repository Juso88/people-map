import React from 'react';

const ButtonPanel = ({ onAdd, onRemove }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '80px', // Adjust this to be below the header
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <button style={buttonStyle} onClick={onAdd}>+</button>
      <button style={buttonStyle} onClick={onRemove}>-</button>
    </div>
  );
};

const buttonStyle = {
  width: '40px',
  height: '40px',
  fontSize: '24px',
  fontWeight: 'bold',
  borderRadius: '8px',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

export default ButtonPanel;