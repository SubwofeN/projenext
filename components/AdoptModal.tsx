"use client";

import { Project } from "@/types/project";
import { X, Send, Copy, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function AdoptModal({ project, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const contactInfo = project.contact || `@${project.author_username} (İletişim belirtilmedi)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(contactInfo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-zinc-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs mb-1">
          <Send className="h-4 w-4" />
          <span>Projeyi Devral</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight">{project.title}</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Bu projeyi devam ettirmek ve geliştirmek istiyorsan, proje sahibiyle iletişime geçebilirsin.
        </p>

        <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <span className="text-xs text-zinc-500 block mb-1">Geliştirici İletişim Bilgisi</span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm font-medium text-amber-400 truncate">
              {contactInfo}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Kopyalandı" : "Kopyala"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-200"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}