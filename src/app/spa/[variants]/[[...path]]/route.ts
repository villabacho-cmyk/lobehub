import { NextResponse } from 'next/server';
// @ts-ignore
import { desktopHtmlTemplate, mobileHtmlTemplate } from './spaHtmlTemplates';

export const GET = async (request: Request, { params }: { params: { variants: string } }) => {
  const isMobile = params.variants === 'mobile';

  // Wir nehmen das Template, das unser neues Skript gerade generiert hat
  const html = isMobile ? mobileHtmlTemplate : desktopHtmlTemplate;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};

export const runtime = 'nodejs';
