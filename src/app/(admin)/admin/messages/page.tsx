import { db } from "@/lib/db";
import { MessagesList } from "@/components/admin/MessagesList";

export default async function AdminMessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: { listing: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Messages</h1>
      <p className="mt-1 text-muted-foreground">
        Everyone who contacted you via the Contact form or a listing inquiry. Add private
        notes and a follow-up date to keep track of who you still need to reply to.
      </p>

      <div className="mt-8">
        <MessagesList messages={messages} />
      </div>
    </div>
  );
}
