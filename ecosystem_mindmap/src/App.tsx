import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { MindMapBuilder } from './mindMapBuilder/MindMapBuilder';
import { EditingCells } from './cells/EditingCells';

const  App: React.FC = () => {
  return (
    <Router>
      <div className='container' >
        <Route path='/' exact component={MindMapBuilder} />
        <Route path='/edit/:id' component={EditingCells} />
      </div>
    </Router>
  );
}

export default App;
