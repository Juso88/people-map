import React, { useState, useEffect } from 'react';
import GraphCanvas from './components/GraphCanvas';
import { fetchPeopleAndConnections, createPerson } from './features/api';

const App = () => {
  const [step, setStep] = useState(0);
  const [visibleStep, setVisibleStep] = useState(0);
  const [fade, setFade] = useState(true);
  const [username, setUsername] = useState('');
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const refreshGraph = async () => {
    try {
      const { people, connections } = await fetchPeopleAndConnections();
      const nodes = people.map(p => ({ id: p.name, label: p.name }));
      const links = connections.map(c => ({ source: c.source.name, target: c.target.name }));
      setGraphData({ nodes, links });
    } catch (err) {
      console.error('Failed to fetch people:', err);
    }
  };

  useEffect(() => {
    if (step < 2) {
      const timer = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setVisibleStep(step + 1);
          setFade(true);
          setStep(prev => prev + 1);
        }, 500);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && username.trim()) {
      setFade(false);
      setTimeout(async () => {
        await createPerson(username);
        await refreshGraph();
        setStep(3);
      }, 500);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {step < 3 ? (
        <div
          style={{
            opacity: fade ? 1 : 0,
            transition: 'opacity 0.5s ease',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          {visibleStep === 0 && <h1>welcome.</h1>}
          {visibleStep === 1 && <h2>enter your name.</h2>}
          {visibleStep === 2 && (
            <div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Your name"
                autoFocus
              />
            </div>
          )}
        </div>
      ) : (
        <GraphCanvas graphData={graphData} username={username} refreshGraph={refreshGraph} />
      )}
    </div>
  );
};

export default App;