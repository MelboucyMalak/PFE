import { AuthNavbar } from "./Navbar/AuthNavbar"
import { SignUpBlock } from "./SignUpBlock/SignUpBlock"
import styles from "./Sign-up.module.css"

export default function SignUp() {
  return (
    <div className={styles.signUp}>
      <AuthNavbar />
      <div className={styles.topographyBck}></div>
      <SignUpBlock /> 
    </div>
  );
}