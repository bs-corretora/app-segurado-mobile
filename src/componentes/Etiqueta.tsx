import { StyleSheet, Text, View } from 'react-native';

import { bordas, cores, fontes } from '@/tema';

type VarianteEtiqueta = 'sucesso' | 'neutra' | 'erro';

type EtiquetaProps = {
  texto: string;
  variante?: VarianteEtiqueta;
};

const coresPorVariante: Record<VarianteEtiqueta, { texto: string; fundo: string }> = {
  sucesso: { texto: cores.sucesso, fundo: cores.sucessoFundo },
  neutra: { texto: cores.textoSecundario, fundo: cores.fundo },
  erro: { texto: cores.erro, fundo: cores.branco },
};

export function Etiqueta({ texto, variante = 'neutra' }: EtiquetaProps) {
  const cor = coresPorVariante[variante];

  return (
    <View style={[estilos.etiqueta, { borderColor: cor.texto, backgroundColor: cor.fundo }]}>
      <Text style={[estilos.texto, { color: cor.texto }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  etiqueta: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: bordas.redonda,
  },
  texto: {
    fontFamily: fontes.media,
    fontSize: 12,
  },
});
