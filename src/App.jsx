import React from 'react';
import Schedule from './screens/Schedule/Schedule';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>OrarioDoc</h1>
        <p className="app-subtitle">Gestione Orari Docenti</p>
      </header>
      <main className="app-main">
        <Schedule />
      </main>
    </div>
  );
}

export default App;
