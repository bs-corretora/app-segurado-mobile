import type { ComponentType } from 'react';
import { Abrindo } from './auth/Abrindo';
import { Login } from './auth/Login';
import { Esqueci } from './auth/Esqueci';
import { EsqueciOk } from './auth/EsqueciOk';
import { ConfirmarEmail } from './auth/ConfirmarEmail';
import { Cadastro } from './auth/Cadastro';
import { Boas } from './auth/Boas';
import { Inicio } from './inicio/Inicio';
import { Apolices } from './apolices/Apolices';
import { Apolice } from './apolices/Apolice';
import { Assist } from './sinistros/Assist';
import { Sinistro } from './sinistros/Sinistro';
import { SinNovo } from './sinistros/SinNovo';
import { SinOk } from './sinistros/SinOk';
import { SinDet } from './sinistros/SinDet';
import { Cotacao } from './cotacoes/Cotacao';
import { CotProd } from './cotacoes/CotProd';
import { CotForm } from './cotacoes/CotForm';
import { CotDet } from './cotacoes/CotDet';
import { Indicar } from './conta/Indicar';
import { Notif } from './conta/Notif';
import { Config } from './conta/Config';
import { Perfil } from './conta/Perfil';
import { Dados } from './conta/Dados';
import { Ajuda } from './conta/Ajuda';
import { Instalar } from './conta/Instalar';
import { Assistente } from './assistente/Assistente';

export const SCREENS: Record<string, ComponentType<{ arg?: string }>> = {
  abrindo: Abrindo,
  login: Login,
  esqueci: Esqueci,
  esqueciok: EsqueciOk,
  cadastro: Cadastro,
  'confirmar-email': ConfirmarEmail,
  boas: Boas,
  home: Inicio,
  apolices: Apolices,
  apolice: Apolice,
  assist: Assist,
  sinistro: Sinistro,
  'sin-novo': SinNovo,
  'sin-ok': SinOk,
  'sin-det': SinDet,
  cotacao: Cotacao,
  'cot-prod': CotProd,
  'cot-form': CotForm,
  'cot-det': CotDet,
  indicar: Indicar,
  notif: Notif,
  config: Config,
  perfil: Perfil,
  dados: Dados,
  ajuda: Ajuda,
  instalar: Instalar,
  assistente: Assistente,
};
