import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface EmailFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  showLabel?: boolean;
}

export function EmailField({
  name,
  label = 'Email',
  placeholder = 'email@example.com',
  required = true,
  showLabel = true,
}: EmailFieldProps) {
  const form = useFormContext();
  const error = form.formState.errors[name];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {showLabel && (
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
              type="email"
              placeholder={placeholder}
              {...field}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={`${name}-error`}
              className={`mt-1 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
          </FormControl>
          <FormMessage id={`${name}-error`} className="text-red-500 text-sm mt-1" />
        </FormItem>
      )}
    />
  );
}
