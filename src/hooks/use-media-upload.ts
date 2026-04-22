'use client'

import { useState, useCallback } from 'react'

interface UploadResult {
  url: string
  fileName: string
  fileSize: number
}

export function useMediaUpload(bucket = 'products') {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File): Promise<UploadResult | null> => {
    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      setProgress(100)

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Upload failed')
        return null
      }

      const data = await res.json()
      return {
        url: data.url,
        fileName: data.fileName,
        fileSize: data.fileSize,
      }
    } catch {
      setError('Upload failed')
      return null
    } finally {
      setUploading(false)
    }
  }, [bucket])

  const uploadMultiple = useCallback(async (files: File[]): Promise<UploadResult[]> => {
    const results: UploadResult[] = []
    for (const file of files) {
      const result = await upload(file)
      if (result) results.push(result)
    }
    return results
  }, [upload])

  return { upload, uploadMultiple, uploading, progress, error }
}
