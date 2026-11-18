import { useId } from 'react';
import type { ChangeEvent, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { useNav } from './nav';
import { PRODUTO, STATUS, type Status } from './rotulos';
import { data, soDigitos, telefone } from './formatos';
import type { ResultadoApi, ResultadoPaginado } from './hooks/useApi';
import type { ApoliceResumo, Contato as ContatoApi } from './api';

const P = {
  home: (
    <>
      <path d="M3 11l9-8 9 8v10H3z" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  quote: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3l10 18H2z" />
      <path d="M12 10v5M12 18v.01" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
      <path d="M10 21h4" />
    </>
  ),
  back: <path d="M15 5l-7 7 7 7" />,
  next: <path d="M9 5l7 7-7 7" />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  download: (
    <>
      <path d="M12 4v11M7 10l5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
};
export type NomeIcone = keyof typeof P;

export const Icon = ({ n }: { n: NomeIcone }) => (
  <svg
    className="ic"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {P[n]}
  </svg>
);

export function Tag({ s }: { s: Status }) {
  const [texto, cor] = STATUS[s] ?? [s, 'warn'];
  return <span className={`tag ${cor}`}>{texto}</span>;
}

export function Card({
  onClick,
  className = '',
  children,
  ...resto
}: { onClick?: () => void; className?: string; children: ReactNode } & Omit<
  HTMLAttributes<HTMLDivElement>,
  'onClick'
>) {
  return (
    <div
      className={`card ${className} ${onClick ? 'li' : ''}`}
      {...(onClick
        ? {
            role: 'button',
            tabIndex: 0,
            onClick,
            onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            },
          }
        : {})}
      {...resto}
    >
      {children}
    </div>
  );
}

const MsgCampo = ({ id, erro }: { id: string; erro?: string }) =>
  erro ? (
    <span id={id} className="msg">
      {erro}
    </span>
  ) : null;

type CampoProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  erro?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'datetime-local';
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  max?: string;
  maxLength?: number;
  dica?: string;
};

export function Campo({ label, value, onChange, erro, dica, ...resto }: CampoProps) {
  const id = useId();
  return (
    <div className={`f ${erro ? 'inv' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-m` : undefined}
        {...resto}
      />
      {dica && !erro && <span className="dica">{dica}</span>}
      <MsgCampo id={`${id}-m`} erro={erro} />
    </div>
  );
}

export function AreaTexto({
  label,
  value,
  onChange,
  erro,
  placeholder,
  maxLength,
}: Pick<CampoProps, 'label' | 'value' | 'onChange' | 'erro' | 'placeholder' | 'maxLength'>) {
  const id = useId();
  return (
    <div className={`f ${erro ? 'inv' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={4}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-m` : undefined}
      />
      <MsgCampo id={`${id}-m`} erro={erro} />
    </div>
  );
}

export function Selecao({
  label,
  value,
  onChange,
  opcoes,
  erro,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  opcoes: readonly (readonly [valor: string, rotulo: string])[];
  erro?: string;
}) {
  const id = useId();
  return (
    <div className={`f ${erro ? 'inv' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-m` : undefined}
      >
        {opcoes.map(([v, r]) => (
          <option key={v} value={v}>
            {r}
          </option>
        ))}
      </select>
      <MsgCampo id={`${id}-m`} erro={erro} />
    </div>
  );
}

export function Caixa({
  checked,
  onChange,
  erro,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  erro?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className={`f ${erro ? 'inv' : ''}`}>
      <label className="sw">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `${id}-m` : undefined}
        />
        <span>{children}</span>
      </label>
      <MsgCampo id={`${id}-m`} erro={erro} />
    </div>
  );
}

export function Botao({
  children,
  variante = 'pri',
  carregando = false,
  type = 'button',
  onClick,
  disabled,
}: {
  children: ReactNode;
  variante?: 'pri' | 'sec' | 'out';
  carregando?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      className={`btn ${variante === 'pri' ? '' : variante}`}
      onClick={onClick}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
    >
      {carregando ? <span className="spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function Aviso({ tipo, children }: { tipo: 'err' | 'ok' | 'info'; children: ReactNode }) {
  return (
    <div className={`aviso ${tipo}`} role={tipo === 'err' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}

export const Carregando = ({ texto = 'Carregando…' }: { texto?: string }) => (
  <div className="estado" role="status">
    <span className="spin grande" aria-hidden="true" />
    <span className="mut">{texto}</span>
  </div>
);

export const Erro = ({ mensagem, aoTentar }: { mensagem: string; aoTentar: () => void }) => (
  <div className="estado" role="alert">
    <b>Não deu para carregar</b>
    <span className="mut">{mensagem}</span>
    <Botao variante="sec" onClick={aoTentar}>
      Tentar de novo
    </Botao>
  </div>
);

export const Vazio = ({ texto, children }: { texto: string; children?: ReactNode }) => (
  <div className="estado vazio">
    <span className="mut">{texto}</span>
    {children}
  </div>
);

/** Mostra carregando/erro até os dados chegarem; depois entrega os dados para `children`. */
export function ComDados<T>({
  r,
  children,
  textoCarregando,
}: {
  r: ResultadoApi<T>;
  children: (dados: T) => ReactNode;
  textoCarregando?: string;
}) {
  if (r.dados === null) {
    if (r.erro) return <Erro mensagem={r.erro} aoTentar={r.tentarDeNovo} />;
    return <Carregando texto={textoCarregando} />;
  }
  return <>{children(r.dados)}</>;
}

/** Botão "carregar mais" no fim de uma lista paginada. */
export function MaisItens<T>({ r }: { r: ResultadoPaginado<T> }) {
  if (!r.temMais) return null;
  return (
    <>
      {r.erroMais && <Aviso tipo="err">{r.erroMais}</Aviso>}
      <Botao variante="sec" carregando={r.carregandoMais} onClick={r.carregarMais}>
        Carregar mais
      </Botao>
    </>
  );
}

export function Contato({ contato }: { contato: ContatoApi }) {
  const tel = contato.telefone ? soDigitos(contato.telefone) : null;
  const zap = contato.whatsapp ? soDigitos(contato.whatsapp) : null;
  return (
    <div className="card col">
      <b>{contato.rotulo}</b>
      {tel && <span className="mut">{telefone(tel)}</span>}
      <div className="btns mt">
        {tel && (
          <a className="btn sec" href={`tel:${tel}`}>
            Ligar
          </a>
        )}
        {zap && (
          <a
            className="btn sec"
            href={`https://wa.me/${zap}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

export function CartaoApolice({ a }: { a: ApoliceResumo }) {
  const { go } = useNav();
  return (
    <Card
      onClick={() => go('apolice', a.id)}
      aria-label={`Apólice ${PRODUTO[a.produto]} ${a.numero}`}
    >
      <div className="row">
        <b>{PRODUTO[a.produto]}</b>
        <Tag s={a.status} />
      </div>
      <div className="mut">Nº {a.numero}</div>
      <div className="mut">
        Vigência {data(a.inicio_vigencia)} a {data(a.fim_vigencia)}
      </div>
    </Card>
  );
}

export const KV = ({ k, v }: { k: string; v: ReactNode }) => (
  <div className="row kv">
    <span className="mut">{k}</span>
    <b>{v}</b>
  </div>
);

export const Avatar = ({ texto, grande }: { texto: string; grande?: boolean }) => (
  <div className={`av ${grande ? 'grande' : ''}`} aria-hidden="true">
    {texto}
  </div>
);
