import { supabase } from './supabase'

/**
 * Uploads an image to the public `images` bucket and returns its public URL
 * (or null on failure). Large photos are scaled down and converted to WebP in
 * the browser first, so uploads stay small.
 */
export async function uploadImage(file, folder) {
  const blob = await shrink(file).catch(() => file)
  const ext = blob.type === 'image/webp' ? 'webp' : file.name.split('.').pop().toLowerCase()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
  const { error } = await supabase.storage.from('images').upload(path, blob, {
    contentType: blob.type || file.type,
    cacheControl: '31536000',
  })
  if (error) return null
  return supabase.storage.from('images').getPublicUrl(path).data.publicUrl
}

const MAX = 1600

async function shrink(file) {
  // Keep SVGs and GIFs (logos, animations) as they are
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close?.()
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.82))
  // Use the original if WebP isn't supported or didn't help
  return blob && blob.type === 'image/webp' && blob.size < file.size ? blob : file
}
