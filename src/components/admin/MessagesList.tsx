import Link from "next/link";
import type { ContactMessage, Listing } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { NotesCell } from "@/components/admin/NotesCell";
import { typeToPath } from "@/lib/validation/listings";

type MessageWithListing = ContactMessage & { listing: Listing | null };

export function MessagesList({ messages }: { messages: MessageWithListing[] }) {
  if (messages.length === 0) {
    return <p className="text-sm text-muted-foreground">No messages yet.</p>;
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div key={msg.id} className="rounded-lg border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={msg.source === "CONTACT_FORM" ? "secondary" : "default"}>
                  {msg.source === "CONTACT_FORM" ? "Contact form" : "Listing inquiry"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {msg.createdAt.toLocaleDateString("en-GB")}
                </span>
              </div>
              <p className="mt-1 font-medium text-foreground">
                {msg.name} <span className="font-normal text-muted-foreground">({msg.email})</span>
              </p>
              {msg.listing && (
                <Link
                  href={`/${typeToPath(msg.listing.type)}/${msg.listing.id}`}
                  target="_blank"
                  className="text-sm text-primary underline underline-offset-4"
                >
                  Re: {msg.listing.title}
                </Link>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{msg.messageBody}</p>
            </div>
          </div>

          <div className="mt-4 border-t pt-3">
            <NotesCell id={msg.id} initialNotes={msg.notes ?? ""} initialFollowUpAt={msg.followUpAt} />
          </div>
        </div>
      ))}
    </div>
  );
}
