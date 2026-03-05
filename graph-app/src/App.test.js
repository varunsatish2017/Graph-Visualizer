import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Graph Visualizer title', () => {
  render(<App />);
  expect(screen.getByText('Graph Visualizer')).toBeInTheDocument();
});

test('renders Play DFS and Play BFS buttons', () => {
  render(<App />);
  expect(screen.getByText('▶ Play DFS')).toBeInTheDocument();
  expect(screen.getByText('▶ Play BFS')).toBeInTheDocument();
});

test('renders Controls with action dropdown', () => {
  render(<App />);
  expect(screen.getByLabelText('Action')).toBeInTheDocument();
});

test('shows Node Name input when Add Vertices (comma separated) is selected', () => {
  render(<App />);
  const select = screen.getByLabelText('Action');
  fireEvent.change(select, { target: { value: 'Add Vertices (comma separated)' } });
  expect(screen.getByLabelText('Node Name')).toBeInTheDocument();
});

test('shows Source and Target inputs when Add Edge is selected', () => {
  render(<App />);
  const select = screen.getByLabelText('Action');
  fireEvent.change(select, { target: { value: 'Add Edge' } });
  expect(screen.getByLabelText('Source')).toBeInTheDocument();
  expect(screen.getByLabelText('Target')).toBeInTheDocument();
});

test('renders Enter button', () => {
  render(<App />);
  expect(screen.getByText('Enter')).toBeInTheDocument();
});

test('renders Traversal Log section', () => {
  render(<App />);
  expect(screen.getByText('Traversal Log')).toBeInTheDocument();
});

test('shows empty traversal message initially', () => {
  render(<App />);
  expect(screen.getByText('No traversal run yet. Press Play DFS or Play BFS.')).toBeInTheDocument();
});
