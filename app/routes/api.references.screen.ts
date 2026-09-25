import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { getInspoScreen } from '~/lib/services/inspoClient.server';

function extractSlug(input: string): string {
  let path = input.trim();

  try {
    path = new URL(path).pathname;
  } catch {
    path = path.split(/[?#]/)[0];
  }

  const segments = path.replace(/\/+$/, '').split('/');

  return decodeURIComponent(segments[segments.length - 1] ?? '');
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { slugOrUrl } = await request.json<{ slugOrUrl: string }>();

    if (!slugOrUrl?.trim()) {
      return Response.json({ error: 'Missing slug or URL' }, { status: 400 });
    }

    const result = await getInspoScreen(extractSlug(slugOrUrl));

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Lookup failed' }, { status: 500 });
  }
}
