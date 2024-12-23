
import getProfileById from "@/app/actions/getProfileById";
import ProfileWindow from "@/app/components/ProfileWindow";

type Params = Promise<{ userId: string }>

const HomeProfile = async (props: { params: Params }) => {
    const params = await props.params
    const userId = params.userId;

    const user = await getProfileById(userId)

    return (
        <>
            <div className="
                lg:pl-80
                h-full
                ">
                <div className="h-screen block">
                    {user ? <ProfileWindow user={user} /> : <></>}
                </div>
            </div>
        </>
    );
}

export default HomeProfile;