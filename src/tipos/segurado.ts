export type Segurado = {
  id: string;
  nome: string;
  email: string;
  /** Data em que a pessoa se tornou segurada, no formato AAAA-MM-DD */
  seguradoDesde: string;
};
