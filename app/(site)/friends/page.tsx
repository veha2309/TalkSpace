'use client'
import EmptyState from "@/app/components/EmptyState";
import useProfile from "@/app/hooks/useProfile";
import clsx from "clsx";

const Home = () => {

    const {isOpen} = useProfile();

    return (
        <>
            <div className={clsx(`
        lg:pl-80 h-full lg:block
        `, isOpen ? 'block' : 'hidden')}>
            <EmptyState />
        </div>
        </>
    );
}

export default Home;