/**
 * Better Auth API Route Handler
 *
 * This catch-all route handles all Better Auth endpoints:
 * - POST /api/auth/sign-up/email - User registration
 * - POST /api/auth/sign-in/email - User login
 * - POST /api/auth/sign-out - User logout
 * - GET /api/auth/session - Get current session
 * - GET /api/auth/token - Get JWT token
 *
 * @see https://www.better-auth.com/docs/integrations/next
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Export GET and POST handlers for the catch-all route
export const { GET, POST } = toNextJsHandler(auth);
