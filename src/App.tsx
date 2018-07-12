import * as React from 'react';
import './App.css';

import Console from './components/console/console';
import Footer from './components/footer/footer';
import Header from './components/header/header';



class App extends React.Component {
  public render() {
    return (
      <div className="App">
      <Header/>
        <Console/>
      <Footer/>
      </div>
    );
  }
}

export default App;
