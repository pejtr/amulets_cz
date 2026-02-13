import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare, Users, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";
import { getLoginUrl } from "@/const";
import { format } from "date-fns";

export default function ChatbotAnalytics() {
  const { user, loading: authLoading } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = trpc.chatbotAnalytics.getStats.useQuery({});
  const { data: recentConversations, isLoading: conversationsLoading } = trpc.chatbotAnalytics.getRecentConversations.useQuery({ limit: 10 });
  const { data: popularTopics, isLoading: topicsLoading } = trpc.chatbotAnalytics.getPopularTopics.useQuery();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Přístup odepřen
            </CardTitle>
            <CardDescription>
              Pouze administrátoři mají přístup k analytics.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Chatbot Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Sledování a vyhodnocování chatbot konverzací
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Celkem konverzací
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalConversations || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Všechny konverzace v databázi
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Celkem zpráv
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Všechny zprávy (user + assistant)
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Průměr zpráv/konverzace
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.avgMessagesPerConversation || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Průměrná délka konverzace
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Conversations */}
        <Card>
          <CardHeader>
            <CardTitle>Poslední konverzace</CardTitle>
            <CardDescription>
              Nejnovější chatbot konverzace s uživateli
            </CardDescription>
          </CardHeader>
          <CardContent>
            {conversationsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : recentConversations && recentConversations.length > 0 ? (
              <div className="space-y-4">
                {recentConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{conv.title || `Konverzace #${conv.id}`}</p>
                      <p className="text-sm text-muted-foreground">
                        {conv.userName || `User #${conv.userId}`} • {conv.messageCount} zpráv
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {format(new Date(conv.lastMessageAt), 'dd.MM.yyyy HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Zatím žádné konverzace
              </p>
            )}
          </CardContent>
        </Card>

        {/* Popular Topics */}
        <Card>
          <CardHeader>
            <CardTitle>Nejčastější témata</CardTitle>
            <CardDescription>
              Nejčastěji zmiňovaná slova v uživatelských zprávách
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topicsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : popularTopics && popularTopics.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularTopics.map((topic, index) => (
                  <div
                    key={topic.word}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium capitalize">{topic.word}</p>
                      <p className="text-xs text-muted-foreground">
                        {topic.count}× zmíněno
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-muted-foreground">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Zatím žádná data
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Users */}
        {stats && stats.topUsers && stats.topUsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Nejaktivnější uživatelé</CardTitle>
              <CardDescription>
                Top 10 uživatelů podle počtu konverzací
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.topUsers.map((user, index) => (
                  <div
                    key={user.userId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium">User #{user.userId}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.conversationCount} konverzací
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
