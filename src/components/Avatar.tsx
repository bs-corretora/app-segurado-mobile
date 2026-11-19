export const Avatar = ({ texto, grande }: { texto: string; grande?: boolean }) => (
  <div className={`av ${grande ? 'grande' : ''}`} aria-hidden="true">
    {texto}
  </div>
);
