import React from 'react';
import { connect } from 'react-redux';
import { getShortName } from './../../utility';
import { LoadingMessage } from '../common';
import { FunctionCode } from './function-code';
import  CreateFunction  from './function-create';

const fetchFunctionCode = (url) => {
  return fetch(url).then(response => response.text());
};

// TODO: this is WIP due to permission issues
const showCode = (func) => {
  fetchFunctionCode(func.properties.script_href)
    .then(code => code.text())
    .then(text => console.log(text));
};


// component
// TODO: connect state to this component
const TemplateFunction = ({func, state}) => {
  const { name } = func;
  const { showCode, showCreate } = state;

  const shortname = getShortName(name);

  return (
    <li className="pl1 pr1 pt2 pb2 border-bottom border-silver">
      {shortname}
      <span className="right">
        <button className="pr2 pl2 mr1 rounded bg-aqua" onClick={() => showCode(func)}>show code</button>
        <button className="pr2 pl2 mr1 rounded bg-teal" onClick={() => showCreate(name)}>create</button>
      </span>
      <FunctionCode />
    </li>
  )
};

const templateFunctions = (state) => {
  const { functionList } = state;

  return functionList
    .filter(func => getShortName(func.name).indexOf('template') === 0)
    .map(func => {
      return (<TemplateFunction func={func} state={state} key={getShortName(func.name)} />);
    });
}

// component
const TemplateFunctionList = (state) => {
  const { functionList, loadingTemplateList, showCreate } = state;
  const children = templateFunctions(state);

  if (loadingTemplateList) return (<LoadingMessage />);

  return (
    <div>
      <ul id="templateList" className="list-reset max-width-3">
        {children}
      </ul>
      <CreateFunction />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    functionList: state.functionList,
    loadingTemplateList: state.loadingTemplateList
  }
};

const mapDispatchToProps = dispatch => {
  return {
    showCreate: (funcName, createFormShowStyle) => dispatch({
      type: "SHOW_CREATE_FORM",
      name: funcName,
    })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateFunctionList)
