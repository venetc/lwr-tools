export interface PageRoute {
  /** Absolute path of the page without a trailing slash; `/` is the root. */
  path: string
  /** Label of the page in the title chain; the root and section index pages may have none. */
  title?: string
  /** One sentence about the page. */
  description: string
}

export interface PageSite {
  /** Site name: ends every title and stands for the root in the chain. */
  name: string
  /** Tagline after the name in the title of the root. */
  tagline: string
  /** Absolute URL of the site root without a trailing slash. */
  url: string
  /** Path of the link preview image from the site root. */
  image: string
  /** Path of the home screen icon from the site root. */
  touchIcon: string
  /** Color of the browser bar. */
  themeColor: string
  /** schema.org `applicationCategory` of the site in the structured data of the root. */
  applicationCategory: string
}

/** Structured data of schema.org, serialized as is. */
export type JsonLd = Readonly<Record<string, unknown>>;

export interface PageHead {
  /** Document title. */
  title: string
  /** Description of the page; null off the route list. */
  description: string | null
  /** Absolute URL of the page without a trailing slash; null off the route list. */
  canonical: string | null
  /** `robots` meta: `noindex` off the route list, null on it. */
  robots: string | null
  /** Site name for link previews. */
  siteName: string
  /** Absolute URL of the link preview image. */
  image: string
  /** Absolute URL of the home screen icon. */
  touchIcon: string
  /** Color of the browser bar. */
  themeColor: string
  /** Structured data of the page; null off the route list. */
  jsonLd: JsonLd | null
}
