# Como contribuir

O repositório segue o **GitHub Flow**, igual ao da API: a `main` é sempre o que está no ar (cada
merge publica em https://app-segurado.onrender.com) e todo trabalho passa por branch curta e Pull
Request com o CI verde. **Nada de upload de arquivo pelo site direto na `main`**: a `main` é
protegida e recusa.

## Fluxo

1. **Issue primeiro.** Toda mudança começa numa issue.
2. **Branch a partir da `main` atualizada:**

   ```bash
   git switch main && git pull
   git switch -c feat/issue-NN-descricao-curta   # ou fix/, refactor/, docs/, test/
   ```

3. **Antes de cada commit**, rode:

   ```bash
   npm run format      # arruma a formatação sozinho
   npm run lint
   npm run typecheck
   npm test
   ```

4. **Commits pequenos** no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/),
   com o número da issue:

   ```text
   feat(apolices): lista de apólices ligada na API (#6)
   fix(login): mensagem de senha errada (#4)
   refactor: telas de sinistro em screens/sinistros (#2)
   ```

5. **Pull Request para a `main`** com `Closes #NN` na descrição. O modelo de PR traz o checklist.
6. **CI verde antes do merge.** A branch é apagada sozinha depois do merge.

## O que o CI confere

| Job                      | O que barra                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| Lint, formatação e tipos | ESLint, Prettier (`format:check`) e `tsc --noEmit`                 |
| Testes                   | Vitest (`tests/`) e o teste de fumaça que renderiza todas as telas |
| Build                    | `npm run build` em Linux (pega import com maiúscula errada)        |
| Segurança › Gitleaks     | segredo em qualquer commit do histórico                            |
| Segurança › npm audit    | dependência de produção com alerta alto ou crítico                 |

## Código

- **TypeScript:** arquivo novo nasce `.ts`/`.tsx`. Os `.jsx` antigos são convertidos na issue #2.
- **Dados da API:** sempre pelas funções de `src/api/` (ver `docs/integracao-api.md`). Nada de
  `fetch` solto nas telas.
- **Nomes em português**, iguais aos da API (`apolice`, `sinistro`, `cotacao`).
- **Estilo no CSS**, não em `style={{ }}`.
- Teste novo com o ID do requisito no nome: `RF-03: recusa data de ocorrência no futuro`.
