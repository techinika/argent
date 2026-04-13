"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { TeamMember } from "@/types/team";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";

const roles = [
  { value: "admin", label: "Admin - Full access" },
  { value: "member", label: "Member - Can edit transactions" },
  { value: "viewer", label: "Viewer - Read only" },
];

export default function BusinessTeamPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<{
    email: string;
    role: "admin" | "member" | "viewer";
    name: string;
  }>({
    email: "",
    role: "member",
    name: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMembers = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "teamMembers"),
        where("businessId", "==", user.uid),
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        joinedAt: d.data().joinedAt?.toDate(),
        invitedAt: d.data().invitedAt?.toDate(),
      })) as TeamMember[];
      setMembers([
        {
          id: "1",
          userId: user.uid,
          businessId: user.uid,
          email: user.email,
          name: user.displayName,
          role: "owner",
          status: "active",
          photoURL: undefined,
        },
        ...data,
      ]);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, businessId: user!.uid }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send invitation");

      setSuccess("Invitation sent successfully!");
      setModalOpen(false);
      setFormData({ email: "", role: "member", name: "" });
      fetchMembers();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to send invitation",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    await deleteDoc(doc(db, "teamMembers", memberId));
    fetchMembers();
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    await updateDoc(doc(db, "teamMembers", memberId), { role: newRole });
    fetchMembers();
  };

  const activeMembers = members.filter((m) => m.status === "active");
  const pendingMembers = members.filter((m) => m.status === "pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Team Management
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Invite team members to collaborate on your business finances
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Invite Member</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          <Card title="Active Members">
            {activeMembers.length === 0 ? (
              <p className="text-zinc-500">No team members yet</p>
            ) : (
              <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {activeMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={member.photoURL}
                        name={member.name}
                        size="lg"
                      />
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">
                          {member.name}
                          {member.role === "owner" && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              Owner
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-zinc-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {member.role !== "owner" && (
                        <>
                          <Select
                            value={member.role}
                            onChange={(e) =>
                              handleUpdateRole(member.id, e.target.value)
                            }
                            options={roles}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemove(member.id)}
                            className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                            aria-label="Remove member"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {pendingMembers.length > 0 && (
            <Card title="Pending Invitations">
              <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {pendingMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {member.email}
                      </p>
                      <p className="text-sm text-zinc-500">
                        Role: {member.role}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(member.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Cancel Invitation
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Invite Team Member"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-sm">
              {success}
            </div>
          )}
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="colleague@company.com"
            required
          />
          <Input
            label="Name (Optional)"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value as "admin" | "member" | "viewer",
              })
            }
            options={roles}
          />
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={saving}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
