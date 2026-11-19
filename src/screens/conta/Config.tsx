import { useState } from 'react';
import { Botao, Card, Icon } from '../../components';
import { sair } from '../../api';
import { useInstalacao } from '../../pwa/instalacao';
import { useNav } from '../../app/nav';
import { useSessao } from '../../app/sessao';

export function Config() {
  const { go } = useNav();
  const { limpar } = useSessao();
  const { podeInstalar, instrucoesIos, instalar } = useInstalacao();
  const [saindo, setSaindo] = useState(false);

  const aoSair = async () => {
    setSaindo(true);
    await sair();
    limpar();
    go('login');
  };

  const itens: [tela: string, texto: string][] = [
    ['perfil', 'Meu perfil'],
    ['dados', 'Dados cadastrais e senha'],
    ['indicar', 'Indique amigos'],
    ['ajuda', 'Ajuda'],
  ];
  return (
    <>
      {itens.map(([t, l]) => (
        <Card key={t} className="row" onClick={() => go(t)}>
          <b>{l}</b>
          <Icon n="next" />
        </Card>
      ))}
      {(podeInstalar || instrucoesIos) && (
        <Card className="row" onClick={() => (podeInstalar ? void instalar() : go('instalar'))}>
          <b>Instalar o app na tela inicial</b>
          <Icon n="download" />
        </Card>
      )}
      <Botao variante="out" carregando={saindo} onClick={() => void aoSair()}>
        Sair
      </Botao>
    </>
  );
}
