import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  FileText,
  RefreshCw,
  Shield,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Ban,
  Eye,
} from "lucide-react";
import { Link } from "wouter";

export default function AdminComments() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");

  const { data: pendingComments, refetch: refetchPending, isLoading: loadingPending } =
    trpc.articles.getPendingComments.useQuery(undefined, {
      enabled: !!user && user.role === "admin",
    });

  const { data: allComments, refetch: refetchAll, isLoading: loadingAll } =
    trpc.articles.getAllComments.useQuery(undefined, {
      enabled: !!user && user.role === "admin",
    });

  const moderateMutation = trpc.articles.moderateComment.useMutation({
    onSuccess: (_, variables) => {
      const action =
        variables.status === "approved"
          ? "schválen"
          : variables.status === "rejected"
          ? "zamítnut"
          : "označen jako spam";
      toast.success(`Komentář byl ${action}`);
      refetchPending();
      refetchAll();
    },
    onError: (error) => {
      toast.error(`Chyba: ${error.message}`);
    },
  });

  const handleModerate = (commentId: number, status: "approved" | "rejected" | "spam") => {
    moderateMutation.mutate({ commentId, status });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getArticleUrl = (slug: string, type: string) => {
    if (type === "guide") return `/symbol/${slug}`;
    return `/magazin/${slug}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Čeká</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Schváleno</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Zamítnuto</Badge>;
      case "spam":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200"><Ban className="w-3 h-3 mr-1" />Spam</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-[#E85A9F]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold mb-2">Přístup odepřen</h2>
            <p className="text-muted-foreground">Tato stránka je dostupná pouze pro administrátory.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingCount = pendingComments?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container max-w-6xl py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-[#E85A9F]" />
                Moderace komentářů
              </h1>
              <p className="text-sm text-muted-foreground">
                Spravujte komentáře pod články
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { refetchPending(); refetchAll(); }}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Obnovit
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-xs text-muted-foreground">Čeká na schválení</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {allComments?.filter((c: any) => c.status === "approved").length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Schváleno</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {allComments?.filter((c: any) => c.status === "rejected").length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Zamítnuto</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {allComments?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Celkem</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Ke schválení
              {pendingCount > 0 && (
                <Badge className="ml-1 bg-yellow-500 text-white text-xs px-1.5 py-0">{pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <FileText className="w-4 h-4" />
              Všechny komentáře
            </TabsTrigger>
          </TabsList>

          {/* Pending comments */}
          <TabsContent value="pending">
            {loadingPending ? (
              <div className="text-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E85A9F]" />
                <p className="text-sm text-muted-foreground">Načítám...</p>
              </div>
            ) : pendingCount === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-lg font-semibold mb-1">Vše schváleno!</h3>
                  <p className="text-muted-foreground">Žádné komentáře nečekají na moderaci.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingComments?.map((comment: any) => (
                  <Card key={comment.id} className="border-l-4 border-l-yellow-400">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <div className="flex items-center gap-1.5">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{comment.authorName}</span>
                            </div>
                            {comment.authorEmail && (
                              <span className="text-xs text-muted-foreground">({comment.authorEmail})</span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              {comment.articleSlug}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {comment.articleType}
                            </Badge>
                            {comment.parentId && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">
                                Odpověď
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleModerate(comment.id, "approved")}
                            disabled={moderateMutation.isPending}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Schválit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleModerate(comment.id, "rejected")}
                            disabled={moderateMutation.isPending}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            Zamítnout
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1.5 text-gray-400 hover:text-gray-600"
                            onClick={() => handleModerate(comment.id, "spam")}
                            disabled={moderateMutation.isPending}
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Spam
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* All comments */}
          <TabsContent value="all">
            {loadingAll ? (
              <div className="text-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E85A9F]" />
                <p className="text-sm text-muted-foreground">Načítám...</p>
              </div>
            ) : !allComments?.length ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-1">Zatím žádné komentáře</h3>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {allComments.map((comment: any) => (
                  <Card key={comment.id} className={`${
                    comment.status === 'pending' ? 'border-l-4 border-l-yellow-400' :
                    comment.status === 'approved' ? 'border-l-4 border-l-green-400' :
                    comment.status === 'rejected' ? 'border-l-4 border-l-red-400' :
                    'border-l-4 border-l-gray-300'
                  }`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-sm">{comment.authorName}</span>
                            {getStatusBadge(comment.status)}
                            <span className="text-xs text-muted-foreground">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Badge variant="secondary" className="text-xs">{comment.articleSlug}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{comment.content}</p>
                          {comment.moderatedBy && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Moderoval: {comment.moderatedBy} • {comment.moderatedAt ? formatDate(comment.moderatedAt) : ''}
                            </p>
                          )}
                        </div>

                        {comment.status === "pending" && (
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-600 hover:bg-green-50"
                              onClick={() => handleModerate(comment.id, "approved")}
                              title="Schválit"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:bg-red-50"
                              onClick={() => handleModerate(comment.id, "rejected")}
                              title="Zamítnout"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {comment.status !== "pending" && comment.status !== "approved" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:bg-green-50 text-xs"
                            onClick={() => handleModerate(comment.id, "approved")}
                          >
                            Obnovit
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
