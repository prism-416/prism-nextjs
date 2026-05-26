"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { ProjectDeleteDialog } from "@/domains/projects/components/ProjectDeleteDialog";
import { ProjectEditDialog } from "@/domains/projects/components/ProjectEditDialog";
import { ProjectSettingsCard } from "@/domains/projects/components/ProjectSettingsCard";
import type { Project } from "@/domains/projects/types";
import { useWorkspaceMembers } from "@/domains/workspaces/hooks/useWorkspaceMembers";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";

type ProjectSettingsClientProps = {
  project: Project;
  workspaceOwnerId?: string;
  workspaceSlug?: string;
};

export function ProjectSettingsClient({ project, workspaceOwnerId, workspaceSlug }: ProjectSettingsClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const { data: members } = useWorkspaceMembers(project.workspaceId);
  const currentMember = members?.find(member => member.userId === currentUser?.userId);
  const isWorkspaceOwner = currentUser?.userId === workspaceOwnerId;
  const canManage = isWorkspaceOwner || currentMember?.role === "admin";
  const canDelete = isWorkspaceOwner;

  const workspaceHref = workspaceSlug ? `/workspaces/${encodeURIComponent(workspaceSlug)}` : "/workspaces";

  return (
    <>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <div>
          <h1 className="text-xl font-semibold text-prism-heading">Settings</h1>
          <p className="mt-1 text-sm text-prism-muted">Manage this project profile.</p>
        </div>

        <ProjectSettingsCard
          project={project}
          canManage={canManage}
          onEdit={() => setIsEditing(true)}
        />
      </section>

      {canDelete && (
        <section className="mx-auto mt-8 w-full max-w-6xl overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]">
          <div className="flex items-center gap-2 border-b border-border/60 px-5 py-3">
            <TriangleAlert className="size-3.5 text-prism-danger" />
            <h2 className="text-sm font-semibold text-prism-danger">Danger Zone</h2>
          </div>

          <div className="divide-y divide-border/60">
            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-prism-heading">Delete project</p>
                <p className="mt-0.5 text-xs text-prism-muted">
                  Permanently delete this project and all its data. This action cannot be undone.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteOpen(true)}
                className="h-9 shrink-0 rounded-lg border-[#DC2626]/30 bg-transparent px-4 text-sm text-prism-danger hover:border-[#DC2626]/50 hover:bg-[#DC2626]/5 hover:text-prism-danger"
              >
                Delete project
              </Button>
            </div>
          </div>
        </section>
      )}

      {isEditing && (
        <ProjectEditDialog
          key={project.projectId}
          project={project}
          open
          onOpenChange={open => {
            if (!open) setIsEditing(false);
          }}
        />
      )}

      <ProjectDeleteDialog
        project={project}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDeleted={() => router.push(workspaceHref)}
      />
    </>
  );
}
