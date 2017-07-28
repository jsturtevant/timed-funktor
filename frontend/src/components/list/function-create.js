import React from 'react';
import { connect } from 'react-redux';

// component
const CreateFunction = (state) => {
  const { createFormShowStyle, templateName, createNewFunction } = state; 
  return (
   <form style={{display: createFormShowStyle}} onSubmit={(e) => createNewFunction(e)}>
     <label>Name</label>
     <input type="text" value="name"/>

     <label>template</label>
     <input type="text" value={state.templateName}/>

     <label>Schedule</label>
     <input type="text" value="" name="schedule"/>
      
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

export default connect(
  mapStateToProps,
)(CreateFunction)
