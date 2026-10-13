import { StyleSheet, Text } from 'react-native';

import { cores, espacamentos, fontes } from '@/tema';

export function TituloSecao({ texto }: { texto: string }) {
  return (
    <Text style={estilos.titulo} accessibilityRole="header">
      {texto}
    </Text>
  );
}

const estilos = StyleSheet.create({
  titulo: {
    fontFamily: fontes.media,
    fontSize: 18,
    color: cores.textoTituloSecao,
    marginTop: espacamentos.xl,
    marginBottom: espacamentos.md,
  },
});
