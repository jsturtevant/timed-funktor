import React from 'react';
import { connect } from 'react-redux';
import { LoadingMessage } from '../common';
import { deleteFunctionUrl, enableFunctionUrl, disableFunctionUrl } from './../../constants';
import cronstrue from 'cronstrue';

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

const startFunction = (funcName) => (dispatch, getState) => {
  const shortname = funcName.split('/').pop();
  console.log(shortname);

  fetch(enableFunctionUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      funcName: shortname
    }
  })
  .then(response => {
    if (response.ok) {
      dispatch({ type: "START_FUNCTION", name: funcName});
    }
  });

};

const stopFunction = (funcName) => (dispatch, getState) => {
  const shortname = funcName.split('/').pop();

  console.log(shortname);
  fetch(disableFunctionUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      funcName: shortname
    }
  })
  .then(response => {
    if (response.ok) {
      dispatch({ type: "STOP_FUNCTION", name: funcName});
    }
  });

};


const deleteFunction = (funcName) => (dispatch, getState) => {
  console.log(dispatch, getState);
  const shortname = funcName.split('/').pop();
  fetch(`${deleteFunctionUrl}/${shortname}`, {
    method: 'delete'
  })
    .then(response => {
      if (response.ok) {
        dispatch({ type: "DELETE_FUNCTION", funcName })
      }
    });
}

const timerFunctions = (functionList, deleteFn, startFn, stopFn) => {
  return filterByTimerType(functionList)
    .filter(func => func.name.split('/').pop().indexOf('template') !== 0)
    .map(func => {
      const { name } = func;
      const shortname = name.split('/').pop();
      const schedule = getTimerFunctionSchedule(func);
      const humanSchedule = cronstrue.toString(schedule).toLowerCase();
      const disabled = func.properties.config.disabled;
      const enabledClassName = disabled ? "bg-silver" : "bg-yellow";
      const disabledClassName = disabled ? "bg-green" : "bg-silver";

      const startButtonClassName = "border-green bg-lighten-4 pl2 pr2 mr1 rounded " + disabledClassName;
      const stopButtonClassName = "border-yellow bg-lighten-4 pl2 pr2 mr1 rounded " + enabledClassName;

      return (
        <li className="pl1 pr1 pt2 pb2 border-bottom border-silver" key={shortname}>
          <button onClick={() => deleteFn(name)} aria-label="delete" className="rounded mr1">x</button>
          {shortname}
          <span className="right">
            <span className="mr3 italic h5"> {humanSchedule}</span>

            <button className={startButtonClassName} disabled={!disabled} onClick={() => startFn(shortname)}>start</button>
            <button className={stopButtonClassName} disabled={disabled} onClick={() => stopFn(shortname)}>stop</button>
          </span>
        </li>
      )
    });
}

// component
const TimerFunctionList = (state) => {
  console.log('state:', state);
  const { functionList, loadingFunctionList, deleteFn, startFn, stopFn } = state;
  const children = timerFunctions(functionList, deleteFn, startFn, stopFn);

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
    deleteFn: (funcName) => dispatch(deleteFunction(funcName)),
    startFn: (funcName) => dispatch(startFunction(funcName)),
    stopFn: (funcName) => dispatch(stopFunction(funcName))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimerFunctionList)
