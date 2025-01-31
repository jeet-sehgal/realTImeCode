import { createContext,useContext } from "react";

export const formContext=createContext({
    editId:"",
    userName:"",
})

export const FormProvider=formContext.Provider

export const useForm=()=>useContext(formContext)