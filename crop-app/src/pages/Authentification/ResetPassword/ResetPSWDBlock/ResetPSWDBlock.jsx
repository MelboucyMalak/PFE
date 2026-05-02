import hero from "../../images/resetPSWDHero.png"
import showPSWD from "../../images/showPSWD.png"
import hidePSWD from "../../images/hidePSWD.png" 
import showPSWDRed from "../../images/showPSWDRed.png"
import hidePSWDRed from "../../images/hidePSWDRed.png"
import errorCross from "../../images/errorCross.png"
import { validateResetPSWD } from "../../utils/validateResetPSWD"
import styles from "./ResetPSWDBlock.module.css"
import { resetPassword } from "@/services/authService"
import { useState } from "react"
import { useNavigate } from "react-router"


export function ResetPSWDBlock() {
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({}) 
  const [password, setPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')
  const [loading, setLoading] = useState(false)  
  const navigate = useNavigate();
  const token = localStorage.getItem('reset_token') 
  async function handleSubmit(e) {
    e.preventDefault()
    const errors = validateResetPSWD(password, confPassword)
    setErrors(errors)
    if (Object.keys(errors).length > 0) return
    setLoading(true)
    try {
      await resetPassword(token, password)
      localStorage.removeItem('reset_token')
      localStorage.removeItem('reset_email')
      navigate('/login')
    } catch (error) {
      setErrors({ api: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.resetPSWDBlock}>
      <img className={styles.resetPSWDImg} src={hero} alt="gardener" />
      <div className={styles.resetPSWDFormSide}>
        <div className={styles.resetPSWDFormBck}></div>

        <form className={styles.resetPSWDForm} id="reset-password-form"
          onSubmit={handleSubmit} noValidate>  

          <div className={`${styles.resetPSWDField}
            ${errors.password ? styles.resetPSWDBlockError : ''}`}>

            <p className={styles.resetPSWDLabel}>Password</p>
            <div className= {`${styles.resetPSWDFieldBlock} ${errors.password ? styles.resetPSWDFieldBlockError : ''}`}>
              <input type={showPassword ? 'text' : 'password'} required minLength={8}
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)} />
              <img className={styles.PSWDEye} 
                src={showPassword ? (errors.password ? hidePSWDRed : hidePSWD) : (errors.password ? showPSWDRed : showPSWD)} alt=""
                onClick={() => setShowPassword(!showPassword)} />
            </div>
            <div className={errors.password ? styles.resetPSWDErrorLine : styles.noSignUpError}>
              <img src={errorCross} alt="x" />
              <p className={styles.resetPSWDError}>{errors.password}</p>
            </div>
            

          </div>

          <div className={`${styles.resetPSWDField} 
          ${errors.confPassword ? styles.resetPSWDBlockError : ''}`}>
            <p className={styles.resetPSWDLabel}>Confirm Password</p>
            <div className={`${styles.resetPSWDFieldBlock} ${errors.confPassword ? styles.resetPSWDFieldBlockError : ''}`} >
              <input type={showPassword ? 'text' : 'password'} required
                placeholder="••••••••" 
                onChange={e => setConfPassword(e.target.value)}/>
              <img className={styles.PSWDEye} 
                src={showPassword ? (errors.confPassword ?  hidePSWDRed : hidePSWD) : (errors.confPassword ? showPSWDRed : showPSWD)} alt=""
                onClick={() => setShowPassword(!showPassword)} />
            </div>

            <div className={errors.confPassword ? styles.resetPSWDErrorLine : styles.noSignUpError}>
              <img src={errorCross} alt="x" />
              <p className={styles.resetPSWDError}>{errors.confPassword}</p>
            </div>
          </div>
        {errors.api && (
          <div className={styles.resetPSWDErrorLine}>
            <img src={errorCross} alt="x" />
            <p className={styles.resetPSWDError}>{errors.api}</p>
          </div>
        )}
        </form>
        <button className={styles.resetPSWDBtn} type="submit"
        form="reset-password-form" disabled={loading}>Log In</button> 
          {loading ? 'Resetting...' : 'Reset Password'}
      </div>
    </div>
  )
}