import React from 'react';
import { connect } from 'react-redux';
import { LoadingMessage } from '../common';
import { FunctionCode } from './function-code';

const fetchFunctionCode = (url) => {
  return fetch(url).then(response => response.text());
};

const onShowCode = (func) => {
  fetchFunctionCode(func.properties.script_href)
    .then(code => code.text())
    .then(text => console.log(text));
};

const templateFunctions = (functionList) => {
  return functionList
  .filter(func => func.name.split('/').pop().indexOf('template') === 0) 
  .map(func => {
    const {name} = func;
    const shortname = name.split('/').pop();

    return (
      <li key={shortname}>
        {shortname}
        <button onClick={() => onShowCode(func)}>show code</button>
        <FunctionCode />
      </li>
    )
  }); 
}

// component
const TemplateFunctionList = (state) => {
  const {functionList, loadingTemplateList} = state;
  const children = templateFunctions(functionList);
 
  if (loadingTemplateList) return (<LoadingMessage />);

  return (
    <ul id="templateList">
      {children}
    </ul>
  );
};

const mapStateToProps = (state) => {
  return {
    functionList: state.functionList,
    loadingTemplateList: state.loadingTemplateList
  }
};

export default connect(
  mapStateToProps
)(TemplateFunctionList)
