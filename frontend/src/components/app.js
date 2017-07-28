import React from 'react';
import TimerFunctionList  from './list/function-list';
import TemplateFunctionList from './list/template-list';
import {getFunctionListUrl} from './../constants'

export const getInitialData  = () => (dispatch) => {
  dispatch({ type: 'LOADING_FUNCTION_LIST' });
  dispatch({ type: 'LOADING_TEMPLATE_LIST' });

  return fetch(getFunctionListUrl)
    .then(response => response.json())
    .then(functionList => dispatch({ type: 'RECEIVE_FUNCTION_LIST', functionList }));
};

// component
export const App = () => {
  return (
    <div className="m1">
      <h1>Timed Funktors App</h1>

      <div className="mb4 mt3">
        <h2>Functions</h2>
        <TimerFunctionList  />
      </div>
      
      <div>
        <h2>Templates</h2>
        <TemplateFunctionList />
      </div>
    </div>
  )
};
