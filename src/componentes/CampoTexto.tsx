import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { bordas, cores, espacamentos, fontes } from '@/tema';

type CampoTextoProps = TextInputProps & {
  rotulo: string;
};

export function CampoTexto({ rotulo, style, ...propsDoInput }: CampoTextoProps) {
  return (
    <View style={estilos.container}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor={cores.textoInativo}
        style={[estilos.campo, style]}
        {...propsDoInput}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    width: '100%',
  },
  rotulo: {
    fontFamily: fontes.regular,
    fontSize: 13,
    color: cores.texto,
    marginBottom: espacamentos.xs,
    marginLeft: espacamentos.sm,
  },
  campo: {
    height: 48,
    paddingHorizontal: espacamentos.md,
    backgroundColor: cores.fundoCampo,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: bordas.media,
    fontFamily: fontes.regular,
    fontSize: 16,
    color: cores.texto,
  },
});
