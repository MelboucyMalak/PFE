 
export function validateVerifyPSWD(code){
  let newErrors = {} 
  if (code.length !== 8) newErrors.code = 'Invalid code' 
  return newErrors;
}

 