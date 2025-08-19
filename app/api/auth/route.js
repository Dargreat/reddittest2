export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.REDDIT_CLIENT_ID,
    response_type: 'code',
    state: 'RANDOM_STRING',
    redirect_uri: process.env.REDDIT_REDIRECT_URI,
    duration: 'temporary',
    scope: 'read'
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://www.reddit.com/api/v1/authorize?${params.toString()}`
    }
  });
}