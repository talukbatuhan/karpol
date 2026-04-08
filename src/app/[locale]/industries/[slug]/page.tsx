import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getIndustryBySlug } from '@/lib/data/public-data'
import { getLocalizedField, getLocalizedArray } from '@/lib/i18n-helpers'

type IndustryDetailProps = {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: IndustryDetailProps): Promise<Metadata> {
  const { slug, locale } = await params
  const { data: industry } = await getIndustryBySlug(slug)

  if (!industry) return { title: 'Industry Not Found | KARPOL' }

  const name = getLocalizedField(industry.name, locale)
  const desc = getLocalizedField(industry.description, locale)

  return {
    title: `${name} | KARPOL Industrial Solutions`,
    description: desc,
  }
}

export default async function IndustryDetailPage({ params }: IndustryDetailProps) {
  const { slug, locale } = await params
  const { data: industry, error } = await getIndustryBySlug(slug)

  if (error || !industry) notFound()

  const name = getLocalizedField(industry.name, locale)
  const desc = getLocalizedField(industry.description, locale)
  const challenges = getLocalizedArray(industry.challenges, locale)
  const solutions = getLocalizedArray(industry.solutions, locale)

  return (
    <main>
      <header style={{ padding: '80px 0 48px', background: 'var(--bg-tertiary)' }}>
        <div className="container">
          <Link href={`/${locale}/industries`} style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            ← All Industries
          </Link>
          <h1 className="section-title" style={{ marginTop: 16 }}>{name}</h1>
          <p className="section-text">{desc}</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            {/* Challenges */}
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: 'var(--text-main)' }}>
                Industry Challenges
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {challenges.map((challenge, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 20px',
                    background: '#FEF3C7',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#92400E',
                  }}>
                    <span>⚠️</span>
                    {challenge}
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: 'var(--text-main)' }}>
                Our Solutions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {solutions.map((solution, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 20px',
                    background: '#D1FAE5',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#065F46',
                  }}>
                    <span>✅</span>
                    {solution}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{
            marginTop: 64,
            padding: 48,
            background: '#1A1A2E',
            borderRadius: 16,
            textAlign: 'center',
            color: '#fff',
          }}>
            <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
              Need custom components for {name.toLowerCase()}?
            </h3>
            <p style={{ fontSize: 16, color: '#94A3B8', maxWidth: 600, margin: '0 auto 24px' }}>
              Our engineering team specializes in designing components that solve the specific challenges of your industry.
            </p>
            <Link
              href={`/${locale}/contact`}
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: '#E8611A',
                color: '#fff',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Contact Engineering Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
