export async function onRequestPost(context) {
  const uuid = crypto.randomUUID();
  await context.env.BUCKET.put(uuid, context.request.body);
  console.log(`uploaded ${uuid}`);
  return new Response(JSON.stringify({ file: uuid }));
}
