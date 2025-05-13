// src/components/GraphCanvas/GraphDisplay.jsx
import { React } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const GraphDisplay = ({ graphData, nodeClickedFunction }) => {
  return (
   
      
      <div style={{  }}>
        <ForceGraph2D
          graphData={graphData}
          backgroundColor='rgba(255, 255, 255, 0.0)'
          nodeAutoColorBy="id"
          linkDirectionalParticles={2}
          linkDirectionalArrowLength={4}
          nodeLabel="label"
          width={window.innerWidth}
          height={window.innerHeight}
          onNodeClick={nodeClickedFunction}
        />
      </div>
  );
};

export default GraphDisplay;