function purify(input) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  const reg = /[&<>"'/]/gi;
  return String(input).replace(reg, (match) => map[match]);
}

export async function onRequestPost(context) {
  const formData = await context.request.formData();
  const input = JSON.parse(formData.get("jsonData"));
  const lat = input.lat == undefined ? undefined : purify(input.lat);
  const lng = input.lat == undefined ? undefined : purify(input.lng);
  const files = !Array.isArray(input.files)
    ? []
    : input.files.map((v) => purify(v));
  const description =
    input.description == undefined ? undefined : purify(input.description);
  const contact =
    input.description == undefined ? undefined : purify(input.contact);
  const message = [
    `<p>Hey Jack,</p>`,
    `<p>One of our neighbors just let me know of a problem in the neighborhood.</p>`,
    `<p>Here is everything they shared with me:</p>`,
  ];
  message.push(`<hr/><p><b>Where they said the problem is:</b></p>`);
  if (lat != undefined && lng != undefined) {
    message.push(
      `<p><a href="https://www.openstreetmap.org/#map=20/${lat}/${lng}">View it on a map (${lat}, ${lng})</a></p>`,
    );
  } else {
    message.push(`<p>They didn't give me a location, sorry.</p>`);
  }
  message.push("<hr/><p><b>Their photos of the problem:</b></p>");
  if (files != undefined && Array.isArray(files) && files.length > 0) {
    files
      .map(
        (v) =>
          `<a href="./image/${v}"><img src="./image/${v}" style="max-width: 300px; max-height: 300px; margin: 10px;" /></a>`,
      )
      .forEach((v) => message.push(v));
    message.push(
      "<p><i>Note: You can click on any image to view a full scale version of it</i></p>",
    );
  } else {
    message.push("<p>They didn't share any photos with me, sorry.</p>");
  }
  message.push("<hr/><p><b>Their description of the problem:</b></p>");
  if (description != undefined && description.length > 0) {
    message.push(`<p>${description}</p>`);
  } else {
    message.push("<p>They didn't describe the problem, sorry.</p>");
  }
  message.push("<hr/><p><b>Their contact Information</b></p>");
  if (contact != undefined && contact.length > 0) {
    message.push(`<p>They said you can contact them at ${contact}</p>`);
  } else {
    message.push("<p>They didn't provide any contact information, sorry.</p>");
  }
  message.push("<hr/>");
  message.push("<p>I hope this report helps.</p>");
  message.push(
    "<p>Please do not reply directly to this email, the inbox is unmonitored.<p>",
  );
  message.push(
    `<p>If you have any questions about how this email was generated, you can reach me at <a href="mailto:william@blankenship.io">william@blankenship.io</a></p>`,
  );
  message.push(`<p>Your Neighbor,<br />William</p>`);
  const headers = new Headers();
  headers.append("Content-Type", "text/html");
  const preamble = "<html><body><h1>Here is a copy of your email</h1>";
  const append = "</body></html>";
  return new Response([preamble, ...message, append].join(""), {
    headers,
  });
}
