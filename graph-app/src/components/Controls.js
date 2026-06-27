import React, { useState } from 'react';

function Controls({ nodes, edges = [], onAdd, onDeleteVertex, onDeleteEdge }) {
  const [action, setAction] = useState('Add Vertices (comma separated)');
  const [nodeNames, setNodeName] = useState('');
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [deleteVertex, setDeleteVertex] = useState('');
  const [deleteEdgeSource, setDeleteEdgeSource] = useState('');
  const [deleteEdgeTarget, setDeleteEdgeTarget] = useState('');

  const canAddEdge = () => {
    //add if there isn't already an edge/arc with the source and target
    return nodes.length >= 2;
  };

  const canAddArc = () => {
    //add if there isn't an edge/arc with this source and target
    return nodes.length >= 2;
  };

  function handleAddArc() {
    // TODO: Implement arc functionality
    if (!source.trim() || !target.trim()) return;
    
    // Placeholder for arc-specific logic
    console.log('Adding arc from', source.trim(), 'to', target.trim());
    
    // For now, you can implement the arc logic here
    onAdd({ type: 'arc', source: source.trim(), target: target.trim() });
    setSource('');
    setTarget('');
  }

  function handleAddEdge() {
    if (!source.trim() || !target.trim()) return;

    onAdd({ type: 'edge', source: source.trim(), target: target.trim() });

    console.log('Adding edge from', source.trim(), 'to', target.trim());

    setSource('');
    setTarget('');
  }

  function handleDeleteVertex() {
    console.log('Deleting vertex:', deleteVertex);

    onDeleteVertex(deleteVertex);

    setDeleteVertex('');
  }

  function handleDeleteEdge() {
    console.log('Deleting edge:', deleteEdgeSource);

    onDeleteEdge(deleteEdgeSource, deleteEdgeTarget);

    setDeleteEdgeSource('');
    setDeleteEdgeTarget('');
  }

  function handleEnter() {
    if (action === 'Add Vertices (comma separated)') {
      if (!nodeNames.trim()) return;
      nodeNames
        .split(',')
        .map(name => name.trim())
        .filter(name => name)
        .forEach(name => {
          onAdd({ type: 'vertex', name });
        });
      setNodeName(''); //resets text field
    } else if (action === 'Add Edge') {
      handleAddEdge();
    } else if (action === 'Add Arc') {
      handleAddArc();
    } else if (action === 'Delete Vertex') {
      handleDeleteVertex();
    } else if (action === 'Delete Arc/Edge') {
      handleDeleteEdge();
    }
  }

  function handleActionChange(e) {
    setAction(e.target.value);
    setNodeName('');
    setSource('');
    setTarget('');
    setDeleteVertex('');
    setDeleteEdgeSource('');
    setDeleteEdgeTarget('');
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
          <option value="Delete Vertex">Delete Vertex</option>
          <option value="Delete Arc/Edge">Delete Arc/Edge</option>
        </select>
      </div>

      {/* State 2: Dynamic inputs */}
      {action === 'Add Vertices (comma separated)' && (
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
      )}

      {(action === 'Add Edge' || action === 'Add Arc') && (
        <>
          <div style={styles.field}>
            <label htmlFor="edge-source" style={styles.label}>Source</label>
            <select
              id="edge-source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              disabled={!canAddEdge()}
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
              disabled={!canAddEdge() || !source}
              style={styles.select}
            >
              <option value="">Select target node</option>
              {nodes.map(node => {
                // Exclude the source node itself
                if (node.id === source) return null;
                // Exclude nodes already connected to source
                const alreadyConnected = edges.some(e => {
                  if (action === 'Add Arc') {
                    // Directed: only outgoing edges from source count
                    return e.source === source && e.target === node.id;
                  }
                  // Undirected: either direction
                  return (
                    (e.source === source && e.target === node.id) ||
                    (e.target === source && e.source === node.id)
                  );
                });
                return (
                  <option key={node.id} value={node.id} disabled={alreadyConnected}>
                    {node.id}{alreadyConnected ? ' (already connected)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
          {!canAddEdge() && (
            <p style={styles.hint}>Add at least 2 nodes before adding an edge.</p>
          )}
        </>
      )}

      {action === 'Delete Vertex' && (
        <div style={styles.field}>
          <label htmlFor="delete-vertex" style={styles.label}>Vertex to Delete</label>
          <select
            id="delete-vertex"
            value={deleteVertex}
            onChange={(e) => setDeleteVertex(e.target.value)}
            disabled={nodes.length === 0}
            style={styles.select}
          >
            <option value="">Select vertex</option>
            {nodes.map(node => (
              <option key={node.id} value={node.id}>{node.id}</option>
            ))}
          </select>
          {nodes.length === 0 && (
            <p style={styles.hint}>No vertices to delete.</p>
          )}
        </div>
      )}

      {action === 'Delete Arc/Edge' && (
        <>
          <div style={styles.field}>
            <label htmlFor="delete-edge-source" style={styles.label}>Source</label>
            <select
              id="delete-edge-source"
              value={deleteEdgeSource}
              onChange={(e) => { setDeleteEdgeSource(e.target.value); setDeleteEdgeTarget(''); }}
              disabled={edges.length === 0}
              style={styles.select}
            >
              <option value="">Select source node</option>
              {/* Only show nodes that are actually an endpoint of some edge */}
              {nodes.filter(node => edges.some(e => e.source === node.id || e.target === node.id)).map(node => (
                <option key={node.id} value={node.id}>{node.id}</option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label htmlFor="delete-edge-target" style={styles.label}>Target</label>
            <select
              id="delete-edge-target"
              value={deleteEdgeTarget}
              onChange={(e) => setDeleteEdgeTarget(e.target.value)}
              disabled={!deleteEdgeSource}
              style={styles.select}
            >
              <option value="">Select target node</option>
              {/* Only show nodes connected to the chosen source */}
              {edges
                .filter(e => e.source === deleteEdgeSource || e.target === deleteEdgeSource)
                .map(e => (e.source === deleteEdgeSource ? e.target : e.source))
                .filter((id, idx, arr) => arr.indexOf(id) === idx) // deduplicate
                .map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
            </select>
          </div>
          {edges.length === 0 && (
            <p style={styles.hint}>No edges or arcs to delete.</p>
          )}
        </>
      )}

      {/* State 3: Enter button */}
      <button
        onClick={handleEnter}
        disabled={
          ((action === 'Add Edge' || action === 'Add Arc') && !canAddEdge()) ||
          (action === 'Delete Vertex' && !deleteVertex) ||
          (action === 'Delete Arc/Edge' && (!deleteEdgeSource || !deleteEdgeTarget))
        }
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
