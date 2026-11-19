import { useId } from 'react'

export function Campo({ label, type = 'text', placeholder, defaultValue, readOnly }) {
  const id = useId()
  return (
    <div className="f">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} placeholder={placeholder} defaultValue={defaultValue} readOnly={readOnly} />
    </div>
  )
}