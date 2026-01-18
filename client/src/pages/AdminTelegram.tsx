import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Eye,
  Bell
} from "lucide-react";
import { toast } from "sonner";

export default function AdminTelegram() {
  const [previewVisible, setPreviewVisible] = useState(false);

  // Check Telegram configuration
  const { data: config, isLoading: configLoading, refetch: refetchConfig } = trpc.telegram.checkConfig.useQuery();

  // Preview report
  const { data: preview, isLoading: previewLoading, refetch: refetchPreview } = trpc.telegram.previewReport.useQuery(undefined, {
    enabled: previewVisible,
  });

  // Send test message mutation
  const sendTestMutation = trpc.telegram.sendTestMessage.useMutation({
    onSuccess: () => {
      toast.success("Testovací zpráva byla odeslána do Telegramu!");
    },
    onError: (error) => {
      toast.error(`Chyba: ${error.message}`);
    },
  });

  // Send daily report mutation
  const sendReportMutation = trpc.telegram.sendDailyReport.useMutation({
    onSuccess: () => {
      toast.success("Denní report byl odeslán do Telegramu!");
    },
    onError: (error) => {
      toast.error(`Chyba: ${error.message}`);
    },
  });

  const handleSendTest = () => {
    sendTestMutation.mutate();
  };

  const handleSendReport = () => {
    sendReportMutation.mutate();
  };

  const handlePreview = () => {
    setPreviewVisible(true);
    refetchPreview();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              Telegram Integrace
            </h1>
            <p className="text-gray-600 mt-1">
              Nastavení a odesílání denních reportů do Telegramu
            </p>
          </div>
          <Button onClick={() => refetchConfig()} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Obnovit
          </Button>
        </div>

        {/* Configuration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Stav konfigurace
            </CardTitle>
            <CardDescription>
              Kontrola nastavení Telegram bota
            </CardDescription>
          </CardHeader>
          <CardContent>
            {configLoading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Načítám...
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {config?.hasToken ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span>Bot Token</span>
                    <Badge variant={config?.hasToken ? "default" : "destructive"}>
                      {config?.hasToken ? "Nastaven" : "Chybí"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {config?.hasChatId ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span>Chat ID</span>
                    <Badge variant={config?.hasChatId ? "default" : "destructive"}>
                      {config?.hasChatId ? "Nastaven" : "Chybí"}
                    </Badge>
                  </div>
                </div>
                
                {!config?.configured && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>Jak nastavit Telegram bota:</strong>
                    </p>
                    <ol className="list-decimal list-inside text-yellow-700 text-sm mt-2 space-y-1">
                      <li>Otevřete Telegram a najděte @BotFather</li>
                      <li>Napište /newbot a vytvořte nového bota</li>
                      <li>Zkopírujte token a nastavte ho jako TELEGRAM_BOT_TOKEN</li>
                      <li>Napište botovi @userinfobot pro získání vašeho Chat ID</li>
                      <li>Nastavte Chat ID jako TELEGRAM_CHAT_ID</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Akce</CardTitle>
            <CardDescription>
              Odeslání zpráv do Telegramu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleSendTest} 
                disabled={!config?.configured || sendTestMutation.isPending}
                variant="outline"
                className="gap-2"
              >
                {sendTestMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Odeslat testovací zprávu
              </Button>
              
              <Button 
                onClick={handleSendReport} 
                disabled={!config?.configured || sendReportMutation.isPending}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {sendReportMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Odeslat denní report
              </Button>
              
              <Button 
                onClick={handlePreview} 
                variant="secondary"
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                Náhled reportu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {previewVisible && (
          <Card>
            <CardHeader>
              <CardTitle>Náhled denního reportu</CardTitle>
              <CardDescription>
                Takto bude vypadat zpráva odeslaná do Telegramu
              </CardDescription>
            </CardHeader>
            <CardContent>
              {previewLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generuji náhled...
                </div>
              ) : (
                <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                  {preview?.report
                    ?.replace(/<b>/g, '')
                    ?.replace(/<\/b>/g, '')
                    ?.replace(/<br>/g, '\n')
                  }
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle>Automatické reporty</CardTitle>
            <CardDescription>
              Informace o automatickém odesílání
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-600 space-y-2">
              <p>
                Pro automatické denní reporty v 8:00 ráno je potřeba nastavit cron job 
                nebo použít externí službu jako je Zapier, Make, nebo GitHub Actions.
              </p>
              <p>
                Endpoint pro automatické volání: <code className="bg-gray-100 px-2 py-1 rounded">/api/trpc/telegram.sendDailyReport</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
