import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Handler from './Handler';
import {
  Home,
  Word
} from './Parts';

export default class App extends Component {

  render() {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Handler />}>
            <Route path="word" element={<Word />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    );
  }
}