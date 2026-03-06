import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const NODE_RADIUS = 20;
const NODE_COLOR = '#4a90d9';
const HIGHLIGHTED_COLOR = 'gold';
const EDGE_COLOR = '#555';
const ARC_COLOR = '#d94a4a';
const TEXT_COLOR = '#fff';

// Helper function to draw arrow head
function drawArrowHead(ctx, fromX, fromY, toX, toY, headSize = 8) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headSize * Math.cos(angle - Math.PI / 6),
    toY - headSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headSize * Math.cos(angle + Math.PI / 6),
    toY - headSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

function drawGraph(ctx, simNodes, edges, highlightedNodeId, width, height) {
  ctx.clearRect(0, 0, width, height);

  // Build a lookup for simulation node positions
  const posMap = {};
  simNodes.forEach((n) => { posMap[n.id] = { x: n.x, y: n.y }; });

  // Draw edges and arcs
  edges.forEach(({ source, target, type }) => {
    const src = posMap[source];
    const tgt = posMap[target];
    if (!src || !tgt) return;
    
    // Calculate shortened line to stop at node edge, not center
    const dx = tgt.x - src.x;
    const dy = tgt.y - src.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return;
    
    const unitX = dx / distance;
    const unitY = dy / distance;
    
    // Adjust start and end points to node edges
    const startX = src.x + unitX * NODE_RADIUS;
    const startY = src.y + unitY * NODE_RADIUS;
    const endX = tgt.x - unitX * NODE_RADIUS;
    const endY = tgt.y - unitY * NODE_RADIUS;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    
    if (type === 'arc') {
      ctx.strokeStyle = ARC_COLOR;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw arrow head for arcs
      ctx.strokeStyle = ARC_COLOR;
      ctx.lineWidth = 2;
      drawArrowHead(ctx, startX, startY, endX, endY);
    } else {
      // Default to edge (line)
      ctx.strokeStyle = EDGE_COLOR;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // Draw nodes
  simNodes.forEach((node) => {
    const isHighlighted = node.id === highlightedNodeId;
    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = isHighlighted ? HIGHLIGHTED_COLOR : NODE_COLOR;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = isHighlighted ? '#333' : TEXT_COLOR;
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, node.x, node.y);
  });
}

function Canvas({ nodes, edges, highlightedNodeId }) {
  const canvasRef = useRef(null);
  const simRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Stop previous simulation
    if (simRef.current) simRef.current.stop();

    // Create D3 force simulation nodes (clone so D3 can mutate x/y)
    const simNodes = nodes.map((n) => ({ ...n }));
    const simEdges = edges.map((e) => ({ ...e }));

    const simulation = d3
      .forceSimulation(simNodes)
      .force('link', d3.forceLink(simEdges).id((d) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(NODE_RADIUS + 10));

    simRef.current = simulation;

    simulation.on('tick', () => {
      drawGraph(ctx, simNodes, edges, highlightedNodeId, width, height);
    });

    // Run and stop after convergence
    simulation.on('end', () => {
      drawGraph(ctx, simNodes, edges, highlightedNodeId, width, height);
    });

    return () => simulation.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  // Redraw immediately when only highlighting changes (no re-simulation needed)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !simRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGraph(
      ctx,
      simRef.current.nodes(),
      edges,
      highlightedNodeId,
      canvas.width,
      canvas.height
    );
  }, [highlightedNodeId, edges]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={500}
      style={{ border: '1px solid #ccc', background: '#fafafa', borderRadius: 6 }}
      aria-label="Graph canvas"
    />
  );
}

export default Canvas;
