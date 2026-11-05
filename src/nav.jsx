import { createContext, useContext, useState } from 'react'

export const TABS = ['home', 'cotacao', 'sinistro', 'assist', 'config']
export const OUT = ['login', 'cadastro', 'esqueci', 'esqueciok', 'boas']

const Ctx = createContext(null)
export const useNav = () => useContext(Ctx)

// Navegação simples por pilha: abas zeram a pilha; telas internas empilham.
export function NavProvider({ children, start = ['login'] }) {
  const [cur, setCur] = useState(start)
  const [stack, setStack] = useState([])
  const [bday, setBday] = useState(true)
  const go = (n, a) => {
    if (TABS.includes(n) || OUT.includes(n)) setStack([])
    else setStack((s) => [...s, cur])
    setCur([n, a])
  }
  const back = () => {
    const s = [...stack]
    setCur(s.pop() || ['home'])
    setStack(s)
  }
  return <Ctx.Provider value={{ cur, go, back, bday, setBday }}>{children}</Ctx.Provider>
}
