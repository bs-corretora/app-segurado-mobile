import { useNav } from '../../app/nav'

export function EsqueciOk() {
  const { go } = useNav()
  return (
    <>
      <div className="card col"><b>Verifique seu e-mail</b><span className="mut">Se o e-mail estiver cadastrado, você receberá o link em instantes.</span></div>
      <button className="btn" onClick={() => go('login')}>Voltar ao login</button>
    </>
  )
}