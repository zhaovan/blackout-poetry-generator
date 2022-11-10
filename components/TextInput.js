import React, { useEffect, useState } from "react";
import styles from "../styles/TextInput.module.css";
import texts from "../constants/texts";
import parse from "html-react-parser";

export default function TextInput({ textRef, error }) {
  const [text, setText] = useState();
  function handlePaste(event) {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    textRef.current.innerText = text;
  }

  useEffect(() => {
    setText(texts[Math.floor(Math.random() * texts.length)]);
  }, []);

  console.log(error);
  function handleKeyDown(event) {
    if (event.keyCode === 9) {
      event.preventDefault();
      const current = textRef.current;
      const doc = current.ownerDocument.defaultView;
      const sel = doc.getSelection();
      let range = sel.getRangeAt(0);

      var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
      range.insertNode(tabNode);

      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  return (
    <p
      contentEditable={true}
      ref={textRef}
      className={error ? styles.textContainerAnimated : styles.textContainer}
      onKeyDown={(e) => handleKeyDown(e)}
      onPaste={handlePaste}
    >
      {text && parse(text)}
    </p>
  );
}
