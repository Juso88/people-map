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
  const [placeholderText, setPlaceholderText] = useState('');


  const handleAdd = () => {
    setInputMode('add');
    setInputValue('');
    setPlaceholderText('Enter name of new person...');
  };

  //should always spawn a dialog to remove a person, don't want to do it by accident.
  const handleRemove = () => {
    setInputMode('remove');
    setInputValue('');
    setPlaceholderText('Enter name to remove...');
  };

  const handleUpdate = () => {
    setInputMode('update');
    setInputValue('');

  };

  const handleNewConnect = () => {
    setInputMode('newConnect');
    setInputValue('');
    setPlaceholderText('Enter name to connect to selected node...');
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || !username) {
      setInputMode(null);
      return;
    }

    if (inputMode === 'add') {
      await createPersonAndConnect(username, inputValue);
      return;
    }


    if (inputMode === 'remove') {
      await deleteConnectionByName(inputValue);
      return;
    }

    //if the update comes from the button, we should update connection.
    //if the update comes from the info box, we should update person.
    if (inputMode === 'update') {
      const [oldTargetId, newTargetId] = inputValue.split(' ');
      await updateConnection(username, oldTargetId, newTargetId);
      return;
    }

    if (inputMode === 'newConnect') {
      await createConnection(selectedNode.label, inputValue);
      return;
    }
    setInputMode(null);
    await refreshGraph();
  };
  const handleNodeClick = (node) => {
    setSelectedNode(node);
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
      <GraphTitle rootName={username} />
      <GraphDisplay graphData={graphData} nodeClickedFunction={handleNodeClick} />
      <ButtonPanel
        onAdd={handleAdd}
        onRemove={handleRemove}
        onUpdate={handleUpdate}
        onInfo={showInfoBox}
        onNewConnect={handleNewConnect}
        selectedNodeText={selectedNode !== null ? selectedNode.label : ""} />

      {inputMode && (
        <OverlayInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSubmit={handleSubmit}
          onCancel={() => setInputMode(null)}
          placeholder={placeholderText}
        />
      )}
    </div>
  );
};

export default GraphCanvas;