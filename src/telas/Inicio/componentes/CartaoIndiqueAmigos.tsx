import { Pressable, StyleSheet, Text, View } from 'react-native';

import { bordas, cores, espacamentos, fontes } from '@/tema';

type CartaoIndiqueAmigosProps = {
  aoIndicar: () => void;
};

export function CartaoIndiqueAmigos({ aoIndicar }: CartaoIndiqueAmigosProps) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>Indique amigos</Text>
        <Text style={estilos.descricao}>Convide conhecidos para cotar na BS Seguros.</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={aoIndicar}
        style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado]}
      >
        <Text style={estilos.textoBotao}>Indicar</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.md,
    padding: espacamentos.lg,
    marginTop: espacamentos.xl,
    backgroundColor: cores.verdeAguaClaro,
    borderWidth: 1,
    borderColor: cores.verdeAguaClaroBorda,
    borderRadius: bordas.grande,
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontFamily: fontes.negrito,
    fontSize: 18,
    color: cores.texto,
  },
  descricao: {
    fontFamily: fontes.regular,
    fontSize: 13,
    color: cores.textoSecundario,
    marginTop: 2,
  },
  botao: {
    paddingHorizontal: espacamentos.lg,
    paddingVertical: espacamentos.sm,
    backgroundColor: cores.primaria,
    borderRadius: bordas.pequena,
  },
  pressionado: {
    opacity: 0.8,
  },
  textoBotao: {
    fontFamily: fontes.seminegrito,
    fontSize: 15,
    color: cores.branco,
  },
});
