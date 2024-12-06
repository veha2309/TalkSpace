import { useEffect, useState } from "react";
import useActiveList from "./useActiveList"
import { Channel, Members } from "pusher-js";
import { pusherClient } from "../libs/pusher";

interface Member {
    id: string; // Include other properties if necessary
}


const useActiveChannel = () => {
    const { set, add, remove } = useActiveList();
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

    useEffect(() => {
        let channel = activeChannel;

        if(!channel){
            channel = pusherClient.subscribe('presence-messenger')
            setActiveChannel(channel)
        }

        channel.bind('pusher:subscription_succeeded' , (members : Members) => {
            const initialMembers : string[] = [];

            members.each((members : Member) => initialMembers.push(members.id));
            set(initialMembers);
        })

        channel.bind('pusher:member_added' , (member : Member) => {
            add(member.id);
        });

        channel.bind('pusher:member_removed' , (member : Member) =>{
            remove(member.id)
        })

        return () => {
            if(activeChannel) {
                pusherClient.unsubscribe('presence-messenger');
                setActiveChannel(null)
            }
        }
    } ,[activeChannel , set, add, remove])

}

export default useActiveChannel; 