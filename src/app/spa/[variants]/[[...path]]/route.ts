import { redirect } from 'next/navigation';

export async function GET() {
  // Schickt jeden, der auf /spa/... landet, zurück zur funktionierenden Root-Seite
  redirect('/');
}

export const runtime = 'nodejs';
