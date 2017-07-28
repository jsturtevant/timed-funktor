import React from 'react';
import { connect } from 'react-redux';
import { handleSubmit } from './../../actions/function-create';
import { getShortName } from '../../utility';

// component
const CreateFunction = (state) => {
  const { createFormShowStyle, templateName, createNewFunction } = state; 
  const templateShortName = getShortName(templateName);

  return (
   <form style={{display: createFormShowStyle}} onSubmit={(e) => createNewFn(e)} className="border-silver border p3 sm-col-5">
     <label className="block mb1">Name</label>
     <input type="text" name="name" className="field block mb2 col-12 p1"/>

     <label className="block mb1">Template</label>
     <input type="text" value={templateShortName} name="template" className="field block mb2 col-12 p1"/>

     <label className="block mb1">Schedule</label>
     <input type="text"  name="schedule" className="field block mb2 col-12 p1"/>
      
      <input type="submit" value="Create" className="block rounded p1 border-silver" />

     </form>
  )
};

const mapStateToProps = (state) => {
  const { createFormShowStyle, currentFunctionTemplateName } = state;
  return {
    createFormShowStyle,
    templateName: currentFunctionTemplateName
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    createNewFn: (e) => dispatch(handleSubmit(e))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateFunction)
