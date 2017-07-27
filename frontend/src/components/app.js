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
    <div>
      <h1>Timed Funktors App</h1>
      <h2>Functions</h2>
      <TimerFunctionList  />

      <h2>Templates</h2>
      <TemplateFunctionList />
    </div>
  )
};
