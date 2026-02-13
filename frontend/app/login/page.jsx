// frontend/app/login/page.jsx
"use client"
import TextField from '@/ui/TextField';
import { api } from "@/lib/api";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import LoadingOverlay from "@/components/LoadingOverlay";
import ScrollReveal from "@/components/ScrollReveal";

function Login() {
  const [username,setUserName] = useState("");
  const [password,setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handelSignin(e) {
    e.preventDefault();
    if(!username || !password){
      return toast.error(`username or password not exist`);
    }
    setLoading(true);
    try {
      const res = await api.post("/users", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Wellcome To Azki Profile");
      router.push('/home', { scroll: false });
    } catch (error) {
      const msg = error?.response?.data?.detail || "error";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full h-screen">
      <LoadingOverlay show={loading} />

      <Image
        src="/Photos/Homepage_Hero.jpg"
        alt="bg"
        fill
        className="object-cover -z-10"
      />

      <div className="flex w-full h-full justify-center items-center">
        <ScrollReveal>
          <div className="w-[400px] flex flex-col items-center">
            <div className="flex justify-center -mb-8 z-10">
              <Image
                src="/Photos/Frame 35712 1.png"
                width={100}
                height={100}
                alt="logo"
              />
            </div>

            <form onSubmit={handelSignin} className="
              bg-bg-form shadow-lg rounded-2xl 
              backdrop-blur-md 
              px-8 py-10
              w-full
              flex flex-col gap-4
            ">
              <h2 className="text-center text-2xl font-semibold text-gray-800 mb-2">
                Sign in
              </h2>

              <TextField onChange={(e)=>setUserName(e.target.value)}  name="Username" label="Username" />
              <TextField onChange={(e)=>setPassword(e.target.value)} name="password" label="Password" type="password" />

              <button type='submit' className="
                bg-blue-500 hover:bg-blue-600 transition
                text-white font-semibold py-2
                rounded-xl mt-2
                w-full
              ">
                Sign In
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

export default Login;
