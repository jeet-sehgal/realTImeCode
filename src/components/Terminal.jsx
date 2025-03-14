import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import toast from "react-hot-toast";

function Terminal({ socket, roomID, onSync, edit }) {
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

  const handleScroll = (event) => {
    event.preventDefault(); 
    

    if (terminalRef.current) {
      const scrollableElement = terminalRef.current.getScrollerElement();
      scrollableElement.scrollTop += event.deltaY; 
      scrollableElement.scrollLeft += event.deltaX; 
    }
  };

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

  useEffect(() => {
    // console.log("terminal : ", edit);
  }, []);
  return (
    <div style={{ height: "70lvh", width: "80vw" }}>
      {/* {console.log("treminal toh ",readOnly)} */}
      {edit.length > 0 && edit[0]?.edit ? (
        ""
      ) : (
        <div
          style={{
            height: "70lvh",
            width: "80vw",
            backgroundColor: "transparent",
            position: "absolute",
            top: "10lvh",
            zIndex: "100",
          }}
          onClick={()=>{
            toast.error("Admin has not allowed you to edit")
          }}
          onWheel={handleScroll}
        ></div>
      )}

      <textarea
        name=""
        id="editarea"
        style={{ borderRadius: "80px" }}
      ></textarea>
    </div>
  );
}

export default Terminal;
