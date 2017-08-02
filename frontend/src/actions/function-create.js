import { createFunctionUrl } from './../constants';

export const handleSubmit = (e) => (dispatch) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  // some of this request body is hard coded for now
  const body = {
    funcName: formData.get('name'),
    templateName: formData.get('template'), 
    schedule: formData.get('schedule'),
    config: {
      key1: 'value1',
      key2: 3
    }
  };

  const options = {
    method: 'POST'
  };
 
  // not sure what shape the response will take at this point, so console logging for now 
  fetch(createFunctionUrl, options)
    .then(response => console.log(response))
    .catch(reason => console.log(reason))
};

