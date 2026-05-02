import hero from "../../images/loginHero.png"
import showPSWD from "../../images/showPSWD.png"
import hidePSWD from "../../images/hidePSWD.png"
import showPSWDRed from "../../images/showPSWDRed.png"
import errorCross from "../../images/errorCross.png"
import { validateLogin } from "../../utils/validateLogin"
import styles from "./LoginBlock.module.css"
import { loginUser } from "@/services/authService"
import { useNavigate } from "react-router-dom"
import { useState } from "react"


export function LoginBlock() {
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isloading, setLoading] = useState(false)   
  const navigate = useNavigate()

async function handleSubmit(e) {
    e.preventDefault()
    console.log('submitted', email, password)
    const validationErrors = validateLogin(email, password)  
    console.log('validation errors:', validationErrors)  
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    setLoading(true)
    try {
      const data = await loginUser({ email, password })

      localStorage.setItem('token', data.token)
      localStorage.setItem('isAdmin', data.admin)
      if (data.admin)
        navigate('/admin/dashboard')
      else
        navigate('/farmer/dashboard')

    } catch (error) {
      setErrors({ api: error.message }) // shows "LOGIN_FAILED" or "USER_NOT_FOUND_BY_EMAIL"
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginBlock}>
      <img className={styles.loginImg} src={hero} alt="gardener" />
      <div className={styles.loginFormSide}>
        <div className={styles.loginFormBck}></div>

        <form className={styles.loginForm} id="login-form"
          onSubmit={handleSubmit} noValidate>

          <div className={`${styles.loginField}
            ${errors.email ? styles.loginFieldError : ''}`}>
            <p className={styles.loginLabel}>E-mail</p>
            <input type="email" placeholder="johndoe@email.com"
              onChange={e => setEmail(e.target.value)} />
            <div className={errors.email ? styles.loginErrorLine : styles.nologinError}>
              <img src={errorCross} alt="x" />
              <p className={styles.loginError}>{errors.email}</p>
            </div>
          </div>

          <div className={`${styles.loginField}
            ${errors.password ? styles.loginBlockError : ''}`}>

            <p className={styles.loginLabel}>Password</p>
            <div className={`${styles.loginFieldBlock} ${errors.password ? styles.loginFieldBlockError : ''}`}>
              <input type={showPassword ? 'text' : 'password'} required minLength={8}
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)} />
              <img className={styles.PSWDEye}
                src={showPassword ? (errors.password ? 'hidePSWDRed' : hidePSWD) : (errors.password ? showPSWDRed : showPSWD)} alt=""
                onClick={() => setShowPassword(!showPassword)} />
            </div>
            <div className={errors.password ? styles.loginErrorLine : styles.nologinError}>
              <img src={errorCross} alt="x" />
              <p className={styles.loginError}>{errors.password}</p>
            </div>

          </div>
          {errors.api && (
            <div className={styles.loginErrorLine}>
              <img src={errorCross} alt="x" />
              <p className={styles.loginError}>{errors.api}</p>
            </div>
          )}

        </form>
        <button className={styles.loginBtn} type="submit" form="login-form" disabled={isloading}>
          {isloading ? 'Logging in...' : 'login'}
        </button>
        <p className={styles.forgotPSWDRedirect}>Forgot your password?-<a href="/forgot-password">Click Here.</a></p>
        <p className={styles.signUpRedirect}>Already have an account-<a href="/sign-up">Sign Up.</a></p>
      </div>
    </div>
  )
}