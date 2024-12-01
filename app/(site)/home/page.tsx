'use client'
import EmptyState from "@/app/components/EmptyState";

const Home = () => {

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