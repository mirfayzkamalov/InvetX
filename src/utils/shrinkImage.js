// Rasmni kichraytirib (max 600px) JPEG data-URL qiladi — saqlash va yuklab olish tez bo'lishi uchun.
export const shrink = (file) => new Promise((res, rej) => {
  const r = new FileReader()
  r.onerror = rej
  r.onload = () => {
    const img = new Image()
    img.onerror = rej
    img.onload = () => {
      const k = Math.min(1, 600 / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      res(c.toDataURL('image/jpeg', 0.9))
    }
    img.src = r.result
  }
  r.readAsDataURL(file)
})
