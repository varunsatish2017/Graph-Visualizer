import React, { useRef, useState } from 'react';
import Canvas from './components/Canvas';
import Controls from './components/Controls';
import TopBar from './components/TopBar';
import Results from './components/Results';
import TraversalBar from './components/TraversalBar';
import './App.css';
import Graph from './components/Graph';

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
  const adjacencyList = useRef({});
  const [highlightedNodeId, setHighlightedNodeId] = useState(null);
  const [visitedLog, setVisitedLog] = useState([]);
  const [traversalList, setTraversalList] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [traversalMode, setTraversalMode] = useState(null); // 'dfs' | 'bfs' | null
  const animationTimers = useRef([]);

  function handleAdd({ type, name, source, target }) {
    if (type === 'vertex') {
      if (nodes.find((n) => n.id === name)) {
        alert('Node "' + name + '" already exists.');
        return;
      }
      setNodes((prev) => [...prev, { id: name, label: name }]);
      if (!adjacencyList.current[name]) {
        adjacencyList.current[name] = [];
      }
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
      const next = adjacencyList.current;
      next[source] = next[source] || [];
      next[target] = next[target] || [];

      if (type === 'arc') {
        if (!next[source].includes(target)) {
          next[source].push(target);
        }
      } else {
        if (!next[source].includes(target)) {
          next[source].push(target);
        }
        if (!next[target].includes(source)) {
          next[target].push(source);
        }
      }
    }
    console.log("Adjacency list: ", adjacencyList);
  }

  // DFS: receives a user-provided traversal order string
  function handleDFS(orderString) {
    if (!orderString) return;
    const order = orderString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    console.log("Order: " + order);
    const graph = new Graph(adjacencyList.current);
    for (const node of order) {
      const dfsTrav = graph.dfs(node);
      setVisitedLog(dfsTrav);
      setTraversalList(dfsTrav);
      setCurrentStep(-1);
      setTraversalMode('dfs');
      animateTraversal(dfsTrav);
    }
  }

  // BFS: receives a starting node; records it (no search logic per requirements)
  function handleBFS(startNode) {
    if (!startNode) return;
    
    const graph = new Graph(adjacencyList.current);
    const bfsTrav = graph.bfs(startNode);

    console.log("BFS traversal: " + bfsTrav);

    setVisitedLog(bfsTrav);
    setTraversalList(bfsTrav);
    setCurrentStep(-1);
    setTraversalMode('bfs');
    animateTraversal(bfsTrav);
  }

  // Animate highlighting each node in sequence
  function animateTraversal(order) {
    // Cancel any in-flight animation
    animationTimers.current.forEach(clearTimeout);
    animationTimers.current = [];

    setHighlightedNodeId(null);
    setCurrentStep(-1);

    order.forEach((nodeId, i) => {
      const t = setTimeout(() => {
        setHighlightedNodeId(nodeId);
        setCurrentStep(i);
        if (i === order.length - 1) {
          setTimeout(() => setHighlightedNodeId(null), 800);
        }
      }, i * 800);
      animationTimers.current.push(t);
    });
  }

  // Manual scrub: user drags the slider to a specific step
  function handleStepChange(stepIndex) {
    // Cancel auto-play so manual control takes over immediately
    animationTimers.current.forEach(clearTimeout);
    animationTimers.current = [];

    setCurrentStep(stepIndex);
    setHighlightedNodeId(traversalList[stepIndex] ?? null);
  }

  function handleClearAllVertices() {
    animationTimers.current.forEach(clearTimeout);
    animationTimers.current = [];
    setNodes([]);
    setEdges([]);
    setHighlightedNodeId(null);
    setVisitedLog([]);
    setTraversalList([]);
    setCurrentStep(-1);
    setTraversalMode(null);
    adjacencyList.current = {};

    console.log("Adjacency list (after cleared): ", adjacencyList);
  }

  function handleClearAllEdges() {
    setEdges([]);
    adjacencyList.current = Object.keys(adjacencyList.current).reduce((acc, vertex) => {
      acc[vertex] = [];
      return acc;
    }, {});
    console.log("Adjacency list (after cleared): ", adjacencyList);
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
    delete adjacencyList.current[vertexId];
    Object.keys(adjacencyList.current).forEach((key) => {
      adjacencyList.current[key] = (adjacencyList.current[key] || []).filter(
        (neighbor) => neighbor !== vertexId
      );
    });
  }

  function removeEdge(deleteEdgeSource, deleteEdgeTarget) {
    if (!deleteEdgeSource || !deleteEdgeTarget) return;
    console.log('Deleting edge/arc between', deleteEdgeSource, 'and', deleteEdgeTarget);

    // TODO: Remove the edge/arc from the adjacency list here.
    // Go to "deleteEdgeSource"s adj list and remove "deleteEdgeTarget"

    adjacencyList.current[deleteEdgeSource] = 
      adjacencyList.current[deleteEdgeSource].filter(id => id !== deleteEdgeTarget);

    // From "deleteEdgeTarget"s adj list, remove "deleteEdgeSource" if present
    adjacencyList.current[deleteEdgeTarget] = 
      adjacencyList.current[deleteEdgeTarget].filter(id => id !== deleteEdgeSource);

    setEdges((prev) =>
      prev.filter((edge) => (edge.source !== deleteEdgeSource || edge.target !== deleteEdgeTarget))
    );
  }

  return (
    <div style={styles.page}>
      <TopBar handleDFS={handleDFS} handleBFS={handleBFS} />

      <div style={styles.body}>
        {/* Left: Canvas */}
        <div style={styles.canvasArea}>
          <TraversalBar
            traversalList={traversalList}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            mode={traversalMode}
          />
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
          <Controls nodes={nodes} edges={edges} onAdd={handleAdd} onDeleteVertex={removeVertex} onDeleteEdge={removeEdge} adjacencyList={adjacencyList} />
        </div>
      </div>

      {/* Bottom: Results */}
      <Results visitedLog={visitedLog} traversalMode={traversalMode} />
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
