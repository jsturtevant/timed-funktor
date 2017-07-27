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
      const {functionList} = action;
      return Object.assign({}, state, {functionList, loadingFunctionList: false, loadingTemplateList: false});
    case 'LOADING_TEMPLATE_LIST':
     return Object.assign({}, state, {loadingTemplateList: true}); 
    default:
      return state;
  }
}
