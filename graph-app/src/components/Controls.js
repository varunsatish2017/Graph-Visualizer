import React, { useState } from 'react';

function Controls({ nodes, onAdd }) {
  const [action, setAction] = useState('Add Vertex');
  const [nodeName, setNodeName] = useState('');
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');

  const canAddEdge = nodes.length >= 2;

  function handleEnter() {
    if (action === 'Add Vertex') {
      if (!nodeName.trim()) return;
      onAdd({ type: 'vertex', name: nodeName.trim() });
      setNodeName('');
    } else {
      if (!source.trim() || !target.trim()) return;
      onAdd({ type: 'edge', source: source.trim(), target: target.trim() });
      setSource('');
      setTarget('');
    }
  }

  function handleActionChange(e) {
    setAction(e.target.value);
    setNodeName('');
    setSource('');
    setTarget('');
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Controls</h3>

      {/* State 1: Dropdown */}
      <div style={styles.field}>
        <label htmlFor="action-select" style={styles.label}>Action</label>
        <select
          id="action-select"
          value={action}
          onChange={handleActionChange}
          style={styles.select}
        >
          <option value="Add Vertex">Add Vertex</option>
          <option value="Add Edge">Add Edge</option>
        </select>
      </div>

      {/* State 2: Dynamic inputs */}
      {action === 'Add Vertex' ? (
        <div style={styles.field}>
          <label htmlFor="node-name" style={styles.label}>Node Name</label>
          <input
            id="node-name"
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="e.g. A"
            style={styles.input}
          />
        </div>
      ) : (
        <>
          <div style={styles.field}>
            <label htmlFor="edge-source" style={styles.label}>Source</label>
            <input
              id="edge-source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. A"
              disabled={!canAddEdge}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="edge-target" style={styles.label}>Target</label>
            <input
              id="edge-target"
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. B"
              disabled={!canAddEdge}
              style={styles.input}
            />
          </div>
          {!canAddEdge && (
            <p style={styles.hint}>Add at least 2 nodes before adding an edge.</p>
          )}
        </>
      )}

      {/* State 3: Enter button */}
      <button
        onClick={handleEnter}
        disabled={action === 'Add Edge' && !canAddEdge}
        style={styles.button}
      >
        Enter
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '16px',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: 6,
    minWidth: 220,
  },
  title: {
    marginTop: 0,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  field: {
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
    color: '#555',
  },
  select: {
    padding: '6px 8px',
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: 14,
  },
  input: {
    padding: '6px 8px',
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: 14,
  },
  hint: {
    fontSize: 12,
    color: '#e55',
    margin: '0 0 8px 0',
  },
  button: {
    width: '100%',
    padding: '8px 0',
    background: '#4a90d9',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontSize: 15,
    cursor: 'pointer',
  },
};

export default Controls;
