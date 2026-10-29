import { redirect } from "next/navigation";

/**
 * Cible des liens et QR codes d'invitation générés par l'API (/join/{code}).
 * Renvoie vers le formulaire de participation avec le code pré-rempli.
 */
export default async function JoinByCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  redirect(`/groups/join?code=${encodeURIComponent(code.toUpperCase().slice(0, 6))}`);
}
