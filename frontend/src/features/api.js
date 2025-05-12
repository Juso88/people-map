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

export const createPerson = async (name) => {
  await fetch('http://localhost:8080/api/people', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
};

export const createConnection = async (sourceId, targetId) => {
  await fetch('http://localhost:8080/api/connections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceId, targetId }),
  });
};