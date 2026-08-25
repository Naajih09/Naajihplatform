import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { format } from "date-fns";

const Waitlist = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [inviteMessage, setInviteMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/waitlist");
      setItems(res.data || res.data?.rows || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const markNotified = async (id: string) => {
    try {
      await api.patch(`/waitlist/${id}/notify`);
      setItems((s) => s.map((it) => (it.id === id ? { ...it, isNotified: true } : it)));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  const sendInvites = async () => {
    const ids = Object.entries(selected).filter(([_, v]) => v).map(([k]) => k);
    if (ids.length === 0) return alert('Select at least one user to invite');
    if (!confirm(`Send invitations to ${ids.length} user(s)?`)) return;
    try {
      const res = await api.post('/waitlist/invite', { ids, message: inviteMessage });
      // update items
      const updatedIds = (res.data.results || []).map((r: any) => r.id);
      setItems((s) => s.map((it) => (updatedIds.includes(it.id) ? { ...it, isNotified: true } : it)));
      setSelected({});
      setInviteMessage('');
      alert(`Invitations sent to ${res.data.processed || 0} users.`);
    } catch (err) {
      console.error(err);
      alert('Failed to send invitations');
    }
  };

  const exportCsv = () => {
    const header = ["email", "role", "firstName", "lastName", "location", "isNotified", "createdAt"];
    const rows = items.map((it) => [
      it.email,
      it.role,
      it.firstName || "",
      it.lastName || "",
      it.location || "",
      it.isNotified ? "true" : "false",
      it.createdAt ? format(new Date(it.createdAt), "yyyy-MM-dd HH:mm:ss") : "",
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Waitlist</h2>
        <div className="flex items-center gap-2">
          <button onClick={load} className="px-3 py-2 admin-button-secondary">Refresh</button>
          <button onClick={exportCsv} className="px-3 py-2 admin-button">Export CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left">
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const map: Record<string, boolean> = {};
                    items.forEach((it) => (map[it.id] = checked));
                    setSelected(map);
                  }}
                />
              </th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Notified</th>
              <th className="px-3 py-2">Joined</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="px-3 py-2">
                  <input type="checkbox" checked={!!selected[it.id]} onChange={() => toggleSelect(it.id)} />
                </td>
                <td className="px-3 py-2">{it.email}</td>
                <td className="px-3 py-2">{it.role}</td>
                <td className="px-3 py-2">{(it.firstName || "") + (it.lastName ? ` ${it.lastName}` : "")}</td>
                <td className="px-3 py-2">{it.location}</td>
                <td className="px-3 py-2">{it.isNotified ? "Yes" : "No"}</td>
                <td className="px-3 py-2">{it.createdAt ? format(new Date(it.createdAt), "yyyy-MM-dd") : ""}</td>
                <td className="px-3 py-2">
                  {!it.isNotified && (
                    <button onClick={() => markNotified(it.id)} className="px-3 py-1 admin-button-secondary">Mark Notified</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <textarea placeholder="Optional invite message" value={inviteMessage} onChange={(e) => setInviteMessage(e.target.value)} className="w-full p-2 border rounded mb-2" />
          <div className="flex gap-2">
            <button onClick={sendInvites} className="px-3 py-2 admin-button">Send Invitations</button>
            <button onClick={() => { setSelected({}); setInviteMessage(''); }} className="px-3 py-2 admin-button-secondary">Clear Selection</button>
          </div>
        </div>
        {loading && <div className="mt-4">Loading...</div>}
        {!loading && items.length === 0 && <div className="mt-4">No entries yet.</div>}
      </div>
    </div>
  );
};

export default Waitlist;
