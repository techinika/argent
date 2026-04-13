"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: "primary" | "danger";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmVariant = "primary",
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">{message}</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button
          variant={confirmVariant === "danger" ? "danger" : "primary"}
          onClick={onConfirm}
          loading={loading}
          className="flex-1"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
