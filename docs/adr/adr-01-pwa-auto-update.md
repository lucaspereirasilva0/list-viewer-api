# ADR 01: Decisão de Implementação de Progressive Web App (PWA) com Auto-Atualização

## O QUE É ESTE ADR?
Este documento registra a decisão arquitetural sobre a implementação do frontend como um Progressive Web App (PWA) com capacidade de auto-atualização.

## DETALHES
- **Contexto:** A aplicação frontend busca oferecer uma experiência de usuário rica, incluindo funcionalidades offline e atualizações contínuas. Durante o desenvolvimento e monitoramento, foram observados erros frequentes 404 no backend para requisições GET para o endpoint `/_app/version.json`. Após investigação, verificou-se que esta requisição é uma chamada automática do Service Worker do PWA, orquestrada pelo `vite-plugin-pwa` para fins de verificação de auto-atualização.

- **Decisão:** Decidiu-se implementar a aplicação frontend como um Progressive Web App (PWA). Para isso, será utilizado o plugin `vite-plugin-pwa` no processo de build do frontend, com a configuração `registerType: 'autoUpdate'` ativada. A requisição `GET /_app/version.json` é reconhecida como um efeito colateral esperado do mecanismo de auto-atualização do PWA e não será diretamente tratada pelo backend, a menos que haja uma necessidade explícita futura de servir informações de versão da API por essa rota.

- **Considered Alternatives:**
    - **Não implementar PWA:** Esta alternativa foi rejeitada por remover as capacidades offline e a experiência de usuário aprimorada que o PWA oferece, sacrificando a resiliência e a performance em condições de rede variadas.
    - **Desabilitar `autoUpdate` no PWA:** Esta alternativa foi rejeitada por exigir intervenção manual do usuário para atualizações, prejudicando a experiência e podendo levar a usuários rodando versões desatualizadas da aplicação.
    - **Implementar um endpoint `/_app/version.json` dedicado no backend:** Embora tecnicamente possível, esta alternativa foi rejeitada por adicionar complexidade desnecessária ao backend, dado que o mecanismo de auto-atualização do PWA lida graciosamente com o 404 e não há necessidade imediata de o backend fornecer informações de versão específicas através desta rota.

- **Consequences:**
    - **Positivas:**
        - Melhoria na experiência do usuário devido ao acesso offline, tempos de carregamento mais rápidos e funcionalidade nativa-like.
        - Atualizações de aplicativo em segundo plano e contínuas, sem a necessidade de intervenção do usuário.
        - Aumento do engajamento do usuário devido à experiência aprimorada.
    - **Negativas:**
        - Geração contínua de logs 404 no backend para a rota `/_app/version.json`. Este é um comportamento benigno, mas pode gerar ruído nos logs de monitoramento se não for compreendido.
        - Aumento da complexidade na configuração de build do frontend devido à integração do PWA.
        - Necessidade de gerenciar corretamente as estratégias de cache para evitar problemas de invalidação, embora o `vite-plugin-pwa` automatize grande parte disso.

## CHANGELOG
- [2024-07-29 10:00 UTC-3] - Version 1.0 - Document initialization. 