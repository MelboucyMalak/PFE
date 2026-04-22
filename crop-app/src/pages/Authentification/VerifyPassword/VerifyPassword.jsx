import { AuthNavbar } from "../Navbar/AuthNavbar"
import { VerifyPSWDBlock } from "./VerifyPSWDBlock/VerifyPSWDBlock"
import styles from "../Authentification.module.css"

export default function VerifyPassword(){
  return(
    <div className={styles.verifyPSWD}>
      <AuthNavbar />
      <div className={styles.topographyBck}></div>
      <VerifyPSWDBlock /> 
    </div>
  )
}


 