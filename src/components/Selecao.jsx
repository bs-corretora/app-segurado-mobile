import { useId } from 'react'

export function Selecao({ label, options }) {
  const id = useId()
  return (
    <div className="f">
      <label htmlFor={id}>{label}</label>
      <select id={id}>{options.map((o) => <option key={o}>{o}</option>)}</select>
    </div>
  )
}