import { getSettings } from "./api/content";

export type Channels = {
  whatsappNumber: string | null;
  email: string | null;
  socials: { label: string; url: string }[];
  location: string | null;
};

/** Canaux de contact : uniquement les réglages du site enregistrés dans MongoDB. */
export async function getChannels(): Promise<Channels> {
  const settings = await getSettings();
  const data = settings.ok ? settings.data : null;
  return {
    whatsappNumber: data?.whatsappNumber || null,
    email: data?.email || null,
    socials: data?.socials ?? [],
    location: data?.location ?? null,
  };
}
