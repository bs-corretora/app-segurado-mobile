import { Login } from './auth/Login.jsx'
import { Esqueci } from './auth/Esqueci.jsx'
import { EsqueciOk } from './auth/EsqueciOk.jsx'
import { Cadastro } from './auth/Cadastro.jsx'
import { Boas } from './auth/Boas.jsx'
import { Inicio } from './inicio/Inicio.jsx'
import { Apolices } from './apolices/Apolices.jsx'
import { Apolice } from './apolices/Apolice.jsx'
import { Pdf } from './apolices/Pdf.jsx'
import { Assist } from './sinistros/Assist.jsx'
import { Sinistro } from './sinistros/Sinistro.jsx'
import { SinNovo } from './sinistros/SinNovo.jsx'
import { SinOk } from './sinistros/SinOk.jsx'
import { SinDet } from './sinistros/SinDet.jsx'
import { Cotacao } from './cotacoes/Cotacao.jsx'
import { CotProd } from './cotacoes/CotProd.jsx'
import { CotForm } from './cotacoes/CotForm.jsx'
import { CotDet } from './cotacoes/CotDet.jsx'
import { Indicar } from './conta/Indicar.jsx'
import { Notif } from './conta/Notif.jsx'
import { Config } from './conta/Config.jsx'
import { Perfil } from './conta/Perfil.jsx'
import { Dados } from './conta/Dados.jsx'
import { Ajuda } from './conta/Ajuda.jsx'

export const SCREENS = {
  login: Login, esqueci: Esqueci, esqueciok: EsqueciOk, cadastro: Cadastro, boas: Boas,
  home: Inicio, apolices: Apolices, apolice: Apolice, pdf: Pdf,
  assist: Assist, sinistro: Sinistro, 'sin-novo': SinNovo, 'sin-ok': SinOk, 'sin-det': SinDet,
  cotacao: Cotacao, 'cot-prod': CotProd, 'cot-form': CotForm, 'cot-det': CotDet,
  indicar: Indicar, notif: Notif, config: Config, perfil: Perfil, dados: Dados, ajuda: Ajuda,
}