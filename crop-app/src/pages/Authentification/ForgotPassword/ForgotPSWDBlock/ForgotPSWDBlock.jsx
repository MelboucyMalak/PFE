import hero from "../../images/forgotPSWDHero.png"
import errorCross from "../../images/errorCross.png"
import { validateForgotPSWD } from "../../utils/validateForgotPSWD"
import styles from "./ForgotPSWDBlock.module.css"

import { useState } from "react"


export function ForgotPSWDBlock() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const errors = validateForgotPSWD(email)
    setErrors(errors)
    if (Object.keys(errors).length > 0) return
  }

  return (
    <div className={styles.forgotPSWDBlock}>
      <div className={styles.forgotPSWDFormBck}></div>
      <img className={styles.forgotPSWDImg} src={hero} alt="hero" />
      <div className={styles.forgotPSWDFormSide}> 

        <form className={styles.forgotPSWDForm} id="forgotPSWD-form"
          onSubmit={handleSubmit} noValidate>

          <p className={styles.forgotPSWDIndication}>Put in the Email adress associated with your account and we will send you a verification code</p>
          <div className={`${styles.forgotPSWDField}
            ${errors.email ? styles.forgotPSWDFieldError : ''}`}>
            <p className={styles.forgotPSWDLabel}>E-mail</p>
            <input type="email" placeholder="johndoe@email.com"
              onChange={e => setEmail(e.target.value)} />
            <div className={errors.email ? styles.forgotPSWDErrorLine : styles.noForgotPSWDError}>
              <img src={errorCross} alt="x" />
              <p className={styles.forgotPSWDError}>{errors.email}</p>
            </div>
          </div>

        </form>
        <button className={styles.sendCodeBtn} type="submit"
          form="forgotPSWD-form">Send code</button>
      </div>
    </div>
  )
}