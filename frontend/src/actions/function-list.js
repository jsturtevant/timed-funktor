import { deleteFunctionUrl, enableFunctionUrl, disableFunctionUrl } from './../constants';
import { getShortName } from './../utility';

export const startFunction = (funcName) => (dispatch, getState) => {
  const shortname = getShortName(funcName);

  const body = {
    funcName: shortname
  };

  const options = {
     method: 'POST',
     body, 
     headers: {
      'Content-Type': 'application/json'
     }
   };

  // need to catch and handle 400 / 500 errors within success
  fetch(enableFunctionUrl, options)
    .then(response => {
      if (response.ok) {
        dispatch({ type: 'START_FUNCTION', funcName });
      }
    });
};

export const stopFunction = (funcName) => (dispatch, getState) => {
  const shortname = getShortName(funcName);

  const body = {
    funcName: shortname
  };
  
  const options = {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // TODO: catch network failures and 400 / 500 errors
  fetch(disableFunctionUrl, options)
    .then(response => {
      if (response.ok) {
        dispatch({ type: 'STOP_FUNCTION', funcName });
      }
    });
};


export const deleteFunction = (funcName) => (dispatch, getState) => {
  const shortname = getShortName(funcName);

  const options = {
    method: 'DELETE'
  };


  // TODO: catch network failures and 400 / 500 errors
  fetch(`${deleteFunctionUrl}/${shortname}`, options)
    .then(response => {
      if (response.ok) {
        dispatch({ type: 'DELETE_FUNCTION', funcName })
      }
    });
}

