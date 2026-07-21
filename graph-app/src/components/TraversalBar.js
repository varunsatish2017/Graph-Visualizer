import React from 'react';

// Color palette per traversal mode
const THEME = {
  dfs: {
    accent: '#6c63ff',
    accentLight: 'rgba(108, 99, 255, 0.25)',
    accentBorder: 'rgba(108, 99, 255, 0.45)',
    accentGlow: 'rgba(108, 99, 255, 0.7)',
    accentGlowFull: 'rgba(108, 99, 255, 1)',
    pillActive: '#6c63ff',
    pillActiveBorder: '#8b85ff',
    thumbDisabled: '#444',
  },
  bfs: {
    accent: '#2da44e',
    accentLight: 'rgba(45, 164, 78, 0.25)',
    accentBorder: 'rgba(45, 164, 78, 0.45)',
    accentGlow: 'rgba(45, 164, 78, 0.7)',
    accentGlowFull: 'rgba(45, 164, 78, 1)',
    pillActive: '#2da44e',
    pillActiveBorder: '#4dc76e',
    thumbDisabled: '#444',
  },
};

/**
 * TraversalBar – shows a slidable progress bar above the canvas.
 *
 * Props:
 *   traversalList  – array of node IDs in traversal/event order ([] when idle)
 *   currentStep    – index of the currently highlighted step (0-based, or -1 when idle)
 *   onStepChange   – callback(newStepIndex) fired when the user drags the slider
 *   mode           – 'dfs' | 'bfs' | null  (controls color scheme)
 *   dfsEvents      – array of { node, type: 'discover'|'finish', time } (DFS only)
 */
export default function TraversalBar({ traversalList, currentStep, onStepChange, mode, dfsEvents }) {
  const theme = THEME[mode] ?? THEME.dfs;
  const total = traversalList.length;
  const isActive = total > 0;

  // Fraction for the custom gradient fill (0 → 1)
  const fraction = isActive && currentStep >= 0 ? currentStep / Math.max(total - 1, 1) : 0;
  const pct = Math.round(fraction * 100);

  // Current event info for DFS
  const currentEvent = mode === 'dfs' && dfsEvents && dfsEvents[currentStep];
  const eventTypeLabel = currentEvent
    ? (currentEvent.type === 'discover' ? '→ GRAY (discovered)' : '→ BLACK (finished)')
    : '';

  return (
    <div style={styles.wrapper}>
      {/* Header row */}
      <div style={styles.header}>
        <span style={styles.label}>
          {isActive
            ? `${mode ? mode.toUpperCase() + ' ' : ''}Step ${currentStep + 1} / ${total}: `
            : 'Run BFS or DFS to see traversal progress'}
          {isActive && (
            <>
              <span style={{ ...styles.nodeName, color: theme.accent }}>{traversalList[currentStep]}</span>
              {eventTypeLabel && (
                <span style={styles.eventLabel}>{eventTypeLabel}</span>
              )}
            </>
          )}
        </span>

        {/* Node pill list */}
        {isActive && (
          <div style={styles.pills}>
            {traversalList.map((id, idx) => {
              const evt = mode === 'dfs' && dfsEvents ? dfsEvents[idx] : null;
              const isDiscover = evt && evt.type === 'discover';
              const isFinish   = evt && evt.type === 'finish';
              const isCurrent  = idx === currentStep;
              const isPast     = idx < currentStep;

              let pillStyle = { ...styles.pill };
              if (isCurrent) {
                pillStyle = {
                  ...pillStyle,
                  background: isFinish ? '#1a1a1a' : theme.pillActive,
                  border: `1px solid ${isFinish ? '#555' : theme.pillActiveBorder}`,
                  color: '#fff',
                  boxShadow: `0 0 8px ${theme.accentGlow}`,
                  transform: 'scale(1.1)',
                };
              } else if (isPast) {
                // Past discover events: gray tint; past finish events: dark
                const pastEvt = mode === 'dfs' && dfsEvents ? dfsEvents[idx] : null;
                pillStyle = {
                  ...pillStyle,
                  background: pastEvt?.type === 'finish' ? 'rgba(26,26,26,0.8)' : theme.accentLight,
                  border: `1px solid ${pastEvt?.type === 'finish' ? '#555' : theme.accentBorder}`,
                  color: pastEvt?.type === 'finish' ? '#ccc' : '#b0aaff',
                };
              }

              return (
                <button
                  key={idx}
                  onClick={() => onStepChange(idx)}
                  style={pillStyle}
                  title={`Step ${idx + 1}: ${id} ${evt ? (evt.type === 'discover' ? '(discovered → gray)' : '(finished → black)') : ''}`}
                >
                  {id}
                  {evt && (
                    <span style={{
                      ...styles.badge,
                      background: isDiscover ? '#666' : '#111',
                      color: '#fff',
                    }}>
                      {isDiscover ? 'D' : 'F'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Slider track */}
      <div style={styles.trackWrapper}>
        <input
          type="range"
          min={0}
          max={isActive ? total - 1 : 0}
          value={isActive && currentStep >= 0 ? currentStep : 0}
          disabled={!isActive}
          onChange={(e) => onStepChange(Number(e.target.value))}
          style={{
            ...styles.slider,
            '--slider-accent': theme.accent,
            // Chromium progress fill via background gradient
            background: isActive
              ? `linear-gradient(to right, ${theme.accent} ${pct}%, #2a2a3d ${pct}%)`
              : '#2a2a3d',
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    border: '1px solid rgba(80, 80, 120, 0.3)',
    borderRadius: 12,
    padding: '12px 16px',
    marginBottom: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  label: {
    color: '#a0a0c0',
    fontSize: 13,
    fontFamily: 'Inter, Arial, sans-serif',
    whiteSpace: 'nowrap',
  },
  nodeName: {
    fontWeight: 700,
    fontSize: 14,
  },
  eventLabel: {
    marginLeft: 6,
    fontSize: 11,
    color: '#a0a0c0',
    fontFamily: 'Inter, monospace',
    fontStyle: 'italic',
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
    flex: 1,
  },
  pill: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 20,
    color: '#c0c0d8',
    fontSize: 11,
    fontFamily: 'Inter, monospace',
    padding: '2px 9px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    lineHeight: 1.6,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 700,
    padding: '1px 4px',
    letterSpacing: '0.03em',
  },
  pillActive: {},
  pillVisited: {},
  trackWrapper: {
    width: '100%',
  },
  slider: {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '100%',
    height: 6,
    borderRadius: 3,
    outline: 'none',
    cursor: 'pointer',
    transition: 'background 0.1s ease',
    // Thumb styling via CSS custom properties (works cross-browser via index.css)
  },
};
