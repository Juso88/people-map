// src/services/api.js

export const fetchPeopleAndConnections = async () => {
  const [peopleRes, connectionsRes] = await Promise.all([
    fetch("http://localhost:8080/api/people"),
    fetch("http://localhost:8080/api/connections")
  ]);

  if (!peopleRes.ok || !connectionsRes.ok) {
    throw new Error('Failed to fetch data from backend');
  }

  const people = await peopleRes.json();
  const connections = await connectionsRes.json();

  return { people, connections };
};

export const fetchPersonByName = async (name) => {
  if (!name) {
    throw new Error('ID is required');
  }

  const response = await fetch(`http://localhost:8080/api/people/by-name/${name}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch person with id ${name}: ${response.status}`);
  }

  const person = await response.json();
  return person;
};

export const fetchConnectionsById = async (id) => {
  if (!id) {
    throw new Error('ID is required');
  }

  const response = await fetch(`http://localhost:8080/api/connections/${id}`, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch connections for person with id ${id}: ${response.status}`);
  }

  const connections = await response.json();
  return connections;
};

export const fetchPersonById = async (id) => {
  if (!id) {
    throw new Error('ID is required');
  }

  const response = await fetch(`http://localhost:8080/api/people/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch person with id ${id}: ${response.status}`);
  }

  const person = await response.json();
  return person;
};


export const createPerson = async (name) => {
  await fetch('http://localhost:8080/api/people', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
};

export const createConnection = async (sourceName, targetName) => {
  // Fetch latest people list
  const peopleRes = await fetch('http://localhost:8080/api/people');
  const people = await peopleRes.json();

  // Find both users
  const source = people.find(p => p.name == sourceName);
  const target = people.find(p => p.name == targetName);
  if (!source || !target) {
    console.error('Source or target person not found');
    return;
  }
  await fetch('http://localhost:8080/api/connections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: source.id, target: target.id }),
  });
};

export const updatePerson = async (id, newName, newDescription) => {
  if (!id || !newName) return;
  try {
    const res = await fetch(`http://localhost:8080/api/people/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, newName, newDescription }),
    });
    if (!res.ok) throw new Error(`Failed to update person: ${res.status}`);
  } catch (err) {
    console.error('Failed to update person:', err);
    throw err;
  }
}

export const updateConnection = async (sourceId, oldTargetId, newTargetId) => {
  if (!sourceId || !oldTargetId || !newTargetId) return;
  try {
    const res = await fetch(`http://localhost:8080/api/connections/${sourceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId, oldTargetId, newTargetId }),
    });
    if (!res.ok) throw new Error(`Failed to update connection: ${res.status}`);
  } catch (err) {
    console.error('Failed to update connection:', err);
    throw err;
  }
}

export const deleteConnectionByName = async (name) => {
  if (!name) return;
  try {
    const res = await fetch(`http://localhost:8080/api/connections/by-name/${name}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);
  } catch (err) {
    console.error('Failed to remove connections and person by name:', err);
    throw err;
  }
};

export const createPersonAndConnect = async (currentUsername, newName) => {
  if (!newName || !currentUsername) return;

  // Ensure the new person exists
  await createPerson(newName);

  // Fetch latest people list
  const peopleRes = await fetch('http://localhost:8080/api/people');
  const people = await peopleRes.json();

  // Find both users
  const source = people.find(p => p.name === currentUsername);
  const target = people.find(p => p.name === newName);

  // Create connection if both exist
  if (source && target) {
    await createConnection(source, target);
  }
};