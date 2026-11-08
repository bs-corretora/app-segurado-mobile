import { Pressable, View } from 'react-native'
import { useNav } from '../nav'
import { POL } from '../data'
import { useS } from '../theme'
import { B, Btn, Card, Icon, PolicyCard, T } from '../ui'

export function Home() {
  const s = useS()
  const { go, bday, setBday } = useNav()
  const atalhos = [['assist', 'phone', 'Assistência 24h'], ['sinistro', 'alert', 'Sinistro'], ['cotacao', 'quote', 'Cotação']]
  return (
    <>
      {bday && (
        <View style={[s.card, s.ban, s.row]}>
          <View style={s.flex1}><B>Feliz Aniversário, Thauan!</B><T style={s.mut}>A BS Seguros deseja um dia especial.</T></View>
          <Pressable accessibilityLabel="Fechar" onPress={() => setBday(false)} hitSlop={10}><T style={{ fontSize: 22, color: s.c.tx2 }}>×</T></Pressable>
        </View>
      )}
      <View style={[s.card, s.hero]}>
        <T style={[s.big, { color: '#fff' }]}>3 anos e 4 meses</T>
        <T style={{ color: '#fff', opacity: 0.85, fontSize: 13 }}>como segurado da BS Seguros</T>
      </View>
      <T style={s.h2}>Minhas apólices ativas</T>
      {POL.filter((p) => p.s === 'ATIVA').map((p) => <PolicyCard key={p.id} p={p} />)}
      <Btn kind="sec" onPress={() => go('apolices')}>Ver todas as apólices</Btn>
      <T style={s.h2}>Acesso rápido</T>
      <View style={s.grid3}>
        {atalhos.map(([t, i, l]) => (
          <Card key={t} style={s.sh} onPress={() => go(t)}><Icon n={i} color={s.c.lk} /><B style={[{ fontSize: 13 }, s.center]}>{l}</B></Card>
        ))}
      </View>
      <View style={[s.card, s.ban, s.row]}>
        <View style={s.flex1}><B>Indique amigos</B><T style={s.mut}>Convide conhecidos para cotar na BS Seguros.</T></View>
        <Btn style={{ paddingHorizontal: 16, paddingVertical: 10 }} onPress={() => go('indicar')}>Indicar</Btn>
      </View>
    </>
  )
}
