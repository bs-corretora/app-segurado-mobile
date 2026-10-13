import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Etiqueta } from '@/componentes/Etiqueta';
import { bordas, cores, espacamentos, fontes } from '@/tema';
import type { Apolice, StatusApolice } from '@/tipos/apolice';
import { formatarData } from '@/utilitarios/datas';

const etiquetaPorStatus: Record<StatusApolice, { texto: string; variante: 'sucesso' | 'neutra' | 'erro' }> = {
  ativa: { texto: 'Ativa', variante: 'sucesso' },
  vencida: { texto: 'Vencida', variante: 'neutra' },
  cancelada: { texto: 'Cancelada', variante: 'erro' },
};

type CartaoApoliceProps = {
  apolice: Apolice;
  aoPressionar?: () => void;
};

export function CartaoApolice({ apolice, aoPressionar }: CartaoApoliceProps) {
  const etiqueta = etiquetaPorStatus[apolice.status];

  return (
    <Pressable
      accessibilityRole={aoPressionar ? 'button' : undefined}
      disabled={!aoPressionar}
      onPress={aoPressionar}
      style={({ pressed }) => [estilos.cartao, pressed && estilos.pressionado]}
    >
      <View style={estilos.linhaTitulo}>
        <Text style={estilos.tipo}>{apolice.tipo}</Text>
        <Etiqueta texto={etiqueta.texto} variante={etiqueta.variante} />
      </View>
      <Text style={estilos.detalhe}>Nº {apolice.numero}</Text>
      <Text style={estilos.detalhe}>
        Vigência {formatarData(apolice.inicioVigencia)} a {formatarData(apolice.fimVigencia)}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    padding: espacamentos.lg,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.bordaClara,
    borderRadius: bordas.grande,
    gap: 2,
  },
  pressionado: {
    opacity: 0.85,
  },
  linhaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  tipo: {
    fontFamily: fontes.negrito,
    fontSize: 20,
    color: cores.texto,
  },
  detalhe: {
    fontFamily: fontes.regular,
    fontSize: 14,
    color: cores.textoSecundario,
  },
});
