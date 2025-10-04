import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.get("/", (req, res) => {
  res.send("🚀 Servidor NASA Bio-AI activo!");
});

app.post("/api/query", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Sos un experto en biología espacial de la NASA." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Error de Groq:", data.error);
      res.status(500).json({ error: data.error.message || "Error al consultar el modelo" });
      return;
    }

    const respuesta = data.choices[0]?.message?.content || "No se pudo generar una respuesta.";
    res.json({ result: respuesta });

  } catch (error) {
    console.error("Error al consultar el modelo:", error);
    res.status(500).json({ error: "Error al procesar la consulta." });
  }
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor NASA Bio-AI escuchando en el puerto ${PORT}`);
});
