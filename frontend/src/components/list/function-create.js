import React from 'react';

// component
export const CreateFunction = ({state}) => {
  return (
   <form style={{display: state.toggleShowStyle}}>
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
