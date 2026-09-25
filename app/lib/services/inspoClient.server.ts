import { experimental_createMCPClient } from 'ai';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('inspo-client');

const INSPO_MCP_URL = 'https://inspomcp.dev/api/mcp';

type InspoClient = Awaited<ReturnType<typeof experimental_createMCPClient>>;

let clientPromise: Promise<InspoClient> | null = null;

function getClient(): Promise<InspoClient> {
  if (!clientPromise) {
    clientPromise = experimental_createMCPClient({
      transport: new StreamableHTTPClientTransport(new URL(INSPO_MCP_URL)),
    }).catch((error) => {
      clientPromise = null;
      throw error;
    });
  }

  return clientPromise;
}

function unwrapToolResult<T>(result: unknown): T {
  if (result && typeof result === 'object' && 'content' in result) {
    const content = (result as { content?: Array<{ type: string; text?: string }> }).content;
    const textPart = content?.find((part) => part.type === 'text' && typeof part.text === 'string');

    if (textPart?.text) {
      return JSON.parse(textPart.text) as T;
    }
  }

  return result as T;
}

async function callTool<T = unknown>(toolName: string, args: Record<string, unknown>): Promise<T> {
  const client = await getClient();
  const tools = await client.tools();
  const tool = tools[toolName];

  if (!tool?.execute) {
    throw new Error(`Inspo tool "${toolName}" is not available`);
  }

  const result = await tool.execute(args, { toolCallId: `inspo-${toolName}-${Date.now()}`, messages: [] });

  return unwrapToolResult<T>(result);
}

export interface InspoSearchParams {
  query?: string;
  style?: string;
  industry?: string;
  vibe?: string;
  color?: string;
  pageType?: string;
  limit?: number;
}

export async function searchInspoScreens(params: InspoSearchParams) {
  try {
    return await callTool('search_screens', { detail: 'concise', ...params });
  } catch (error) {
    logger.error('search_screens failed', error);
    throw error;
  }
}

export async function getInspoFilters() {
  try {
    return await callTool('get_filters', {});
  } catch (error) {
    logger.error('get_filters failed', error);
    throw error;
  }
}

export async function getInspoScreen(slug: string) {
  try {
    return await callTool('get_screen', { slug });
  } catch (error) {
    logger.error('get_screen failed', error);
    throw error;
  }
}
