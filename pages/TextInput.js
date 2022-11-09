import React from "react";
import styles from "../styles/TextInput.module.css";

export default function TextInput({ textRef }) {
  return (
    <p contentEditable={true} ref={textRef} className={styles.textContainer}>
      in the days of yore how do we know that the men we care about, are worthy
      of deceit
    </p>
  );
}
