export async function onRequest(context) {
  const object = await context.env.BUCKET.get(context.params.name);
  if (object === null) {
    return new Response("Image Not Found", { status: 404 });
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  return new Response(object.body, { headers });
}
