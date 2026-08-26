# Passos que Alimentam

Site de pré-inscrição para a corrida beneficente da MF Contabilidade, com Next.js, Supabase e integração server-side com n8n.

## Estado atual

O repositório foi iniciado vazio. A fundação visual, landing page, páginas de documentos, fluxo de cadastro/entrada, contratos de validação, migration/seed Supabase, RLS, função transacional, schema do webhook, template de e-mail e testes básicos estão implementados. O fluxo de autenticação e as mutações reais devem ser conectados às variáveis Supabase antes de homologação; o formulário atual é uma experiência de fallback local para validar a interface.

## Desenvolvimento

1. `npm install`
2. Copie `.env.example` para `.env.local` e preencha as chaves.
3. `npm run dev`
4. `npm run typecheck`, `npm test` e `npm run test:e2e`.

## Supabase

Execute `supabase/migrations/0001_initial.sql` e depois `supabase/seed.sql` no SQL Editor. Configure confirmação obrigatória de e-mail, redirect URLs e bucket privado `avatars`. A chave administrativa nunca deve ser exposta ao navegador. Antes de produção, conecte a função `confirm_pre_registration` a uma Server Action/Route Handler que valide Turnstile, Origin, rate limit e monte o webhook.

## n8n

`n8n/webhook-payload.schema.json` é o contrato de entrada. `n8n/email-template.html` é o template a reproduzir no workflow. O endpoint deve validar Bearer, timestamp, HMAC `sha256=HMAC_SHA256(timestamp + '.' + rawBody)`, schema e `Idempotency-Key` antes de enviar e-mail.

## Segurança e produção

- Segredos somente em variáveis sem `NEXT_PUBLIC_`.
- Adicionar Turnstile server-side, rate limiting distribuído e verificação de Origin nos endpoints.
- Retentar `webhook_deliveries` sem apagar inscrições e respeitar idempotência.
- Revisar todas as bases legais, retenção, controlador, canal do titular, encarregado e prazo de imagem. Placeholders jurídicos impedem publicação.
- Substituir o wordmark provisório pela logo oficial sem deformação assim que o asset for fornecido.
- Validar upload com assinatura real, EXIF/orientação, Sharp no servidor e Storage privado antes de habilitar avatar.

## Referências visuais

Three.js, GSAP, Anime.js, Motion, React Bits, 21st.dev e UIverse foram avaliados. Nesta revisão, `motion/react` foi adotado para reveal, spring hover e tap feedback; o padrão Spotlight Card do React Bits foi adaptado em CSS sem dependência pesada; o botão ganhou a faixa de feedback visual inspirada nos componentes do UIverse; e o percurso/motion path foi implementado com SVG/CSS, seguindo a direção de SVG/Scroll do GSAP e Anime.js. Three.js e GSAP não foram instalados porque não agregariam valor proporcional no MVP.

## Pendências obrigatórias

Logo oficial e imagens da corrida; razão social, CNPJ, endereço, e-mail/canal do titular, encarregado; retenção oficial; prazo de uso de imagem; revisão jurídica dos documentos; credenciais Supabase/n8n/Turnstile; implementação final de upload e consentimento de responsável; auditoria Lighthouse real em ambiente publicado.
