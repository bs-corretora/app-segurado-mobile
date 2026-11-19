/** Passo a passo para instalar no iPhone (o Safari não tem botão de instalar). */
export function Instalar() {
  return (
    <div className="card col">
      <b>No iPhone ou iPad, pelo Safari:</b>
      <ol className="passos">
        <li>Toque no botão Compartilhar (o quadrado com a seta para cima).</li>
        <li>Role e toque em &quot;Adicionar à Tela de Início&quot;.</li>
        <li>Toque em &quot;Adicionar&quot;. O app da BS Seguros aparece junto dos outros.</li>
      </ol>
    </div>
  );
}
