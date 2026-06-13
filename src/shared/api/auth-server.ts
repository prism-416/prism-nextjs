import "server-only";

import { cache } from "react";

import { getCurrentUser } from "@/shared/api/auth";

export const getCurrentUserCached = cache(getCurrentUser);
