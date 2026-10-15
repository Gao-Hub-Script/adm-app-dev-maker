# ADM — App Dev Maker (com Gemini)

Esta versão conecta o site ADM ao Gemini por um servidor local. A chave da API fica no servidor, dentro de `.env`, e **não** no HTML público.

## Antes de começar
- Windows com Node.js LTS instalado: https://nodejs.org/
- Uma API Key criada no Google AI Studio: https://aistudio.google.com/apikey
- Atenção: a API pode ter limites gratuitos e condições de uso/cobrança. Confira a página de uso e faturamento do Google antes de usar bastante.

## Configuração no Windows
1. Extraia o ZIP para uma pasta fácil de encontrar, por exemplo `Documentos\ADM`.
2. Instale o Node.js LTS pelo site oficial, se ainda não tiver.
3. Na pasta extraída, copie o arquivo `.env.example` e dê à cópia o nome `.env` (sem `.txt`).
   - No Explorador de Arquivos, ative **Exibir > Mostrar > Extensões de nomes de arquivos** para conferir que o nome ficou exatamente `.env`.
4. Abra `.env` com o Bloco de Notas e substitua `COLE_SUA_CHAVE_AQUI` pela sua API Key. Não compartilhe esse arquivo nem envie a chave em chats.
5. Abra o Terminal/Prompt de Comando dentro da pasta do ADM.
   - Dica: clique na barra de endereço da pasta, digite `cmd` e pressione Enter.
6. Execute:
   ```bash
   npm install
   ```
7. Quando terminar, execute:
   ```bash
   npm start
   ```
8. Abra no navegador: http://localhost:3000
9. Preencha nome e descrição e clique em **Gerar meu app com IA**.

## O que essa versão faz
- Mantém a identidade visual ADM e os modelos de inspiração.
- Envia a descrição ao Gemini através do servidor local.
- Mostra o HTML gerado numa prévia e permite copiar/baixar o arquivo.
- Guarda projetos neste navegador (localStorage).

## Limites
- Gera uma primeira versão de site/app web em um arquivo HTML. Não cria sozinho um APK Android nem configura bancos de dados, login seguro, pagamentos ou servidores complexos.
- A prévia é executada em um iframe isolado, mas ainda assim teste arquivos baixados com cuidado.
- Se aparecer erro de limite (429), aguarde e tente mais tarde; o uso gratuito não é ilimitado.
- Nunca coloque sua API Key no `public/index.html`, em capturas de tela ou em repositórios públicos.

## Se der erro
- `npm` não é reconhecido: feche e abra o terminal depois de instalar Node.js.
- `Falta configurar GEMINI_API_KEY`: confira se o arquivo se chama exatamente `.env`.
- `API key not valid`: confira a chave no Google AI Studio; não a envie para ninguém.
- `429`: limite de uso atingido ou cota temporária.
