/** E-katalog okuyucu: /e-katalog/[slug] (liste sayfası /e-katalog hariç). */
export function isEcatalogReaderPath(pathname: string): boolean {
  return /^\/e-katalog\/[^/]+$/.test(pathname);
}
