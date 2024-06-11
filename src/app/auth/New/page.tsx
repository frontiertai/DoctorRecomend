"use client";
import React from "react";
import {useForm,SubmitHandler} from "react-hook-form";
import { auth } from "../../../../firebase";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { error } from "console";

type Inputs={
    name:string;
    id:string;
};

const New=()=>{
    const router=useRouter();

    const{
        register,
        handleSubmit,
        formState:{errors},
    }=useForm<Inputs>();


const onSubmit: SubmitHandler<Inputs>=async(data)=>{
    await createUserWithEmailAndPassword(auth,data.name,data.id).then(
        (userCrendential)=>{
            const user=userCrendential.user;
            router.push("/auth/Login");
            
        }
    ).catch((error)=>{
        if(error.code==="auth/email-already-in-use"){
            alert("このメールアドレスはすでに使われている");

        }else{
            alert(error.message);
        }
    });
}




    return (
        <div className="h-screem flex flex-col items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                 className=" bg-blue p-8 rounded-1g shadow-md w-96">
                <h1 className="mb-4 text -2x1 text-gray-700 font-medium">新規登録</h1>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">メールアドレス</label>
                    <input 
                    {...register("name",{
                        required:"メールアドレスを入力してください",
                        pattern:{
                            value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                            message: "不適切なメールアドレスです"
                        },
                    })}
                    type="text"
                    className="mt-1 border-2 rouded-md w-full p-2"/>
                    {errors.name && <span className="text-red-600 text-sm">{errors.name.message}</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">ID(６桁)</label>
                    <input
                      {...register("id",{
                        required:"IDを入力してください",
                        minLength:{
                            value: 6,
                            message:"６文字以上入力して下さい"
                        },
                      })}
                      type="text"
                      className="mt-1 border-2 rouded-md w-full p-2"/>
                      {errors.id && <span className="text-red-600">{errors.id.message}</span>}
                </div>
                <div className="flex justify-end">
                    <button
                    type="submit"
                     className=" bg-blue-400 text-white font-bold py-2 px-4 rounded hover:bg-blue-900">新規登録</button>
                </div>
                
            </form>

        </div>
    )
};

export default New;