import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.test';

const root = ReactDOM.createRoot(document.getElementById('root')!);
// 1. 用DndProvider根节点包裹
root.render(
    <DndProvider backend={ HTML5Backend }>
        <App />
    </DndProvider>
);
