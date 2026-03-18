import { MessageSquare, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { showToast } from '../../lib/utils';
import { Navigate } from 'react-router-dom';

const Community = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const authToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    '';
  const authHeaders = authToken
    ? { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'ADMIN';
  const isAspirant = user?.role === 'ASPIRING_BUSINESS_OWNER';

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [postDetails, setPostDetails] = useState<Record<string, any>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [tagFilter, setTagFilter] = useState('');
  const [appliedTag, setAppliedTag] = useState('');
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [pendingComments, setPendingComments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  const [draft, setDraft] = useState({
    title: '',
    body: '',
    tags: '',
  });

  const getDisplayName = (user: any) => {
    const profile = user?.entrepreneurProfile || user?.investorProfile || {};
    const first = profile.firstName || user?.firstName || '';
    const last = profile.lastName || user?.lastName || '';
    const name = `${first} ${last}`.trim();
    return name || user?.email || 'Member';
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab === 'mine') params.set('mine', 'true');
      if (appliedTag) params.set('tag', appliedTag);
      const res = await fetch(`${API_BASE}/community/posts?${params.toString()}`, {
        headers: authHeaders,
      });
      const data = await res.json();
      setPosts(Array.isArray(data?.items) ? data.items : []);
    } catch (error) {
      console.error(error);
      showToast('Failed to load community posts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [activeTab, appliedTag]);

  useEffect(() => {
    if (!isAdmin) return;
    const loadPending = async () => {
      try {
        const [postsRes, commentsRes] = await Promise.all([
          fetch(`${API_BASE}/community/admin/pending/posts`, { headers: authHeaders }),
          fetch(`${API_BASE}/community/admin/pending/comments`, { headers: authHeaders }),
        ]);
        const postsData = postsRes.ok ? await postsRes.json() : [];
        const commentsData = commentsRes.ok ? await commentsRes.json() : [];
        setPendingPosts(Array.isArray(postsData) ? postsData : []);
        setPendingComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (error) {
        console.error(error);
      }
    };
    const loadReports = async () => {
      try {
        const res = await fetch(`${API_BASE}/community/admin/reports`, { headers: authHeaders });
        const data = res.ok ? await res.json() : [];
        setReports(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    };
    loadPending();
    loadReports();
  }, [isAdmin]);

  const handleCreatePost = async () => {
    if (!draft.title.trim() || !draft.body.trim()) {
      showToast('Add a title and message.', 'error');
      return;
    }
    setCreating(true);
    try {
      const payload = {
        title: draft.title.trim(),
        body: draft.body.trim(),
        tags: draft.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      const res = await fetch(`${API_BASE}/community/posts`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('Create failed');
      }
      const created = await res.json();
      setPosts((prev) => [created, ...prev]);
      setDraft({ title: '', body: '', tags: '' });
      showToast('Post published.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Unable to publish post.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePost = async (postId: string) => {
    if (openPostId === postId) {
      setOpenPostId(null);
      return;
    }
    setOpenPostId(postId);
    if (postDetails[postId]) return;
    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}`, { headers: authHeaders });
      if (!res.ok) throw new Error('Load failed');
      const data = await res.json();
      setPostDetails((prev) => ({ ...prev, [postId]: data }));
    } catch (error) {
      console.error(error);
      showToast('Failed to load post.', 'error');
    }
  };

  const handleComment = async (postId: string) => {
    const message = commentDrafts[postId]?.trim();
    if (!message) {
      showToast('Add a comment.', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ body: message }),
      });
      if (!res.ok) throw new Error('Comment failed');
      const newComment = await res.json();
      setPostDetails((prev) => {
        const existing = prev[postId];
        if (!existing) return prev;
        return {
          ...prev,
          [postId]: {
            ...existing,
            comments: [...(existing.comments || []), newComment],
          },
        };
      });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, _count: { comments: (post?._count?.comments || 0) + 1 } }
            : post,
        ),
      );
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error(error);
      showToast('Unable to add comment.', 'error');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!isAdmin) return;
    const confirmed = window.confirm('Delete this post? This cannot be undone.');
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!res.ok) throw new Error('Delete failed');
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setPostDetails((prev) => {
        const copy = { ...prev };
        delete copy[postId];
        return copy;
      });
      if (openPostId === postId) {
        setOpenPostId(null);
      }
      showToast('Post deleted.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Unable to delete post.', 'error');
    }
  };

  const handleDeleteComment = async (commentId: string, postId?: string) => {
    if (!isAdmin) return;
    const confirmed = window.confirm('Delete this comment?');
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE}/community/comments/${commentId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!res.ok) throw new Error('Delete failed');
      if (postId) {
        setPostDetails((prev) => {
          const existing = prev[postId];
          if (!existing) return prev;
          return {
            ...prev,
            [postId]: {
              ...existing,
              comments: (existing.comments || []).filter((c: any) => c.id !== commentId),
            },
          };
        });
      }
      setPendingComments((prev) => prev.filter((comment) => comment.id !== commentId));
      showToast('Comment deleted.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Unable to delete comment.', 'error');
    }
  };

  const updatePostStatus = async (postId: string, status: 'APPROVED' | 'REJECTED') => {
    if (!isAdmin) return;
    try {
      const res = await fetch(`${API_BASE}/community/admin/posts/${postId}/status`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      setPendingPosts((prev) => prev.filter((post) => post.id !== postId));
      showToast(`Post ${status.toLowerCase()}.`, 'success');
      loadPosts();
    } catch (error) {
      console.error(error);
      showToast('Unable to update post.', 'error');
    }
  };

  const updateCommentStatus = async (commentId: string, status: 'APPROVED' | 'REJECTED') => {
    if (!isAdmin) return;
    try {
      const res = await fetch(`${API_BASE}/community/admin/comments/${commentId}/status`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      setPendingComments((prev) => prev.filter((comment) => comment.id !== commentId));
      showToast(`Comment ${status.toLowerCase()}.`, 'success');
    } catch (error) {
      console.error(error);
      showToast('Unable to update comment.', 'error');
    }
  };

  const togglePinned = async (postId: string, isPinned: boolean) => {
    if (!isAdmin) return;
    try {
      const res = await fetch(`${API_BASE}/community/admin/posts/${postId}/pin`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ isPinned }),
      });
      if (!res.ok) throw new Error('Update failed');
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, isPinned } : post)),
      );
      showToast(isPinned ? 'Post pinned.' : 'Post unpinned.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Unable to update pin.', 'error');
    }
  };

  const handleReport = async (targetId: string, targetType: 'POST' | 'COMMENT') => {
    const reason = window.prompt('Why are you reporting this?');
    if (!reason?.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/community/reports/${targetId}`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ targetType, reason: reason.trim() }),
      });
      if (!res.ok) throw new Error('Report failed');
      showToast('Report submitted.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Unable to submit report.', 'error');
    }
  };

  const resolveReport = async (reportId: string) => {
    if (!isAdmin) return;
    try {
      const res = await fetch(`${API_BASE}/community/admin/reports/${reportId}/resolve`, {
        method: 'PATCH',
        headers: authHeaders,
      });
      if (!res.ok) throw new Error('Resolve failed');
      setReports((prev) => prev.filter((report) => report.id !== reportId));
      showToast('Report resolved.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Unable to resolve report.', 'error');
    }
  };

  if (!isAspirant && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Community Forum</h1>
            <p className="text-slate-500 dark:text-neutral-muted text-sm">
              Ask questions, share progress, and get feedback from founders and mentors.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-3xl p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Start a discussion</h2>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#111113] rounded-full p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold rounded-full ${
                activeTab === 'all'
                  ? 'bg-primary text-neutral-dark'
                  : 'text-slate-500 dark:text-gray-400'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`px-4 py-2 text-xs font-bold rounded-full ${
                activeTab === 'mine'
                  ? 'bg-primary text-neutral-dark'
                  : 'text-slate-500 dark:text-gray-400'
              }`}
            >
              My Posts
            </button>
          </div>
        </div>
        <input
          value={draft.title}
          onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="What are you working on?"
          className="w-full border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-[#111113] text-slate-900 dark:text-white"
        />
        <textarea
          value={draft.body}
          onChange={(event) => setDraft((prev) => ({ ...prev, body: event.target.value }))}
          placeholder="Share context or ask your question..."
          rows={4}
          className="w-full border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-[#111113] text-slate-900 dark:text-white"
        />
        <input
          value={draft.tags}
          onChange={(event) => setDraft((prev) => ({ ...prev, tags: event.target.value }))}
          placeholder="Tags (comma separated)"
          className="w-full border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-[#111113] text-slate-900 dark:text-white"
        />
        <div className="flex flex-col md:flex-row gap-2">
          <input
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
            placeholder="Filter by tag (e.g. funding)"
            className="flex-1 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-[#111113] text-slate-900 dark:text-white"
          />
          <Button
            onClick={() => setAppliedTag(tagFilter.trim())}
            className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold px-6 py-3 rounded-xl"
          >
            Apply
          </Button>
          {appliedTag && (
            <Button
              onClick={() => {
                setAppliedTag('');
                setTagFilter('');
              }}
              className="bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-gray-700 font-bold px-6 py-3 rounded-xl"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleCreatePost}
            disabled={creating}
            className="bg-primary text-neutral-dark font-bold px-6 py-3 rounded-xl"
          >
            {creating ? 'Posting...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-slate-500">Loading community posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-slate-500">No posts yet. Be the first to share.</div>
        ) : (
          posts.map((post) => {
            const details = postDetails[post.id];
            const isOpen = openPostId === post.id;
            const commentCount = post?._count?.comments || 0;
            return (
              <div
                key={post.id}
                className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{post.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {getDisplayName(post.user)} • {new Date(post.createdAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {!isAdmin && (
                      <button
                        onClick={() => handleReport(post.id, 'POST')}
                        className="text-xs font-bold text-slate-500 uppercase"
                      >
                        Report
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => togglePinned(post.id, !post.isPinned)}
                        className="text-xs font-bold text-amber-500 uppercase"
                      >
                        {post.isPinned ? 'Unpin' : 'Pin'}
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-xs font-bold text-red-500 uppercase"
                      >
                        Delete
                      </button>
                    )}
                    <button
                      onClick={() => handleTogglePost(post.id)}
                      className="text-xs font-bold text-primary uppercase flex items-center gap-1"
                    >
                      <MessageSquare size={14} /> {isOpen ? 'Hide' : `Comments (${commentCount})`}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-neutral-muted whitespace-pre-line">
                  {post.body}
                </p>
                {post.status && post.status !== 'APPROVED' && (
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                    post.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {post.status}
                  </span>
                )}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setAppliedTag(tag);
                          setTagFilter(tag);
                        }}
                        className="text-[10px] uppercase font-bold bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                {isOpen && (
                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-gray-800">
                    {details?.comments?.length ? (
                      <div className="space-y-3">
                        {details.comments.map((comment: any) => (
                          <div key={comment.id} className="bg-slate-50 dark:bg-[#111113] rounded-xl p-4">
                            <p className="text-xs text-slate-500 mb-2">
                              {getDisplayName(comment.user)} •{' '}
                              {new Date(comment.createdAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                            </p>
                            <p className="text-sm text-slate-700 dark:text-neutral-muted whitespace-pre-line">
                              {comment.body}
                            </p>
                            {comment.status && comment.status !== 'APPROVED' && (
                              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                                comment.status === 'PENDING'
                                  ? 'bg-yellow-500/20 text-yellow-500'
                                  : 'bg-red-500/20 text-red-500'
                              }`}>
                                {comment.status}
                              </span>
                            )}
                            {!isAdmin && (
                              <button
                                onClick={() => handleReport(comment.id, 'COMMENT')}
                                className="mt-2 text-xs font-bold text-slate-500 uppercase"
                              >
                                Report
                              </button>
                            )}
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteComment(comment.id, post.id)}
                                className="mt-2 text-xs font-bold text-red-500 uppercase"
                              >
                                Delete Comment
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No comments yet.</p>
                    )}

                    <div className="flex gap-3">
                      <input
                        value={commentDrafts[post.id] || ''}
                        onChange={(event) =>
                          setCommentDrafts((prev) => ({ ...prev, [post.id]: event.target.value }))
                        }
                        placeholder="Add a comment..."
                        className="flex-1 border border-slate-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-[#111113] text-slate-900 dark:text-white text-sm"
                      />
                      <Button
                        onClick={() => handleComment(post.id)}
                        className="bg-primary text-neutral-dark font-bold px-4 py-2 rounded-xl"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {isAdmin && (
        <div className="space-y-6">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Moderation Queue</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase text-slate-500">Pending Posts</h3>
              {pendingPosts.length === 0 ? (
                <p className="text-sm text-slate-500">No pending posts.</p>
              ) : (
                pendingPosts.map((post) => (
                  <div key={post.id} className="border border-slate-200 dark:border-gray-700 rounded-xl p-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{post.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{post.body}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        onClick={() => updatePostStatus(post.id, 'APPROVED')}
                        className="bg-primary text-neutral-dark font-bold px-3 py-2 rounded-xl text-xs"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => updatePostStatus(post.id, 'REJECTED')}
                        className="bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-gray-700 font-bold px-3 py-2 rounded-xl text-xs"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase text-slate-500">Pending Comments</h3>
              {pendingComments.length === 0 ? (
                <p className="text-sm text-slate-500">No pending comments.</p>
              ) : (
                pendingComments.map((comment) => (
                  <div key={comment.id} className="border border-slate-200 dark:border-gray-700 rounded-xl p-4">
                    <p className="text-xs text-slate-500">Post: {comment.post?.title}</p>
                    <p className="text-sm text-slate-700 dark:text-neutral-muted mt-2">{comment.body}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        onClick={() => updateCommentStatus(comment.id, 'APPROVED')}
                        className="bg-primary text-neutral-dark font-bold px-3 py-2 rounded-xl text-xs"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => updateCommentStatus(comment.id, 'REJECTED')}
                        className="bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-gray-700 font-bold px-3 py-2 rounded-xl text-xs"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="bg-red-500/10 text-red-500 border border-red-500/30 font-bold px-3 py-2 rounded-xl text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-500">Reports</h3>
            {reports.length === 0 ? (
              <p className="text-sm text-slate-500">No open reports.</p>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="border border-slate-200 dark:border-gray-700 rounded-xl p-4 space-y-2">
                  <p className="text-xs text-slate-500">
                    Target: {report.targetType} • {report.target?.title || report.target?.body || report.targetId}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-neutral-muted">{report.reason}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => resolveReport(report.id)}
                      className="bg-primary text-neutral-dark font-bold px-3 py-2 rounded-xl text-xs"
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
