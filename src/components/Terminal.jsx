import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";


function Terminal({ socket, roomID, onSync }) {
  const terminalRef = useRef(null);

  
  useEffect(() => {
    const start = () => {
      const editor = CodeMirror.fromTextArea(
        document.querySelector("#editarea"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseBrackets: true,
          autoCloseTags: true,
          lineNumbers: true,
          
        }
      );
      terminalRef.current = editor;
      terminalRef.current.on("change", (instance, changes) => {
        const code = instance.getValue();
        const { origin } = changes;
        onSync(code);
        if (origin != "setValue") {
          // console.log(code)
          socket.current.emit("code-change", { code, roomID });
        }
      });

      editor.setSize("100%", "100%");
    };
    start();
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("code-change", ({ code }) => {
        if (code != null) {
          // console.log(code);
          terminalRef.current.setValue(code);
        }
      });
    }
  }, [socket.current]);

  return (
    <div style={{ height: "70lvh", width: "80vw" }}>
      {/* {console.log("treminal toh ",readOnly)} */}
      <textarea
        
        name=""
        id="editarea"
        style={{ borderRadius: "80px" }}
      ></textarea>
    </div>
  );
}

export default Terminal;
