import React from 'react';
import { MdOutlineAddReaction, MdRemove, MdOutlineRefresh, MdOutlineInfo, MdAltRoute, MdOutlineRoute } from 'react-icons/md';

const ButtonPanel = ({ onAdd, onRemove, onInfo, onNewConnect, onRefresh, selectedNodeText }) => {


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <button style={buttonStyle} onClick={onAdd}><MdOutlineAddReaction style={{ marginRight: "0.5em" }} /> Add</button>
      <button style={buttonStyle} onClick={onNewConnect}><MdOutlineRoute style={{ marginRight: "0.5em" }} /> New Connection</button>
      <button style={buttonStyle} onClick={onRemove}><MdRemove style={{ marginRight: "0.5em" }} /> Remove</button>
      <button style={buttonStyle} onClick={onInfo}><MdOutlineInfo style={{ marginRight: "0.5em" }} /> Info</button>
      <button style={buttonStyle} onClick={onRefresh}><MdOutlineRefresh style={{ marginRight: "0.5em" }} /> Refresh</button>
      <div id='selected-node' >Selected node: {selectedNodeText}</div>
    </div>
  );
};

const buttonStyle = {
  width: 'auto',
  height: '1em',
  fontSize: '1em',
  fontWeight: 'bold',
  borderRadius: '8px',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

export default ButtonPanel;