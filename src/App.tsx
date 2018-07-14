import * as React from 'react';

import 'weather-icons/sass/weather-icons.scss';

import './App.scss';


import Header from './components/header/header';
import Console from './components/console/console';
import Main from './components/main/main';
import Footer from './components/footer/footer';



class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header/>
        <Console/>
        <Main  />
        <Footer/>
      </div>
    );
  }
}

export default App;
