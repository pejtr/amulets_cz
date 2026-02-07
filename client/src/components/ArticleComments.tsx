import { useState } from 'react';
import { MessageCircle, Send, User, Clock, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

interface ArticleCommentsProps {
  articleSlug: string;
  articleType?: 'magazine' | 'guide' | 'tantra';
  visitorId: string;
}

export default function ArticleComments({ articleSlug, articleType = 'magazine', visitorId }: ArticleCommentsProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [authorEmail, setAuthorEmail] = useState(user?.email || '');
  const [content, setContent] = useState('');
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { data: comments, refetch } = trpc.articles.getComments.useQuery({ articleSlug });
  const { data: stats } = trpc.articles.getStats.useQuery({ articleSlug });

  const addCommentMutation = trpc.articles.addComment.useMutation({
    onSuccess: (result) => {
      setContent('');
      setReplyToId(null);
      setShowForm(false);
      if (result.autoApproved) {
        setSuccessMessage('Komentář byl přidán!');
      } else {
        setSuccessMessage('Komentář byl odeslán a čeká na schválení.');
      }
      setTimeout(() => setSuccessMessage(''), 5000);
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !authorName.trim()) return;

    addCommentMutation.mutate({
      articleSlug,
      articleType,
      visitorId,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim() || undefined,
      content: content.trim(),
      parentId: replyToId || undefined,
    });
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Separate top-level comments and replies
  const topLevelComments = (comments || []).filter(c => !c.parentId);
  const replies = (comments || []).filter(c => c.parentId);
  const getReplies = (parentId: number) => replies.filter(r => r.parentId === parentId);

  const displayedComments = showAllComments ? topLevelComments : topLevelComments.slice(0, 3);
  const totalComments = stats?.comments?.total || 0;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#E85A9F]" />
          <h3 className="text-xl font-bold text-[#2C3E50]">
            Komentáře {totalComments > 0 && <span className="text-muted-foreground font-normal">({totalComments})</span>}
          </h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-[#E85A9F] text-[#E85A9F] hover:bg-[#E85A9F]/10"
          onClick={() => { setShowForm(!showForm); setReplyToId(null); }}
        >
          <MessageCircle className="w-4 h-4" />
          Napsat komentář
        </Button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
          {successMessage}
        </div>
      )}

      {/* Comment form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="font-medium text-[#2C3E50] mb-4">
            {replyToId ? 'Odpovědět na komentář' : 'Sdílejte své myšlenky a zkušenosti'}
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Jméno *</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Vaše jméno"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E85A9F]/30 focus:border-[#E85A9F] outline-none"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email (volitelný)</label>
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="vas@email.cz"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E85A9F]/30 focus:border-[#E85A9F] outline-none"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">Komentář *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Podělte se o své myšlenky, zkušenosti nebo otázky..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E85A9F]/30 focus:border-[#E85A9F] outline-none resize-none"
              rows={4}
              required
              maxLength={2000}
            />
            <div className="text-xs text-gray-400 mt-1 text-right">{content.length}/2000</div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              size="sm"
              className="gap-2 bg-[#E85A9F] hover:bg-[#E85A9F]/90 text-white"
              disabled={addCommentMutation.isPending || !content.trim() || !authorName.trim()}
            >
              <Send className="w-4 h-4" />
              {addCommentMutation.isPending ? 'Odesílám...' : 'Odeslat komentář'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { setShowForm(false); setReplyToId(null); }}
            >
              Zrušit
            </Button>
          </div>

          {!user && (
            <p className="text-xs text-gray-400 mt-2">
              Komentáře nepřihlášených uživatelů čekají na schválení.
            </p>
          )}
        </form>
      )}

      {/* Comments list */}
      {displayedComments.length > 0 ? (
        <div className="space-y-4">
          {displayedComments.map((comment) => {
            const commentReplies = getReplies(comment.id);
            return (
              <div key={comment.id} className="group">
                {/* Main comment */}
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E85A9F] to-purple-400 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-[#2C3E50] text-sm">{comment.authorName}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                      <p className="mt-1.5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                      <button
                        className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-[#E85A9F] transition-colors"
                        onClick={() => { setReplyToId(comment.id); setShowForm(true); }}
                      >
                        <Reply className="w-3 h-3" />
                        Odpovědět
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {commentReplies.length > 0 && (
                  <div className="ml-8 mt-2 space-y-2">
                    {commentReplies.map((reply) => (
                      <div key={reply.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-start gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-[#2C3E50] text-xs">{reply.authorName}</span>
                              <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Zatím žádné komentáře. Buďte první!</p>
        </div>
      )}

      {/* Show more/less */}
      {topLevelComments.length > 3 && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-[#E85A9F]"
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Zobrazit méně
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Zobrazit všechny ({topLevelComments.length})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
