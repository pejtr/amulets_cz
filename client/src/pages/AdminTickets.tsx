import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  RefreshCw, 
  Mail, 
  Clock, 
  User, 
  MessageSquare, 
  Send,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Ticket {
  id: number;
  visitorId: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  conversationHistory: string | null;
  status: 'pending' | 'processing' | 'answered' | 'closed';
  response: string | null;
  respondedAt: Date | null;
  respondedBy: string | null;
  createdAt: Date;
}

export default function AdminTickets() {
  const [activeTab, setActiveTab] = useState<'pending' | 'answered' | 'all'>('pending');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);

  // Fetch tickets
  const { data: ticketsData, isLoading, refetch } = trpc.chatbotAB.getAllTickets.useQuery({
    status: activeTab,
    limit: 50,
    offset: 0,
  });

  // Answer ticket mutation
  const answerMutation = trpc.chatbotAB.answerTicket.useMutation({
    onSuccess: () => {
      toast.success("Odpověď byla odeslána");
      setIsDialogOpen(false);
      setResponseText("");
      setSelectedTicket(null);
      refetch();
    },
    onError: (error: { message: string }) => {
      toast.error(`Chyba: ${error.message}`);
    },
  });

  const handleOpenResponse = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setResponseText("");
    setIsDialogOpen(true);
  };

  const handleSendResponse = () => {
    if (!selectedTicket || !responseText.trim()) return;
    
    answerMutation.mutate({
      ticketId: selectedTicket.id,
      response: responseText,
      respondedBy: "admin",
    });
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" /> Čeká na odpověď</Badge>;
      case 'answered':
        return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle className="w-3 h-3" /> Zodpovězeno</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Zpracovává se</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const parseConversationHistory = (history: string | null) => {
    if (!history) return [];
    try {
      return JSON.parse(history);
    } catch {
      return [];
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Správa Ticketů</h1>
          <p className="text-muted-foreground">Offline dotazy z chatbota</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Obnovit
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="gap-2">
            <AlertCircle className="w-4 h-4" />
            Nevyřízené
            {ticketsData?.total && activeTab !== 'pending' && (
              <Badge variant="destructive" className="ml-1">{ticketsData.total}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="answered" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Zodpovězené
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Všechny
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : !ticketsData?.tickets?.length ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Žádné tickety k zobrazení</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ticketsData.tickets.map((ticket: Ticket) => (
                <Card key={ticket.id} className={ticket.status === 'pending' ? 'border-red-200 bg-red-50/50' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {ticket.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {ticket.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(ticket.createdAt)}
                          </span>
                        </CardDescription>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Customer message */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="font-medium text-sm text-muted-foreground mb-1">Dotaz zákazníka:</p>
                        <p className="whitespace-pre-wrap">{ticket.message}</p>
                      </div>

                      {/* Conversation history */}
                      {ticket.conversationHistory && (
                        <div>
                          <button
                            onClick={() => setExpandedHistory(expandedHistory === ticket.id ? null : ticket.id)}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {expandedHistory === ticket.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            Zobrazit historii konverzace
                          </button>
                          {expandedHistory === ticket.id && (
                            <div className="mt-2 bg-slate-100 rounded-lg p-4 max-h-64 overflow-y-auto">
                              {parseConversationHistory(ticket.conversationHistory).map((msg: { role: string; content: string }, idx: number) => (
                                <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                                  <span className={`inline-block px-3 py-1 rounded-lg text-sm ${
                                    msg.role === 'user' 
                                      ? 'bg-purple-100 text-purple-900' 
                                      : 'bg-white text-gray-900'
                                  }`}>
                                    {msg.content}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Response */}
                      {ticket.response && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="font-medium text-sm text-green-700 mb-1">
                            Odpověď ({ticket.respondedBy}) - {ticket.respondedAt && formatDate(ticket.respondedAt)}:
                          </p>
                          <p className="whitespace-pre-wrap text-green-900">{ticket.response}</p>
                        </div>
                      )}

                      {/* Actions */}
                      {ticket.status === 'pending' && (
                        <div className="flex justify-end">
                          <Button onClick={() => handleOpenResponse(ticket)} className="gap-2">
                            <Send className="w-4 h-4" />
                            Odpovědět
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Response Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Odpovědět na dotaz</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-medium text-sm mb-1">Od: {selectedTicket.name} ({selectedTicket.email})</p>
                <p className="text-sm text-muted-foreground mb-2">{formatDate(selectedTicket.createdAt)}</p>
                <p className="whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Vaše odpověď:</label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Napište odpověď zákazníkovi..."
                  rows={6}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Zrušit
            </Button>
            <Button 
              onClick={handleSendResponse} 
              disabled={!responseText.trim() || answerMutation.isPending}
              className="gap-2"
            >
              {answerMutation.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Odeslat odpověď
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
