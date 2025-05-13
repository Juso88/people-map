// src/components/GraphCanvas/GraphTitle.jsx
import React from 'react';

const GraphTitle = ({rootName}) => (
  <div
    style={{
      backgroundColor: 'skyblue',
      padding: '10px 20px',
      textAlign: 'center',
      fontSize: '2rem',
      fontWeight: 'bold',
      fontFamily: 'system-ui, sans-serif',
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 2
    }}
  >
    {rootName}'s People-Map
  </div>
);

export default GraphTitle;