/**
 * Conversation Analysis - Analyze chatbot conversations for insights
 */

import { invokeLLM } from './_core/llm';
import { getDb } from './db';

interface ConversationInsights {
  topics: Array<{ topic: string; count: number; examples: string[] }>;
  wishes: string[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  interestingExamples: Array<{ question: string; context: string }>;
}

/**
 * Analyze conversations from a date range
 */
export async function analyzeConversations(
  startDate: Date,
  endDate: Date
): Promise<ConversationInsights> {
  const db = await getDb();
  if (!db) {
    console.warn('[ConversationAnalysis] Database not available');
    return {
      topics: [],
      wishes: [],
      sentiment: { positive: 0, neutral: 0, negative: 0 },
      interestingExamples: [],
    };
  }

  const { chatbotTickets } = await import('../drizzle/schema');
  const { and, gte, lt } = await import('drizzle-orm');
  
  // Get all conversations from the date range
  const conversations = await db
    .select()
    .from(chatbotTickets)
    .where(
      and(
        gte(chatbotTickets.createdAt, startDate),
        lt(chatbotTickets.createdAt, endDate)
      )
    )
    .limit(100); // Limit to last 100 conversations to avoid token limits

  if (conversations.length === 0) {
    return {
      topics: [],
      wishes: [],
      sentiment: { positive: 0, neutral: 0, negative: 0 },
      interestingExamples: [],
    };
  }

  // Prepare conversation summaries for LLM
  const conversationSummaries = conversations.map((conv: any, idx: number) => {
    const messages = typeof conv.messages === 'string' 
      ? JSON.parse(conv.messages) 
      : conv.messages;
    
    const userMessages = messages
      .filter((m: any) => m.role === 'user')
      .map((m: any) => m.content)
      .join(' | ');
    
    return `${idx + 1}. ${userMessages}`;
  }).join('\n');

  // Use LLM to analyze conversations
  const prompt = `Analyzuj následující konverzace z chatbota a vytvoř strukturovaný report:

KONVERZACE:
${conversationSummaries}

Vytvoř JSON odpověď s následující strukturou:
{
  "topics": [
    {
      "topic": "název tématu (např. 'Dotazy na produkty', 'Spirituální poradenství')",
      "count": počet konverzací s tímto tématem,
      "examples": ["příklad otázky 1", "příklad otázky 2"]
    }
  ],
  "wishes": [
    "seznam přání a požadavků uživatelů (např. 'Chtějí více informací o pyramidách')"
  ],
  "sentiment": {
    "positive": počet pozitivních konverzací,
    "neutral": počet neutrálních konverzací,
    "negative": počet negativních konverzací
  },
  "interestingExamples": [
    {
      "question": "zajímavá otázka",
      "context": "proč je zajímavá (např. 'Neobvyklý dotaz na kombinaci produktů')"
    }
  ]
}

PRAVIDLA:
- Topics: Max 5 nejčastějších témat
- Wishes: Max 5 nejdůležitějších přání
- InterestingExamples: Max 3 nejzajímavější dotazy
- Sentiment: Součet positive + neutral + negative = celkový počet konverzací (${conversations.length})
- Odpověz POUZE validním JSON, bez dalšího textu`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'Jsi analytik konverzací. Odpovídáš pouze validním JSON.' },
        { role: 'user', content: [{ type: 'text' as const, text: prompt }] }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'conversation_insights',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              topics: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    topic: { type: 'string' },
                    count: { type: 'integer' },
                    examples: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  },
                  required: ['topic', 'count', 'examples'],
                  additionalProperties: false
                }
              },
              wishes: {
                type: 'array',
                items: { type: 'string' }
              },
              sentiment: {
                type: 'object',
                properties: {
                  positive: { type: 'integer' },
                  neutral: { type: 'integer' },
                  negative: { type: 'integer' }
                },
                required: ['positive', 'neutral', 'negative'],
                additionalProperties: false
              },
              interestingExamples: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    question: { type: 'string' },
                    context: { type: 'string' }
                  },
                  required: ['question', 'context'],
                  additionalProperties: false
                }
              }
            },
            required: ['topics', 'wishes', 'sentiment', 'interestingExamples'],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in LLM response');
    }

    // Handle content being string or array
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const insights: ConversationInsights = JSON.parse(contentStr);
    return insights;
  } catch (error) {
    console.error('[ConversationAnalysis] Error analyzing conversations:', error);
    
    // Return empty insights on error
    return {
      topics: [],
      wishes: [],
      sentiment: { positive: 0, neutral: 0, negative: 0 },
      interestingExamples: [],
    };
  }
}

/**
 * Format insights for Telegram message
 */
export function formatInsightsForTelegram(insights: ConversationInsights): string {
  let message = '';

  // Topics
  if (insights.topics.length > 0) {
    message += '<b>💬 Nejčastější témata:</b>\n';
    insights.topics.forEach((topic) => {
      message += `• ${topic.topic} (${topic.count}x)\n`;
      if (topic.examples.length > 0) {
        message += `  <i>"${topic.examples[0]}"</i>\n`;
      }
    });
    message += '\n';
  }

  // Wishes
  if (insights.wishes.length > 0) {
    message += '<b>🎯 Přání a požadavky:</b>\n';
    insights.wishes.forEach((wish) => {
      message += `• ${wish}\n`;
    });
    message += '\n';
  }

  // Sentiment
  const total = insights.sentiment.positive + insights.sentiment.neutral + insights.sentiment.negative;
  if (total > 0) {
    const positivePercent = ((insights.sentiment.positive / total) * 100).toFixed(0);
    const neutralPercent = ((insights.sentiment.neutral / total) * 100).toFixed(0);
    const negativePercent = ((insights.sentiment.negative / total) * 100).toFixed(0);
    
    message += '<b>😊 Spokojenost návštěvníků:</b>\n';
    message += `• 😊 Spokojení: ${insights.sentiment.positive} (${positivePercent}%)\n`;
    message += `• 😐 Neutrální: ${insights.sentiment.neutral} (${neutralPercent}%)\n`;
    message += `• 😞 Nespokojení: ${insights.sentiment.negative} (${negativePercent}%)\n\n`;
  }

  // Interesting examples
  if (insights.interestingExamples.length > 0) {
    message += '<b>✨ Zajímavé dotazy:</b>\n';
    insights.interestingExamples.forEach((example, idx) => {
      message += `${idx + 1}. "${example.question}"\n`;
      message += `   <i>${example.context}</i>\n`;
    });
    message += '\n';
  }

  return message;
}
