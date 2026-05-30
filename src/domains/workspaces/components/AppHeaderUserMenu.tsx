"use client";

import { useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/app/_providers/AuthProvider";
import { Button } from "@/atomics/atoms/Button";
import { UserAvatar } from "@/atomics/atoms/Avatar";
import { Skeleton } from "@/atomics/atoms/Skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import { getCurrentUserDisplayName } from "@/shared/utils/user-display";

export function AppHeaderUserMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearSession } = useAuth();
  const { data: currentUser, isPending } = useCurrentUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await clearSession();
      queryClient.clear();
      router.replace("/sign-in");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isPending && !currentUser) {
    return <Skeleton className="size-9 shrink-0 rounded-full bg-prism-navy/10" />;
  }

  const displayName = currentUser ? getCurrentUserDisplayName(currentUser) : "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`${displayName} menu`}
          className="size-9 rounded-full p-0 hover:bg-prism-navy/5"
        >
          <UserAvatar
            name={displayName}
            seed={currentUser?.userId}
            className="size-9 text-sm text-primary-foreground"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-64">
        <div className="flex items-center gap-3 px-3 py-3">
          <UserAvatar
            name={displayName}
            seed={currentUser?.userId}
            className="size-10 text-sm text-primary-foreground"
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-prism-heading">{displayName}</div>
            {currentUser?.email ? <div className="truncate text-xs text-prism-muted">{currentUser.email}</div> : null}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          asChild
          className="gap-2.5 whitespace-nowrap"
        >
          <Link href="/profile">
            <UserRound className="size-4 text-prism-muted" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={isLoggingOut}
          onSelect={() => {
            void handleLogout();
          }}
          className="gap-2.5 whitespace-nowrap text-prism-danger data-[highlighted]:bg-prism-danger-soft/25 data-[highlighted]:text-prism-danger"
        >
          <LogOut className="size-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
