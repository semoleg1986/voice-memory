import { upload } from "@floot/storage";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import superjson from "superjson";
import { schema, OutputType } from "./upload_POST.schema";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    const input = schema.parse(superjson.parse(await request.text()));
    const ext = input.mimeType.includes("mp4") ? "m4a" : "webm";
    const storageFilename = `voice-memory/${user.id}/${input.id}.${ext}`;
    const result = await upload({ visibility: "private", filename: storageFilename, contentType: input.mimeType, sizeBytes: input.sizeBytes, expiresInSeconds: 3600 });
    if (!result.ok) throw new Error(result.error.message);
    return new Response(superjson.stringify({ presignedUrl: result.presignedUrl, storageFilename } satisfies OutputType));
  } catch (error: any) {
    return new Response(superjson.stringify({ error: error.message }), { status: error?.name === "NotAuthenticatedError" ? 401 : 400 });
  }
}
