 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateSignUp(username, email, password,confPassword){
  let newErrors = {}
  if (username.length < 5) newErrors.username = 'Min 5 characters '
  if (!emailRegex.test(email)) newErrors.email = 'Invalid email'
  if (password.length < 8) newErrors.password = 'Min 8 characters' 
  if (password.localeCompare(confPassword) !== 0) newErrors.confPassword= 'Passwords do not match'
  return newErrors;
}

 