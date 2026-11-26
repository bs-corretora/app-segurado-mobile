import { useState } from 'react';
import type { FormEvent } from 'react';
import { Aviso, AvisoDemora, Botao, Caixa, Campo } from '../../components';
import { cadastrar } from '../../api';
import { mascaraCpf, mascaraTelefone, paraInputDataHora, soDigitos } from '../../utils/formatos';
import { useEnvio } from '../../hooks/useEnvio';
import { useNav } from '../../app/nav';
import { guardarPendente } from '../../utils/codigoEmail';
import { validadoresPorTipo as v, validarTudo } from '../../utils/validacao';

export function Cadastro() {
  const { go } = useNav();
  const envio = useEnvio();
  const [f, setF] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    senha: '',
    numero_apolice: '',
    aceite_termos: false,
    aceita_marketing: false,
  });
  const muda =
    <K extends keyof typeof f>(k: K) =>
    (v: (typeof f)[K]) =>
      setF((atual) => ({ ...atual, [k]: v }));
  const hoje = paraInputDataHora(new Date()).slice(0, 10);
  const c = envio.campos;

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    const r = await envio.enviar(
      () =>
        cadastrar({
          nome: f.nome.trim(),
          cpf: soDigitos(f.cpf),
          email: f.email.trim(),
          telefone: soDigitos(f.telefone),
          data_nascimento: f.data_nascimento,
          senha: f.senha,
          numero_apolice: f.numero_apolice.trim() || undefined,
          aceite_termos: true,
          aceita_marketing: f.aceita_marketing,
        }),
      () => ({
        ...validarTudo({
          nome: [f.nome, v.nome],
          cpf: [f.cpf, v.cpf],
          email: [f.email, v.email],
          telefone: [f.telefone, v.telefone],
          data_nascimento: [f.data_nascimento, v.dataNaoFutura],
          senha: [f.senha, v.senha],
        }),
        ...(f.aceite_termos
          ? {}
          : { aceite_termos: 'É preciso aceitar os termos para criar a conta.' }),
      }),
    );
    if (!r) return;
    // Sem sessão ainda: o e-mail precisa ser confirmado com o código que acabou de chegar.
    const email = f.email.trim();
    guardarPendente(email, true);
    go('confirmar-email', email);
  };

  return (
    <div className="form-container">
      <form onSubmit={aoEnviar} noValidate className="form-grid">
        <p className="legend-obrigatorio" aria-hidden="true">
          * obrigatório
        </p>
        <h1>Criar conta</h1>
        <Campo
          label="Nome completo"
          placeholder="Seu nome"
          autoComplete="name"
          value={f.nome}
          onChange={muda('nome')}
          onBlur={muda('nome')}
          erro={c.nome}
          required
          validar={v.nome}
        />
        <Campo
          label="CPF"
          placeholder="000.000.000-00"
          inputMode="numeric"
          value={f.cpf}
          onChange={(v) => muda('cpf')(mascaraCpf(v))}
          onBlur={(v) => muda('cpf')(mascaraCpf(v))}
          erro={c.cpf}
          required
          validar={v.cpf}
        />
        <Campo
          label="E-mail"
          type="email"
          placeholder="voce@email.com"
          autoComplete="email"
          inputMode="email"
          value={f.email}
          onChange={muda('email')}
          onBlur={muda('email')}
          erro={c.email}
          required
          validar={v.email}
        />
        <Campo
          label="Celular"
          type="tel"
          placeholder="(00) 00000-0000"
          autoComplete="tel-national"
          inputMode="tel"
          value={f.telefone}
          onChange={(v) => muda('telefone')(mascaraTelefone(v))}
          onBlur={(v) => muda('telefone')(mascaraTelefone(v))}
          erro={c.telefone}
          required
          validar={v.telefone}
        />
        <Campo
          label="Data de nascimento"
          type="date"
          autoComplete="bday"
          max={hoje}
          value={f.data_nascimento}
          onChange={muda('data_nascimento')}
          onBlur={muda('data_nascimento')}
          erro={c.data_nascimento}
          required
          validar={v.dataNaoFutura}
        />
        <Campo
          label="Senha (mínimo 8 caracteres)"
          type="password"
          placeholder="Crie uma senha"
          autoComplete="new-password"
          value={f.senha}
          onChange={muda('senha')}
          onBlur={muda('senha')}
          erro={c.senha}
          required
          validar={v.senha}
        />
        <h2>Já tem apólice? (opcional)</h2>
        <Campo
          label="Número da apólice"
          placeholder="Ex.: AU-2026-004821"
          value={f.numero_apolice}
          onChange={(v) => muda('numero_apolice')(v.toUpperCase())}
          onBlur={(v) => muda('numero_apolice')(v.toUpperCase())}
          erro={c.numero_apolice}
          dica="Com ele, as apólices do seu CPF já aparecem no app."
          className="full-width"
        />
        <Caixa
          checked={f.aceite_termos}
          onChange={muda('aceite_termos')}
          onBlur={muda('aceite_termos')}
          erro={c.aceite_termos}
          required
          validar={(v) => (v ? undefined : 'É preciso aceitar os termos para criar a conta.')}
          className="full-width"
        >
          Li e aceito os termos de uso e a política de privacidade
        </Caixa>
        <Caixa
          checked={f.aceita_marketing}
          onChange={muda('aceita_marketing')}
          onBlur={muda('aceita_marketing')}
          erro={c.aceita_marketing}
          className="full-width"
        >
          Quero receber novidades e atualizações por e-mail e notificação
        </Caixa>
        {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
        <AvisoDemora ativo={envio.demorando} />
        <Botao type="submit" carregando={envio.enviando} className="full-width">
          Criar conta
        </Botao>
        <button type="button" className="lk full-width" onClick={() => go('login')}>
          Já tenho conta
        </button>
      </form>
    </div>
  );
}
