import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { bordas, cores, fontes } from '@/tema';

type VarianteBotao = 'primario' | 'contorno' | 'suave' | 'link';

type BotaoProps = {
  titulo: string;
  aoPressionar: () => void;
  variante?: VarianteBotao;
  carregando?: boolean;
  desabilitado?: boolean;
  estilo?: StyleProp<ViewStyle>;
};

export function Botao({
  titulo,
  aoPressionar,
  variante = 'primario',
  carregando = false,
  desabilitado = false,
  estilo,
}: BotaoProps) {
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: carregando }}
      onPress={aoPressionar}
      disabled={inativo}
      style={({ pressed }) => [
        estilos.base,
        estilosPorVariante[variante].botao,
        pressed && estilos.pressionado,
        inativo && estilos.inativo,
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={variante === 'primario' ? cores.branco : cores.primaria} />
      ) : (
        <Text style={[estilos.texto, estilosPorVariante[variante].texto]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontFamily: fontes.media,
    fontSize: 16,
  },
  pressionado: {
    opacity: 0.8,
  },
  inativo: {
    opacity: 0.6,
  },
});

const estilosPorVariante = {
  primario: StyleSheet.create({
    botao: { backgroundColor: cores.primaria, borderRadius: bordas.pequena },
    texto: { color: cores.branco },
  }),
  contorno: StyleSheet.create({
    botao: {
      backgroundColor: cores.branco,
      borderRadius: bordas.media,
      borderWidth: 1,
      borderColor: cores.primaria,
    },
    texto: { color: cores.primaria },
  }),
  suave: StyleSheet.create({
    botao: {
      backgroundColor: cores.azulClaro,
      borderRadius: bordas.media,
      borderWidth: 1,
      borderColor: cores.azulClaroBorda,
      minHeight: 48,
    },
    texto: { color: cores.primaria, fontFamily: fontes.seminegrito },
  }),
  link: StyleSheet.create({
    botao: { backgroundColor: 'transparent', minHeight: 32 },
    texto: { color: cores.primaria },
  }),
};
