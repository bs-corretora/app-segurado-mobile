import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Botao } from '@/componentes/Botao';
import { sair } from '@/servicos/autenticacao';
import { cores, espacamentos } from '@/tema';

export default function TelaConfiguracoes() {
  const [saindo, setSaindo] = useState(false);

  async function aoSair() {
    setSaindo(true);
    try {
      await sair();
    } finally {
      setSaindo(false);
      // replace limpa o histórico: o botão voltar não retorna para a área logada.
      router.replace('/login');
    }
  }

  return (
    <View style={estilos.tela}>
      <Botao titulo="Sair da conta" variante="contorno" aoPressionar={aoSair} carregando={saindo} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    padding: espacamentos.lg,
    backgroundColor: cores.fundo,
  },
});
