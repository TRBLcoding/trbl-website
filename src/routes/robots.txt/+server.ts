import { env } from "$env/dynamic/public"
import { error } from "@sveltejs/kit"

export const prerender = false

export async function GET(): Promise<Response> {
  if (!env.PUBLIC_SITE_ORIGIN) {
    throw error(500, 'PUBLIC_SITE_ORIGIN environment variable is not defined')
  }

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${env.PUBLIC_SITE_ORIGIN}/sitemap.xml`
  ].join('\n').trim()

  const headers = {
    'Content-Type': 'text/plain',
  }

  return new Response(body, { headers })
}