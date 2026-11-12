import { Login, Esqueci, EsqueciOk, Cadastro, Boas } from './Auth'
import { Home } from './Home'
import { Apolices, Apolice, Pdf } from './Policies'
import { Assist, Sinistro, SinNovo, SinOk, SinDet } from './Claims'
import { Cotacao, CotProd, CotForm, CotDet } from './Quotes'
import { Indicar, Notif, Config, Perfil, Dados, Ajuda } from './More'

export const SCREENS = {
  login: Login, esqueci: Esqueci, esqueciok: EsqueciOk, cadastro: Cadastro, boas: Boas,
  home: Home, apolices: Apolices, apolice: Apolice, pdf: Pdf,
  assist: Assist, sinistro: Sinistro, 'sin-novo': SinNovo, 'sin-ok': SinOk, 'sin-det': SinDet,
  cotacao: Cotacao, 'cot-prod': CotProd, 'cot-form': CotForm, 'cot-det': CotDet,
  indicar: Indicar, notif: Notif, config: Config, perfil: Perfil, dados: Dados, ajuda: Ajuda,
}
