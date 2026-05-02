
export function validateVerifyPSWD(code){
  let newErrors = {} 
  if (!code) newErrors.code = 'Please enter the code' 
  return newErrors;
}

