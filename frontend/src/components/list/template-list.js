import React from 'react';
import { connect } from 'react-redux';
import { LoadingMessage } from '../common';
import { FunctionCode } from './function-code';
import { CreateFunction } from './function-create';

const fetchFunctionCode = (url) => {
  return fetch(url).then(response => response.text());
};

const onShowCode = (func) => {
  fetchFunctionCode(func.properties.script_href)
    .then(code => code.text())
    .then(text => console.log(text));
};

const templateFunctions = (functionList, showCreate, toggleShowCreate) => {
  return functionList
    .filter(func => func.name.split('/').pop().indexOf('template') === 0)
    .map(func => {
      const { name } = func;
      const shortname = name.split('/').pop();

      return (
        <li key={shortname}>
          {shortname}
          <button onClick={() => onShowCode(func)}>show code</button>
          <button onClick={() => showCreate(func.name, toggleShowCreate)}>create</button>
          <FunctionCode />
        </li>
      )
    });
}

// component
const TemplateFunctionList = (state) => {
  const { functionList, loadingTemplateList, showCreate, toggleShowStyle } = state;
  const children = templateFunctions(functionList, showCreate, toggleShowCreate);

  if (loadingTemplateList) return (<LoadingMessage />);

  return (
    <div>
      <ul id="templateList">
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
    showCreate: (funcName, toggleShowCreate) => dispatch({
      type: "SHOW_CREATE_FORM",
      name: funcName,
      show: !toggleShowCreate
    })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateFunctionList)
