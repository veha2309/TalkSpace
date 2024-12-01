'use client'
import EmptyState from "@/app/components/EmptyState";
import { signOut } from "next-auth/react";




const Home = () => {




    const handleClick = () => {
        signOut({ callbackUrl: '/', redirect: true });
    }


    return (
        <>
            <div className="
                hidden
                lg:block
                lg:pl-80
                h-full
                ">
                <EmptyState />
            </div>
        </>
    );
}

export default Home;