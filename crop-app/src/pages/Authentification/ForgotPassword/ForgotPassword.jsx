import { AuthNavbar } from "../Navbar/AuthNavbar"
import { ForgotPSWDBlock } from "./ForgotPSWDBlock/ForgotPSWDBlock"
import styles from "../Authentification.module.css"

export default function ForgotPassword(){
  return(
    <div className={styles.forgotPSWD}>
      <AuthNavbar />
      <div className={styles.topographyBck}></div>
      <ForgotPSWDBlock /> 
    </div>
  )
}


 