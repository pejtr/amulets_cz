import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  History,
  Trash2,
  Sparkles
} from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  metadata?: {
    ragSources?: Array<{ title: string; url?: string }>;
  };
}

interface Conversation {
  id: number;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function EnhancedChatbot() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | undefined>();
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Queries
  const conversationsQuery = trpc.chat.getConversations.useQuery(undefined, {
    enabled: isAuthenticated && showHistory,
  });

  const conversationMessagesQuery = trpc.chat.getConversationMessages.useQuery(
    { conversationId: currentConversationId! },
    { enabled: !!currentConversationId }
  );

  // Mutations
  const sendMessageMutation = trpc.chat.sendMessageWithMemory.useMutation({
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: data.response,
          createdAt: new Date(),
          metadata: { ragSources: data.ragSources },
        },
      ]);
      setCurrentConversationId(data.conversationId);
    },
    onError: (error) => {
      toast.error(error.message || "Nepodařilo se odeslat zprávu");
    },
  });

  const deleteConversationMutation = trpc.chat.deleteConversation.useMutation({
    onSuccess: () => {
      toast.success("Konverzace smazána");
      conversationsQuery.refetch();
      if (currentConversationId) {
        setMessages([]);
        setCurrentConversationId(undefined);
      }
    },
  });

  // Load conversation messages when selected
  useEffect(() => {
    if (conversationMessagesQuery.data) {
      setMessages(conversationMessagesQuery.data.map(msg => ({
        ...msg,
        role: msg.role as "user" | "assistant",
        createdAt: new Date(msg.createdAt),
        metadata: msg.metadata ? JSON.parse(msg.metadata as string) : undefined,
      })));
      setShowHistory(false);
    }
  }, [conversationMessagesQuery.data]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || sendMessageMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: message,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");

    sendMessageMutation.mutate({
      message: message.trim(),
      conversationId: currentConversationId,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(undefined);
    setShowHistory(false);
  };

  const loadConversation = (conversationId: number) => {
    setCurrentConversationId(conversationId);
  };

  const deleteConversation = (conversationId: number) => {
    if (confirm("Opravdu chcete smazat tuto konverzaci?")) {
      deleteConversationMutation.mutate({ conversationId });
    }
  };

  if (!isAuthenticated) {
    return null; // Don't show enhanced chatbot for non-authenticated users
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-6 z-[100] h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          aria-label="Otevřít chat s pamětí"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-6 z-[100] w-96 h-[600px] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-semibold">Natálie AI (s pamětí)</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(!showHistory)}
                className="text-white hover:bg-white/20"
              >
                <History className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* History Sidebar */}
          {showHistory ? (
            <div className="flex-1 overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h4 className="font-semibold">Historie konverzací</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startNewConversation}
                >
                  Nová konverzace
                </Button>
              </div>
              <ScrollArea className="h-[calc(600px-140px)]">
                <div className="p-4 space-y-2">
                  {conversationsQuery.isLoading && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    </div>
                  )}
                  {conversationsQuery.data?.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer group"
                    >
                      <div
                        className="flex-1"
                        onClick={() => loadConversation(conv.id)}
                      >
                        <p className="font-medium text-sm">
                          {conv.title || "Konverzace"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(conv.updatedAt).toLocaleDateString("cs-CZ")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100"
                        onClick={() => deleteConversation(conv.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {conversationsQuery.data?.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Zatím nemáte žádné konverzace
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                      <p className="font-medium">Ahoj {user?.name}! 👋</p>
                      <p className="text-sm mt-2">
                        Jsem Natálie s vylepšenou pamětí. Pamatuji si naše
                        předchozí konverzace a mám přístup k celé databázi
                        symbolů a produktů.
                      </p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-accent"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <Streamdown>{msg.content}</Streamdown>
                            {msg.metadata?.ragSources &&
                              msg.metadata.ragSources.length > 0 && (
                                <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                                  <p className="font-semibold mb-1">Zdroje:</p>
                                  {msg.metadata.ragSources.map((source, idx) => (
                                    <div key={idx}>
                                      {source.url ? (
                                        <a
                                          href={source.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="hover:underline"
                                        >
                                          {source.title}
                                        </a>
                                      ) : (
                                        <span>{source.title}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {sendMessageMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-accent rounded-lg p-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Zeptejte se na symboly, kameny nebo produkty..."
                    className="flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                    rows={2}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
}
