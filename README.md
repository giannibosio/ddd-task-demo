```markdown
# ddd-task-demo

Mini progetto DDD in TypeScript (Task manager) — setup pensato per sviluppo su macOS con Visual Studio Code.

Cosa c'è:
- modello Domain (Value Objects, Entity/Aggregate, Domain Events)
- repository in-memory
- application service
- test con Jest (ts-jest)
- ESLint + Prettier + husky (lint-staged)
- VS Code recommended settings

Prerequisiti (macOS):
1. Node.js (consigliato tramite nvm)
   - Se usi nvm: `nvm install && nvm use` (usa la versione in .nvmrc)
2. Visual Studio Code

Installazione:
1. Clona il repo:
   ```
   git clone <url-del-repo>
   cd ddd-task-demo
   ```
2. Installa dipendenze:
   ```
   npm install
   ```
3. Prepara husky (git hooks):
   ```
   npm run prepare
   ```

Comandi utili:
- Sviluppo con reload: `npm run dev`
- Compilare: `npm run build`
- Eseguire build: `npm start`
- Eseguire test: `npm test`
- Lint: `npm run lint`
- Format: `npm run format`
- CI (lint + test): `npm run ci`

VS Code (consigli):
- Estensioni consigliate:
  - ESLint
  - Prettier - Code formatter
  - TypeScript Hero o similari (opzionale)
- Apri la cartella del progetto e lascia che VS Code usi la TypeScript del progetto se ti chiede (Use Workspace Version).

Struttura chiave:
- src/
  - domain/
  - infra/
  - application/
- tests/
- .vscode/ (impostazioni utili)

Test e sviluppo:
- I test sono in `tests/` e usano Jest + ts-jest.
- L'app demo logga eventi su console. Puoi estendere il repository in-memory con connettori reali (Prisma, TypeORM, ecc.) mantenendo il repository come interfaccia.

Se vuoi, posso:
- creare il repo fisico su GitHub e pushare i file (dammi il nome del repo e lo creo),
- adattare la configurazione per usare Prisma/SQLite,
- aggiungere esempi di mapping tra domain entity e entità persistenti.

Buon lavoro!
```