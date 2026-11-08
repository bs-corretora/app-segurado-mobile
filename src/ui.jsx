import { useState } from 'react'
import { Alert, Linking, Platform, Pressable, Text, TextInput, View } from 'react-native'
import Svg, { Circle, Path, Rect } from 'react-native-svg'
import { useNav } from './nav'
import { ST } from './data'
import { useS } from './theme'

export function T({ style, ...p }) {
  const { c } = useS()
  return <Text {...p} style={[{ color: c.tx, fontSize: 15 }, style]} />
}
export const B = ({ style, ...p }) => <T {...p} style={[{ fontWeight: '700' }, style]} />
// Alert.alert não funciona no navegador (react-native-web), então usamos window.alert na web.
export const stub = (msg) => (Platform.OS === 'web' ? window.alert(`Protótipo: ${msg}`) : Alert.alert('Protótipo', msg))

const P = {
  home: <><Path d="M3 11l9-8 9 8v10H3z" /><Path d="M9 21v-6h6v6" /></>,
  quote: <><Rect x="4" y="3" width="16" height="18" rx="2" /><Path d="M8 8h8M8 12h8M8 16h5" /></>,
  alert: <><Path d="M12 3l10 18H2z" /><Path d="M12 10v5M12 18v.01" /></>,
  phone: <Path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  gear: <><Circle cx="12" cy="12" r="3" /><Path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
  bell: <><Path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><Path d="M10 21h4" /></>,
  back: <Path d="M15 5l-7 7 7 7" />,
  shield: <Path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
}
export const Icon = ({ n, color }) => {
  const { c } = useS()
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color || c.tx} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{P[n]}</Svg>
  )
}

export function Tag({ s }) {
  const st = useS()
  const col = st.c[ST[s][1]]
  return <T style={[st.tag, { color: col, borderColor: col }]}>{ST[s][0]}</T>
}

export function Card({ onPress, style, children }) {
  const s = useS()
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress} style={[s.card, style]}>{children}</Pressable>
  ) : (
    <View style={[s.card, style]}>{children}</View>
  )
}

export function Btn({ kind, onPress, style, children, testID }) {
  const s = useS()
  return (
    <Pressable testID={testID} accessibilityRole="button" onPress={onPress} style={[s.btn, kind === 'sec' && s.btnSec, kind === 'out' && s.btnOut, style]}>
      <T style={[s.btnT, kind === 'sec' && s.btnSecT, kind === 'out' && s.btnOutT]}>{children}</T>
    </Pressable>
  )
}

export function Link({ onPress, children }) {
  const s = useS()
  return <Pressable accessibilityRole="link" onPress={onPress} style={s.link}><T style={s.linkT}>{children}</T></Pressable>
}

export function Field({ label, type, placeholder, defaultValue, readOnly, multiline }) {
  const s = useS()
  const kb = { email: 'email-address', tel: 'phone-pad' }[type]
  return (
    <View style={s.f}>
      <T style={s.label}>{label}</T>
      <TextInput
        accessibilityLabel={label}
        style={[s.input, multiline && s.area, readOnly && s.ro]}
        placeholder={placeholder}
        placeholderTextColor={s.c.tx2}
        defaultValue={defaultValue}
        editable={!readOnly}
        secureTextEntry={type === 'password'}
        keyboardType={kb}
        autoCapitalize={type === 'email' || type === 'password' ? 'none' : 'sentences'}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  )
}

// React Native não tem <select>: as opções viram "chips" selecionáveis.
export function Select({ label, options }) {
  const s = useS()
  const [v, setV] = useState(options[0])
  return (
    <View style={s.f}>
      <T style={s.label}>{label}</T>
      <View style={s.chips}>
        {options.map((o) => (
          <Pressable key={o} accessibilityRole="radio" accessibilityState={{ selected: v === o }} onPress={() => setV(o)} style={[s.chip, v === o && s.chipOn]}>
            <T style={[s.chipT, v === o && s.chipOnT]}>{o}</T>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

export function Check({ label, defaultChecked }) {
  const s = useS()
  const [on, setOn] = useState(!!defaultChecked)
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={() => setOn(!on)} style={s.check}>
      <View style={[s.box, on && s.boxOn]}>{on && <T style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>✓</T>}</View>
      <T style={s.flex1}>{label}</T>
    </Pressable>
  )
}

export function Contact({ title }) {
  const s = useS()
  return (
    <Card style={s.col}>
      <B>{title}</B>
      <T style={s.mut}>(81) 0000-0000</T>
      <View style={s.btns}>
        <Btn kind="sec" style={s.flexBtn} onPress={() => Linking.openURL('tel:+558100000000')}>Ligar</Btn>
        <Btn kind="sec" style={s.flexBtn} onPress={() => Linking.openURL('https://wa.me/558100000000')}>WhatsApp</Btn>
      </View>
    </Card>
  )
}

export function PolicyCard({ p }) {
  const s = useS()
  const { go } = useNav()
  return (
    <Card onPress={() => go('apolice', p.id)} style={s.col}>
      <View style={s.row}><B>{p.p}</B><Tag s={p.s} /></View>
      <T style={s.mut}>Nº {p.n}</T>
      <T style={s.mut}>Vigência {p.v}</T>
    </Card>
  )
}

export function KV({ k, v }) {
  const s = useS()
  return <View style={s.kv}><T style={s.mut}>{k}</T><B style={{ textAlign: 'right', flexShrink: 1 }}>{v}</B></View>
}
