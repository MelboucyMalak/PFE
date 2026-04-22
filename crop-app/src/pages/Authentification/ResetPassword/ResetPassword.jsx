import { AuthNavbar } from "../Navbar/AuthNavbar"
import { ResetPSWDBlock } from "./ResetPSWDBlock/ResetPSWDBlock"
import styles from "../Authentification.module.css"

export default function ResetPassword() {
  return (
    <div className={styles.resetPassword}>
      <AuthNavbar />
      <div className={styles.topographyBck}></div>
      <ResetPSWDBlock /> 
    </div>
  );
}