"use client";

import { type FormEvent, useState } from "react";
import { MoreVertical, Save, UserRound, X } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { useUpdateProfile } from "@/domains/profile/hooks/useUpdateProfile";
import type { CurrentUser } from "@/shared/types/auth";
import { getCurrentUserDisplayName } from "@/shared/utils/user-display";

type ProfileNameFieldProps = {
  user: CurrentUser;
};

function getProfileMutationErrorMessage(error: unknown) {
  const data = (error as { data?: { message?: string } } | undefined)?.data;

  return data?.message || "Name could not be updated.";
}

export function ProfileNameField({ user }: ProfileNameFieldProps) {
  const currentFullName = typeof user.fullName === "string" ? user.fullName : "";
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(currentFullName);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { mutateAsync, isPending, error, reset } = useUpdateProfile();
  const trimmedName = draftName.trim();
  const canSubmit = trimmedName.length > 0 && trimmedName.length <= 100 && trimmedName !== currentFullName;

  function startEditing() {
    setDraftName(currentFullName);
    setFieldError(null);
    reset();
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftName(currentFullName);
    setFieldError(null);
    reset();
    setIsEditing(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedName) {
      setFieldError("Name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setFieldError("Name must be 100 characters or fewer.");
      return;
    }

    setFieldError(null);

    try {
      await mutateAsync({ fullName: trimmedName, currentUser: user });
      setIsEditing(false);
    } catch {
      // Mutation error is rendered below.
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-border/80 bg-surface p-4 ${isEditing ? "" : "relative pr-14"}`}
      noValidate
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-prism-muted">
        <UserRound className="size-4" />
        Name
      </div>

      {!isEditing && (
        <div className="absolute right-3 top-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={startEditing}
            className="size-8 rounded-lg text-prism-muted hover:bg-prism-navy/5 hover:text-prism-heading"
            aria-label="Edit name"
          >
            <MoreVertical className="size-4" />
          </Button>
        </div>
      )}

      {isEditing ? (
        <div className="mt-3">
          <Input
            value={draftName}
            onChange={event => {
              setDraftName(event.target.value);
              setFieldError(null);
              reset();
            }}
            onKeyDown={event => {
              if (event.key === "Escape") {
                event.preventDefault();
                cancelEditing();
              }
            }}
            minLength={1}
            maxLength={100}
            autoComplete="name"
            className="h-10 rounded-xl border-border bg-surface-field text-sm font-medium text-prism-heading"
            autoFocus
          />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-prism-muted">{trimmedName.length}/100</span>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={cancelEditing}
                className="h-9 rounded-lg border-border/80 bg-transparent px-3 text-sm text-prism-muted hover:bg-prism-navy/5 hover:text-prism-heading"
              >
                <X className="size-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !canSubmit}
                className="h-9 rounded-lg px-3 text-sm"
              >
                <Save className="size-4" />
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 break-words text-sm font-medium text-prism-heading">
          {currentFullName || getCurrentUserDisplayName(user)}
        </div>
      )}

      {fieldError || error ? (
        <div className="mt-2 text-xs font-medium text-red-500">
          {fieldError || getProfileMutationErrorMessage(error)}
        </div>
      ) : null}
    </form>
  );
}
