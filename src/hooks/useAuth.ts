/**
 * useAuth Hook - Compatibility wrapper for AuthContext
 * 
 * This hook provides a compatibility layer for admin pages that were
 * importing useAuth from @/hooks/useAuth instead of using the AuthContext directly.
 * 
 * It re-exports the useAuth hook from the AuthContext to maintain compatibility.
 */

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Re-export the useAuth hook from AuthContext for compatibility
export const useAuth = useAuthContext;

// Also export other auth-related utilities for convenience
export { withAuth, usePermissions } from '@/contexts/AuthContext';

// Default export for compatibility
export default useAuth;
