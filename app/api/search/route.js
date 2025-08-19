import { getAccessToken } from '@/lib/tokenStore';

export async function GET(request) {
  const token = getAccessToken();
  if (!token) {
    return new Response('Not authenticated', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return new Response('Missing search query', { status: 400 });
  }

  try {
    const response = await fetch(`https://oauth.reddit.com/subreddits/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'myRedditApp/0.1 by Technical_Desk3049'
      }
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data = await response.json();
    const subreddits = data.data.children.map(child => ({
      name: child.data.display_name,
      url: `https://reddit.com${child.data.url}`,
      subscribers: child.data.subscribers,
      activeUsers: child.data.active_user_count,
      description: child.data.public_description
    }));

    return Response.json(subreddits);
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}