import React from 'react';
import { connect } from 'react-redux';
import { createFunctionUrl } from './../../constants';

const handleSubmit = (e) => (dispatch) => {
  console.log('submission');
  e.preventDefault();
  const formData = new FormData(e.target);
  const body = {
    "templateName": formData.get('name'), 
    "schedule": formData.get('schedule'),
    "config": {
      "key1": "value1",
      "key2": 3
    }
  };

  fetch(createFunctionUrl, {method: 'POST'})
    .then(response => console.log(response))
    .catch(reason => console.log(reason))
};

// component
const CreateFunction = (state) => {
  const { createFormShowStyle, templateName, createNewFunction } = state; 
  return (
   <form style={{display: createFormShowStyle}} onSubmit={(e) => createNewFunction(e)} className="border-silver border p3 sm-col-5">
     <label className="block mb1">Name</label>
     <input type="text" name="name" className="field block mb2 col-12 p1"/>

     <label className="block mb1">Template</label>
     <input type="text" value={templateName} name="template" className="field block mb2 col-12 p1"/>

     <label className="block mb1">Schedule</label>
     <input type="text"  name="schedule" className="field block mb2 col-12 p1"/>
      
      <input type="submit" value="Create" className="block rounded p1 border-silver" />

     </form>
  )
};

const mapStateToProps = (state) => {
  return {
    createFormShowStyle: state.createFormShowStyle,
    templateName: state.currentFunctionTemplateName
  }
};

const mapDispatchToProps = dispatch => {
  return {
    createNewFunction: (e) => dispatch(handleSubmit(e))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateFunction)
