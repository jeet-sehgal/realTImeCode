import React, { useEffect, useState } from "react";
import { useForm } from "../context/homeForm";
import logo from "../images/ode_Book__1_-removebg-preview.png";
import { nanoid } from "nanoid";
import {toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

function Home() {
  // const {editId,userId} =useForm();
  const [id,setId]=useState("");
  const [name,setName]=useState("");
  const nevigate=useNavigate()
  useEffect(()=>{
    
    if(localStorage.getItem("uname")){
      console.log("uname hai")
      setName(localStorage.getItem("uname"))
    }
    else{
      console.log("uname nahi hai")
      


    }
  },[])
  useEffect(()=>{
    localStorage.setItem("uname",name)
  },[name])
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "black",
        border: "4px solid grey",
        padding: "20px",
        borderRadius: "5px",
      }}
    >
      <img src={logo} alt="" className="logo" />
      <h4 style={{ color: "white", fontSize: "20px", marginTop: "10px" }}>
        Enter The Room ID
      </h4>
      <div className="inputBox">
        <div style={{ position: "relative" }}>
          <input type="text" placeholder="" className="id input" id="id" value={id} onChange={(e)=>{setId(e.target.value)}} autoComplete="off"/>
          <label htmlFor="id" className="label">
            Room ID
          </label>
        </div>
        <div style={{ position: "relative" }}>
          <input type="text" placeholder="" className="name input" id="name" value={name} onChange={(e)=>{setName(e.target.value)}} autoComplete="off" />
          <label htmlFor="name" className="label">
            Username
          </label>
        </div>
      </div>
      <button className="join" style={{ fontWeight: "600F" }} onClick={()=>{
        if(!id || !name){
            toast.error("both the fields should be filled")
            return
        }
        
        nevigate(`edit/${id}`,{
          state:{
            username:name,
          }
        });
        toast.success(`you entered the room`)
      }}>
        Join
      </button>
      <p style={{ color: "white", fontSize: "15px", marginTop: "10px" }}>
        Do you have a room ? {" "}
        <span style={{ color: "rgb(16, 165, 106)", fontWeight: "600" ,cursor:"pointer"}} onClick={()=>{
            const id=nanoid();
            setId(id);
            toast.success("Room ID is generated")
        }}>
          New Room
        </span>
      </p>
    </div>
  );
}

export default Home;
