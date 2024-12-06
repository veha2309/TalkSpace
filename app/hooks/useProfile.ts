import { useParams } from "next/navigation";
import { useMemo } from "react";

const useProfile = () =>{
    const params =  useParams();
    const userId = useMemo(()=>{
        if(!params?.userId){
            return '';
        }
        return params.userId as string;
    }, [params?.userId]);

    const isOpen = useMemo(()=> !!userId, [userId]);
    return useMemo(()=>({
        isOpen,
        userId,
    }), [isOpen, userId]);
};
export default useProfile