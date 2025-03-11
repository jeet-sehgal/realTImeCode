import React, { useEffect, useRef } from "react";
import logo from "../images/ode_Book__1_-removebg-preview.png";
import { useState } from "react";
import { initSocket } from "../socket";
import load from '../assets/load.gif'

function Editor() {
  const ref = useRef(null);
  const { editId } = useParams();
  const location = useLocation();
  const nevigate = useNavigate();
  const [filename, setFilename] = useState("");
  const [language, setLanguage] = useState("");
  const [uId, setUId] = useState(null);
  const [editable,setEditable] = useState([])
  // const[adminId,setAdminId]=useState("")

  const optionLang = ["C", "C++", "JAVA", "JavaScript", "PHP", "Python"];
  const optionLangDetail = {
    C: {
      value: "c",
      version: "4",
      index: "9.1.0",
      ext: "c",
    },
    "C++": {
      value: "cpp",
      version: "4",
      index: "9.1.0",
      ext: "cpp",
    },
    JAVA: {
      value: "java",
      version: "4",
      index: "17.0.1",
      ext: "java",
    },
    JavaScript: {
      value: "nodejs",
      version: "5",
      index: "20.9.1",
      ext: "js",
    },
    PHP: {
      value: "php",
      version: "5",
      index: "8.2.12",
      ext: "php",
    },
    Python: {
      value: "python3",
      version: "5",
      index: "3.11.5",
      ext: "py",
    },
  };
  const [output,setOutput]=useState("")
  const [loading,setLoading]=useState(false)
  const [stdInput,setStdInput]=useState("")
  const codeRef = useRef(null);
  async function executeCode() {
    // console.log(codeRef.current);
    // console.log(optionLangDetail[language].value);
    const input=stdInput.split("/n")
    console.log(input.join("/"))
    const response = await fetch("/exe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        script: codeRef.current,
        language: optionLangDetail[language].value,
        versionIndex: optionLangDetail[language].version,
        clientId: import.meta.env.VITE_CLIENT_ID,
        clientSecret: import.meta.env.VITE_CLIENT_SECRET,
        stdin: input.join("\n"), 
      }),
    }).then((res) => res.json());

    return response;
  }

  useEffect(() => {
    async function ini() {
      ref.current = await initSocket();
      ref.current.on("connect_error", (err) => {
        handel(err);
      });
      ref.current.on("connect_failed", (err) => {
        handel(err);
      });

      ref.current.on("you", ({ id, admin, adminName }) => {
        // console.log("Your socket ID is:", id);
        // setAdminId(admin)
        toast.success(`${adminName} is the admin`);
        setUId(id);
      });
      ref.current.emit("join", { id: editId, name: location.state.username });
      ref.current.on("leave", ({ id, username }) => {
        toast.success(`${username} leaved the room`);
        setMem((prev) => prev.filter((ele) => ele.id != id));
        setEditable((prev) => prev.filter((ele) => ele.id != id));
        
      });

      ref.current.on("refresh", (clients) => {
        console.log("admin chala");
        // setAdminId(mem[0].id)
        window.location.reload();
        setMem(clients);
      });

      ref.current.on("joined", ({ name, socket, clients ,clientEdit}) => {
        setMem(clients);
        // console.log(codeRef.current)
        setEditable(clientEdit)
        console.log("edit :",editable)

        // console.log("aa ja")
        ref.current.emit("code-sync", { code: codeRef.current, id: editId });
        if (name != location.state?.username) {
          toast.success(`${name} joined the room`);
        }
        // else{
        //   setMem(prev=>prev.map(ele=>ele.name==location.state.username?Object.assign(ele, { you: true }):Object.assign(ele, { you: false })))
        // }
      });
      ref.current.on("changeEdit",({client})=>{
        console.log("data from server : ",client)
        setEditable(client)
      })
      ref.current.on("re", (clients) => {
        setMem(clients);
      });
      ref.current.on("kickedOut", (id) => {
        // console.log("hoi")
        nevigate("/");
        toast.error("Admin has kicked you out from chat room");
      });

      function handel(err) {
        toast.error("Connection error, try again");
        nevigate("/");
      }
    }
    ini();
    return () => {
      ref.current.disconnect();
    };
  }, []);
  useEffect(()=>{console.table(editable)},[editable])

  const [mem, setMem] = useState([]);
  function kick(id) {
    ref.current.emit("kick", id);
  }
  function setPencil(id){
    console.log("hello",editable)
    setEditable(prev =>
      prev.map(ele =>
        ele.id === id ? { ...ele, edit: !ele.edit } : ele
      )
    );
    ref.current.emit("edit",{id,editId})
  }

  return (
    <div className="editorPage">
      <div className="left">
        <div
          style={{
            height: "15lvh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img src={logo} alt="" className="logo" />
          <hr color="grey" size="1" width="85%" />
        </div>
        <div style={{ height: "70lvh", width: "100%" }}>
          <h4
            style={{
              color: "white",
              fontSize: "17px",
              textAlign: "center",
              marginBottom: "5px",
            }}
          >
            Members ({mem.length})
          </h4>
          <div
            className="membersShow"
            style={{
              overflow: "auto",
              height: "65lvh",
              //   scrollbarColor: "rgb(68, 75, 97) rgba(255,255,255,0)",
              scrollBehavior: "smooth",
            }}
          >
            {/* {mem.length!=0?setAdminId(mem[0].id):""} */}
            {mem.map((ele) => (
              <Member
                id={ele.id}
                name={ele.name}
                admin={ele.admin}
                youId={uId}
                adminId={mem[0].id}
                kick={kick}
                edit={editable.filter(element=>element.id==ele.id)}
                setEdit={setPencil}
              />
            ))}
          </div>
        </div>
        {console.table(mem)}
        <div
          style={{
            height: "15lvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "10px",
          }}
        >
          <hr color="grey" size="1" width="90%" />

          <button
            style={{
              padding: "7px",
              borderRadius: "5px",
              border: "1px solid black",
              backgroundColor: "rgb(16, 165, 106)",
              color: "white",
            }}
            className="leftBtn"
            onClick={() => {
              navigator.clipboard.writeText(editId);
              toast.success("Room ID is copied");
            }}
          >
            Copy the Room ID
          </button>
          <button
            onClick={() => {
              ref.current.disconnect();

              nevigate("/");
            }}
            className="leftBtn"
            style={{
              padding: "7px",
              borderRadius: "5px",
              border: "1px solid black",
              backgroundColor: "red",
              color: "white",
            }}
          >
            leave Room
          </button>
        </div>
      </div>
      <div className="right">
        <div className="buttons">
          <div>
            <input
              type="text"
              placeholder="Untitled"
              className="filename"
              value={filename}
              onChange={(e) => {
                setFilename(e.target.value);
              }}
            />
            <select
              className="filename"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
              }}
            >
              <option value="" selected disabled>
                select language
              </option>
              {optionLang.map((ele) => (
                <option key={Date.now} value={ele}>
                  {ele}{" "}
                  <span style={{ color: "red", fontSize: "0px" }}>
                    {optionLangDetail[ele].index}
                  </span>
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              gap: "4px",
            }}
          >
            <button
              className="rightButton run"
              onClick={async () => {
                if (!language) {
                  toast.error("Please select a Language", {
                    duration: 1000,
                  });
                  return;
                } else {
                  setLoading(true)
                  const data = await executeCode();
                  console.log(data)
                  if(data.error){
                    setOutput(data.error)
                    setLoading(false); 
                    // console.log(output)
                    return; 
                  }
                  setOutput(data.output)
                  setLoading(false)
                }
              }}
            >
              <i class="fa-solid fa-play"></i>
            </button>

            <button
              className="rightButton copy"
              onClick={() => {
                navigator.clipboard.writeText(codeRef.current);
                toast.success("Code is copied");
              }}
            >
              <i class="fa-solid fa-copy"></i>
            </button>

            <button
              className="rightButton download"
              onClick={() => {
                const blob = new Blob([codeRef.current], {
                  type: "text/plain",
                });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `${filename ? filename : "untitled"}.${
                  language ? optionLangDetail[language].ext : "txt"
                }`;
                link.click();
                toast.success("Downloaded successfully");
              }}
            >
              <i class="fa-solid fa-download"></i>
            </button>
          </div>
        </div>
        <div className="terminal" >

          <Terminal
            socket={ref}
            roomID={editId}
            onSync={(code) => {
              codeRef.current = code;
            }}
            edit={editable.filter(ele=>ele.id==uId)}
          />
        </div>
        {/* {console.log("readonly ",readOnly)} */}
        <div
          className="runBox"
          style={{
            height: "20lvh",
            width: "80vw",
            position: "absolute",
            top: "80lvh",
            display: "flex",
            backgroundColor: "#081230",
            marginLeft: "1px",
          }}
        >
          <div
            className="inputContainer"
            style={{
              color: "white",
              width: "40vw",
              border: "1px solid white",
              border: "none",
              borderRight: "1px solid white",
              padding:"10px"
            }}
          >
            <h3 >Input</h3>
            <textarea
            className="scroll"
              name=""
              id=""
              placeholder="eg : input1&#10;     input2&#10;     input3"
              style={{
                padding: "10px",
                backgroundColor: "transparent",
                color: "white",
                width: "25vw",
                resize: "none",
                width: "100%",
                height: "15lvh",
                border: "none",
                outline: "none",
              }}
              value={stdInput}
              onChange={(e)=>{setStdInput(e.target.value)}}
            ></textarea>
          </div>
          <div
            className="outputBox"
            style={{ color: "white", width: "40vw", border: "none",padding:"10px" }}
          >
            <h3>Output</h3>
            {loading?<img src={load} alt="" style={{height:"15lvh"}}/>:""}
            <textarea
              name=""
              id=""
              value={output}
              className="scroll"
              placeholder="Output will be shown here"
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "none",
                width: "25vw",
                resize: "none",
                width: "100%",
                height: "15lvh",
                outline: "none",
                padding:"10px"
              }}
              readOnly={true}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
import Member from "./Member";
import Terminal from "./Terminal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { version } from "codemirror";

export default Editor;
