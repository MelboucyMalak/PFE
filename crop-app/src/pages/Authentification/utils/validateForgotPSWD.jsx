
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateForgotPSWD(email){
  let newErrors = {} 
  if (!emailRegex.test(email)) newErrors.email = 'Invalid email' 
  return newErrors;
}

 