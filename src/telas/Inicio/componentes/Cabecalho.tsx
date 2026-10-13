import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/componentes/Avatar';
import { cores, espacamentos, fontes } from '@/tema';

type CabecalhoProps = {
  nome: string;
  aoAbrirNotificacoes: () => void;
};

export function Cabecalho({ nome, aoAbrirNotificacoes }: CabecalhoProps) {
  return (
    <View style={estilos.cabecalho}>
      <View style={estilos.usuario}>
        <Avatar nome={nome} />
        <Text style={estilos.nome} numberOfLines={1}>
          {nome}
        </Text>
      </View>
      <Pressable
        onPress={aoAbrirNotificacoes}
        accessibilityRole="button"
        accessibilityLabel="Notificações"
        hitSlop={12}
      >
        <Feather name="bell" size={24} color={cores.texto} />
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: espacamentos.lg + espacamentos.xs,
    paddingVertical: espacamentos.md,
    backgroundColor: cores.branco,
    borderBottomWidth: 1,
    borderBottomColor: cores.bordaClara,
  },
  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.md,
    flexShrink: 1,
  },
  nome: {
    fontFamily: fontes.negrito,
    fontSize: 18,
    color: cores.texto,
    flexShrink: 1,
  },
});
