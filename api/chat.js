export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const systemPrompt = `
You are Ember. You are friendly. you reply within 1-4 lines in default unless told to elaborate(max 10 lines). do not use "*", reply in plain text. 
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\nUser: ${message}\nEmber:`
                }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Ember didn’t respond.";

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
