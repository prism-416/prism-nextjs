"use client";

import { AtSign, KeyRound, Mail } from "lucide-react";

import { UserAvatar } from "@/atomics/atoms/Avatar";
import { ProfileField } from "@/domains/profile/components/ProfileField";
import { ProfileNameField } from "@/domains/profile/components/ProfileNameField";
import { ProfileOAuthPasswordNotice } from "@/domains/profile/components/ProfileOAuthPasswordNotice";
import { ProfilePasswordForm } from "@/domains/profile/components/ProfilePasswordForm";
import { getCurrentUser } from "@/shared/api/auth";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";
import type { CurrentUser } from "@/shared/types/auth";
import { getCurrentUserDisplayName } from "@/shared/utils/user-display";
import { ProfileSkeleton } from "@/domains/profile/components/ProfileSkeleton";

type ProfileClientProps = {
  initialData?: CurrentUser;
};

export function ProfileClient({ initialData }: ProfileClientProps) {
  const { data: user, isPending } = useApiQuery<CurrentUser | undefined>({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: getCurrentUser,
    initialData,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isPending || !user) {
    return <ProfileSkeleton />;
  }

  const displayName = getCurrentUserDisplayName(user);

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)] sm:flex-row sm:items-center">
        <UserAvatar
          name={displayName}
          seed={user.userId}
          className="size-20 text-2xl text-primary-foreground"
        />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold text-prism-heading">{displayName}</h1>
          <p className="mt-1 truncate text-sm text-prism-muted">@{user.username}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <ProfileNameField user={user} />
        <ProfileField
          icon={AtSign}
          label="Username"
          value={`@${user.username}`}
        />
        <ProfileField
          icon={Mail}
          label="Email"
          value={user.email}
        />
        <ProfileField
          icon={KeyRound}
          label="Sign-in"
          value={user.isOAuthUser ? "OAuth" : "Email and password"}
        />
      </div>

      {user.isOAuthUser ? <ProfileOAuthPasswordNotice /> : <ProfilePasswordForm />}
    </section>
  );
}
