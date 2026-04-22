const buildFallbackReply = (prompt, userName) => {
  const trimmedPrompt = prompt.trim();

  return [
    `Hello ${userName || "there"}, this is a demo AI response.`,
    "Your API integration layer is ready. To connect a real model, add your AI provider URL and key in `.env`.",
    `Prompt received: "${trimmedPrompt.slice(0, 160)}${trimmedPrompt.length > 160 ? "..." : ""}"`,
    "Suggested next step: plug in OpenAI, Anthropic, or any OpenAI-compatible endpoint."
  ].join("\n\n");
};

const getAiResponse = async ({ prompt, userName }) => {
  if (!process.env.AI_API_KEY || !process.env.AI_API_URL) {
    return buildFallbackReply(prompt, userName);
  }

  const response = await fetch(process.env.AI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant inside a productivity web app."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI provider error: ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI provider returned an empty response.");
  }

  return content;
};

module.exports = {
  getAiResponse
};
