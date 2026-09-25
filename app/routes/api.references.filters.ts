import { type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { getInspoFilters } from '~/lib/services/inspoClient.server';

export async function loader(_args: LoaderFunctionArgs) {
  try {
    const result = await getInspoFilters();
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Failed to load filters' }, { status: 500 });
  }
}
