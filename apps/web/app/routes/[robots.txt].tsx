export const loader = () => {
  const robotText = `
      User-agent: Googlebot
      Allow: /

      User-agent: *
      Disallow: /
      `;

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
