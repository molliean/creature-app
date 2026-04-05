import { getAiRecommendations } from "@/lib/aiRecommendations";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const books = await getAiRecommendations(prompt.trim());
  return Response.json({ books });
}
