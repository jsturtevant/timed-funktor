import React from 'react';
import { connect } from 'react-redux';
import { LoadingMessage } from '../common';

const filterByTimerType = (functionList) => {
  return functionList.filter(func => {
      if (!func.properties.config.bindings){
        return false;
      }
      const filterTimerBindings = func.properties.config.bindings.filter(binding => {
        return binding.type === 'timerTrigger';
      });
      const containsTimerBinding = filterTimerBindings.length > 0;
      return containsTimerBinding;
    });
};

const getTimerFunctionSchedule = (func) => {
  const timerBinding = func.properties.config.bindings.filter(binding => binding.type === 'timerTrigger');
  return timerBinding.pop().schedule;
};

const timerFunctions = (functionList) => {
  return filterByTimerType(functionList)
   .filter(func => func.name.split('/').pop().indexOf('template') !== 0) 
   .map(func => {
      const {name} = func;
      const shortname = name.split('/').pop();
      const schedule = getTimerFunctionSchedule(func);

      return (
        <li key={shortname}>
          {shortname} - {schedule}
          <button>start</button>
          <button>stop</button>
          <button>delete</button>   
        </li>
      )
  }); 
}

// component
const TimerFunctionList = (state) => {
  console.log('state:', state);
  const {functionList, loadingFunctionList} = state;
  const children = timerFunctions(functionList);
 
  if (loadingFunctionList) return (<LoadingMessage />);

  return (
    <ul id="functionList">
      {children}
    </ul>
  );
};

const mapStateToProps = (state) => {
  return {
    functionList: state.functionList,
    loadingFunctionList: state.loadingFunctionList
  }
};

export default connect(
  mapStateToProps
)(TimerFunctionList)
