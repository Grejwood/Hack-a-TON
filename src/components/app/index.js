import React from 'react';
import {BrowserRouter} from "react-router-dom";

import AppRouter from './AppRouter';

const App = () => {
  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  );
}

export default App;