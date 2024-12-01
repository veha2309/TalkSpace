
import getUsers from "@/app/actions/getUsers";
import ConversationList from "./components/ConversationList"
import getConversations from "@/app/actions/getConversations";
import Sidebar from "@/app/components/Sidebar";

export default async function ConversationsLayout({
  children
}: { children: React.ReactNode }) {

  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <Sidebar>
      <div className="h-screen">
        <ConversationList
          users={users}
          initialItems={conversations}
        />
        {children}
      </div>
    </Sidebar>
  )
}
