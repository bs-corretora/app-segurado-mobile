import { useState } from 'react';
import type { FormEvent } from 'react';
import { Aviso, AvisoDemora, Botao, Caixa, Campo } from '../../components';
import { cadastrar } from '../../api';
import { mascaraCpf, mascaraTelefone, paraInputDataHora, soDigitos } from '../../utils/formatos';
import { useEnvio } from '../../hooks/useEnvio';
import { useNav } from '../../app/nav';
import { guardarPendente } from '../../utils/codigoEmail';

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
        }),
      () =>
        f.aceite_termos ? {} : { aceite_termos: 'É preciso aceitar os termos para criar a conta.' },
    );
    if (!r) return;
    // Sem sessão ainda: o e-mail precisa ser confirmado com o código que acabou de chegar.
    const email = f.email.trim();
    guardarPendente(email, true);
    go('confirmar-email', email);
  };

  return (
    <form onSubmit={aoEnviar} noValidate>
      <h1>Criar conta</h1>
      <Campo
        label="Nome completo"
        placeholder="Seu nome"
        autoComplete="name"
        value={f.nome}
        onChange={muda('nome')}
        erro={c.nome}
      />
      <Campo
        label="CPF"
        placeholder="000.000.000-00"
        inputMode="numeric"
        value={f.cpf}
        onChange={(v) => muda('cpf')(mascaraCpf(v))}
        erro={c.cpf}
      />
      <Campo
        label="E-mail"
        type="email"
        placeholder="voce@email.com"
        autoComplete="email"
        inputMode="email"
        value={f.email}
        onChange={muda('email')}
        erro={c.email}
      />
      <Campo
        label="Celular"
        type="tel"
        placeholder="(00) 00000-0000"
        autoComplete="tel-national"
        inputMode="tel"
        value={f.telefone}
        onChange={(v) => muda('telefone')(mascaraTelefone(v))}
        erro={c.telefone}
      />
      <Campo
        label="Data de nascimento"
        type="date"
        autoComplete="bday"
        max={hoje}
        value={f.data_nascimento}
        onChange={muda('data_nascimento')}
        erro={c.data_nascimento}
      />
      <Campo
        label="Senha (mínimo 8 caracteres)"
        type="password"
        placeholder="Crie uma senha"
        autoComplete="new-password"
        value={f.senha}
        onChange={muda('senha')}
        erro={c.senha}
      />
      <h2>Já tem apólice? (opcional)</h2>
      <Campo
        label="Número da apólice"
        placeholder="Ex.: AU-2026-004821"
        value={f.numero_apolice}
        onChange={(v) => muda('numero_apolice')(v.toUpperCase())}
        erro={c.numero_apolice}
        dica="Com ele, as apólices do seu CPF já aparecem no app."
      />
      <Caixa checked={f.aceite_termos} onChange={muda('aceite_termos')} erro={c.aceite_termos}>
        Li e aceito os termos de uso e a política de privacidade
      </Caixa>
      {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
      <AvisoDemora ativo={envio.demorando} />
      <Botao type="submit" carregando={envio.enviando}>
        Criar conta
      </Botao>
      <button type="button" className="lk" onClick={() => go('login')}>
        Já tenho conta
      </button>
    </form>
  );
}
