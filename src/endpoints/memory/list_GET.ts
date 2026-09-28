import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import superjson from "superjson";
import type { OutputType } from "./list_GET.schema";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    const rows = await db.selectFrom("voiceMemories")
      .select(["id","transcript","durationSeconds","createdAt"])
      .where("userId","=",String(user.id)).where("status","=","ready")
      .orderBy("createdAt","desc").limit(100).execute();
    return new Response(superjson.stringify({ items: rows.map(r => ({ id:r.id, transcript:r.transcript ?? "", durationSeconds:r.durationSeconds, createdAt:new Date(r.createdAt as any).toISOString() })) } satisfies OutputType));
  } catch (error: any) {
    return new Response(superjson.stringify({ error:error.message }), { status:401 });
  }
}
