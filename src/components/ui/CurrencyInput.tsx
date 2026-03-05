import { forwardRef } from 'react'
import { formatNumber, parseCurrency } from '../../utils/format'

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number
  onChange?: (value: number) => void
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '')
      e.target.value = raw ? formatNumber(raw) : ''
      onChange?.(parseCurrency(raw))
    }

    return (
      <input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        defaultValue={value !== undefined ? formatNumber(value) : undefined}
        onChange={handleChange}
        className={
          className ??
          'w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none'
        }
      />
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'
export default CurrencyInput
