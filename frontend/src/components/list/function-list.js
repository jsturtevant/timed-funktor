import React from 'react';
import { connect } from 'react-redux';
import { LoadingMessage } from '../common';
import { getShortName, getTimerFunctionSchedule, filterByTimerType } from '../../utility';
import {startFunction, stopFunction, deleteFunction } from './../../actions/function-list';
import cronstrue from 'cronstrue';

// styles
const getFunctionButtonClassNames = (disabled) => {
  const startButtonBg = disabled ? "bg-green" : "bg-silver";
  const stopButtonBg = disabled ? "bg-silver" : "bg-yellow";

  const startButtonClassName = `border-green bg-lighten-4 pl2 pr2 mr1 rounded ${startButtonBg}`;
  const stopButtonClassName = `border-yellow bg-lighten-4 pl2 pr2 mr1 rounded ${stopButtonBg}`;

  return { startButtonClassName, stopButtonClassName };
};

// component
// TODO: connect state to this component
const TimerFunction = ({func, state}) => {
  const { name, properties } = func;
  const { startFn, stopFn, deleteFn } = state;

  const shortname = getShortName(name);
  const schedule = getTimerFunctionSchedule(func);
  const humanSchedule = cronstrue.toString(schedule).toLowerCase();

  const disabled = properties.config.disabled;
  const { startButtonClassName, stopButtonClassName } = getFunctionButtonClassNames(disabled);

  return (
    <li className="pl1 pr1 pt2 pb2 border-bottom border-silver">
      <button onClick={() => deleteFn(name)} aria-label="delete" className="rounded mr1">x</button>
      {shortname}
      <span className="right">
        <span className="mr3 italic h5">{humanSchedule}</span>

        <button className={startButtonClassName} disabled={!disabled} onClick={() => startFn(shortname)}>start</button>
        <button className={stopButtonClassName} disabled={disabled} onClick={() => stopFn(shortname)}>stop</button>
      </span>
    </li>
  )
};

// component
const TimerFunctions = (state) => {
  const { functionList } = state;
  return filterByTimerType(functionList)
    .filter(func => getShortName(func.name).indexOf('template') !== 0)
    .map(func => {
      return <TimerFunction func={func} state={state} key={getShortName(func.name)} />
    });
}

// component
const TimerFunctionList = (state) => {
  // TODO: delete me
  console.log('state:', state);

  const children = TimerFunctions(state);

  if (state.loadingFunctionList) return (<LoadingMessage />);

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

