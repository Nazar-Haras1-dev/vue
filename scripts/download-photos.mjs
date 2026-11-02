// Завантажує 10 фото в public/users/1.jpg ... 10.jpg
// Запуск (з кореня проєкту): node scripts/download-photos.mjs
import { mkdir, writeFile } from 'node:fs/promises'

const PHOTOS = [
  'women/87', 'men/32', 'women/44', 'men/75', 'women/12',
  'men/46', 'women/65', 'men/22', 'women/33', 'men/8',
]

await mkdir('public/users', { recursive: true })

for (const [i, path] of PHOTOS.entries()) {
  const res = await fetch(`https://randomuser.me/api/portraits/${path}.jpg`)
  if (!res.ok) throw new Error(`Не вдалося завантажити ${path}: ${res.status}`)
  await writeFile(`public/users/${i + 1}.jpg`, Buffer.from(await res.arrayBuffer()))
  console.log(`✔ public/users/${i + 1}.jpg`)
}
