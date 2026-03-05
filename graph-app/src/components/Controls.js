import React, { useState } from 'react';

function Controls({ nodes, onAdd }) {
  const [action, setAction] = useState('Add Vertices (comma separated)');
  const [nodeNames, setNodeName] = useState('');
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [disabledNodes, setNodeDisabled] = useState([]) //[For edges] a node is disabled if already connected to n - 1 nodes

  const canAddEdge = nodes.length >= 2;

  function handleEnter() {
    if (action === 'Add Vertices (comma separated)') {
      if (!nodeNames.trim()) return;
      nodeNames
        .split(',')
        .map(name => name.trim())
        .filter(name => name)
        .forEach(name => onAdd({ type: 'vertex', name }));
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
          <option value="Add Vertices (comma separated)">Add Vertices (comma separated)</option>
          <option value="Add Edge">Add Edge</option>
          <option value="Add Arc">Add Arc</option>
        </select>
      </div>

      {/* State 2: Dynamic inputs */}
      {action === 'Add Vertices (comma separated)' ? (
        <div style={styles.field}>
          <label htmlFor="node-name" style={styles.label}>Node Name(s)</label>
          <input
            id="node-name"
            type="text"
            value={nodeNames}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="e.g. A, B, C"
            style={styles.input}
          />
        </div>
      ) : (
        <>
          <div style={styles.field}>
            <label htmlFor="edge-source" style={styles.label}>Source</label>
            <select
              id="edge-source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              disabled={!canAddEdge}
              style={styles.select}
            >
              <option value="">Select source node</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.id}</option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label htmlFor="edge-target" style={styles.label}>Target</label>
            <select
              id="edge-target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={!canAddEdge}
              style={styles.select}
            >
              <option value="">Select target node</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.id}</option>
              ))}
            </select>
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
