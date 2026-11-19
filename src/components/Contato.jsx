export const Contato = ({ title }) => (
  <div className="card col">
    <b>{title}</b>
    <span className="mut">(81) 0000-0000</span>
    <div className="btns" style={{ marginTop: 8 }}>
      <a className="btn sec" href="tel:+558****0000">Ligar</a>
      <a className="btn sec" href="https://wa.me/558100000000" target="_blank" rel="noopener noreferrer">WhatsApp</a>
    </div>
  </div>
)