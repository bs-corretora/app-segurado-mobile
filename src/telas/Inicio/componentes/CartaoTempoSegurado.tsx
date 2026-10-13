import { StyleSheet, Text, View } from 'react-native';

import { bordas, cores, espacamentos, fontes } from '@/tema';
import { calcularTempoDesde } from '@/utilitarios/datas';

type CartaoTempoSeguradoProps = {
  seguradoDesde: string;
};

export function CartaoTempoSegurado({ seguradoDesde }: CartaoTempoSeguradoProps) {
  return (
    <View style={estilos.cartao}>
      <Text style={estilos.tempo}>{calcularTempoDesde(seguradoDesde)}</Text>
      <Text style={estilos.legenda}>como segurado da BS Seguros</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    paddingHorizontal: espacamentos.xl,
    paddingVertical: espacamentos.lg + espacamentos.xs,
    backgroundColor: cores.primaria,
    borderWidth: 1,
    borderColor: cores.primariaEscura,
    borderRadius: bordas.grande,
  },
  tempo: {
    fontFamily: fontes.negrito,
    fontSize: 22,
    color: cores.branco,
  },
  legenda: {
    fontFamily: fontes.regular,
    fontSize: 13,
    color: cores.branco,
    marginTop: 2,
  },
});
