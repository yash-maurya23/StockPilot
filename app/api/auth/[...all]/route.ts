import { getAuth } from "@/lib/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const GET = async (req: Request) => {
  return toNextJsHandler(await getAuth()).GET(req);
};

export const POST = async (req: Request) => {
  return toNextJsHandler(await getAuth()).POST(req);
};