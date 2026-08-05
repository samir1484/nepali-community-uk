"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/generated/prisma/client";
import { updateUserRole, setUserBlocked } from "@/lib/actions/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UsersTable({ users }: { users: User[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleRoleChange(userId: string, role: string) {
    setPendingId(userId);
    startTransition(async () => {
      await updateUserRole(userId, role);
      router.refresh();
      setPendingId(null);
    });
  }

  function handleBlockToggle(user: User) {
    const blocking = !user.isBlocked;
    if (
      blocking &&
      !window.confirm(
        `Block ${user.name}? They won't be able to log in or post anything until you unblock them. Their existing listings stay up.`
      )
    ) {
      return;
    }

    setPendingId(user.id);
    startTransition(async () => {
      const result = await setUserBlocked(user.id, blocking);
      setMessage({ type: result.success ? "success" : "error", text: result.message });
      router.refresh();
      setPendingId(null);
    });
  }

  return (
    <div className="space-y-3">
      {message && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === "success"
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}
      {users.map((user) => (
        <div
          key={user.id}
          className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">
                {user.name}
                {user.isBlocked && (
                  <Badge variant="destructive" className="ml-2 align-middle">
                    Blocked
                  </Badge>
                )}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                {user.phone && <span>{user.phone}</span>}
                {user.location && <span>{user.location}</span>}
                {user.address && <span>{user.address}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">{user.userType}</Badge>
            <Select
              value={user.role}
              onValueChange={(role) => role && handleRoleChange(user.id, role)}
            >
              <SelectTrigger className="w-32" disabled={isPending && pendingId === user.id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={user.isBlocked ? "outline" : "destructive"}
              size="sm"
              disabled={isPending && pendingId === user.id}
              onClick={() => handleBlockToggle(user)}
            >
              {user.isBlocked ? "Unblock" : "Block"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
