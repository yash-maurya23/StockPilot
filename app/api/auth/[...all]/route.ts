import { auth } from "@/lib/better-auth/auth";

export const { POST, GET } = auth.toNextJsHandler();
