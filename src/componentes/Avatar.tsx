import { StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '@/tema';
import { obterIniciais } from '@/utilitarios/textos';

type AvatarProps = {
  nome: string;
  tamanho?: number;
};

export function Avatar({ nome, tamanho = 40 }: AvatarProps) {
  return (
    <View
      style={[estilos.circulo, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text style={[estilos.iniciais, { fontSize: tamanho * 0.4 }]}>{obterIniciais(nome)}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  circulo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.avatar,
  },
  iniciais: {
    fontFamily: fontes.seminegrito,
    color: cores.branco,
  },
});
