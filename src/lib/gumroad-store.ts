// The Gumroad store address. Change it here and every buy link on the site follows,
// including links stored in the database or typed into Admin with an older address.
export const gumroadStore = "https://mawgroupofcompanies.gumroad.com";

/** A product's checkout page, from its Gumroad code (e.g. "vlepqs"). */
export const gumroadLink = (code: string) => `${gumroadStore}/l/${code}`;

// Store product links on any store address. Gumroad's own app, API and file hosts are left alone.
const storeProductLink =
  /^https?:\/\/(?:(?!app\.|api\.|public-files\.)[a-z0-9-]+\.)?gumroad\.com(\/l\/.+)$/i;

/** Moves a Gumroad product link onto the current store address. Other links are returned as they are. */
export function onStore<T extends string | null | undefined>(url: T): T {
  if (!url) return url;
  const m = url.trim().match(storeProductLink);
  return (m ? `${gumroadStore}${m[1]}` : url) as T;
}
