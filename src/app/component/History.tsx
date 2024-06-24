"use client"
import React, { useEffect, useState } from 'react';
import { db } from "../../../firebase";
import { collection, onSnapshot, query, where, orderBy, Timestamp, serverTimestamp, addDoc } from "firebase/firestore";
import { useAppContext } from '../context/Appcontext';


type Room = {
    id: string;
    name: string;
    createdAt:Timestamp; 
};

const History = () => {
    const { user,userId,setSelectedRoom ,setSeletRoomName} = useAppContext();
  
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        if (userId) {
            const roomCollectionRef = collection(db, "rooms");
            const q = query(roomCollectionRef, where("userId", "==", userId), orderBy("createdAt"));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedRooms = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name as string, 
                    createdAt: doc.data().createdAt as Timestamp
                }));
                setRooms(fetchedRooms); 
                console.log("Rooms fetched", fetchedRooms);
            }, error => {
                console.error("Error fetching rooms: ", error);
            });

            return () => unsubscribe();

        } else {
            console.log("User ID not set");
        }
    }, [userId]);

    const selectRoom=(roomId:string,roomName:string)=>{
        setSelectedRoom(roomId);
        setSelectedRoom(roomName);
        console.log(roomId);
        console.log(roomName)
        

    }
    const addNewRoom=async()=>{

        const roomName=prompt("ルーム名を入力してください");
        if (roomName){
            const newRoomref=collection(db,"rooms");
            await addDoc(newRoomref,{
                name:roomName,
                userId:userId,
                createdAt:serverTimestamp(),

            })
        }

    }

    return (
        <div className=" rounded bg-blue-700 h-full overflow-y-auto px-5 flex flex-col">
        <div className="flex-grow ">
            <div 
                onClick={addNewRoom}
                className="cursor-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-800 duration-150"
            >
                <span className="text-white p-4 text-2xl">+</span>
                <h1 className="text-white txed-x1 font-semibold p-4">新たに始める</h1>
            </div>
            <ul>
            {rooms.map((room, index) => (
                <li key={index} 
                    className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-800 duration-150"
                    onClick={()=>selectRoom(room.id,room.name)}
                >
                    {room.name}
                </li>
            ))}
            </ul>
        </div>
    </div>
)
        
};

export default History;


