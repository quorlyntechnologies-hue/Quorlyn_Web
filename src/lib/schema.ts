import { company, contact, socials } from "@/content/company";

/**
 * Organization structured data.
 *
 * Only fields backed by verified facts are emitted. Unconfirmed contact details
 * are omitted rather than guessed — bad structured data is worse than none,
 * and search engines surface it as if the company had asserted it.
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName,
  alternateName: company.name,
  url: company.url,
  description: company.descriptor,
  foundingDate: company.founded,
  address: {
    "@type": "PostalAddress",
    addressLocality: company.location.locality,
    addressRegion: company.location.region,
    addressCountry: company.location.countryCode,
    ...(contact.streetAddress ? { streetAddress: contact.streetAddress } : {}),
  },
  ...(contact.email ? { email: contact.email } : {}),
  ...(contact.phone ? { telephone: contact.phone } : {}),
  ...(socials.length ? { sameAs: socials.map((s) => s.href) } : {}),
};

/** Per-page breadcrumb trail. */
export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${company.url}${item.path}`,
    })),
  };
}
