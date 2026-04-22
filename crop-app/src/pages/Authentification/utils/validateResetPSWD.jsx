
export function validateResetPSWD( password, confPassword) {
  let newErrors = {}
  if (password.length < 8) newErrors.password = 'Min 8 characters'
  if (password.localeCompare(confPassword) !== 0) newErrors.confPassword = 'Passwords do not match'
  return newErrors;
}

