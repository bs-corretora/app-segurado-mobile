// As datas chegam como texto AAAA-MM-DD. Elas são lidas manualmente para evitar
// que o fuso horário do aparelho mude o dia (o que acontece com `new Date('2026-10-01')`).
function lerData(data: string) {
  const [ano, mes, dia] = data.split('-').map(Number);
  return { ano, mes, dia };
}

/** '2026-10-01' → '01/10/2026' */
export function formatarData(data: string): string {
  const { ano, mes, dia } = lerData(data);
  return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
}

/** Tempo desde `dataInicio` até hoje, por extenso. Ex.: '3 anos e 4 meses'. */
export function calcularTempoDesde(dataInicio: string, hoje: Date = new Date()): string {
  const inicio = lerData(dataInicio);
  let totalMeses = (hoje.getFullYear() - inicio.ano) * 12 + (hoje.getMonth() + 1 - inicio.mes);
  if (hoje.getDate() < inicio.dia) totalMeses -= 1;

  if (totalMeses < 1) return 'Menos de 1 mês';

  const anos = Math.floor(totalMeses / 12);
  const meses = totalMeses % 12;
  const textoAnos = anos === 1 ? '1 ano' : `${anos} anos`;
  const textoMeses = meses === 1 ? '1 mês' : `${meses} meses`;

  if (anos === 0) return textoMeses;
  if (meses === 0) return textoAnos;
  return `${textoAnos} e ${textoMeses}`;
}
