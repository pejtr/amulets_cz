import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, MailOpen, Trash2, ArrowLeft, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

interface BrowsingContext {
  currentPage?: string;
  referrer?: string;
  timeOnSite?: number;
}

interface ConversationMessage {
  role: string;
  content: string;
}

interface OfflineMessage {
  id: number;
  userId: number | null;
  email: string | null;
  message: string;
  conversationHistory: ConversationMessage[] | null;
  browsingContext: BrowsingContext | null;
  isRead: boolean;
  readAt: Date | null;
  readBy: number | null;
  createdAt: Date;
}

export default function AdminMessages() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Fetch messages
  const { data: messages, isLoading, refetch } = trpc.offlineMessages.getAll.useQuery(
    { 
      unreadOnly: showUnreadOnly,
      email: emailFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    },
    { enabled: user?.role === 'admin' }
  );

  // Fetch unread count
  const { data: unreadData } = trpc.offlineMessages.getUnreadCount.useQuery(
    undefined,
    { enabled: user?.role === 'admin' }
  );

  // Mutations
  const markAsReadMutation = trpc.offlineMessages.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Zpráva označena jako přečtená");
    },
    onError: () => {
      toast.error("Nepodařilo se označit zprávu jako přečtenou");
    },
  });

  const deleteMutation = trpc.offlineMessages.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Zpráva smazána");
    },
    onError: () => {
      toast.error("Nepodařilo se smazat zprávu");
    },
  });

  // Helper to safely render browsing context
  const renderBrowsingContext = (ctx: unknown) => {
    if (!ctx || typeof ctx !== 'object') return null;
    const context = ctx as BrowsingContext;
    return (
      <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded">
        <p>
          <strong>Stránka:</strong> {context.currentPage || "N/A"}
        </p>
        {context.referrer && (
          <p>
            <strong>Referrer:</strong> {context.referrer}
          </p>
        )}
      </div>
    );
  };

  // Helper to safely render conversation history
  const renderConversationHistory = (history: unknown) => {
    if (!history || !Array.isArray(history) || history.length === 0) return null;
    const messages = history as ConversationMessage[];
    return (
      <details className="mb-4">
        <summary className="text-sm text-purple-600 cursor-pointer hover:text-purple-800">
          Zobrazit historii konverzace ({messages.length} zpráv)
        </summary>
        <div className="mt-2 space-y-2 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded text-sm">
          {messages.map((histMsg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded ${
                histMsg.role === "user"
                  ? "bg-blue-50 text-blue-900"
                  : "bg-purple-50 text-purple-900"
              }`}
            >
              <span className="font-medium">
                {histMsg.role === "user" ? "Uživatel:" : "Natálie:"}
              </span>{" "}
              {histMsg.content}
            </div>
          ))}
        </div>
      </details>
    );
  };

  // Check if user is admin
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Přístup odepřen</CardTitle>
            <CardDescription>
              Tato stránka je přístupná pouze pro administrátory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zpět na hlavní stránku
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => setLocation("/")} variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zpět
            </Button>
            <h1 className="text-xl font-semibold text-purple-900">
              Offline zprávy
              {unreadData && unreadData.count > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadData.count} nepřečtených
                </Badge>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showUnreadOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            >
              {showUnreadOnly ? "Zobrazit vše" : "Pouze nepřečtené"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email filter */}
            <div>
              <label htmlFor="email-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email-filter"
                type="text"
                placeholder="Hledat podle emailu..."
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Date from filter */}
            <div>
              <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
                Od data
              </label>
              <input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Date to filter */}
            <div>
              <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
                Do data
              </label>
              <input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Clear filters button */}
          {(emailFilter || dateFrom || dateTo) && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEmailFilter("");
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                Vymazat filtry
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : !messages || messages.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <MailOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <CardTitle className="text-gray-600">Žádné zprávy</CardTitle>
              <CardDescription>
                {showUnreadOnly
                  ? "Nemáte žádné nepřečtené offline zprávy."
                  : "Zatím nemáte žádné offline zprávy."}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {(messages as OfflineMessage[]).map((msg) => (
              <Card
                key={msg.id}
                className={`transition-all ${
                  !msg.isRead
                    ? "border-purple-300 bg-purple-50/50 shadow-md"
                    : "border-gray-200"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {msg.isRead ? (
                        <MailOpen className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Mail className="h-5 w-5 text-purple-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {msg.email || "Anonymní uživatel"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(msg.createdAt), "d. MMMM yyyy, HH:mm", {
                            locale: cs,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          Nová
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap mb-4">{msg.message}</p>

                  {/* Browsing context */}
                  {renderBrowsingContext(msg.browsingContext)}

                  {/* Conversation history preview */}
                  {renderConversationHistory(msg.conversationHistory)}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    {!msg.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsReadMutation.mutate({ messageId: msg.id })}
                        disabled={markAsReadMutation.isPending}
                      >
                        {markAsReadMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <MailOpen className="h-4 w-4 mr-2" />
                        )}
                        Označit jako přečtené
                      </Button>
                    )}
                    {msg.email && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`mailto:${msg.email}`, "_blank")}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Odpovědět emailem
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
                      onClick={() => {
                        if (confirm("Opravdu chcete smazat tuto zprávu?")) {
                          deleteMutation.mutate({ messageId: msg.id });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
