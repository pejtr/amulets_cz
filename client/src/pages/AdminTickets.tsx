import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ChevronUp,
  Download,
  Search,
  Calendar,
  FileText,
  Sparkles,
  X
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

// FAQ šablony pro automatické odpovědi
const FAQ_TEMPLATES = [
  {
    id: 'shipping',
    title: '📦 Doprava a doručení',
    response: `Dobrý den,

děkuji za váš dotaz ohledně dopravy.

**Možnosti doručení:**
- Zásilkovna (výdejní místa): 79 Kč
- Kurýr na adresu: 119 Kč
- **Doprava zdarma** při objednávce nad 1 500 Kč

**Doba doručení:**
- Objednávky do 14:00 odesíláme tentýž den
- Standardní doba doručení: 1-3 pracovní dny

Pokud máte další dotazy, neváhejte se ozvat.

S láskou,
Natálie z Amulets.cz 💜`
  },
  {
    id: 'returns',
    title: '↩️ Vrácení a reklamace',
    response: `Dobrý den,

děkuji za váš dotaz.

**Vrácení zboží:**
- Máte 14 dní na vrácení bez udání důvodu
- Zboží musí být nepoužité a v původním obalu
- Peníze vracíme do 14 dnů od přijetí zásilky

**Reklamace:**
- Záruka 24 měsíců na všechny produkty
- Kontaktujte nás na info@amulets.cz s popisem závady
- Reklamaci vyřídíme do 30 dnů

Jsem tu pro vás, pokud potřebujete pomoct.

S láskou,
Natálie z Amulets.cz 💜`
  },
  {
    id: 'symbol_meaning',
    title: '✨ Význam symbolů',
    response: `Dobrý den,

děkuji za váš zájem o spirituální symboly!

Každý symbol má svůj jedinečný význam a energie. Doporučuji vám projít náš **Průvodce amulety** na webu, kde najdete detailní popis 33 posvátných symbolů.

Můžete také zkusit náš **Kvíz: Tvůj symbol** - pomůže vám najít symbol, který rezonuje s vaší duší.

Pokud hledáte konkrétní symbol pro specifický účel (ochrana, láska, prosperita...), ráda vám poradím osobně.

S láskou,
Natálie z Amulets.cz 💜`
  },
  {
    id: 'blue_lotus',
    title: '🪷 Modrý lotos',
    response: `Dobrý den,

děkuji za váš zájem o modrý lotos - posvátnou květinu egyptských mystérií!

**Modrý lotos (Nymphaea caerulea)** byl v starověkém Egyptě považován za bránu k vyššímu vědomí. Používal se při meditacích a rituálech pro:
- Hlubokou relaxaci a uvolnění
- Posílení intuice a snů
- Spojení s vyšším já

**Naše produkty s modrým lotosem:**
- Esenciální olej Blue Lotus
- Aromaterapeutické směsi
- Meditační svíčky

Použijte kód **LOTOS10** pro 10% slevu na první nákup.

S láskou,
Natálie z Amulets.cz 💜`
  },
  {
    id: 'custom_order',
    title: '🎁 Zakázková výroba',
    response: `Dobrý den,

děkuji za váš zájem o zakázkovou výrobu!

**Nabízíme:**
- Personalizované orgonitové pyramidy
- Amulety s vlastním výběrem kamenů
- Gravírování symbolů na přání

**Postup:**
1. Napište mi vaše představy a přání
2. Připravím návrh a cenovou kalkulaci
3. Po schválení začneme s výrobou (7-14 dní)

Ráda s vámi proberu všechny možnosti. Můžeme se spojit na WhatsApp: 776 041 740

S láskou,
Natálie z Amulets.cz 💜`
  }
];

