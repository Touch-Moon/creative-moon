'use client'

import { createContext, useContext } from 'react'
import type Lenis from 'lenis'

const LenisContext = createContext<React.RefObject<Lenis | null>>({ current: null })

export const useLenis = () => useContext(LenisContext)
export default LenisContext
