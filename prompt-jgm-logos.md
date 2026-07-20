# Ajuste de Logos — Site JGM Construções

## Contexto
Site institucional já criado (index.html) em `/home/winder/Documentos/jgm/`. Duas logos novas foram salvas na raiz do projeto:
- `logo-header.png` → logo horizontal (ícone + texto ao lado), fundo transparente
- `logo-footer.png` → logo empilhada (ícone em cima, texto embaixo), fundo transparente

## Problema atual
- Header: logo aparece cortada, só mostra o ícone, sem o texto "JGM CONSTRUÇÕES"
- Footer: logo aparece com tonalidade vinho/vermelha estranha (provável filter/blend-mode/background aplicado errado), tamanho grande demais dominando a seção, e a tagline "Construções no geral" está com fonte itálica/script destoando do resto do site

## Tarefas

### 1. Header
- Trocar `<img>` do logo para `src="logo-header.png"`
- Altura entre 40-48px, `object-fit: contain`, largura automática
- Padding lateral suficiente pra não colar no menu
- Checar contraste contra o fundo escuro do header — logo é preto/branco/laranja, deve ficar legível sem esforço

### 2. Footer
- Trocar `<img>` do logo para `src="logo-footer.png"`
- Remover qualquer `filter`, `mix-blend-mode`, `background-color` ou `opacity` aplicado na tag `<img>` ou no container que esteja distorcendo a cor pra tom vinho — precisa sair com as cores originais (preto/branco/laranja)
- Reduzir tamanho: hoje está grande demais, ajustar pra ~140-180px de largura
- Trocar fonte de "Construções no geral" pra mesma fonte de heading usada no resto do site, sem itálico
- Alinhar logo + tagline à esquerda, com margin-bottom antes das colunas de Navegação/Contato

### 3. Geral
- Não alterar hero, serviços, ou outras seções
- Testar responsivo — logo do header não pode quebrar o menu hamburguer no mobile

## Arquivos envolvidos
- `index.html`
- CSS correspondente
- `logo-header.png` e `logo-footer.png` (raiz do projeto)

## Critério de aceite
- Header: logo horizontal completa, sem corte, bom contraste
- Footer: logo com cores originais (sem vinho), tamanho proporcional, tagline com fonte correta
- Nada mais quebrado
