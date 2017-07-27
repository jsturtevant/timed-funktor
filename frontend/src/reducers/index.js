const initialState = {
  functionList: [],
  templateList: [],
  loadingFunctionList: false,
  loadingTemplateList: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOADING_FUNCTION_LIST':
     return Object.assign({}, state, {loadingFunctionList: true}); 
    case 'RECEIVE_FUNCTION_LIST':
      let {functionList} = action;
      return Object.assign({}, state, {functionList, loadingFunctionList: false, loadingTemplateList: false});
    case 'LOADING_TEMPLATE_LIST':
      return Object.assign({}, state, {loadingTemplateList: true});
    case 'DELETE_FUNCTION':
      let newFunctionList =  state.functionList.filter(x => x.name != action.name);
      return Object.assign({}, state, {functionList: newFunctionList});
    default:
      return state;
  }
}
