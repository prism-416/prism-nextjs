/**
 * Centralized Query Key Factory
 *
 * Usage:
 * - QUERY_KEYS.user.detail()
 * - QUERY_KEYS.product.list({ category: 'something' })
 */
const templateStatusKeys = {
  all: ["template-status"] as const,
  detail: () => [...templateStatusKeys.all, "detail"] as const,
};

export const QUERY_KEYS = {
  templateStatus: templateStatusKeys,
} as const;
