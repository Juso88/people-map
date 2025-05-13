import React from 'react';

const OverlayInput = ({ value, onChange, onSubmit, onCancel, placeholder }) => {
  return (
    <div style={overlayStyle}>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
        autoFocus
      />
      <div style={{ marginTop: '10px' }}>
        <button style={buttonStyle} onClick={onSubmit}>Submit</button>
        <button style={buttonStyle} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 10,
};

const inputStyle = {
  padding: '10px',
  fontSize: '16px',
  width: '250px',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '8px 16px',
  margin: '0 5px',
  backgroundColor: '#222',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

export default OverlayInput;