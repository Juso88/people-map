// src/components/GraphCanvas/GraphCanvas.jsx
import React from 'react';
import GraphTitle from './GraphTitle';
import GraphDisplay from './GraphDisplay';
import ButtonPanel from './ButtonPanel';
import { createPerson, createConnection } from '../features/api';

const GraphCanvas = ({ graphData, username, refreshGraph }) => {

  const handleAdd = async () => {
    const newName = prompt("Enter name to connect:");
    if (!newName || !username) return;

    await createPerson(newName);

    const peopleRes = await fetch('http://localhost:8080/api/people');
    const people = await peopleRes.json();
    const source = people.find(p => p.name === username);
    const target = people.find(p => p.name === newName);

    if (source && target) {
      await createConnection(source.id, target.id);
    }

    await refreshGraph();
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GraphTitle />
      <GraphDisplay graphData={graphData} />
      <ButtonPanel onAdd={handleAdd} onRemove={() => console.log("Remove clicked")} />
    </div>
  );
};

export default GraphCanvas;