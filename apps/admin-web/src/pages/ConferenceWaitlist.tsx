import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { format } from "date-fns";

const ConferenceWaitlist = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/admin/conference-waitlist");
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

  const markNotified = async (id: string) => {
    try {
      await api.patch(`/users/admin/conference-waitlist/${id}/notify`);
      setItems((s) =>
        s.map((it) =>
          it.id === id ? { ...it, conferenceNotifiedAt: new Date().toISOString() } : it,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to mark user as notified");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Conference Signups</h2>
          <p className="text-sm text-slate-500">People who signed up in conference mode.</p>
        </div>
        <button onClick={load} className="px-3 py-2 admin-button-secondary">Refresh</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left">
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Signed Up</th>
              <th className="px-3 py-2">Notified</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="px-3 py-2">{it.email}</td>
                <td className="px-3 py-2">{it.role}</td>
                <td className="px-3 py-2">{it.createdAt ? format(new Date(it.createdAt), "yyyy-MM-dd") : ""}</td>
                <td className="px-3 py-2">{it.conferenceNotifiedAt ? "Yes" : "No"}</td>
                <td className="px-3 py-2">
                  {!it.conferenceNotifiedAt && (
                    <button onClick={() => markNotified(it.id)} className="px-3 py-1 admin-button-secondary">Mark Notified</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="mt-4">Loading...</div>}
        {!loading && items.length === 0 && <div className="mt-4">No conference signups yet.</div>}
      </div>
    </div>
  );
};

export default ConferenceWaitlist;
