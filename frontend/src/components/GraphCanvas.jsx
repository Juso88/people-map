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
  const [isInfoBoxVisible, setIsInfoBoxVisible] = useState(false);
  const [immediateConnect, setImmediateConnect] = useState(false);


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
      if (immediateConnect) {
        await createPersonAndConnect(selectedNode.label, inputValue);
      } else {
        await createPerson(inputValue);
      }
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

    if (inputMode === 'newConnect') {
      await createConnection(selectedNode.label, inputValue);
    }
    setInputMode(null);
    await refreshGraph();
  };
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    return;
  };

  const showInfoBox = () => {
    if (selectedNode === null) return null;
    setIsInfoBoxVisible(true);

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
        onRefresh={refreshGraph}
        onNodeClick={handleNodeClick}
        selectedNodeText={selectedNode !== null ? selectedNode.label : ""} />
      {/*<div style={{ position: 'absolute', top: '15em', right: '20px', padding: '10px', marginLeft: '10px', marginTop: '1em' , height: '1em'}}>
        <label> Add new person and connect to selected node immediately?
      <input
        type="checkbox"
        checked={immediateConnect}
        onChange={() => setImmediateConnect(!immediateConnect)}
      /></label>
      </div>*/}
      {isInfoBoxVisible && (
        <InfoBox
          onSubmit={handleUpdate}
          onCancel={() => setIsInfoBoxVisible(false)}
          selectedNodeName={selectedNode?.label} // Changed from selectedNode to selectedNodeName
        />
      )}

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