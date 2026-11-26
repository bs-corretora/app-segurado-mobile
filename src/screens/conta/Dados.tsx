import { useState } from 'react';
import type { FormEvent } from 'react';
import { ComDados, Aviso, Botao, Caixa, Campo } from '../../components';
import { buscarPerfil, atualizarPerfil, trocarSenha } from '../../api';
import type { Perfil as PerfilApi } from '../../api';
import { useApi } from '../../hooks/useApi';
import { mascaraCpf, mascaraTelefone, soDigitos } from '../../utils/formatos';
import { useEnvio } from '../../hooks/useEnvio';
import { validadoresPorTipo } from '../../utils/validacao';

export function Dados() {
  const r = useApi(buscarPerfil);
  return (
    <ComDados r={r}>
      {(p) => (
        <>
          <FormDados perfil={p} />
          <FormSenha />
        </>
      )}
    </ComDados>
  );
}

function FormDados({ perfil }: { perfil: PerfilApi }) {
  const envio = useEnvio();
  const [tel, setTel] = useState(mascaraTelefone(perfil.telefone ?? ''));
  const [marketing, setMarketing] = useState(perfil.aceita_marketing);
  const [salvou, setSalvou] = useState(false);

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    setSalvou(false);
    const r = await envio.enviar(() =>
      atualizarPerfil({ telefone: soDigitos(tel) || null, aceita_marketing: marketing }),
    );
    if (r) setSalvou(true);
  };

  return (
    <div className="form-container">
      <form onSubmit={aoEnviar} noValidate className="form-grid">
        <p className="legend-obrigatorio" aria-hidden="true">* obrigatório</p>
        <div className="card full-width">
          <div className="kv-row"><span>Nome</span><b>{perfil.nome}</b></div>
          <div className="kv-row"><span>CPF</span><b>{mascaraCpf(perfil.cpf)}</b></div>
          <div className="kv-row"><span>E-mail</span><b>{perfil.email}</b></div>
        </div>
        <p className="mut">Para mudar nome, CPF ou e-mail, fale com a BS Seguros.</p>
        <Campo
          label="Telefone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(00) 00000-0000"
          value={tel}
          onChange={(v) => {
            setSalvou(false);
            setTel(mascaraTelefone(v));
          }}
          onBlur={(v) => {
            setSalvou(false);
            setTel(mascaraTelefone(v));
          }}
          erro={envio.campos.telefone}
          required
          validar={validadoresPorTipo.telefone}
        />
        <Caixa
          checked={marketing}
          onChange={(v) => {
            setSalvou(false);
            setMarketing(v);
          }}
          onBlur={(v) => {
            setSalvou(false);
            setMarketing(v);
          }}
          erro={envio.campos.aceita_marketing}
          className="full-width"
        >
          Quero receber novidades e atualizações por e-mail e notificação
        </Caixa>
        {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
        {salvou && <Aviso tipo="ok">Dados salvos.</Aviso>}
        <Botao type="submit" carregando={envio.enviando} className="full-width">
          Salvar alterações
        </Botao>
      </form>
    </div>
  );
}

function FormSenha() {
  const envio = useEnvio();
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [trocou, setTrocou] = useState(false);

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    setTrocou(false);
    const r = await envio.enviar(
      async () => {
        await trocarSenha(atual, nova);
        return true;
      },
      () => ({
        ...(atual ? {} : { senha_atual: 'Informe sua senha atual.' }),
        ...(nova.length >= 8
          ? {}
          : { nova_senha: 'A nova senha precisa de 8 caracteres ou mais.' }),
      }),
    );
    if (!r) return;
    setAtual('');
    setNova('');
    setTrocou(true);
  };

  return (
    <div className="form-container">
      <form onSubmit={aoEnviar} noValidate className="form-grid">
        <p className="legend-obrigatorio" aria-hidden="true">* obrigatório</p>
        <h2>Trocar senha</h2>
        <Campo
          label="Senha atual"
          type="password"
          autoComplete="current-password"
          value={atual}
          onChange={setAtual}
          onBlur={setAtual}
          erro={envio.campos.senha_atual}
          required
          validar={validadoresPorTipo.senha}
        />
        <Campo
          label="Nova senha (mínimo 8 caracteres)"
          type="password"
          autoComplete="new-password"
          value={nova}
          onChange={setNova}
          onBlur={setNova}
          erro={envio.campos.nova_senha}
          required
          validar={validadoresPorTipo.senha}
        />
        {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
        {trocou && <Aviso tipo="ok">Senha alterada.</Aviso>}
        <Botao type="submit" variante="out" carregando={envio.enviando} className="full-width">
          Trocar senha
        </Botao>
      </form>
    </div>
  );
}
