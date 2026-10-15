import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "40kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/generate", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "Falta configurar GEMINI_API_KEY no arquivo .env. Veja o README." });
    }

    const { name, description, type, style } = req.body || {};
    if (typeof name !== "string" || typeof description !== "string" ||
        !name.trim() || !description.trim()) {
      return res.status(400).json({ error: "Informe o nome e a descrição do projeto." });
    }
    if (name.length > 100 || description.length > 5000) {
      return res.status(400).json({ error: "O nome deve ter até 100 caracteres e a descrição até 5.000." });
    }

    const prompt = `Você é o gerador de apps web do ADM: App Dev Maker. Gere uma primeira versão FUNCIONAL de um site/app web em um único arquivo HTML, incluindo CSS e JavaScript no próprio arquivo.
Nome do projeto: ${name.trim()}
Tipo escolhido: ${String(type || "Site").slice(0, 60)}
Estilo visual: ${String(style || "Moderno").slice(0, 100)}
Descrição do usuário: ${description.trim()}

Requisitos:
- Responda SOMENTE com o HTML completo, começando em <!DOCTYPE html> e terminando em </html>. Não use Markdown nem cercas de código.
- O app deve ter funcionalidades reais no navegador, não apenas uma descrição.
- Design responsivo para celular e computador, acessível e com botões funcionais.
- Se fizer sentido, use a identidade ADM (vermelho #F43F3F, laranja #FF7A00, amarelo #FFD43B), mas priorize a ideia descrita.
- Não inclua dependências externas desnecessárias, não faça chamadas a APIs secretas, não peça senhas, não finja autenticação ou pagamentos reais.
- Se o pedido exigir servidor, banco de dados, login seguro ou recursos nativos Android, crie um protótipo front-end honesto e deixe claro na interface o que precisa de backend.
- Não inclua scripts para roubar dados, capturar credenciais, explorar serviços ou contornar segurança.
- Mantenha o código completo e relativamente compacto.`;

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 12000 }
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const apiMessage = payload?.error?.message || `Gemini respondeu com HTTP ${response.status}.`;
      if (response.status === 429) {
        return res.status(429).json({ error: "Limite de uso atingido. Aguarde um pouco e tente novamente. Detalhe: " + apiMessage });
      }
      return res.status(502).json({ error: "Erro da API Gemini: " + apiMessage });
    }

    let output = payload?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("\n") || "";
    output = output.trim().replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/, "").trim();
    const start = output.toLowerCase().indexOf("<!doctype html");
    if (start >= 0) output = output.slice(start);
    else {
      const htmlStart = output.toLowerCase().indexOf("<html");
      if (htmlStart >= 0) output = "<!DOCTYPE html>\n" + output.slice(htmlStart);
    }
    if (!output.toLowerCase().includes("</html>")) {
      return res.status(502).json({ error: "A resposta da IA veio incompleta. Tente novamente com uma ideia mais simples." });
    }
    return res.json({ html: output });
  } catch (err) {
    console.error("Erro ao gerar app:", err?.message || err);
    return res.status(500).json({ error: "Erro inesperado no servidor. Confira sua conexão e tente novamente." });
  }
});

app.listen(PORT, () => {
  console.log(`ADM rodando em http://localhost:${PORT}`);
});
