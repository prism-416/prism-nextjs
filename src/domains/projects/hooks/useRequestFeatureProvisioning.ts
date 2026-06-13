"use client";

import { useQueryClient } from "@tanstack/react-query";

import { requestFeatureProvisioning } from "@/domains/projects/api";
import type { FeatureProvisioningRequest } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type RequestFeatureProvisioningVariables = {
  workspaceId: string;
  projectId: string;
  featureSpecification: string;
};

function isValidRequestId(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "" && value !== "undefined" && value !== "null";
}

export function useRequestFeatureProvisioning() {
  const queryClient = useQueryClient();

  return useApiMutation<FeatureProvisioningRequest, Error, RequestFeatureProvisioningVariables>({
    mutationFn: async ({ workspaceId, projectId, featureSpecification }) => {
      const request = await requestFeatureProvisioning(workspaceId, {
        projectId,
        featureSpecification,
      });

      if (!isValidRequestId(request?.requestId)) {
        throw new Error("Feature provisioning request could not be created.");
      }

      return request;
    },
    onSuccess: (_request, { workspaceId, projectId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.agentRunHistory(workspaceId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.workItems(projectId) });
    },
  });
}
