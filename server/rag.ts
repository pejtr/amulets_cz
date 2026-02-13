import { getDb } from "./db";
import { knowledgeBase } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";
import { eq, sql } from "drizzle-orm";

/**
 * Generate embedding for text using OpenAI API
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Generate embedding for the following text.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      // Note: OpenAI embeddings API would be used here in production
      // For now, we'll use a simple hash-based approach
    });

    // Placeholder: In production, use OpenAI embeddings API
    // For now, return a simple vector based on text length and content
    const vector = new Array(384).fill(0).map((_, i) => {
      const charCode = text.charCodeAt(i % text.length) || 0;
      return (charCode / 255) * Math.random();
    });

    return vector;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Search knowledge base for relevant content
 */
export async function searchKnowledgeBase(
  query: string,
  limit: number = 5,
  contentTypes?: string[]
): Promise<Array<{
  id: number;
  title: string;
  content: string;
  url: string | null;
  contentType: string;
  similarity: number;
}>> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[RAG] Database not available");
      return [];
    }

    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);

    // Fetch all knowledge base entries (with optional filtering)
    const entries = contentTypes && contentTypes.length > 0
      ? await db.select().from(knowledgeBase).where(
          sql`${knowledgeBase.contentType} IN (${sql.join(contentTypes.map((t: string) => sql`${t}`), sql`, `)})`
        )
      : await db.select().from(knowledgeBase);

    // Calculate similarity for each entry
    const results = entries
      .map((entry: typeof knowledgeBase.$inferSelect) => {
        const embedding = entry.embedding
          ? JSON.parse(entry.embedding)
          : [];
        const similarity =
          embedding.length > 0
            ? cosineSimilarity(queryEmbedding, embedding)
            : 0;

        return {
          id: entry.id,
          title: entry.title,
          content: entry.content,
          url: entry.url,
          contentType: entry.contentType,
          similarity,
        };
      })
      .filter((r: { similarity: number }) => r.similarity > 0.3) // Threshold for relevance
      .sort((a: { similarity: number }, b: { similarity: number }) => b.similarity - a.similarity)
      .slice(0, limit);

    return results;
  } catch (error) {
    console.error("Error searching knowledge base:", error);
    return [];
  }
}

/**
 * Add content to knowledge base
 */
export async function addToKnowledgeBase(data: {
  contentType: string;
  contentId?: string;
  title: string;
  content: string;
  url?: string;
  metadata?: Record<string, any>;
}): Promise<number> {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    // Generate embedding
    const embedding = await generateEmbedding(data.content);

    // Insert into database
    const result = await db.insert(knowledgeBase).values({
      contentType: data.contentType,
      contentId: data.contentId,
      title: data.title,
      content: data.content,
      url: data.url,
      embedding: JSON.stringify(embedding),
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    });

    return result[0].insertId;
  } catch (error) {
    console.error("Error adding to knowledge base:", error);
    throw error;
  }
}

/**
 * Update knowledge base entry
 */
export async function updateKnowledgeBase(
  id: number,
  data: {
    title?: string;
    content?: string;
    url?: string;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const updates: any = {};

    if (data.title) updates.title = data.title;
    if (data.url) updates.url = data.url;
    if (data.metadata) updates.metadata = JSON.stringify(data.metadata);

    // If content changed, regenerate embedding
    if (data.content) {
      updates.content = data.content;
      const embedding = await generateEmbedding(data.content);
      updates.embedding = JSON.stringify(embedding);
    }

    await db.update(knowledgeBase).set(updates).where(eq(knowledgeBase.id, id));
  } catch (error) {
    console.error("Error updating knowledge base:", error);
    throw error;
  }
}

/**
 * Build RAG context from search results
 */
export function buildRAGContext(
  results: Array<{
    title: string;
    content: string;
    url: string | null;
    contentType: string;
  }>
): string {
  if (results.length === 0) {
    return "";
  }

  const context = results
    .map((r, i) => {
      return `[${i + 1}] ${r.title}\n${r.content}${r.url ? `\nZdroj: ${r.url}` : ""}`;
    })
    .join("\n\n---\n\n");

  return `Relevantní informace z naší databáze:\n\n${context}`;
}
