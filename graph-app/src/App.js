import React, { useState } from 'react';
import Canvas from './components/Canvas';
import Controls from './components/Controls';
import TopBar from './components/TopBar';
import Results from './components/Results';
import './App.css';
import Graph from './Graph';

// Initial demo graph – positions are managed by D3 force simulation
const INITIAL_NODES = [
  // { id: 'A', label: 'A' },
  // { id: 'B', label: 'B' },
  // { id: 'C', label: 'C' },
  // { id: 'D', label: 'D' },
  // { id: 'E', label: 'E' },
];

const INITIAL_EDGES = [
  // { source: 'A', target: 'B' },
  // { source: 'B', target: 'C' },
  // { source: 'C', target: 'D' },
  // { source: 'D', target: 'E' },
  // { source: 'E', target: 'A' },
];

function App() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [highlightedNodeId, setHighlightedNodeId] = useState(null);
  const [visitedLog, setVisitedLog] = useState([]);

  function handleAdd({ type, name, source, target }) {
    if (type === 'vertex') {
      if (nodes.find((n) => n.id === name)) {
        alert('Node "' + name + '" already exists.');
        return;
      }
      setNodes((prev) => [...prev, { id: name, label: name }]);
    } else {
      if (!nodes.find((n) => n.id === source)) {
        alert('Source node "' + source + '" does not exist.');
        return;
      }
      if (!nodes.find((n) => n.id === target)) {
        alert('Target node "' + target + '" does not exist.');
        return;
      }
      setEdges((prev) => [...prev, { source, target, type }]);
    }
  }

  // DFS: receives a user-provided traversal order string
  function handleDFS(orderString) {
    if (!orderString) return;
    const order = orderString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setVisitedLog(order);
    animateTraversal(order);
  }

  // BFS: receives a starting node; records it (no search logic per requirements)
  function handleBFS(startNode) {
    if (!startNode) return;
    setVisitedLog([startNode]);
    animateTraversal([startNode]);
  }

  // Animate highlighting each node in sequence
  function animateTraversal(order) {
    setHighlightedNodeId(null);
    order.forEach((nodeId, i) => {
      setTimeout(() => {
        setHighlightedNodeId(nodeId);
        if (i === order.length - 1) {
          setTimeout(() => setHighlightedNodeId(null), 800);
        }
      }, i * 800);
    });
  }

  function handleClearAllVertices() {
    // TODO: Implement clear-all-vertices behavior.
  }

  function handleClearAllEdges() {
    // TODO: Implement clear-all-edges behavior.
  }

  function removeVertex(vertex) {
    const vertexId = (vertex || '').trim();
    if (!vertexId) return;

    setNodes((prev) => prev.filter((node) => node.id !== vertexId));
    setEdges((prev) =>
      prev.filter((edge) => edge.source !== vertexId && edge.target !== vertexId)
    );

    if (highlightedNodeId === vertexId) {
      setHighlightedNodeId(null);
    }

    setVisitedLog((prev) => prev.filter((id) => id !== vertexId));

    //iterate through each key (and its adjacency list)
    //if the current one is key, clear key from the list
    //otherwise iterate through the adjacency list and remove key if it's there\
    
  }

  return (
    <div style={styles.page}>
      <TopBar handleDFS={handleDFS} handleBFS={handleBFS} />

      <div style={styles.body}>
        {/* Left: Canvas */}
        <div style={styles.canvasArea}>
          <Canvas
            nodes={nodes}
            edges={edges}
            highlightedNodeId={highlightedNodeId}
            onClearAllVertices={handleClearAllVertices}
            onClearAllEdges={handleClearAllEdges}
          />
        </div>

        {/* Right: Controls */}
        <div style={styles.sidebar}>
          <Controls nodes={nodes} onAdd={handleAdd} />
        </div>
      </div>

      {/* Bottom: Results */}
      <Results visitedLog={visitedLog} />
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 900,
    margin: '40px auto',
    fontFamily: 'Arial, sans-serif',
    padding: '0 16px',
  },
  body: {
    display: 'flex',
    gap: 20,
    marginTop: 16,
    alignItems: 'flex-start',
  },
  canvasArea: {
    flex: 1,
  },
  sidebar: {
    flexShrink: 0,
    width: 240,
  },
};

export default App;
