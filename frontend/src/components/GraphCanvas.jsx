import React, { useState } from 'react';
import GraphTitle from './GraphTitle';
import GraphDisplay from './GraphDisplay';
import ButtonPanel from './ButtonPanel';
import OverlayInput from './OverlayInput';
import { createPerson, createConnection, updateConnection, deleteConnectionByName, createPersonAndConnect } from '../features/api';
import InfoBox from './InfoBox';
import { GradientBackground } from "react-gradient-animation";


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
      {/* Gradient Background Layer - Lowest z-index */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <GradientBackground
          size={{ min: 500, max: 700, pulse: 0.3 }}
          speed={{ x: { min: 0.4, max: 1.5 }, y: { min: 0.4, max: 1.5 } }}
          colors={{ background: 'transparent', particles: ['#ff681c', '#87ddfe', '#231efe'] }}
          skew={0}
          style={{
            width: '100%',
            height: '100%'
          }}
        />
      </div>

      {/* Graph Layer */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 2
      }}>
        <GraphDisplay
          graphData={graphData}
          nodeClickedFunction={handleNodeClick}
        />
      </div>

      {/* UI Layer - Highest z-index */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 3,
        pointerEvents: 'none'
      }}>
        {/* Title */}
        <div style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          pointerEvents: 'auto'
        }}>
          <GraphTitle rootName={username} />
        </div>

        {/* Button Panel */}
        <div style={{
          position: 'absolute',
          top: '5em',
          right: '1em',
          pointerEvents: 'auto'
        }}>
          <ButtonPanel
            onAdd={handleAdd}
            onRemove={handleRemove}
            onInfo={showInfoBox}
            onNewConnect={handleNewConnect}
            onRefresh={refreshGraph}
            onNodeClick={handleNodeClick}
            selectedNodeText={selectedNode !== null ? selectedNode.label : ""}
          />
        </div>

        {/* Overlays */}
        {isInfoBoxVisible && (
          <div style={{ pointerEvents: 'auto' }}>
            <InfoBox
              onCancel={() => setIsInfoBoxVisible(false)}
              selectedNodeName={selectedNode?.label}
            />
          </div>
        )}

        {inputMode && (
          <div style={{ pointerEvents: 'auto' }}>
            <OverlayInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleSubmit}
              onCancel={() => setInputMode(null)}
              placeholder={placeholderText}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphCanvas;