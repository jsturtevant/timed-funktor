import React from 'react';
import { connect } from 'react-redux';
import { LoadingMessage } from '../common';
import { FunctionCode } from './function-code';
import  CreateFunction  from './function-create';

const fetchFunctionCode = (url) => {
  return fetch(url).then(response => response.text());
};

const onShowCode = (func) => {
  fetchFunctionCode(func.properties.script_href)
    .then(code => code.text())
    .then(text => console.log(text));
};

const templateFunctions = (functionList, showCreate) => {
  return functionList
    .filter(func => func.name.split('/').pop().indexOf('template') === 0)
    .map(func => {
      const { name } = func;
      const shortname = name.split('/').pop();

      return (
        <li className="pl1 pr1 pt2 pb2 border-bottom border-silver" key={shortname}>
          {shortname}
          <span className="right">
            <button className="pr2 pl2 mr1 rounded bg-aqua" onClick={() => onShowCode(func)}>show code</button>
            <button className="pr2 pl2 mr1 rounded bg-teal" onClick={() => showCreate(name)}>create</button>
          </span>
          <FunctionCode />
        </li>
      )
    });
}

// component
const TemplateFunctionList = (state) => {
  const { functionList, loadingTemplateList, showCreate } = state;
  const children = templateFunctions(functionList, showCreate);

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
