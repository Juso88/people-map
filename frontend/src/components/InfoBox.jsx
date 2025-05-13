import React, { useState, useEffect } from 'react';
import { MdClose, MdSaveAs } from 'react-icons/md';
import { fetchConnectionsById, fetchPersonByName, updatePerson } from '../features/api';

const InfoBox = ({ onCancel, selectedNodeName }) => {
  const [person, setPerson] = useState(null);
  const [connections, setConnections] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedNodeName) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const personData = await fetchPersonByName(selectedNodeName);
        const connectionsData = await fetchConnectionsById(personData.id);
        setPerson(personData);
        setConnections(connectionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPerson(null);
        setConnections(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedNodeName]); // Run effect when selectedNodeName changes

  if (isLoading) {
    return <div style={overlayStyle}>Loading...</div>;
  }

  if (!person || !connections) {
    return (

      <div style={overlayStyle}>
        <button style={closeButtonStyle} onClick={onCancel}><MdClose /></button>
        <h2>Error</h2>
        No data found
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <input style={
          { bigNameStyle }
        } type="text"
          defaultValue={person.name} />
        <button style={closeButtonStyle} onClick={onCancel}><MdClose /></button>
      </div>
      <div>
        Connections:
        {connections.map(conn => (
          <div key={conn.id}>
            {conn.source.name === person.name ? conn.target.name : conn.source.name}
          </div>
        ))}
      </div>
      <div>Id: {person.id}</div>
      <textarea
        value={person.description}
        placeholder={"Enter description here..."}
        style={inputStyle}
      />
      <div style={{ marginTop: '10px' }}>
        <button style={buttonStyle} onClick={
          async () => {
            await updatePerson(person.id, person.description);
            onCancel();
          }
        }>
          <MdSaveAs style={{ marginRight: "0.5em" }} /> Update info
        </button>
      </div>
    </div>
  );
};

const bigNameStyle = {
  padding: '10px',
  fontSize: '3em',
height: '1em',
  fontWeight: 'bold',
  width: 'auto',
  borderRadius: '0px',
  border: '0px'
}


const overlayStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 10,
};

const inputStyle = {
  padding: '10px',
  fontSize: '16px',
  width: '250px',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '8px 16px',
  margin: '0 5px',
  backgroundColor: '#222',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
};

const closeButtonStyle = {
  display: 'flex',
  float: 'right',
  padding: '0.45em 0.5em',
  margin: '0 0',
  backgroundColor: '#222',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

export default InfoBox;