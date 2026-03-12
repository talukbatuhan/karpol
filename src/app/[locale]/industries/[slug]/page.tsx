type IndustryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Industries</span>
        <h1 className="section-title">{slug}</h1>
        <p className="section-text">
          Bu detay sayfası bir sonraki adımda ilgili ürünler ve çözüm blokları
          ile genişletilecek.
        </p>
      </div>
    </main>
  );
}
