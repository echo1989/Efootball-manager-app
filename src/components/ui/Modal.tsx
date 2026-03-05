interface ModalProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function Modal({ title, message, confirmLabel = 'Conferma', onConfirm, onCancel }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#141420] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="text-sm text-white/40">{message}</p>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 font-semibold text-sm transition"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold text-sm transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
