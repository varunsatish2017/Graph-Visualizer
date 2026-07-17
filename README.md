# Graph-Visualizer
Intended to help CSE 101 students understand BFS and DFS traversal for the programming assignments.

**Ideas to implement:**
- Add a clear button to top right of canvas. Will send an alert before clearing all nodes on canvas.

- To the actions dropdown, add Remove Node(s) option. Will allow users to delete selected nodes via comma separated values.
    - Bonus: Allow highlight + delete key within the canvas itself

- Bottom of the page will display a log of traversals, along with a table showing discover, visit, and finish times (populated in real time during traversal)

- AI sidebar chat to allow user to ask questions about the graph (visual image of graph, graph nodes, edges/arcs, BFS + DFS traversals, etc. attached *beforehand*)

- Login system (Firebase or AWS amplify) + Document database storage of user's graphs

- Allow a Graph to be shared via link

- Host website using Vercel or Github

**Next Steps**
- White (for the unvisited), Gray (for the visited), Black (for the visited + completed) node coloring during traversal
- Replace Traversal Log with a table displaying discover and finish times for the nodes

## Sample UI

![Image](https://github.com/varunsatish2017/Graph-Visualizer/blob/main/graphUI.png)
