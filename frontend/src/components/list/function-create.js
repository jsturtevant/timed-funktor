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
   <form style={{display: createFormShowStyle}} onSubmit={(e) => createNewFunction(e)}>
     <label>Name</label>
     <input type="text" name="name" />

     <label>template</label>
     <input type="text" value={templateName} name="template"/>

     <label>Schedule</label>
     <input type="text"  name="schedule"/>
      
      <input type="submit" value="Create"></input>

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
