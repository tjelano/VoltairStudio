import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { searchInspoScreens, type InspoSearchParams } from '~/lib/services/inspoClient.server';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const params = await request.json<InspoSearchParams>();
    const result = await searchInspoScreens(params);

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Search failed' }, { status: 500 });
  }
}
