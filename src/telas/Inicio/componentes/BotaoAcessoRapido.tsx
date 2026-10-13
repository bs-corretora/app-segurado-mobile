import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { bordas, cores, espacamentos, fontes } from '@/tema';

type BotaoAcessoRapidoProps = {
  titulo: string;
  icone: ComponentProps<typeof Feather>['name'];
  aoPressionar: () => void;
};

export function BotaoAcessoRapido({ titulo, icone, aoPressionar }: BotaoAcessoRapidoProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={aoPressionar}
      style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado]}
    >
      <Feather name={icone} size={28} color={cores.texto} />
      <Text style={estilos.titulo} numberOfLines={1} adjustsFontSizeToFit>
        {titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacamentos.sm,
    paddingHorizontal: espacamentos.xs,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: bordas.grande,
  },
  pressionado: {
    opacity: 0.85,
  },
  titulo: {
    fontFamily: fontes.regular,
    fontSize: 13,
    color: cores.texto,
  },
});
