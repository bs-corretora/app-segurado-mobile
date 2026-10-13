export type TipoApolice = 'Auto' | 'Vida' | 'Residencial' | 'Empresarial';

export type StatusApolice = 'ativa' | 'vencida' | 'cancelada';

export type Apolice = {
  id: string;
  tipo: TipoApolice;
  numero: string;
  status: StatusApolice;
  /** Data no formato AAAA-MM-DD */
  inicioVigencia: string;
  /** Data no formato AAAA-MM-DD */
  fimVigencia: string;
};
