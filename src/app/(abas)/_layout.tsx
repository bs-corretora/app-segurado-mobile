import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { cores, fontes } from '@/tema';

type NomeIcone = ComponentProps<typeof Feather>['name'];

function icone(nome: NomeIcone) {
  return ({ color }: { color: ColorValue }) => <Feather name={nome} size={22} color={color} />;
}

// Barra de abas inferior (Início, Cotação, Sinistro, Assistência, Configurações).
export default function LayoutAbas() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoInativo,
        tabBarLabelStyle: { fontFamily: fontes.media, fontSize: 11 },
        tabBarStyle: { backgroundColor: cores.branco, borderTopColor: cores.bordaClara },
        headerStyle: { backgroundColor: cores.branco },
        headerTitleStyle: { fontFamily: fontes.seminegrito, color: cores.texto },
        sceneStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{ title: 'Início', headerShown: false, tabBarIcon: icone('home') }}
      />
      <Tabs.Screen name="cotacao" options={{ title: 'Cotação', tabBarIcon: icone('file') }} />
      <Tabs.Screen name="sinistro" options={{ title: 'Sinistro', tabBarIcon: icone('alert-triangle') }} />
      <Tabs.Screen name="assistencia" options={{ title: 'Assistência', tabBarIcon: icone('phone') }} />
      <Tabs.Screen
        name="configuracoes"
        options={{ title: 'Configurações', tabBarIcon: icone('settings') }}
      />
    </Tabs>
  );
}
