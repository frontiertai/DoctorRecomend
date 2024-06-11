"use client";
import React from "react";
import {useForm,SubmitHandler} from "react-hook-form";
import { auth } from "../../../../firebase";
import { useRouter } from "next/navigation";
import {  signInWithEmailAndPassword } from "firebase/auth";
import { error } from "console";

type Inputs={
    name:string;
    id:string;
};

const Login=()=>{
    const router=useRouter();

    const{
        register,
        handleSubmit,
        formState:{errors},
    }=useForm<Inputs>();


const onSubmit: SubmitHandler<Inputs>=async(data)=>{
    await signInWithEmailAndPassword(auth,data.name,data.id).then(
        (userCrendential)=>{
            router.push("/auth/Registore");
            
        }
    ).catch((error)=>{
        if(error.code==="auth/invalid-credential"){
            alert("そのようなユーザは存在しない");

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
                <h1 className="mb-4 text -2x1 text-gray-700 font-medium">ログイン</h1>

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
                     className=" bg-blue-400 text-white font-bold py-2 px-4 rounded hover:bg-blue-900">ログイン</button>
                </div>
            </form>

        </div>
    )
};

export default Login;