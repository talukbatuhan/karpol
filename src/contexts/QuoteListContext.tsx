'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { RFQLineItem } from '@/types/database'

const STORAGE_KEY = 'karpol:quoteList:v1'

export type QuoteListEntry = {
  id: string
  productId?: string
  productSku?: string
  productName: string
  quantity?: string
}

type QuoteListContextValue = {
  items: QuoteListEntry[]
  addItem: (p: Omit<QuoteListEntry, 'id'>) => void
  removeItem: (id: string) => void
  clear: () => void
  toRfqLineItems: () => RFQLineItem[]
}

const QuoteListContext = createContext<QuoteListContextValue | null>(null)

function load(): QuoteListEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x) => x && typeof (x as QuoteListEntry).id === 'string' && typeof (x as QuoteListEntry).productName === 'string',
    ) as QuoteListEntry[]
  } catch {
    return []
  }
}

export function QuoteListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteListEntry[]>([])

  useEffect(() => {
    setItems(load())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* ignore */
    }
  }, [items])

  const addItem = useCallback((p: Omit<QuoteListEntry, 'id'>) => {
    setItems((prev) => {
      const id = [
        p.productId ?? '',
        p.productSku ?? '',
        p.productName,
      ].join('::')
      if (prev.some((x) => x.id === id)) return prev
      return [...prev, { ...p, id }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const clear = useCallback(() => {
    setItems([])
  }, [])

  const toRfqLineItems = useCallback((): RFQLineItem[] => {
    return items.map((e) => ({
      product_id: e.productId,
      product_sku: e.productSku,
      product_name: e.productName,
      quantity: e.quantity,
    }))
  }, [items])

  const value = useMemo(
    () => ({ items, addItem, removeItem, clear, toRfqLineItems }),
    [items, addItem, removeItem, clear, toRfqLineItems],
  )

  return <QuoteListContext.Provider value={value}>{children}</QuoteListContext.Provider>
}

export function useQuoteList() {
  const ctx = useContext(QuoteListContext)
  if (!ctx) {
    return {
      items: [] as QuoteListEntry[],
      addItem: () => {},
      removeItem: () => {},
      clear: () => {},
      toRfqLineItems: (): RFQLineItem[] => [],
    } satisfies QuoteListContextValue
  }
  return ctx
}
