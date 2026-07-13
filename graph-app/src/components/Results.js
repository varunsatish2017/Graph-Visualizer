import React from 'react';

function Results({ visitedLog, traversalMode, dfsTableData, bfsTableData }) {
  const hasDfsTable = traversalMode === 'dfs' && dfsTableData && dfsTableData.length > 0;
  const hasBfsTable = traversalMode === 'bfs' && bfsTableData && bfsTableData.length > 0;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Traversal Table</h3>

      {visitedLog.length === 0 ? (
        <p style={styles.empty}>No traversal run yet. Press Play DFS or Play BFS.</p>
      ) : hasDfsTable ? (
        /* ── DFS Table ─────────────────────────────────────────────── */
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Node</th>
                <th style={styles.th}>Adjacency List / Neighbors</th>
                {/* TODO: implement these columns */}
                <th style={{ ...styles.th, ...styles.placeholderTh }}>Discover Time</th>
                <th style={{ ...styles.th, ...styles.placeholderTh }}>Finish Time</th>
                <th style={{ ...styles.th, ...styles.placeholderTh }}>Parent</th>
                <th style={{ ...styles.th, ...styles.placeholderTh }}>Color History</th>
              </tr>
            </thead>
            <tbody>
              {dfsTableData.map((row, i) => (
                <tr key={row.node} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  {/* ── Implemented columns ── */}
                  <td style={{ ...styles.td, ...styles.nodeCell }}>
                    <span style={styles.nodeBadge}>{row.node}</span>
                  </td>
                  <td style={styles.td}>
                    {row.neighbors}
                  </td>

                  {/* ── Placeholder columns – implement values here ── */}
                  <td style={{ ...styles.td, ...styles.placeholderTd }}>
                    {/* TODO: render row.discoverTime once implemented */}
                    {row.discoverTime !== null ? row.discoverTime : '—'}
                  </td>
                  <td style={{ ...styles.td, ...styles.placeholderTd }}>
                    {/* TODO: render row.finishTime once implemented */}
                    {row.finishTime !== null ? row.finishTime : '—'}
                  </td>
                  <td style={{ ...styles.td, ...styles.placeholderTd }}>
                    {/* TODO: render row.parent once implemented */}
                    {row.parent !== null ? row.parent : '—'}
                  </td>
                  <td style={{ ...styles.td, ...styles.placeholderTd }}>
                    {/* TODO: render row.colorHistory once implemented */}
                    {row.colorHistory && row.colorHistory.length > 0
                      ? row.colorHistory.join(' → ')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      ) : hasBfsTable ? (
        /* ── BFS Table ─────────────────────────────────────────────── */
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Node</th>
                <th style={styles.th}>Adjacency List / Neighbors</th>
                <th style={styles.th}>Distance</th>
                <th style={styles.th}>Parent</th>
                <th style={{ ...styles.th, ...styles.placeholderTh }}>Color History</th>
              </tr>
            </thead>
            <tbody>
              {bfsTableData.map((row, i) => (
                <tr key={row.node} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  {/* ── Implemented columns ── */}
                  <td style={{ ...styles.td, ...styles.nodeCell }}>
                    <span style={styles.nodeBadge}>{row.node}</span>
                  </td>
                  <td style={styles.td}>
                    {row.neighbors}
                  </td>

                  {/* ── Implemented columns ── */}
                  <td style={styles.td}>
                    {row.distance}
                  </td>
                  <td style={styles.td}>
                    {row.parent !== null ? row.parent : '—'}
                  </td>

                  {/* ── Placeholder column – implement value here ── */}
                  <td style={{ ...styles.td, ...styles.placeholderTd }}>
                    {/* TODO: render row.colorHistory once implemented */}
                    {row.colorHistory && row.colorHistory.length > 0
                      ? row.colorHistory.join(' → ')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      ) : (
        /* ── Fallback sequence view ─────────────────────────────── */
        <div style={styles.sequence}>
          {traversalMode && (
            <span
              style={{
                ...styles.modeLabel,
                color: traversalMode === 'bfs' ? '#2da44e' : '#6c63ff',
                borderColor: traversalMode === 'bfs' ? '#2da44e' : '#6c63ff',
              }}
            >
              {traversalMode.toUpperCase()}:
            </span>
          )}
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

  /* ── Table styles ───────────────────────────────────────── */
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
    fontFamily: 'Inter, Arial, sans-serif',
  },
  th: {
    textAlign: 'left',
    padding: '8px 12px',
    background: '#e6eaf8',
    color: '#444',
    fontWeight: 700,
    borderBottom: '2px solid #c5ceee',
    whiteSpace: 'nowrap',
  },
  /** Dimmed header style to signal "not yet implemented" */
  placeholderTh: {
    color: '#aaa',
    fontStyle: 'italic',
    fontWeight: 600,
  },
  rowEven: {
    background: '#f8faff',
  },
  rowOdd: {
    background: '#eef2fc',
  },
  td: {
    padding: '7px 12px',
    borderBottom: '1px solid #dde3f8',
    verticalAlign: 'middle',
    color: '#333',
  },
  /** Greyed-out placeholder cell */
  placeholderTd: {
    color: '#bbb',
    fontStyle: 'italic',
  },
  nodeCell: {
    whiteSpace: 'nowrap',
  },
  nodeBadge: {
    background: '#4a90d9',
    color: '#fff',
    padding: '2px 10px',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 12,
    display: 'inline-block',
  },

  /* ── Legacy sequence view (BFS / fallback) ──────────────── */
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
  modeLabel: {
    fontWeight: 700,
    fontSize: 13,
    fontFamily: 'Inter, Arial, sans-serif',
    border: '1px solid',
    borderRadius: 4,
    padding: '2px 7px',
    marginRight: 4,
    letterSpacing: 0.5,
  },
};

export default Results;
