import React, { Component } from 'react';
import './App.css';
import LinkOpener from './components/link_opener';
import { BrowserRouter, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App container">
          <br />
          <h4>
              Open multiple links with one click
          </h4>
          <BrowserRouter>
              <div>
                  <Route path='/links/' component={LinkOpener} />
              </div>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;
