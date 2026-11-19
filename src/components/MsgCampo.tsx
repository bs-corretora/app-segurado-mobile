export const MsgCampo = ({ id, erro }: { id: string; erro?: string }) =>
  erro ? (
    <span id={id} className="msg">
      {erro}
    </span>
  ) : null;
