import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Maengelmelder } from './features/maengelmelder/Maengelmelder';
import Image from 'react-bootstrap/Image';

function App() {

  return (
    <div className="App" style={{ backgroundColor: 'ghostwhite', minHeight: '100vh', minWidth: '100vw' }}>
      <header className="App-header">
        <Image src="https://static.werdenktwas.de/domain/32/logo.png"
          alt='Mängelmelder'
          style={{ marginTop: 6 }} />
        <Maengelmelder />
      </header>
    </div>
  );
}

export default App;
