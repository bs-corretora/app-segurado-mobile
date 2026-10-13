// Importa só os pesos usados, para não embutir todas as variações da Inter no app.
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';

// Arquivos de fonte carregados no início do app (ver src/app/_layout.tsx).
export const arquivosDeFonte = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
};

// Nomes usados no estilo `fontFamily` dos textos.
export const fontes = {
  regular: 'Inter_400Regular',
  media: 'Inter_500Medium',
  seminegrito: 'Inter_600SemiBold',
  negrito: 'Inter_700Bold',
  extranegrito: 'Inter_800ExtraBold',
} as const;
