import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/componentes/Botao';
import { CampoTexto } from '@/componentes/CampoTexto';
import { Logo } from '@/componentes/Logo';
import { entrar } from '@/servicos/autenticacao';
import { cores, espacamentos, fontes } from '@/tema';

export default function TelaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function aoEntrar() {
    if (!email.trim() || !senha) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }

    setErro(null);
    setCarregando(true);
    try {
      await entrar(email.trim(), senha);
      router.replace('/inicio');
    } catch {
      setErro('Não foi possível entrar. Confira seus dados e tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <KeyboardAvoidingView
        style={estilos.tela}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          <Logo />

          <Text style={estilos.boasVindas}>BEM-VINDO À BS SEGUROS</Text>

          <View style={estilos.campos}>
            <CampoTexto
              rotulo="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />
            <CampoTexto
              rotulo="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={aoEntrar}
            />
          </View>

          {erro && <Text style={estilos.erro}>{erro}</Text>}

          <Botao
            titulo="Entrar"
            aoPressionar={aoEntrar}
            carregando={carregando}
            estilo={estilos.botaoEntrar}
          />
          <Botao
            titulo="Esqueci minha senha"
            variante="link"
            aoPressionar={() => router.push('/esqueci-senha')}
          />
          <Botao
            titulo="Criar conta"
            variante="contorno"
            aoPressionar={() => router.push('/criar-conta')}
            estilo={estilos.botaoCriarConta}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: espacamentos.xl + espacamentos.sm,
    paddingVertical: espacamentos.xxl,
  },
  boasVindas: {
    fontFamily: fontes.extranegrito,
    fontSize: 17,
    color: cores.texto,
    marginTop: espacamentos.xxl,
    marginBottom: espacamentos.xl,
    textAlign: 'center',
  },
  campos: {
    width: '100%',
    gap: espacamentos.xl,
  },
  erro: {
    fontFamily: fontes.regular,
    fontSize: 14,
    color: cores.erro,
    marginTop: espacamentos.md,
    textAlign: 'center',
  },
  botaoEntrar: {
    width: '78%',
    marginTop: espacamentos.xl + espacamentos.sm,
    marginBottom: espacamentos.sm,
  },
  botaoCriarConta: {
    width: '86%',
    marginTop: espacamentos.lg,
  },
});
