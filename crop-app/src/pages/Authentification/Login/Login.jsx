import { AuthNavbar } from "../Navbar/AuthNavbar"
import { LoginBlock } from "./LoginBlock/LoginBlock"
import styles from "../Authentification.module.css"

export default function Login() {
  return (
    <div className={styles.login}>
      <AuthNavbar />
      <div className={styles.topographyBck}></div>
      <LoginBlock /> 
    </div>
  );
}