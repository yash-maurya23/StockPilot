import { getAuth } from "@/lib/better-auth/auth";

export const POST = async (req: Request) => {
    const auth = await getAuth();
    const handler = auth.toNextJsHandler();
    return handler.POST(req);
};

export const GET = async (req: Request) => {
    const auth = await getAuth();
    const handler = auth.toNextJsHandler();
    return handler.GET(req);
};
