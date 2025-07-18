"use client";
import React from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
  MarkerType,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

// --- Initial Nodes Definition (Horizontal Layout) ---
// The positions of the nodes have been adjusted for a horizontal flow.


// --- Main App Component ---
export default function FlowChart({researchData,hypothesis,idea,overview}) {
  // `useNodesState` and `useEdgesState` are hooks to make the nodes and edges interactive.
 
  const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Type:'+overview?.research_type },
    position: { x: 50, y: 200 },
    style: { background: '#2f855a', color: 'white', borderColor: '#2f855a' },
  },
  {
    id: '2',
    data: { label: overview.study_design.data_source.type.toLowerCase()==="secondary"?"Secondary":"Primary"},
    position: { x: 250, y: 200 },
    style: { background: '#b7791f', color: 'white', borderColor: '#b7791f' },
  },
  {
    id: '3',
    data: { label: researchData?.data_platforms?.map((dat)=>{
      return   dat.name
    })?.join(',') }, 
    position: { x: 450, y: 200 },
    style: { background: '#2c5282', color: 'white', borderColor: '#2c5282' },
  },
  {
    id: '4',
    data: { label: 'Show Login Form' },
    position: { x: 250, y: 350 },
    style: { background: '#2c5282', color: 'white', borderColor: '#2c5282' },
  },
  {
    id: '5',
    data: { label: 'User submits credentials' },
    position: { x: 450, y: 350 },
    style: { background: '#b7791f', color: 'white', borderColor: '#b7791f' },
  },
  {
    id: '6',
    data: { label: 'Show error message' },
    position: { x: 450, y: 450 },
    style: { background: '#c53030', color: 'white', borderColor: '#c53030' },
  },
  {
    id: '7',
    type: 'output',
    data: { label: 'End' },
    position: { x: 650, y: 200 },
    style: { background: '#718096', color: 'white', borderColor: '#718096' },
  },
];


const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: '2', target: '3', label: 'Yes', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-4', source: '2', target: '4', label: 'No', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4-5', source: '4', target: '5', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5-3', source: '5', target: '3', label: 'Valid', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5-6', source: '5', target: '6', label: 'Invalid', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6-4', source: '6', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-7', source: '3', target: '7', markerEnd: { type: MarkerType.ArrowClosed } },
];
 const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-8 font-sans">
      <div className="w-full max-w-6xl text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-sky-400">React Flow Authentication Chart</h1>
        <p className="text-lg text-gray-400">
          An interactive flowchart built with React Flow, showing a user authentication process.
        </p>
      </div>
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[600px] border border-gray-700">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView // This makes the flow fit the viewport on initial load
        >
          {/* Helper components for a better user experience */}
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
