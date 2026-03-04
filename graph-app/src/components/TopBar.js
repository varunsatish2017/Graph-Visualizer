import React from 'react';

function TopBar({ handleDFS, handleBFS }) {
  function onPlayDFS() {
    const order = window.prompt('Enter Traversal Order (comma-separated node names, e.g. A,B,C):');
    if (order !== null) {
      handleDFS(order.trim());
    }
  }

  function onPlayBFS() {
    const startNode = window.prompt('Enter Starting Node for BFS:');
    if (startNode !== null) {
      handleBFS(startNode.trim());
    }
  }

  return (
    <div style={styles.bar}>
      <span style={styles.brand}>Graph Visualizer</span>
      <div style={styles.buttons}>
        <button onClick={onPlayDFS} style={{ ...styles.btn, background: '#6c63ff' }}>
          ▶ Play DFS
        </button>
        <button onClick={onPlayBFS} style={{ ...styles.btn, background: '#2da44e' }}>
          ▶ Play BFS
        </button>
      </div>
    </div>
  );
}

const styles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#1e1e2e',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '6px 6px 0 0',
  },
  brand: {
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  buttons: {
    display: 'flex',
    gap: 12,
  },
  btn: {
    padding: '8px 18px',
    border: 'none',
    borderRadius: 4,
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
    fontWeight: 600,
  },
};

export default TopBar;
