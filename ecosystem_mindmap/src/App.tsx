import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { MindMapBuilder } from './mindMapBuilder/MindMapBuilder';

const  App: React.FC = () => {
  return (
    <Router>
      <div className='container' >
        <Route path='/' exact component={MindMapBuilder} />
      </div>
    </Router>
  );
}

export default App;
