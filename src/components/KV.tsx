import type { ReactNode } from 'react';

export const KV = ({ k, v }: { k: ReactNode; v: ReactNode }) => (
  <div className="row kv">
    <span className="mut">{k}</span>
    <b>{v}</b>
  </div>
);
