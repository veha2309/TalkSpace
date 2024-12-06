import { useEffect, useState } from "react";
import axios from "axios";

const useIsFriend = (profileUserId: string) => {
    const [isFriend, setIsFriend] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIsFriend = async () => {
                setLoading(true);
                setError(null);

                await axios.get(`/api/friend/isfriend`, {
                    params: { profileUserId },
                })
                .then((response) => setIsFriend(response.data.isFriend))
                .catch ((err)=>setError(err?.response?.data?.message || "Error checking friend status"))
            .finally(()=>setLoading(false))
        };

        if (profileUserId) {
            fetchIsFriend();
        }
    }, [profileUserId]);

    return { isFriend, loading, error };
};

export default useIsFriend;
