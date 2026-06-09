import { useEffect, useState } from 'react';
import { CheckCircle, Flag, Loader2, MessageSquareWarning, RefreshCw, ShieldAlert } from 'lucide-react';
import api from '../utils/api';
import EmptyState from '../components/EmptyState';

interface UserSummary {
  id: string;
  email: string;
  role: string;
  entrepreneurProfile?: { firstName?: string; lastName?: string };
  investorProfile?: { firstName?: string; lastName?: string };
}

interface MessageReport {
  id: string;
  reason: string;
  source: string;
  status: string;
  createdAt: string;
  reporter?: UserSummary | null;
  reportedUser?: UserSummary;
  message?: {
    id: string;
    content?: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
  } | null;
}

const getName = (user?: UserSummary | null) => {
  if (!user) return 'System';
  const profile = user.entrepreneurProfile || user.investorProfile || {};
  return [profile.firstName, profile.lastName].filter(Boolean).join(' ') || user.email;
};

const MessageReports = () => {
  const [reports, setReports] = useState<MessageReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<MessageReport | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [status, setStatus] = useState('OPEN');
  const [loading, setLoading] = useState(true);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState('');

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/messages/admin/reports?status=${status}`);
      const list = Array.isArray(response.data) ? response.data : [];
      setReports(list);
      setSelectedReport((current) => {
        if (!current) return list[0] || null;
        return list.find((report: MessageReport) => report.id === current.id) || list[0] || null;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [status]);

  useEffect(() => {
    if (!selectedReport) {
      setConversation([]);
      return;
    }

    const loadConversation = async () => {
      setConversationLoading(true);
      try {
        const response = await api.get(`/messages/admin/reports/${selectedReport.id}/conversation`);
        setConversation(Array.isArray(response.data) ? response.data : []);
      } finally {
        setConversationLoading(false);
      }
    };

    loadConversation();
  }, [selectedReport?.id]);

  const resolveReport = async (report: MessageReport) => {
    setResolvingId(report.id);
    try {
      await api.patch(`/messages/admin/reports/${report.id}/resolve`);
      await loadReports();
    } finally {
      setResolvingId('');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Safety Moderation</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Message Reports</h1>
          <p className="mt-1 text-slate-500 dark:text-gray-400">
            Review user-reported and system-flagged conversations for off-platform deal risk.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="admin-input px-3 py-2 text-sm"
            aria-label="Filter reports by status"
          >
            <option value="OPEN">Open</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ALL">All</option>
          </select>
          <button
            type="button"
            onClick={loadReports}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-white/5"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <div className="admin-surface overflow-hidden">
          <div className="border-b border-slate-200 p-4 dark:border-gray-800">
            <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Flag size={18} className="text-primary" />
              Reports
            </h2>
          </div>
          <div className="max-h-[650px] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-sm text-slate-500">
                <Loader2 className="mr-2 inline animate-spin" size={16} />
                Loading reports...
              </div>
            ) : reports.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  title="No message reports"
                  description="Reported or flagged conversations will appear here."
                />
              </div>
            ) : (
              reports.map((report) => (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setSelectedReport(report)}
                  className={`w-full border-b border-slate-200 p-4 text-left transition dark:border-gray-800 ${
                    selectedReport?.id === report.id
                      ? 'bg-primary/10'
                      : 'hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-widest text-primary">
                      {report.source === 'SYSTEM_FLAG' ? 'System Flag' : 'User Report'}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                      report.status === 'RESOLVED'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                    {getName(report.reportedUser)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-gray-400">
                    {report.reason}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {new Date(report.createdAt).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="admin-surface min-h-[650px]">
          {selectedReport ? (
            <div className="flex h-full flex-col">
              <div className="border-b border-slate-200 p-5 dark:border-gray-800">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                      {selectedReport.source === 'SYSTEM_FLAG' ? 'Automatically flagged' : 'Reported by user'}
                    </p>
                    <h2 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                      {getName(selectedReport.reportedUser)}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                      Reporter: {getName(selectedReport.reporter)}
                    </p>
                  </div>
                  {selectedReport.status !== 'RESOLVED' ? (
                    <button
                      type="button"
                      onClick={() => resolveReport(selectedReport)}
                      disabled={resolvingId === selectedReport.id}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60"
                    >
                      {resolvingId === selectedReport.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      Mark Resolved
                    </button>
                  ) : null}
                </div>
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                  <div className="mb-2 flex items-center gap-2 font-bold">
                    <ShieldAlert size={16} />
                    Report reason
                  </div>
                  {selectedReport.reason}
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {conversationLoading ? (
                  <div className="text-sm text-slate-500">
                    <Loader2 className="mr-2 inline animate-spin" size={16} />
                    Loading conversation...
                  </div>
                ) : conversation.length === 0 ? (
                  <EmptyState
                    title="No conversation available"
                    description="The related message may have been removed."
                  />
                ) : (
                  conversation.map((message) => {
                    const isReportedUser = message.senderId === selectedReport.reportedUser?.id;
                    return (
                      <div key={message.id} className={`flex ${isReportedUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[82%] rounded-2xl p-3 text-sm ${
                          isReportedUser
                            ? 'rounded-tr-none bg-red-500/10 text-slate-900 dark:text-white'
                            : 'rounded-tl-none bg-slate-100 text-slate-900 dark:bg-white/5 dark:text-gray-200'
                        }`}>
                          <p>{message.content || `[${message.type || 'Attachment'}]`}</p>
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-50">
                            {getName(message.sender)} • {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <EmptyState
                title="Select a report"
                description="Choose a report to review the safety context."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageReports;
