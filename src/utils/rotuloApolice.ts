import type { ApoliceResumo } from '../api';
import { PRODUTO } from '../constants/rotulos';

export const rotuloApolice = (a: ApoliceResumo) => `${PRODUTO[a.produto]} — ${a.numero}`;
