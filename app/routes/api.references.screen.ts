import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { getInspoScreen } from '~/lib/services/inspoClient.server';

function extractSlug(input: string): string {
  const trimmed = input.trim().replace(/\/+$/, '');
  const segments = trimmed.split('/');

  return segments[segments.length - 1];
}

export async function action({ request }: ActionFunctionArgs) {
  const { slugOrUrl } = await request.json<{ slugOrUrl: string }>();

  if (!slugOrUrl?.trim()) {
    return Response.json({ error: 'Missing slug or URL' }, { status: 400 });
  }

  try {
    const result = await getInspoScreen(extractSlug(slugOrUrl));
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Lookup failed' }, { status: 500 });
  }
}
