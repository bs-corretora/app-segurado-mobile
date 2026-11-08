import { useEffect } from 'react'
import { BackHandler, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { NavProvider, useNav, TABS, OUT } from './nav'
import { SCREENS } from './screens'
import { TL, TI, TT } from './data'
import { useS } from './theme'
import { B, Icon, T } from './ui'

const LG = () => {
  const s = useS()
  return <Image source={require('../assets/b-branco.png')} style={s.hLogo} resizeMode="contain" accessibilityLabel="BS Seguros" />
}

function Header() {
  const s = useS()
  const ins = useSafeAreaInsets()
  const { cur, go, back } = useNav()
  const [n] = cur
  const tab = TABS.includes(n)
  return (
    <View style={[s.header, { paddingTop: ins.top + 12 }]}>
      {tab ? (
        n === 'home' ? (
          <><View style={s.av}><T style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>TV</T></View><B style={s.headerT}>Thauan Veiga</B></>
        ) : (
          <>{n === 'cotacao' && <LG />}<B style={s.headerT}>{TL[n]}</B></>
        )
      ) : (
        <>
          <Pressable onPress={back} accessibilityLabel="Voltar" hitSlop={10}><Icon n="back" color="#fff" /></Pressable>
          {n.startsWith('cot') && <LG />}
          <B style={s.headerT}>{TT[n]}</B>
        </>
      )}
      <Pressable testID="sino" onPress={() => go('notif')} accessibilityLabel="Notificações" style={s.bell}>
        <Icon n="bell" color="#fff" />
        <View style={s.badge}><T style={{ color: '#fff', fontSize: 10 }}>2</T></View>
      </Pressable>
    </View>
  )
}

function TabBar() {
  const s = useS()
  const ins = useSafeAreaInsets()
  const { cur, go } = useNav()
  return (
    <View style={[s.tabBar, { paddingBottom: ins.bottom }]}>
      {TABS.map((t) => {
        const on = t === cur[0]
        return (
          <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => go(t)} style={s.tabBtn}>
            <Icon n={TI[t]} color={on ? s.c.lk : s.c.tx2} />
            <T style={{ fontSize: 11, color: on ? s.c.lk : s.c.tx2, fontWeight: on ? '700' : '400' }}>{TL[t]}</T>
          </Pressable>
        )
      })}
    </View>
  )
}

// Todas as telas têm o mesmo tamanho: cabeçalho e barra fixos, miolo rolável.
export function Shell() {
  const s = useS()
  const ins = useSafeAreaInsets()
  const { cur, back, canBack } = useNav()
  const [n, a] = cur
  const Screen = SCREENS[n]

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canBack) return false
      back()
      return true
    })
    return () => sub.remove()
  }, [canBack, back])

  const out = OUT.includes(n)
  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {!out && <Header />}
      <ScrollView key={`${n}-${a}`} style={s.root} contentContainerStyle={[s.screen, out && { paddingTop: ins.top + 16 }]} keyboardShouldPersistTaps="handled">
        <Screen arg={a} />
      </ScrollView>
      {TABS.includes(n) && <TabBar />}
    </KeyboardAvoidingView>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavProvider><Shell /></NavProvider>
    </SafeAreaProvider>
  )
}
