import { setAccessToken } from '@/lib/tokenStore';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  const authString = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');
  
  try {
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'myRedditApp/0.1 by Technical_Desk3049'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDDIT_REDIRECT_URI
      })
    });

    const data = await response.json();
    
    if (data.access_token) {
      setAccessToken(data.access_token);
      return new Response(null, {
        status: 302,
        headers: { Location: '/' }
      });
    }
    
    return new Response('Authentication failed', { status: 400 });
  } catch (error) {
    return new Response('Server error', { status: 500 });
  }
}