import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import superjson from "superjson";
import type { OutputType } from "./list_GET.schema";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    const rows = await db.selectFrom("people").select(["id","displayName","organization","description"]).where("userId","=",String(user.id)).orderBy("displayName").execute();
    return new Response(superjson.stringify({ items:rows } satisfies OutputType));
  } catch (error:any) {
    return new Response(superjson.stringify({ error:error.message }), { status:401 });
  }
}
