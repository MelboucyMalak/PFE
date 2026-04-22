import hero from "../../images/verifyPSWDHero.png"
import errorCross from "../../images/errorCross.png"
import { validateVerifyPSWD } from "../../utils/validateVerifyPSWD"
import styles from "./VerifyPSWDBlock.module.css"

import { useState } from "react"
import { useNavigate } from "react-router"


export function VerifyPSWDBlock() {
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault()
    const errors = validateVerifyPSWD(code)
    setErrors(errors)
    if (Object.keys(errors).length > 0) return
  }

  return (
    <div className={styles.verifyPSWDBlock}>
      <div className={styles.verifyPSWDFormBck}></div>
      <img className={styles.verifyPSWDImg} src={hero} alt="hero" />
      <div className={styles.verifyPSWDFormSide}> 

        <form className={styles.verifyPSWDForm} id="verifyPSWD-form"
          onSubmit={handleSubmit} noValidate>

          <p className={styles.verifyPSWDIndication}>An Email was sent towards your adress,input the verification code</p>
          <div className={`${styles.verifyPSWDField}
            ${errors.code ? styles.verifyPSWDFieldError : ''}`}>
            <p className={styles.verifyPSWDLabel}>E-mail</p>
            <input type="text" placeholder="8-digits code"
              onChange={e => setCode(e.target.value)} />
            <div className={errors.code ? styles.verifyPSWDErrorLine : styles.noVerifyPSWDError}>
              <img src={errorCross} alt="x" />
              <p className={styles.verifyPSWDError}>{errors.code}</p>
            </div>
          </div>

        </form>
        <button className={styles.confirmCodeBtn} type="submit"
        onClick={() => navigate('/reset-password')}
          form="verifyPSWD-form">Confirm
        </button>
        <button className={styles.resendVerifCode} 
          >Resend Code
        </button>
      </div>
    </div>
  )
}