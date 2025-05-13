import React, { useState } from 'react';
import GraphTitle from './GraphTitle';
import GraphDisplay from './GraphDisplay';
import ButtonPanel from './ButtonPanel';
import OverlayInput from './OverlayInput';
import { createPerson, createConnection, updateConnection, deleteConnectionByName, createPersonAndConnect } from '../features/api';
import InfoBox from './InfoBox';

const GraphCanvas = ({ graphData, username, refreshGraph }) => {
  const [inputMode, setInputMode] = useState(null); // 'add' or 'remove'
  const [inputValue, setInputValue] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  

  const handleAdd = () => {
    setInputMode('add');
    setInputValue('');
  };

  const handleRemove = () => {
    setInputMode('remove');
    setInputValue('');
  };

  const handleUpdate = () => {
    setInputMode('update');
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

    //if the update comes from the button, we should update connection.
    //if the update comes from the info box, we should update person.
    if (inputMode === 'update') {
      const [oldTargetId, newTargetId] = inputValue.split(' ');
      await updateConnection(username, oldTargetId, newTargetId);
    }

    setInputMode(null);
    await refreshGraph();
  };
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (node) {showInfoBox();}
    else {setSelectedNode(null);}
    return;
  };

  const showInfoBox = () => {
    if (!selectedNode) return null;
    
    return (
      <InfoBox
        value={selectedNode.description}
        onSubmit={handleSubmit}
        onCancel={() => setSelectedNode(null)}
        personName={selectedNode.name}
      />
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GraphTitle rootName={username}/>
      <GraphDisplay graphData={graphData} nodeClickedFunction={handleNodeClick} />
      <ButtonPanel onAdd={handleAdd} onRemove={handleRemove} onUpdate={handleUpdate} selectedNodeText={selectedNode} />

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