/**
 * Resize and compress an image file to a JPEG data URL suitable for DB storage.
 */
export function readImageAsDataUrl(file, { maxDim = 900, quality = 0.82, maxChars = 450_000 } = {}) {
  if (!file?.type?.startsWith('image/')) {
    return Promise.reject(new Error('Please choose an image file (JPEG, PNG, or WebP).'));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height / width) * maxDim);
            width = maxDim;
          } else {
            width = Math.round((width / height) * maxDim);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        let q = quality;
        let dataUrl = canvas.toDataURL('image/jpeg', q);
        while (dataUrl.length > maxChars && q > 0.45) {
          q -= 0.08;
          dataUrl = canvas.toDataURL('image/jpeg', q);
        }
        if (dataUrl.length > maxChars) {
          reject(new Error('Image is still too large after compression. Try a smaller photo.'));
          return;
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Could not read this image.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsDataURL(file);
  });
}
