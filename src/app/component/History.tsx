"use client"
import React, { useEffect, useState } from 'react';
import { db } from "../../../firebase";
import { collection, onSnapshot, query, where, orderBy, Timestamp } from "firebase/firestore";
import { useAppContext } from '../context/Appcontext';


type Room = {
    id: string;
    name: string;
    createdAt:Timestamp; 
};

const History = () => {
    const { userId } = useAppContext();
  
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

    return (
        <div className=" rounded bg-blue-700 h-full overflow-y-auto px-5 flex flex-col">
        <div className="flex-grow ">
            <div className="cursor-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-800 duration-150">
                <span className="text-white p-4 text-2xl">+</span>
                <h1 className="text-white txed-x1 font-semibold p-4">新たに始める</h1>
            </div>
            <ul>
            {rooms.map((room, index) => (
                <div key={index} className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-800 duration-150">
                    {room.name}
                </div>
            ))}
            </ul>
        </div>
    </div>
)
        
};

export default History;


