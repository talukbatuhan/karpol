/** Site header yüksekliğini tek seferde, animasyon ara değerleri olmadan yazar. */
export function setSiteHeaderHeight(px: number) {
  document.documentElement.style.setProperty("--site-header-height", `${px}px`);
}

export function clearSiteHeaderHeight() {
  document.documentElement.style.removeProperty("--site-header-height");
}
