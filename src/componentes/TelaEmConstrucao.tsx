import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';

import { cores, espacamentos, fontes } from '@/tema';

// Conteúdo provisório para telas que ainda não foram desenvolvidas.
export function TelaEmConstrucao({ titulo }: { titulo: string }) {
  return (
    <View style={estilos.tela}>
      <Feather name="tool" size={40} color={cores.textoInativo} />
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.texto}>Esta tela ainda está em construção.</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacamentos.sm,
    padding: espacamentos.xl,
    backgroundColor: cores.fundo,
  },
  titulo: {
    fontFamily: fontes.negrito,
    fontSize: 20,
    color: cores.texto,
  },
  texto: {
    fontFamily: fontes.regular,
    fontSize: 15,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
});
