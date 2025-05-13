// src/components/GraphCanvas/GraphDisplay.jsx
import {React} from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const GraphDisplay = ({ graphData, nodeClickedFunction }) => {
  
return (
  <ForceGraph2D
    graphData={graphData}
    nodeAutoColorBy="id"
    linkDirectionalParticles={2}
    linkDirectionalArrowLength={4}
    nodeLabel="label"
    width={window.innerWidth}
    height={window.innerHeight}
    onNodeClick={nodeClickedFunction}
  />
)
};

export default GraphDisplay;