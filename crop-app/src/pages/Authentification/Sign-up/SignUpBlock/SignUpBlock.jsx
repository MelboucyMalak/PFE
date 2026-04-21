import gardener from "../../images/gardener.png"
import showPSWD from "../../images/showPSWD.png"
import hidePSWD from "../../images/hidePSWD.png"
import errorCross from "../../images/errorCross.png"
import { validateSignUp } from "../../utils/validateSignUp"
import styles from "./SignUpBlock.module.css"

import { useState } from "react"


export function SignUpBlock() {
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const errors = validateSignUp(username, email, password, confPassword)
    setErrors(errors)
    if (Object.keys(errors).length > 0) return
  }

  return (
    <div className={styles.signUpBlock}>
      <img className={styles.signUpImg} src={gardener} alt="gardener" />
      <div className={styles.signUpFormSide}>
        <div className={styles.signUpFormBck}></div>

        <form className={styles.signUpForm} id="sign-up-form"
          onSubmit={handleSubmit} noValidate>

          <div className={`${styles.signUpField}
            ${errors.username ? styles.signUpFieldError : ''}`}>
            <p className={styles.signUpLabel}>Username</p>
            <input type="text" required minLength={5} maxLength={20} placeholder="John doe"
              onChange={e => setUsername(e.target.value)}
            />
            <div className={errors.username ? styles.signUpErrorLine : styles.noSignUpError}>
              <img src={errorCross} alt="x" />
              <p className={styles.signUpError}>{errors.username}</p>
            </div>
          </div>

          <div className={`${styles.signUpField}
            ${errors.email ? styles.signUpFieldError : ''}`}>
            <p className={styles.signUpLabel}>E-mail</p>
            <input type="email" placeholder="johndoe@email.com"
              onChange={e => setEmail(e.target.value)} />
              <div className={errors.email ? styles.signUpErrorLine : styles.noSignUpError}>
                <img src={errorCross} alt="x" />
                <p className={styles.signUpError}>{errors.email}</p>
              </div>
          </div>

          <div className={`${styles.signUpField}
            ${errors.password ? styles.signUpFieldError : ''}`}>

            <p className={styles.signUpLabel}>Password</p>
            <div className={styles.signUpFieldBlock}>
              <input type={showPassword ? 'text' : 'password'} required minLength={8}
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)} />
              <img className={styles.PSWDEye} src={showPassword ? hidePSWD : showPSWD} alt=""
                onClick={() => setShowPassword(!showPassword)} />
            </div>
            <div className={errors.password ? styles.signUpErrorLine : styles.noSignUpError}>
              <img src={errorCross} alt="x" />
              <p className={styles.signUpError}>{errors.password}</p>
            </div>

          </div>

          <div className={`${styles.signUpField}
            ${errors.confPassword ? styles.signUpFieldError : ''}`}>
            <p className={styles.signUpLabel}>Confirm Password</p>
            <div className={styles.signUpFieldBlock}>
              <input type={showPassword ? 'text' : 'password'} required
                placeholder="••••••••" 
                onChange={e => setConfPassword(e.target.value)}/>
              <img className={styles.PSWDEye} src={showPassword ? hidePSWD : showPSWD} alt=""
                onClick={() => setShowPassword(!showPassword)} />
            </div>
            <div className={errors.confPassword ? styles.signUpErrorLine : styles.noSignUpError}>
              <img src={errorCross} alt="x" />
              <p className={styles.signUpError}>{errors.confPassword}</p>
            </div>
          </div>

        </form>
        <button className={styles.signUpBtn} type="submit" form="sign-up-form">Sign Up</button>
        <p className={styles.loginRedirect}>Already have an account-<a href="">Log in.</a></p>
      </div>
    </div>
  )
}