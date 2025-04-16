import React, { useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import ButtonPanel from './components/ButtonPanel';

const App = () => {
  const [step, setStep] = useState(0); // 0: welcome, 1: prompt, 2: input, 3: graph
  const [visibleStep, setVisibleStep] = useState(0);
  const [fade, setFade] = useState(true);
  const [username, setUsername] = useState('');
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const fetchPeople = async () => {
    try {
      const [peopleRes, connectionsRes] = await Promise.all([
        fetch("http://localhost:8080/api/people"),
        fetch("http://localhost:8080/api/connections")
      ]);
      
      const people = await peopleRes.json();
      const connections = await connectionsRes.json();
      
      const nodes = people.map(p => ({
        id: p.name,
        label: p.name
      }));
      
      const links = connections.map(c => ({
        source: c.source.name,
        target: c.target.name
      }));

      setGraphData({ nodes, links });
    } catch(err) {
      console.error('Failed to fetch people:', err)
    }
  };

  const createPerson = async (name) => {
    try {
      await fetch('http://localhost:8080/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
    } catch(err) {
      console.error('Failed to create person:', err);
    }
  }

  useEffect(() => {
    let timers = [];

    if (step < 2) {
      timers.push(setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setVisibleStep(step + 1);
          setFade(true);
          setStep(prev => prev + 1);
        }, 500); // match transition time
      }, 2000));
    }

    return () => timers.forEach(clearTimeout);
  }, [step]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && username.trim()) {
      // fade out input
      setFade(false);
      setTimeout(async() => {
        await createPerson(username);
        await fetchPeople()
        setStep(3); // move to graph
      }, 500); // wait for fade
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {step < 3 && (
        <div
          className="fade-step"
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
          {visibleStep === 0 && <h1 className="title">welcome.</h1>}
          {visibleStep === 1 && <h2 className="title">enter your name.</h2>}
          {visibleStep === 2 && (
            <div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Your name"
                className="name-input"
                autoFocus
              />
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div
          style={{
            opacity: 1,
            transition: 'opacity 0.5s ease',
            width: '100%',
            height: '100%',
          }}
        >
          <ForceGraph2D
            graphData={graphData}
            nodeAutoColorBy="id"
            linkDirectionalParticles={2}
            linkDirectionalArrowLength={4}
            nodeLabel="label"
            width={window.innerWidth}
            height={window.innerHeight}
          />

          <ButtonPanel
            onAdd={async () => {
              const newName = prompt("Enter name to connect:");
              if(!newName || !username) return;

              await fetch("http://localhost:8080/api/people", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name:newName }),
              });

              const res = await fetch("http://localhost:8080/api/people");
              const people = await res.json();

              const source = people.find(p => p.name === username);
              const target = people.find(p => p.name === newName);

              if (source && target) {
                await fetch("http://localhost:8080/api/connections", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ sourceId: source.id, targetId: target.id }),
                });
              }

              await fetchPeople();
            }}
            onRemove={() => {
              console.log("Remove button clicked");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default App;