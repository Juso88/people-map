import React, { useState } from 'react';
import GraphTitle from './GraphTitle';
import GraphDisplay from './GraphDisplay';
import ButtonPanel from './ButtonPanel';
import OverlayInput from './OverlayInput';
import { createPerson, createConnection, deleteConnectionByName, createPersonAndConnect } from '../features/api';

const GraphCanvas = ({ graphData, username, refreshGraph }) => {
  const [inputMode, setInputMode] = useState(null); // 'add' or 'remove'
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    setInputMode('add');
    setInputValue('');
  };

  const handleRemove = () => {
    setInputMode('remove');
    setInputValue('');
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || !username) {
      setInputMode(null);
      return;
    }

    if (inputMode === 'add') {
      await createPersonAndConnect(username, inputValue);
    }


    if (inputMode === 'remove') {
      await deleteConnectionByName(inputValue);
    }

    setInputMode(null);
    await refreshGraph();
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GraphTitle rootName={username}/>
      <GraphDisplay graphData={graphData} />
      <ButtonPanel onAdd={handleAdd} onRemove={handleRemove} />

      {inputMode && (
        <OverlayInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSubmit={handleSubmit}
          onCancel={() => setInputMode(null)}
          placeholder={inputMode === 'add' ? "Enter name to connect..." : "Enter name to remove..."}
        />
      )}
    </div>
  );
};

export default GraphCanvas;