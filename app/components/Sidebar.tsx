import MobileFooter from "./MobileFooter";
import ProfileDrawer from "./ProfileDrawer";
import getCurrentUser from "@/app/actions/getCurrentUser"

async function Sidebar({ children }: { children: React.ReactNode }) {
    const currentUser = await getCurrentUser();
    return (
        <div className="h-full">
            <MobileFooter/>
            {currentUser!==null ? <ProfileDrawer currentUser={currentUser} /> : null}
            <main className="lg:pl-20 h-full">
                {children}
            </main>
        </div>
    )
}
export default Sidebar;