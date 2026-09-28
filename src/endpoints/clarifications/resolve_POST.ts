import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import superjson from "superjson";
import { schema } from "./resolve_POST.schema";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    const input = schema.parse(superjson.parse(await request.text()));
    const clarification = await db.selectFrom("clarifications").selectAll()
      .where("id","=",input.id).where("userId","=",String(user.id)).where("status","=","pending").executeTakeFirst();
    if (!clarification) throw new Error("Уточнение не найдено");
    if (input.action === "dismiss") {
      await db.updateTable("clarifications").set({ status:"dismissed", resolvedAt:new Date() }).where("id","=",clarification.id).execute();
      return new Response(superjson.stringify({ ok:true }));
    }
    let personId = clarification.proposedPersonId;
    if (input.action === "create" || !personId) {
      personId = crypto.randomUUID();
      await db.insertInto("people").values({ id:personId, userId:String(user.id), displayName:clarification.mentionedName, aliases:[], description:null, organization:null }).execute();
    }
    await db.insertInto("memoryPeople").values({ memoryId:clarification.memoryId, personId, relation:"mentioned", confidence:input.action==="accept"?0.85:1 }).onConflict(oc=>oc.columns(["memoryId","personId"]).doNothing()).execute();
    await db.updateTable("clarifications").set({ status:"resolved", resolvedAt:new Date(), proposedPersonId:personId }).where("id","=",clarification.id).execute();
    return new Response(superjson.stringify({ ok:true }));
  } catch (error:any) {
    return new Response(superjson.stringify({ error:error.message }), { status:400 });
  }
}
