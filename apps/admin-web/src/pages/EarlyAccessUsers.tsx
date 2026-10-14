import { useEffect, useState } from "react";
import api from "../utils/api";
import { format } from "date-fns";

const EarlyAccessUsers = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [inviteMessage, setInviteMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/admin/waitlist");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((current) => ({ ...current, [id]: !current[id] }));
  };

  const sendInvitations = async () => {
    const ids = Object.entries(selected)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);

    if (ids.length === 0) return;
    if (!confirm(`Send the launch email to ${ids.length} account(s)?`)) return;

    setSending(true);
    try {
      const response = await api.post("/users/admin/waitlist/invite", {
        ids,
        message: inviteMessage,
      });
      const sentIds = response.data?.sentIds || [];
      const sentIdSet = new Set(sentIds);
      setItems((current) =>
        current.map((item) =>
          sentIdSet.has(item.id)
            ? { ...item, waitlistNotifiedAt: new Date().toISOString() }
            : item,
        ),
      );
      setSelected({});
      alert(
        `Launch emails sent: ${response.data?.sent || 0}. Failed or skipped: ${response.data?.failed || 0}.`,
      );
    } catch (err) {
      console.error(err);
      alert("Failed to send launch emails");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Early Access Users</h2>
          <p className="text-sm text-slate-500">
            Accounts waiting for the NaajihBiz launch.
          </p>
        </div>
        <button onClick={load} className="px-3 py-2 admin-button-secondary">
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left">
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  aria-label="Select accounts not yet notified"
                  checked={
                    items.filter((item) => !item.waitlistNotifiedAt).length > 0 &&
                    items
                      .filter((item) => !item.waitlistNotifiedAt)
                      .every((item) => selected[item.id])
                  }
                  onChange={(event) => {
                    const nextSelection = { ...selected };
                    items
                      .filter((item) => !item.waitlistNotifiedAt)
                      .forEach((item) => {
                        nextSelection[item.id] = event.target.checked;
                      });
                    setSelected(nextSelection);
                  }}
                />
              </th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Signed Up</th>
              <th className="px-3 py-2">Notified</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    aria-label={`Select ${item.email}`}
                    disabled={Boolean(item.waitlistNotifiedAt)}
                    checked={!!selected[item.id]}
                    onChange={() => toggleSelect(item.id)}
                  />
                </td>
                <td className="px-3 py-2">{item.email}</td>
                <td className="px-3 py-2">{item.role}</td>
                <td className="px-3 py-2">
                  {item.createdAt
                    ? format(new Date(item.createdAt), "yyyy-MM-dd")
                    : ""}
                </td>
                <td className="px-3 py-2">
                  {item.waitlistNotifiedAt ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="mt-4">Loading...</div>}
        {!loading && items.length === 0 && (
          <div className="mt-4">No early access users yet.</div>
        )}
        <div className="mt-6 border-t pt-5">
          <label htmlFor="launch-email-message" className="mb-2 block text-sm font-semibold">
            Optional message
          </label>
          <textarea
            id="launch-email-message"
            maxLength={2000}
            placeholder="Add a short note to the launch email"
            value={inviteMessage}
            onChange={(event) => setInviteMessage(event.target.value)}
            className="mb-3 w-full rounded border p-3"
            rows={3}
          />
          <button
            onClick={sendInvitations}
            disabled={sending || Object.values(selected).filter(Boolean).length === 0}
            className="px-3 py-2 admin-button disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending
              ? "Sending..."
              : `Send launch email${Object.values(selected).filter(Boolean).length === 1 ? "" : "s"} (${Object.values(selected).filter(Boolean).length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EarlyAccessUsers;