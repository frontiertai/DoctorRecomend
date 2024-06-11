"use client"

import { User,onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext,useContext,useEffect,useState} from "react";
import { auth } from "../../../firebase";


type AppProviderProps={
    children: ReactNode;
}

type AppContextType={
    user:User|null;
    userId:string|null
    setUser:React.Dispatch<React.SetStateAction<User|null>>;
    selectedRoom:string |null;
    setSelectedRoom:React.Dispatch<React.SetStateAction<string|null>>;
    selectRoomName:string |null;
    setSeletRoomName:React.Dispatch<React.SetStateAction<string|null>>,


};

const defaultContextData={
    user:null,
    userId:null,
    setUser:()=>{},
    selectedRoom:null,
    setSelectedRoom:()=>{},
    selectRoomName:null,
    setSeletRoomName:()=>{},

};

const AppContext=createContext<AppContextType>(defaultContextData);

export function AppProvider({children}:AppProviderProps){
    const[user,setUser]=useState<User |null>(null);
    const[userId,setUserId]=useState<string |null>(null);
    const[selectedRoom,setSelectedRoom]=useState<string |null>(null);
    const[selectRoomName,setSeletRoomName]=useState<string |null>(null);

    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,(newUser)=>{
            setUser(newUser);
            setUserId(newUser ? newUser.uid:null);
        });
        return()=>{
            unsubscribe(); //ずっとlistenしないように
        }
    },[]);

    return (
        <AppContext.Provider value={{user,userId,setUser,selectedRoom,setSelectedRoom,selectRoomName,setSeletRoomName}}>{children}</AppContext.Provider>
    );
}
export function useAppContext(){
    return useContext(AppContext);


}