'use client'
import TypewriterText from "@/app/components/TypewriterText";
import Image from "next/image";
import AuthForm from "./components/AuthForm";




export default function Home() {

  return (
    <>
      <Image src="/mobileLogo.png" height={200} width={200} alt="MobileLogo" className="absolute" />
      <div className="max-lg:hidden fixed bg-cover overflow-hidden h-full -z-[1]">
        <video src="/background.mp4" autoPlay muted loop className="bg-fixed" />
      </div>
      <div className="grid max-lg:flex justify-center items-center lg:grid-cols-2 h-screen w-full bg-gradient-to-t">
        <div className="h-full w-full hidden lg:flex flex-col items-center justify-center scale-75">
          <Image alt="logo" height={600} width={600} src="/logo.png" />
          <div className="absolute pb-10 w-52 font-semibold font-sans leading-6 overflow-hidden">
            <TypewriterText text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. At aspernatur nam vero pariatur iure." />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center bg-neutral-100 max-h-fit shadow-gray-500 shadow-xl min-h-3/5 w-[55%] mx-auto">
          <AuthForm />
        </div>
      </div>
    </>
  );
}
