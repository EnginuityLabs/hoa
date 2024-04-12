export async function onRequestPost(context) {
  const name = crypto.randomUUID() + ".png";
  const formData = await context.request.formData();
  await context.env.BUCKET.put(name, formData.get("file"));
  console.log(`uploaded ${name}`);
  return new Response(JSON.stringify({ name }));
}
