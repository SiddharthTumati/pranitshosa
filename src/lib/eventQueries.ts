/** Shared PostgREST select for event rows + approver name (audit trail). */
export const EVENTS_WITH_AUDIT_SELECT =
  "*, approver:profiles!events_approved_by_fkey(full_name)" as const;
