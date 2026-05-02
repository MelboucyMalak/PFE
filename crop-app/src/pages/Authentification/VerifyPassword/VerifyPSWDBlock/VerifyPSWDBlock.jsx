import hero from "../../images/verifyPSWDHero.png"
import errorCross from "../../images/errorCross.png"
import { validateVerifyPSWD } from "../../utils/validateVerifyPSWD"
import styles from "./VerifyPSWDBlock.module.css"
import { forgotPassword, verifyCode } from "@/services/authService"
import { useState } from "react"
import { useNavigate } from "react-router"


export function VerifyPSWDBlock() {
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    console.log('handleSubmit called')        // ✅ add this
    console.log('code value:', code)   
    e.preventDefault()
    const errors = validateVerifyPSWD(code)
    console.log('validation:', errors) 
    setErrors(errors)
    if (Object.keys(errors).length > 0) return
    setLoading(true)
    try { 
      console.log('sending code:', code)
      await verifyCode(code)
      
      localStorage.setItem('reset_token', code)
      navigate('/reset-password')
    } catch (error) {
      setErrors({ api: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {  
    const email = localStorage.getItem('reset_email')
    if (!email) return setErrors({ api: "Session expired, please start again." })
    try {
      await forgotPassword(email)
      setErrors({ api: '' })
    } catch (error) {
      setErrors({ api: error.message })
    }
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
            onChange={e => setCode(e.target.value.trim())} />
            <div className={errors.code ? styles.verifyPSWDErrorLine : styles.noVerifyPSWDError}>
              <img src={errorCross} alt="x" />
              <p className={styles.verifyPSWDError}>{errors.code}</p>
            </div>
          </div>
          {errors.api && (
          <div className={styles.verifyPSWDErrorLine}>
            <img src={errorCross} alt="x" />
            <p className={styles.verifyPSWDError}>{errors.api}</p>
          </div>
        )}

        </form>
        <button className={styles.confirmCodeBtn} type="submit"
          form="verifyPSWD-form" disabled={loading}>
          {loading ? 'Verifying...' : 'Confirm'}
        </button>
        <button className={styles.resendVerifCode} type="button"
          onClick={handleResend}>Resend Code </button>
      </div>
    </div>
  )
}