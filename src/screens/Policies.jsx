import { View } from 'react-native'
import { useNav } from '../nav'
import { POL } from '../data'
import { useS } from '../theme'
import { B, Btn, PolicyCard, T, Tag, stub } from '../ui'

export const Apolices = () => <>{POL.map((p) => <PolicyCard key={p.id} p={p} />)}</>

export function Apolice({ arg }) {
  const s = useS()
  const { go } = useNav()
  const p = POL[arg]
  return (
    <>
      <View style={[s.card, s.col]}>
        <View style={s.row}><B style={s.h1}>{p.p}</B><Tag s={p.s} /></View>
        <T style={s.mut}>Número</T><B>{p.n}</B>
        <T style={s.mut}>Vigência</T><B>{p.v}</B>
        <T style={s.mut}>Prêmio</T><B>{p.pr}</B>
      </View>
      <Btn onPress={() => go('pdf', arg)}>Visualizar PDF</Btn>
      <Btn kind="out" onPress={() => stub('Download iniciado')}>Baixar PDF</Btn>
    </>
  )
}

export function Pdf({ arg }) {
  const s = useS()
  const w = ['100%', '100%', '70%', '100%', '85%', '100%', '60%', '100%', '100%', '75%']
  return (
    <>
      <View style={s.pdf}>
        <T style={{ color: '#222', fontWeight: '700' }}>Apólice {POL[arg].n}</T>
        {w.map((x, i) => <View key={i} style={[s.bar, { width: x }]} />)}
      </View>
      <Btn onPress={() => stub('Download iniciado')}>Baixar PDF</Btn>
    </>
  )
}
