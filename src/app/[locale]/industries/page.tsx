import { Metadata } from 'next'
import Link from 'next/link'
import { getIndustries } from '@/lib/data/public-data'
import { getLocalizedField, getLocalizedArray } from '@/lib/i18n-helpers'

export const metadata: Metadata = {
  title: 'Industry Solutions | KARPOL Industrial',
  description: 'Custom-engineered components for marble processing, mining, construction, automation, chemical, and food industries.',
}

export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { data: industries } = await getIndustries()

  return (
    <main>
      <header style={{ padding: '80px 0 40px', background: 'var(--bg-tertiary)' }}>
        <div className="container">
          <span className="eyebrow">Industries We Serve</span>
          <h1 className="section-title">Engineered Solutions by Industry</h1>
          <p className="section-text">
            We design and manufacture custom components tailored to the unique challenges of each industry.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: 24,
          }}>
            {industries.map((industry) => {
              const name = getLocalizedField(industry.name, locale)
              const desc = getLocalizedField(industry.description, locale)
              const challenges = getLocalizedArray(industry.challenges, locale)

              return (
                <Link
                  key={industry.id}
                  href={`/${locale}/industries/${industry.slug}`}
                  style={{
                    display: 'block',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 12,
                    padding: 32,
                    textDecoration: 'none',
                    transition: 'var(--transition)',
                  }}
                >
                  {industry.is_featured && (
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      background: '#FFF3ED',
                      color: '#E8611A',
                      borderRadius: 4,
                      marginBottom: 12,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      Featured
                    </span>
                  )}
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
                    {name}
                  </h3>
                  <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                    {desc}
                  </p>
                  {challenges.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {challenges.slice(0, 3).map((ch, i) => (
                        <span key={i} style={{
                          padding: '4px 10px',
                          fontSize: 12,
                          background: 'var(--bg-tertiary)',
                          borderRadius: 4,
                          color: 'var(--text-muted)',
                        }}>
                          {ch}
                        </span>
                      ))}
                    </div>
                  )}
                  <span style={{
                    display: 'block',
                    marginTop: 20,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#E8611A',
                  }}>
                    View Solutions →
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