export default function AdminTickets() {
  const [activeTab, setActiveTab] = useState<'pending' | 'answered' | 'all'>('pending');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  
  // Filtrování
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFaqPanel, setShowFaqPanel] = useState(false);

  // Fetch tickets
  const { data: ticketsData, isLoading, refetch } = trpc.chatbotAB.getAllTickets.useQuery({
    status: activeTab,
    limit: 100,
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

  // Filtrované tickety
  const filteredTickets = useMemo(() => {
    if (!ticketsData?.tickets) return [];
    
    return ticketsData.tickets.filter((ticket: Ticket) => {
      // Filtr podle klíčových slov
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = ticket.name.toLowerCase().includes(query);
        const matchesEmail = ticket.email.toLowerCase().includes(query);
        const matchesMessage = ticket.message.toLowerCase().includes(query);
        const matchesHistory = ticket.conversationHistory?.toLowerCase().includes(query);
        
        if (!matchesName && !matchesEmail && !matchesMessage && !matchesHistory) {
          return false;
        }
      }
      
      // Filtr podle data od
      if (dateFrom) {
        const ticketDate = new Date(ticket.createdAt);
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (ticketDate < fromDate) return false;
      }
      
      // Filtr podle data do
      if (dateTo) {
        const ticketDate = new Date(ticket.createdAt);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (ticketDate > toDate) return false;
      }
      
      return true;
    });
  }, [ticketsData?.tickets, searchQuery, dateFrom, dateTo]);

  const handleOpenResponse = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setResponseText("");
    setShowFaqPanel(false);
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

  const handleUseFaqTemplate = (template: typeof FAQ_TEMPLATES[0]) => {
    setResponseText(template.response);
    setShowFaqPanel(false);
    toast.success(`Šablona "${template.title}" byla vložena`);
  };

  const handleExportCSV = () => {
    if (!filteredTickets.length) {
      toast.error("Žádné tickety k exportu");
      return;
    }

    // Připravit CSV data
    const headers = ['ID', 'Datum', 'Jméno', 'Email', 'Dotaz', 'Status', 'Odpověď', 'Datum odpovědi'];
    const rows = filteredTickets.map((ticket: Ticket) => [
      ticket.id,
      formatDate(ticket.createdAt),
      ticket.name,
      ticket.email,
      `"${ticket.message.replace(/"/g, '""')}"`,
      ticket.status,
      ticket.response ? `"${ticket.response.replace(/"/g, '""')}"` : '',
      ticket.respondedAt ? formatDate(ticket.respondedAt) : ''
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map((row: (string | number)[]) => row.join(';'))
    ].join('\n');

    // Stáhnout soubor
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tickety_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success(`Exportováno ${filteredTickets.length} ticketů`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
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

  const hasActiveFilters = searchQuery || dateFrom || dateTo;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Správa Ticketů</h1>
          <p className="text-muted-foreground">Offline dotazy z chatbota</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Obnovit
          </Button>
        </div>
      </div>

      {/* Filtrování */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Hledat</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Jméno, email, text dotazu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-[160px]">
              <label className="text-sm font-medium mb-1 block">Od data</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-[160px]">
              <label className="text-sm font-medium mb-1 block">Do data</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="gap-1">
                <X className="w-4 h-4" />
                Zrušit filtry
              </Button>
            )}
          </div>
          {hasActiveFilters && (
            <p className="text-sm text-muted-foreground mt-2">
              Nalezeno {filteredTickets.length} ticketů
            </p>
          )}
        </CardContent>
      </Card>

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
          ) : !filteredTickets.length ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {hasActiveFilters ? 'Žádné tickety odpovídající filtrům' : 'Žádné tickety k zobrazení'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket: Ticket) => (
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Odpovědět na dotaz</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Hlavní obsah */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-medium text-sm mb-1">Od: {selectedTicket.name} ({selectedTicket.email})</p>
                  <p className="text-sm text-muted-foreground mb-2">{formatDate(selectedTicket.createdAt)}</p>
                  <p className="whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Vaše odpověď:</label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowFaqPanel(!showFaqPanel)}
                      className="gap-1"
                    >
                      <Sparkles className="w-4 h-4" />
                      {showFaqPanel ? 'Skrýt šablony' : 'FAQ šablony'}
                    </Button>
                  </div>
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Napište odpověď zákazníkovi..."
                    rows={10}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* FAQ Panel */}
              {showFaqPanel && (
                <div className="lg:col-span-1 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Rychlé odpovědi:</p>
                  {FAQ_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleUseFaqTemplate(template)}
                      className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium text-sm">{template.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {template.response.substring(0, 80)}...
                      </p>
                    </button>
                  ))}
                </div>
              )}
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
