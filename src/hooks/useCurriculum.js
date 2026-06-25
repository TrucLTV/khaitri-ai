import { useMemo } from 'react'
import data from '../data/curriculum.json'

export function useCurriculum() {
  return useMemo(() => {
    const tietByTuan = {}
    for (const tiet of data.tiet) {
      if (!tietByTuan[tiet.so_tuan]) tietByTuan[tiet.so_tuan] = []
      tietByTuan[tiet.so_tuan].push(tiet)
    }

    const gdMap = {}
    for (const gd of data.giai_doan) gdMap[gd.id] = gd

    const tuan = data.tuan.map(t => ({
      ...t,
      tiet_detail: tietByTuan[t.so_tuan] || [],
      giai_doan_info: gdMap[t.giai_doan] || null,
    }))

    return { metadata: data.metadata, giai_doan: data.giai_doan, tuan, gdMap }
  }, [])
}

export function useTuan(soTuan) {
  const { tuan, gdMap } = useCurriculum()
  return useMemo(() => {
    const t = tuan.find(t => t.so_tuan === Number(soTuan))
    if (!t) return null
    return { ...t, giai_doan_info: gdMap[t.giai_doan] }
  }, [tuan, gdMap, soTuan])
}
