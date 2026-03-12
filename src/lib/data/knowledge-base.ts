export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or HTML content
  category: "Material Science" | "Maintenance" | "Engineering";
  publishedAt: string;
  readTime: string;
  image?: string;
};

export const articles: Article[] = [
  {
    slug: "polyurethane-vs-rubber",
    title: "Polyurethane vs. Rubber: Which Material to Choose?",
    excerpt:
      "A comprehensive comparison of wear resistance, load-bearing capacity, and environmental resilience to help you select the right elastomer for your application.",
    category: "Material Science",
    publishedAt: "2023-10-15",
    readTime: "5 min read",
    content: `
      <h2>Introduction</h2>
      <p>When selecting an elastomer for industrial applications, the choice often comes down to Polyurethane (PU) or Rubber. While both materials have elastic properties, their chemical structures and performance characteristics differ significantly.</p>
      
      <h3>1. Wear and Abrasion Resistance</h3>
      <p>Polyurethane generally outperforms rubber in abrasion resistance. It is often referred to as "wearable rubber" because it can withstand severe sliding abrasion. For applications like mining screens, scraper blades, and chute liners, PU can last 3-4 times longer than standard rubber.</p>

      <h3>2. Load Bearing Capacity</h3>
      <p>PU has a higher load-bearing capacity than rubber. It resists compression set better under heavy loads, making it ideal for heavy-duty wheels, pads, and mounts. Rubber tends to deform permanently under similar high-stress conditions.</p>

      <h3>3. Environmental Resistance</h3>
      <ul>
        <li><strong>Oil & Grease:</strong> PU has excellent resistance to oils and solvents. Natural rubber swells and degrades quickly when exposed to hydrocarbons.</li>
        <li><strong>Heat:</strong> Special rubber compounds (like Viton or Silicone) perform better at extreme temperatures (>100°C). Standard PU is limited to around 80-90°C.</li>
        <li><strong>Hydrolysis:</strong> Standard PU can degrade in hot water/steam environments unless specific hydrolysis-resistant formulations are used.</li>
      </ul>

      <h3>Conclusion</h3>
      <p>Choose <strong>Polyurethane</strong> for high wear, high load, and oil resistance. Choose <strong>Rubber</strong> for high-temperature applications, extreme flexibility needs, or cost-sensitive projects where high performance is not critical.</p>
    `,
  },
  {
    slug: "understanding-shore-hardness",
    title: "Understanding Shore Hardness: A Guide for Engineers",
    excerpt:
      "What does Shore A 90 mean? Learn how to interpret durometer scales and specify the correct hardness for wheels, rollers, and seals.",
    category: "Engineering",
    publishedAt: "2023-11-02",
    readTime: "4 min read",
    content: `
      <h2>The Shore Scale Explained</h2>
      <p>The Shore durometer is a device for measuring the hardness of a material, typically of polymers, elastomers, and rubbers.</p>

      <h3>Shore A vs. Shore D</h3>
      <p>There are several scales, but the most common for our industry are:</p>
      <ul>
        <li><strong>Shore A:</strong> Measures softer, flexible materials. Think of a rubber band (Shore 20A) up to a shopping cart wheel (Shore 95A).</li>
        <li><strong>Shore D:</strong> Measures harder, more rigid materials. Think of a hard hat (Shore 80D) or a bowling ball.</li>
      </ul>
      <p>Note that the scales overlap. A 95 Shore A is roughly equivalent to a 45 Shore D, though they react differently to stress.</p>

      <h3>Selecting the Right Hardness</h3>
      <ul>
        <li><strong>Soft (60A - 70A):</strong> Best for grip, noise reduction, and handling rough surfaces. Examples: Drive rollers, conveyor belts.</li>
        <li><strong>Medium (80A - 90A):</strong> The industry standard for most wheels. Good balance of load capacity and cushioning.</li>
        <li><strong>Hard (90A - 60D):</strong> High load bearing, low rolling resistance, but higher vibration transfer. Examples: Pallet truck wheels, heavy-duty pads.</li>
      </ul>
    `,
  },
  {
    slug: "maintenance-guide-pu-rollers",
    title: "Maintenance Guide: Extending the Life of Polyurethane Rollers",
    excerpt:
      "Simple inspection routines and storage tips to prevent premature failure of your PU rollers and wheels.",
    category: "Maintenance",
    publishedAt: "2023-12-10",
    readTime: "3 min read",
    content: `
      <h2>Storage</h2>
      <p>Polyurethane is sensitive to UV light and moisture. Always store spare rollers in a cool, dark, and dry place. Wrap them in UV-resistant black plastic if possible to prevent "chalking" or surface degradation.</p>

      <h2>Cleaning</h2>
      <p>Avoid strong solvents like Acetone or MEK, as they can cause the PU surface to swell or crack over time. Use mild soapy water or specific industrial cleaners recommended for elastomers.</p>

      <h2>Inspection</h2>
      <p>Check for flat spots. If a heavy machine is left stationary on PU wheels for weeks, they may develop permanent flat spots (compression set). It's best to jack up equipment or rotate wheels periodically during long downtimes.</p>
    `,
  },
];

export function getAllArticles() {
  return articles;
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
