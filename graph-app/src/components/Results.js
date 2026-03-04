import React from 'react';

function Results({ visitedLog }) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Traversal Log</h3>
      {visitedLog.length === 0 ? (
        <p style={styles.empty}>No traversal run yet. Press Play DFS or Play BFS.</p>
      ) : (
        <div style={styles.sequence}>
          {visitedLog.map((node, index) => (
            <span key={index} style={styles.step}>
              {index > 0 && <span style={styles.arrow}>→</span>}
              <span style={styles.node}>{node}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '16px 24px',
    background: '#f0f4ff',
    border: '1px solid #dde3f8',
    borderRadius: 6,
    marginTop: 16,
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: 15,
    color: '#333',
  },
  empty: {
    color: '#888',
    fontSize: 13,
    margin: 0,
  },
  sequence: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  arrow: {
    color: '#999',
    fontSize: 14,
    marginRight: 2,
  },
  node: {
    background: '#4a90d9',
    color: '#fff',
    padding: '3px 10px',
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 600,
  },
};

export default Results;
