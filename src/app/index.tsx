import { Redirect } from 'expo-router';

// Rota inicial do app. Por enquanto sempre abre o login.
// TODO: quando a sessão vier da API, mandar direto para /inicio se o usuário já estiver logado.
export default function Inicial() {
  return <Redirect href="/login" />;
}
