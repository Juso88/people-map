import React, { useState, useCallback } from 'react';
import GraphTitle from './GraphTitle';
import GraphDisplay from './GraphDisplay';
import ButtonPanel from './ButtonPanel';
import OverlayInput from './OverlayInput';
import { createPerson, createConnection, updateConnection, deleteConnectionByName, createPersonAndConnect, fetchPersonById } from '../features/api';
import InfoBox from './InfoBox';

const GraphCanvas = ({ graphData, username, refreshGraph }) => {
  const [inputMode, setInputMode] = useState(null); // 'add' or 'remove'
  const [inputValue, setInputValue] = useState('');
  const [selectedNodes, setSelectedNodes] = useState(null);
  const [isInfoBoxVisible, setIsInfoBoxVisible] = useState(false);


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

  const handleNewConnection = () => {
    if (selectedNodes.length != 2) {
      window.alert("Must select 2 nodes to make a new connection");
      return;
    }

  }

  const handleSubmitButton = async () => {
    if (!inputValue.trim() || !username) {
      setInputMode(null);
      return;
    }

    if (inputMode === 'add') {
      await createPersonAndConnect(selectedNodes.id, inputValue);
    }


    if (inputMode === 'remove') {
      await deleteConnectionByName(inputValue);
    }

    if (inputMode === 'newConnect') {
      await createConnection(selectedNodes.id, inputValue);
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

  const handleNodeClick = useCallback((node, event) => {
    if (event.ctrlKey || event.shiftKey || event.altKey) { // multi-selection
      selectedNodes.has(node) ? selectedNodes.delete(node) : selectedNodes.add(node);
      setSelectedNodes(new Set(selectedNodes));
    } else { // single-selection
      const untoggle = selectedNodes.has(node) && selectedNodes.size === 1;
      selectedNodes.clear();
      !untoggle && selectedNodes.add(node);
    }
    setSelectedNodes(new Set(selectedNodes)); // update selected nodes state
  }, [selectedNodes]);

  const onNodeDrag = useCallback((node, translate) => {
    if (selectedNodes.has(node)) { // moving a selected node
      [...selectedNodes]
        .filter(selNode => selNode !== node) // don't touch node being dragged
        .forEach(node => ['x', 'y'].forEach(coord => node[`f${coord}`] = node[coord] + translate[coord])); // translate other nodes by same amount
    }
  }, [selectedNodes]);

  const onNodeDragEnd = useCallback(node => {
    if (selectedNodes.has(node)) { // finished moving a selected node
      [...selectedNodes]
        .filter(selNode => selNode !== node) // don't touch node being dragged
        .forEach(node => ['x', 'y'].forEach(coord => node[`f${coord}`] = undefined)); // unfix controlled nodes
    }
  }, [selectedNodes]);

  const showInfoBox = () => {
    if (!selectedNodes) return null;
    const person = fetchPersonById(selectedNodes.id);
    setIsInfoBoxVisible(true);
    return (
      <InfoBox
        value={person.description}
        onSubmit={handleSubmitButton}
        personName={selectedNodes.name}
        isVisible={isInfoBoxVisible}
      />
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GraphTitle rootName={username} />
      <GraphDisplay 
      graphData={graphData} 
      onNodeClick={handleNodeClick}
  onNodeDrag={onNodeDrag}
  onNodeDragEnd={onNodeDragEnd} 
      />
      <ButtonPanel onAdd={handleAdd} onRemove={handleRemove} onUpdate={handleUpdate} onInfo={showInfoBox} onNewConnect={handleNewConnection} selectedNodeText={selectedNodes === null ? "" : selectedNodes} />

      {inputMode && (
        <OverlayInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSubmit={handleSubmitButton}
          onCancel={() => setInputMode(null)}
          placeholder={inputMode === 'add' ? "Enter name to connect..." : "Enter name to remove..."}
        />
      )}
    </div>
  );
};

export default GraphCanvas;