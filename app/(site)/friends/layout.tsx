import Sidebar from '@/app/components/Sidebar'
import FriendList from './components/FriendList';
import { getFriends } from '@/app/actions/getFriends';
import getCurrentUser from '@/app/actions/getCurrentUser';

export default async function UsersLayout({
    children
}: {
    children: React.ReactNode
}) {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
        return (
            <>
                <Sidebar>
                    <div className="
                    h-screen">
                        No Friends
                        {children}
                    </div>
                </Sidebar>
            </>
        )
    }
    const users = await getFriends(currentUser.id);

    return (
        <>
            <Sidebar>
                <div className="
                    h-screen">
                    <FriendList items={users} />
                    {children}
                </div>
            </Sidebar>
        </>
    )
}