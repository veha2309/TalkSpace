import getProfileById from "@/app/actions/getProfileById";
import ProfileWindow from "@/app/components/ProfileWindow";
import clsx from "clsx";

type Params = Promise<{ userId: string }>

const Profile = async (props: { params: Params }) => {
    const params = await props.params
    const userId = params.userId;

    const user = await getProfileById(userId)

    return (
        <>
            <div className="
                lg:pl-80
                h-full
                ">
                <div className={clsx("h-screen")}>                 
                    {user ? <ProfileWindow user={user} /> : <></>}
                </div>
            </div>
        </>
    );
}

export default Profile;