;
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: "خانه | پروفایل ازکی",
};

export default function Home() {
  return (
    <div className="relative w-full h-screen">

      {/* Background */}
      <Image
        src="/Photos/Homepage_Hero.jpg"
        alt="bg"
        fill
        className="object-cover -z-10"
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center w-full ">

        <div className="w-10/12 flex items-center justify-between ">
                  {/* LEFT CONTENT (TEXTS) */}
          <div className="flex flex-col w-1/2  items-start">
            
            <h1 className="text-6xl font-extrabold text-black leading-tight">
              Welcome To
            </h1>

            <h1 className="text-6xl font-extrabold text-black leading-tight mt-2">
              Azki Operations
            </h1>

            <p className="mt-6 text-gray-700 text-lg ">
              Your workspace for performance, insights and daily workflow on app
            </p>

      <div>
        <Link href={"/signin"}><button className='bg-blue-500 mt-4 text-white px-8 py-2 rounded-2xl shadow-blue-200 shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center font-normal'>Sign In</button></Link>
      </div>
          </div>
                  {/* RIGHT IMAGE */}
          <div className="flex justify-center w-1/2">
            <Image
              src="/Photos/Rectangle.png"
              alt="bg"
              width={350}
              height={350}
              className="drop-shadow-xl"
            />
          </div> 

        </div>

      </div>
    </div>
  );
}




