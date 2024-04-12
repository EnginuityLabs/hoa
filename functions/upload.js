export async function onRequestPost(context) {
  const uuid = crypto.randomUUID();
  const formData = await context.request.formData();
  await context.env.BUCKET.put(uuid, formData.get("file"));
  console.log(`uploaded ${uuid}`);
  return new Response(JSON.stringify({ file: uuid }));
}
