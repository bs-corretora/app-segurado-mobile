import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/componentes/Botao';
import { CartaoApolice } from '@/componentes/CartaoApolice';
import { TituloSecao } from '@/componentes/TituloSecao';
import { buscarApolicesAtivas, buscarSegurado } from '@/servicos/segurado';
import { cores, espacamentos } from '@/tema';
import type { Apolice } from '@/tipos/apolice';
import type { Segurado } from '@/tipos/segurado';

import { BotaoAcessoRapido } from './componentes/BotaoAcessoRapido';
import { Cabecalho } from './componentes/Cabecalho';
import { CartaoIndiqueAmigos } from './componentes/CartaoIndiqueAmigos';
import { CartaoTempoSegurado } from './componentes/CartaoTempoSegurado';

export default function TelaInicio() {
  const [segurado, setSegurado] = useState<Segurado | null>(null);
  const [apolices, setApolices] = useState<Apolice[]>([]);

  useEffect(() => {
    Promise.all([buscarSegurado(), buscarApolicesAtivas()]).then(([dadosSegurado, dadosApolices]) => {
      setSegurado(dadosSegurado);
      setApolices(dadosApolices);
    });
  }, []);

  if (!segurado) {
    return (
      <View style={estilos.carregando}>
        <ActivityIndicator color={cores.primaria} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['top']}>
      <Cabecalho nome={segurado.nome} aoAbrirNotificacoes={() => router.push('/notificacoes')} />

      <ScrollView contentContainerStyle={estilos.conteudo}>
        <CartaoTempoSegurado seguradoDesde={segurado.seguradoDesde} />

        <TituloSecao texto="Minhas apólices ativas" />
        <View style={estilos.listaApolices}>
          {apolices.map((apolice) => (
            <CartaoApolice key={apolice.id} apolice={apolice} />
          ))}
          <Botao
            titulo="Ver todas as apólices"
            variante="suave"
            aoPressionar={() => router.push('/apolices')}
          />
        </View>

        <TituloSecao texto="Acesso rápido" />
        <View style={estilos.acessoRapido}>
          <BotaoAcessoRapido
            titulo="Assistência 24h"
            icone="phone"
            aoPressionar={() => router.navigate('/assistencia')}
          />
          <BotaoAcessoRapido
            titulo="Sinistro"
            icone="alert-triangle"
            aoPressionar={() => router.navigate('/sinistro')}
          />
          <BotaoAcessoRapido
            titulo="Cotação"
            icone="file"
            aoPressionar={() => router.navigate('/cotacao')}
          />
        </View>

        <CartaoIndiqueAmigos aoIndicar={() => router.push('/indicar-amigos')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  carregando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: espacamentos.lg,
    paddingBottom: espacamentos.xl,
  },
  listaApolices: {
    gap: espacamentos.md,
  },
  acessoRapido: {
    flexDirection: 'row',
    gap: espacamentos.lg,
  },
});
