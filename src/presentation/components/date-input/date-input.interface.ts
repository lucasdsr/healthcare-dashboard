export interface DateInputProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  clearable?: boolean;
  helpText?: string;
  format?: 'date' | 'datetime-local';
  timezone?: string;
}
