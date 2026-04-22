 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin (email, password ){
  let newErrors = {} 
  if (!emailRegex.test(email)) newErrors.email = 'Invalid email'
  if (password.length < 8) newErrors.password = 'Min 8 characters'  
  return newErrors;
}

 