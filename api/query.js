import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: "Sos un experto en biología espacial de la NASA." },
            { role: "user", content: prompt }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      res.status(200).json({ result: response.data.choices[0].message.content });
    } catch (err) {
      console.error(err.response?.data || err.message);
      res.status(500).json({ error: "Error al procesar la consulta." });
    }

  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
