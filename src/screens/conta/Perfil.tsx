import { Avatar, Botao, ComDados, KV } from '../../components';
import { buscarPerfil } from '../../api';
import { data, iniciais, mascaraCpf, telefone } from '../../utils/formatos';
import { useApi } from '../../hooks/useApi';
import { useNav } from '../../app/nav';

export function Perfil() {
  const { go } = useNav();
  const r = useApi(buscarPerfil);
  return (
    <ComDados r={r}>
      {(p) => (
        <>
          <div className="card col perfil">
            <Avatar texto={iniciais(p.nome)} grande />
            <h1>{p.nome}</h1>
            {p.cliente_desde && <span className="mut">Segurado desde {data(p.cliente_desde)}</span>}
          </div>
          <div className="card">
            <KV k="CPF" v={mascaraCpf(p.cpf)} />
            <KV k="E-mail" v={p.email} />
            <KV k="Telefone" v={telefone(p.telefone)} />
            <KV k="Data de nascimento" v={data(p.data_nascimento)} />
            <KV k="Código de indicação" v={p.codigo_indicacao} />
            <KV k="Receber campanhas" v={p.aceita_marketing ? 'Sim' : 'Não'} />
            <KV k="Termos aceitos em" v={data(p.termos_aceitos_em)} />
          </div>
          <Botao onClick={() => go('dados')}>Editar dados</Botao>
        </>
      )}
    </ComDados>
  );
}
