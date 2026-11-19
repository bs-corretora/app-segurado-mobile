import { Aviso } from './Aviso';

export const AvisoDemora = ({ ativo }: { ativo: boolean }) =>
  ativo ? (
    <Aviso tipo="info">
      O servidor está acordando. O primeiro acesso pode levar até um minuto.
    </Aviso>
  ) : null;
