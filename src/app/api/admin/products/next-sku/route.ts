import { NextRequest, NextResponse } from 'next/server'
import { requireAdminContext } from '@/lib/auth/admin-guard'
import { enforceRateLimit } from '@/lib/security/rate-limit'
import { createAdminClient } from '@/lib/supabase-admin'

const DEFAULT_BRAND = 'KRP'
const DEFAULT_PADDING = 3

function buildPattern(brand: string, prefix: string) {
  const safeBrand = brand.replace(/[^A-Z0-9]/gi, '').toUpperCase() || DEFAULT_BRAND
  const safePrefix = prefix.replace(/[^A-Z0-9]/gi, '').toUpperCase()
  return `${safeBrand}-${safePrefix}-`
}

export async function GET(request: NextRequest) {
  const throttled = await enforceRateLimit(request, 'admin-api')
  if (throttled) return throttled

  const { denied } = await requireAdminContext(request)
  if (denied) return denied

  const params = request.nextUrl.searchParams
  const categoryId = params.get('categoryId')
  const padding = Math.max(
    1,
    Math.min(6, Number.parseInt(params.get('padding') || '', 10) || DEFAULT_PADDING),
  )
  const brand = params.get('brand') || DEFAULT_BRAND

  if (!categoryId) {
    return NextResponse.json(
      { error: 'Missing categoryId' },
      { status: 400 },
    )
  }

  const supabase = createAdminClient()

  const { data: category, error: categoryError } = await supabase
    .from('product_categories')
    .select('prefix')
    .eq('id', categoryId)
    .single()

  if (categoryError || !category?.prefix) {
    return NextResponse.json(
      { error: 'Category prefix not found' },
      { status: 404 },
    )
  }

  const pattern = buildPattern(brand, category.prefix)

  const { data: existing, error: listError } = await supabase
    .from('products')
    .select('sku')
    .ilike('sku', `${pattern}%`)
    .order('sku', { ascending: false })
    .limit(200)

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 })
  }

  const numericTail = new RegExp(`^${pattern}(\\d+)$`)
  const maxNum = (existing ?? []).reduce<number>((max, row) => {
    const match = row.sku?.match(numericTail)
    if (!match) return max
    const num = Number.parseInt(match[1], 10)
    return Number.isFinite(num) && num > max ? num : max
  }, 0)

  const next = String(maxNum + 1).padStart(padding, '0')
  const sku = `${pattern}${next}`

  return NextResponse.json({
    sku,
    pattern,
    nextNumber: maxNum + 1,
    padding,
  })
}
