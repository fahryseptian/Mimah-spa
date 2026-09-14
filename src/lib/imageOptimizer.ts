/**
 * Image Optimization, Resizing, and Supabase Storage Upload Utility
 */

import { supabase } from './supabase';

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
}

/**
 * Resizes and compresses an image file in-browser before uploading/saving
 * Returns a base64 Data URL and compressed Blob
 */
export async function optimizeImageFile(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<{ dataUrl: string; blob: Blob; width: number; height: number; originalSize: number; optimizedSize: number }> {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.82,
    format = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to create canvas context'));
          return;
        }

        // Fill background with white for JPEG transparency fix
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(format, quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                dataUrl,
                blob,
                width,
                height,
                originalSize: file.size,
                optimizedSize: blob.size,
              });
            } else {
              reject(new Error('Canvas blob generation failed'));
            }
          },
          format,
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image element'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Uploads an image file to Supabase Storage bucket 'avatars' or 'services'
 * Fallbacks cleanly to optimized base64 Data URL if Supabase Storage is unconfigured
 */
export async function uploadImageToStorage(
  file: File,
  bucket: 'avatars' | 'services' | 'general' = 'avatars',
  folder: string = 'profiles'
): Promise<{ url: string; isRemote: boolean; originalSize: number; optimizedSize: number }> {
  try {
    // 1. Optimize and compress image first
    const optimized = await optimizeImageFile(file, {
      maxWidth: bucket === 'avatars' ? 600 : 1200,
      maxHeight: bucket === 'avatars' ? 600 : 800,
      quality: 0.85,
      format: 'image/jpeg'
    });

    // 2. Try Supabase Storage upload if supabase client exists
    if (supabase) {
      try {
        const fileExt = 'jpg';
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, optimized.blob, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (!error && data?.path) {
          const { data: publicData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

          if (publicData?.publicUrl) {
            return {
              url: publicData.publicUrl,
              isRemote: true,
              originalSize: optimized.originalSize,
              optimizedSize: optimized.optimizedSize
            };
          }
        }
      } catch (storageErr) {
        console.warn('Supabase storage bucket upload skipped or not configured, using optimized Data URL:', storageErr);
      }
    }

    // 3. Fallback to lightweight optimized Base64 Data URL
    return {
      url: optimized.dataUrl,
      isRemote: false,
      originalSize: optimized.originalSize,
      optimizedSize: optimized.optimizedSize
    };
  } catch (err) {
    console.error('Error in uploadImageToStorage:', err);
    throw err;
  }
}
