import { StyleSheet, Text, View } from 'react-native';

import { bordas, cores, fontes } from '@/tema';

// Espaço reservado para o logo. Quando a imagem oficial existir, coloque-a em
// assets/ e troque o conteúdo deste componente por um <Image />.
export function Logo() {
  return (
    <View style={estilos.caixa} accessibilityRole="image" accessibilityLabel="Logo BS Seguros">
      <Text style={estilos.texto}>LOGO</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    width: 240,
    height: 118,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.texto,
    borderRadius: bordas.grande + 4,
  },
  texto: {
    fontFamily: fontes.extranegrito,
    fontSize: 34,
    color: cores.texto,
  },
});
