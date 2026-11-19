import { STATUS } from '../constants/rotulos';
import type { Status } from '../constants/rotulos';

export function Tag({ s }: { s: Status }) {
  const [texto, cor] = STATUS[s] ?? [s, 'warn'];
  return <span className={`tag ${cor}`}>{texto}</span>;
}
