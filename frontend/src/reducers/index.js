const initialState = {
  functionList: [],
  loadingFunctionList: false,
  loadingTemplateList: false,
  createFormShowStyle: 'none',
  currentFunctionTemplateName:'' 
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOADING_FUNCTION_LIST':
      return Object.assign({}, state, { loadingFunctionList: true });

    case 'RECEIVE_FUNCTION_LIST':
      let { functionList } = action;

      return Object.assign({}, state, { functionList, loadingFunctionList: false, loadingTemplateList: false });

    case 'LOADING_TEMPLATE_LIST':
      return Object.assign({}, state, { loadingTemplateList: true });

    case 'DELETE_FUNCTION':
      let newFunctionList = state.functionList.filter(x => x.name != action.funcName);

      return Object.assign({}, state, { functionList: newFunctionList });

    case 'SHOW_CREATE_FORM':
      return Object.assign({}, state, { createFormShowStyle: 'block', currentFunctionTemplateName: action.name });
      
    case 'START_FUNCTION':
      let enabledFuncFunctionList = state.functionList.map(func => {
        if (func.name === action.funcName) {
          const newProp = {properties: {config: {disabled: false}}};
          return Object.assign({}, func, newProp);
        } else {
          return func;
        }
      });

      return Object.assign({}, state, functionList: enabledFuncFunctionList);

    case 'STOP_FUNCTION':
      let disabledFuncFunctionList = state.functionList.map(func => {
        if (func.name === action.funcName) {
          return Object.assign({}, func, {properties: {config: { disabled: true }}});
        } else {
          return func;
        }
      });

      return Object.assign({}, state, functionList: disabledFuncFunctionList);

    default:
      return state;
  }
}
