import { getDb } from "./db";
import { sharedUserProfiles, userInteractions } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export interface UserPsychologyProfile {
  personalityType?: string;
  interests: string[];
  purchaseHistory: Record<string, number>;
  preferredProducts: string[];
  communicationStyle?: string;
  engagementLevel?: string;
  crossProjectScore: number;
}

/**
 * Get or create shared user profile
 */
export async function getOrCreateSharedProfile(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  let profile = await db
    .select()
    .from(sharedUserProfiles)
    .where(eq(sharedUserProfiles.userId, userId))
    .limit(1);

  if (profile.length === 0) {
    if (!db) throw new Error("Database not available");
    await db.insert(sharedUserProfiles).values({
      userId,
      personalityType: "unknown",
      interests: JSON.stringify([]),
      purchaseHistory: JSON.stringify({}),
      preferredProducts: JSON.stringify([]),
      communicationStyle: "neutral",
      engagementLevel: "low",
      crossProjectScore: 0,
    });

    profile = await db
      .select()
      .from(sharedUserProfiles)
      .where(eq(sharedUserProfiles.userId, userId))
      .limit(1);
  }

  return profile[0];
}

/**
 * Log user interaction for psychology learning
 */
export async function logUserInteraction(
  userId: number,
  projectName: string,
  interactionType: string,
  content: string,
  category?: string,
  sentiment?: string,
  result?: string,
  duration?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(userInteractions).values({
    userId,
    projectName,
    interactionType,
    content,
    category: category || "general",
    sentiment: sentiment || "neutral",
    result: result || "interested",
    duration: duration || 0,
  });

  // Update shared profile based on interaction
  await updateProfileFromInteraction(userId, projectName, category, sentiment);
}

/**
 * Update user profile based on their interactions
 */
async function updateProfileFromInteraction(
  userId: number,
  projectName: string,
  category?: string,
  sentiment?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const profile = await getOrCreateSharedProfile(userId);

  // Parse existing data
  const interests = JSON.parse(profile.interests || "[]") as string[];
  const purchaseHistory = JSON.parse(
    profile.purchaseHistory || "{}"
  ) as Record<string, number>;
  const preferredProducts = JSON.parse(
    profile.preferredProducts || "[]"
  ) as string[];

  // Update interests
  if (category && !interests.includes(category)) {
    interests.push(category);
  }

  // Update purchase history
  if (projectName) {
    purchaseHistory[projectName] = (purchaseHistory[projectName] || 0) + 1;
  }

  // Determine engagement level
  const totalInteractions = Object.values(purchaseHistory).reduce(
    (a, b) => a + b,
    0
  );
  let engagementLevel = "low";
  if (totalInteractions >= 10) engagementLevel = "high";
  else if (totalInteractions >= 5) engagementLevel = "medium";

  // Calculate cross-project score (0-100)
  const projectCount = Object.keys(purchaseHistory).length;
  const crossProjectScore = projectCount > 1 ? Math.min(100, totalInteractions * 10) : 0;

  // Determine personality type based on sentiment and category
  let personalityType = "unknown";
  if (interests.includes("spirituality") || interests.includes("meditation")) {
    personalityType = "spiritual";
  } else if (interests.includes("crystals") || interests.includes("healing")) {
    personalityType = "practical";
  } else if (interests.includes("horoskop") || interests.includes("analysis")) {
    personalityType = "analytical";
  }

  // Update profile
  if (!db) throw new Error("Database not available");
  await db
    .update(sharedUserProfiles)
    .set({
      interests: JSON.stringify(interests),
      purchaseHistory: JSON.stringify(purchaseHistory),
      preferredProducts: JSON.stringify(preferredProducts),
      engagementLevel,
      personalityType,
      crossProjectScore,
      lastInteractionProject: projectName,
      updatedAt: new Date(),
    })
    .where(eq(sharedUserProfiles.userId, userId));
}

/**
 * Get psychology profile for chatbot personalization
 */
export async function getPsychologyProfile(userId: number): Promise<UserPsychologyProfile> {
  const profile = await getOrCreateSharedProfile(userId);

  return {
    personalityType: profile.personalityType || "unknown",
    interests: JSON.parse(profile.interests || "[]"),
    purchaseHistory: JSON.parse(profile.purchaseHistory || "{}"),
    preferredProducts: JSON.parse(profile.preferredProducts || "[]"),
    communicationStyle: profile.communicationStyle || "neutral",
    engagementLevel: profile.engagementLevel || "low",
    crossProjectScore: profile.crossProjectScore || 0,
  };
}

/**
 * Get personalization context for AI chatbot
 */
export async function getChatbotPersonalizationContext(userId: number, projectName: string): Promise<string> {
  const profile = await getPsychologyProfile(userId);

  const context = `
User Psychology Profile:
- Personality: ${profile.personalityType}
- Interests: ${profile.interests.join(", ") || "unknown"}
- Engagement: ${profile.engagementLevel}
- Communication style: ${profile.communicationStyle}
- Cross-project interest score: ${profile.crossProjectScore}/100
- Purchase history: ${JSON.stringify(profile.purchaseHistory)}
- Preferred products: ${profile.preferredProducts.join(", ") || "none yet"}

Personalization hints:
${profile.personalityType === "spiritual" ? "- User is spiritually inclined, use spiritual language and references" : ""}
${profile.personalityType === "practical" ? "- User is practical, focus on benefits and results" : ""}
${profile.personalityType === "analytical" ? "- User is analytical, provide detailed explanations" : ""}
${profile.crossProjectScore > 50 ? "- User is highly interested in both projects, mention cross-project benefits" : ""}
${profile.engagementLevel === "high" ? "- User is highly engaged, can offer premium products" : ""}
${profile.engagementLevel === "low" ? "- User is new, start with basics and build trust" : ""}
  `.trim();

  return context;
}
