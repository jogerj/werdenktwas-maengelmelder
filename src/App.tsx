import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Maengelmelder } from './features/maengelmelder/Maengelmelder';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mängelmelder</h1>
        <Maengelmelder />
      </header>
    </div>
  );
}

export default App;
