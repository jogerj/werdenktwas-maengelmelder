
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Image from 'react-bootstrap/Image';
import './App.css';
import { Maengelmelder } from './features/maengelmelder/Maengelmelder';


function App(): ReturnType<React.FC> {

  return (
    <div className="App" style={{ backgroundColor: '#e6e6e6', minHeight: '100%', minWidth: '100%' }}>
      <header className="App-header">
        <Image src="https://static.werdenktwas.de/domain/32/logo.png"
          alt='Mängelmelder'
          style={{ marginTop: 6 }} />
      </header>
      <div className="App-body">
        <Maengelmelder />
      </div>
    </div>
  );
}

export default App;
