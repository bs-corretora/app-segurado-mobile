import { POL } from '../../constants/data'
import { CartaoApolice } from '../../components'

export function Apolices() {
  return POL.map((p) => <CartaoApolice key={p.id} p={p} />)
}