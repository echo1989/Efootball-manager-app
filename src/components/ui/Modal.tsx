interface ModalProps {
  title: string
  message: string
  confirmLabel?: string
  confirmClass?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function Modal({
  title,
  message,
  confirmLabel = 'Conferma',
  confirmClass = 'bg-red-600 hover:bg-red-500',
  onConfirm,
  onCancel,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 max-w-sm w-full">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 ${confirmClass} text-white py-2 rounded-lg font-bold transition`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-bold transition"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  )
}
