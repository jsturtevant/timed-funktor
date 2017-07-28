export const getShortName = (funcName) => funcName.split('/').pop();

export const filterByTimerType = (functionList) => {
  return functionList.filter(func => {
    if (!func.properties.config.bindings) {
      return false;
    }
    const filterTimerBindings = func.properties.config.bindings.filter(binding => {
      return binding.type === 'timerTrigger';
    });
    const containsTimerBinding = filterTimerBindings.length > 0;
    return containsTimerBinding;
  });
};

export const getTimerFunctionSchedule = (func) => {
  const timerBinding = func.properties.config.bindings.filter(binding => binding.type === 'timerTrigger');
  return timerBinding.pop().schedule;
};

