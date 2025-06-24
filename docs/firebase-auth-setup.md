# Firebase Auth Setup Guide

Este documento descreve, passo a passo, como configurar o **Firebase Authentication** para o List Manager, incluindo integrações no frontend (React) e backend (Go) e considerações de deploy no Heroku.

---
## 1. Visão Geral

| Aspecto | Detalhes |
|---------|----------|
| **Serviço** | Firebase Authentication (gerenciado pelo Google) |
| **SDK** | Bibliotecas gratuitas (`firebase` para Web/Node, `firebase.google.com/go/v4` para Go) |
| **Plano Spark (Free Tier)** | &le; 10 000 usuários e ~50 000 logins/mês |
| **Modelo** | Stateless (JWT/OIDC) – backend apenas valida assinatura |
| **Benefícios** | Login Google 1-click, email/senha, MFA futura, sem infraestrutura própria de senhas |

---
## 2. Criação do Projeto Firebase

1. Acesse <https://console.firebase.google.com> e faça login na sua conta Google.
2. Clique em **Add project** e informe um nome (ex.: `list-manager`).
3. Siga o assistente até concluir a criação (pode desativar Google Analytics se não quiser).

---
## 3. Ativando Firebase Authentication

1. No painel do projeto, abra **Authentication** e clique em **Get started**.
2. Aba **Sign-in method**:
   1. Clique em **Email/Password**, ative e salve.
   2. Clique em **Google**, ative e salve.

---
## 4. Registrando o Aplicativo Web

1. Em **Project settings** (ícone ⚙, canto superior esquerdo) → Aba **General**.
2. Seção **Your apps** → clique no ícone `</>` para adicionar um app Web.
3. Informe um apelido (ex.: `frontend`) e marque *Config Firebase Hosting* **somente** se usar Hosting (opcional).
4. Copie as chaves geradas (`apiKey`, `authDomain`, `projectId`, etc.). Elas serão usadas no frontend.

---
## 5. Domínios Autorizados

Firebase exige que você liste os domínios permitidos a executar o fluxo de login:

1. **Authentication** → **Settings** (ícone engrenagem dentro de Authentication).
2. Seção **Authorized domains** → **Add domain**:
   * `localhost` – desenvolvimento local.
   * `meuapp.herokuapp.com` – URL após o deploy.

---
## 6. Conta de Serviço (Service Account)

O backend precisa verificar o ID-Token gerado pelo Firebase.

1. **Project settings** → **Service accounts**.
2. Clique em **Generate new private key** e baixe o JSON.
3. No Heroku, defina a variável de ambiente `GOOGLE_APPLICATION_CREDENTIALS` apontando para o caminho desse arquivo no container, ou armazene o conteúdo do JSON em `FIREBASE_CREDENTIALS` e carregue via código.

---
## 7. Integração no Frontend (React/PWA)

```bash
npm i firebase@^9
```

```ts
// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

Exemplo de login Google:

```ts
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./lib/firebase";

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
```

Obter ID-Token e enviar ao backend:

```ts
const idToken = await auth.currentUser?.getIdToken();
await fetch("/api/session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ idToken }),
});
```

---
## 8. Integração no Backend (Go)

### Dependência
```bash
go get firebase.google.com/go/v4
```

### Inicialização do Cliente Firebase
```go
package main

import (
    "context"
    "log"
    "os"

    firebase "firebase.google.com/go/v4"
    "google.golang.org/api/option"
)

func newFirebaseAuth(ctx context.Context) *auth.Client {
    cred := option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS"))
    app, err := firebase.NewApp(ctx, &firebase.Config{ProjectID: os.Getenv("FIREBASE_PROJECT_ID")}, cred)
    if err != nil {
        log.Fatalf("firebase init: %v", err)
    }
    client, err := app.Auth(ctx)
    if err != nil {
        log.Fatalf("firebase auth client: %v", err)
    }
    return client
}
```

### Middleware de Verificação
```go
func AuthMiddleware(client *auth.Client, next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    tokenStr := extractToken(r) // Header Authorization ou cookie
    token, err := client.VerifyIDToken(r.Context(), tokenStr)
    if err != nil {
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }
    ctx := context.WithValue(r.Context(), "uid", token.UID)
    next.ServeHTTP(w, r.WithContext(ctx))
  })
}
```

---
## 9. Variáveis de Ambiente no Heroku

```bash
# Frontend (.env)
VITE_FB_API_KEY=...
VITE_FB_AUTH_DOMAIN=...
VITE_FB_PROJECT_ID=...

# Backend (Config Vars do Heroku)
FIREBASE_PROJECT_ID=...
GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/firebase.json
```

Inclua o arquivo `firebase.json` no slug de deploy ou monte via variáveis.

---
## 10. Segurança e Boas Práticas

* Use cookies `HttpOnly Secure SameSite=Strict` se optar por enviar o ID-Token ao backend via cookie.
* Mantenha `access token` curto (1 h) e deixe o SDK renovar automaticamente.
* Habilite proteção de email verificado e limite de tentativas de login.
* Avalie habilitar MFA no futuro.

---
## 11. Referências

* [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
* [Firebase Admin SDK (Go)](https://firebase.google.com/docs/auth/admin)
* [Heroku – Configuring Build & Runtime](https://devcenter.heroku.com/)

---
## 12. Desenvolvimento Local

### Opção A – Usar Projeto Firebase Real

1. Adicione `localhost` e `127.0.0.1` em **Authentication → Settings → Authorized domains**.
2. Crie um arquivo `.env` no diretório `frontend/` com:
   ```
   VITE_FB_API_KEY=...
   VITE_FB_AUTH_DOMAIN=...
   VITE_FB_PROJECT_ID=...
   ```
3. Baixe o JSON da **Service Account** e exporte variáveis no terminal de desenvolvimento:
   ```bash
   export FIREBASE_PROJECT_ID=<seu-project-id>
   export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/credentials/firebase.json
   ```
4. Execute os serviços locais:
   ```bash
   # Frontend
   cd frontend && npm run dev
   # Backend
   go run ./cmd/server
   ```
5. Faça login via Google ou email/senha normalmente (requer conexão com a Internet).

### Opção B – Usar Firebase Emulator Suite

1. Instale o CLI do Firebase se ainda não tiver:
   ```bash
   npm install -g firebase-tools
   ```
2. Inicialize o emulador de Authentication (na raiz do projeto):
   ```bash
   firebase init emulators   # marque apenas "Authentication"
   ```
3. Inicie o emulador:
   ```bash
   firebase emulators:start --only auth
   ```
4. Ajuste o frontend para conectar ao emulador (exemplo em `src/lib/firebase.ts`):
   ```ts
   import { connectAuthEmulator } from "firebase/auth";
   if (import.meta.env.DEV) {
     connectAuthEmulator(auth, "http://127.0.0.1:9099");
   }
   ```
5. No backend Go, informe ao SDK que deve usar o emulador:
   ```bash
   export FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
   ```
6. Acesse a interface web do emulador em <http://127.0.0.1:4000> para criar usuários de teste.

> Os tokens gerados pelo emulador são válidos apenas no ambiente local e não funcionam contra o Firebase em produção.

---
**Última atualização:** <!-- CURSOR-DATE --> 