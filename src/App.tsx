import * as React from 'react';

import 'weather-icons/sass/weather-icons.scss';

import styles from './App.scss';

import Header from './components/header/header';
import Main from './components/main/main';
import Footer from './components/footer/footer';



class App extends React.Component {
  public render() {
    return (
      <div className={styles['App']}>
        <Header/>
        <Main />
        {/* <Footer/> */}
      </div>
    );
  }
}

export default App;
