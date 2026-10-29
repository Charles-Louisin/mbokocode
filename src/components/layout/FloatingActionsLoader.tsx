import { getChannels } from "@/src/lib/channels";
import { whatsappLink } from "@/src/lib/whatsapp";
import { FloatingActions } from "./FloatingActions";

// Le lien WhatsApp vient des réglages du site (MongoDB) ; sans numéro, le bouton n'apparaît pas.
export async function FloatingActionsLoader() {
  const { whatsappNumber } = await getChannels();
  return <FloatingActions whatsappHref={whatsappLink(whatsappNumber, "Bonjour Charles, je voudrais parler d'un projet.")} />;
}
