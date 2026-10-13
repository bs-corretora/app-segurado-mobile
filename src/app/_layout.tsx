import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { arquivosDeFonte, cores, fontes } from '@/tema';

// Layout raiz: carrega as fontes e define a navegação em pilha (Stack) do app.
// Telas com cabeçalho e botão de voltar são configuradas aqui.
export default function LayoutRaiz() {
  const [fontesCarregadas] = useFonts(arquivosDeFonte);

  if (!fontesCarregadas) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: cores.fundo },
          headerTintColor: cores.primaria,
          headerTitleStyle: { fontFamily: fontes.seminegrito, color: cores.texto },
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(abas)" />
        <Stack.Screen name="esqueci-senha" options={{ headerShown: true, title: 'Esqueci minha senha' }} />
        <Stack.Screen name="criar-conta" options={{ headerShown: true, title: 'Criar conta' }} />
        <Stack.Screen name="apolices" options={{ headerShown: true, title: 'Minhas apólices' }} />
        <Stack.Screen name="notificacoes" options={{ headerShown: true, title: 'Notificações' }} />
        <Stack.Screen name="indicar-amigos" options={{ headerShown: true, title: 'Indique amigos' }} />
      </Stack>
    </>
  );
}
