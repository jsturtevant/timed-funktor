import React from 'react';
import { connect } from 'react-redux';
import { LoadingMessage } from '../common';
import { deleteFunctionUrl } from './../../constants'

const filterByTimerType = (functionList) => {
  return functionList.filter(func => {
    if (!func.properties.config.bindings) {
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

const deleteFunction = (funcName) => (dispatch, getState) => {
  console.log(dispatch, getState);
  const shortname = funcName.split('/').pop();
  fetch(`${deleteFunctionUrl}/${shortname}`, {
    method: 'delete'
  })
    .then(response => {
      if (response.ok) {
        dispatch({ type: "DELETE_FUNCTION", name: funcName })
      }
    });
}

const timerFunctions = (functionList, deleteFn) => {
  return filterByTimerType(functionList)
    .filter(func => func.name.split('/').pop().indexOf('template') !== 0)
    .map(func => {
      const { name } = func;
      const shortname = name.split('/').pop();
      const schedule = getTimerFunctionSchedule(func);

      return (
        <li className="pl1 pr1 pt2 pb2 border-bottom border-silver" key={shortname}>
          <button onClick={() => deleteFn(name)} aria-label="delete" className="rounded mr1">x</button>
          {shortname}
          <span className="right">
            <span className="mr3"> {schedule}</span>
            <button className="border-green bg-green bg-lighten-4 pr2 pl2 mr1 rounded">start</button>
            <button className="border-yellow bg-yellow bg-lighten-4 pr2 pl2 mr1 rounded">stop</button>
          </span>
        </li>
      )
    });
}

// component
const TimerFunctionList = (state) => {
  console.log('state:', state);
  const { functionList, loadingFunctionList, deleteFn } = state;
  const children = timerFunctions(functionList, deleteFn);

  if (loadingFunctionList) return (<LoadingMessage />);

  return (
    <ul id="functionList" className="list-reset max-width-3">
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

const mapDispatchToProps = dispatch =>{
  return {
    deleteFn: (funcName) => dispatch(deleteFunction(funcName))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimerFunctionList)
