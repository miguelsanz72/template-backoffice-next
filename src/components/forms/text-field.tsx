import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface TextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'tel' | 'url';
  required?: boolean;
}

export function TextField({ name, label = 'Texto', placeholder = 'Ingrese el texto', type = 'text', required = true }: TextFieldProps) {
  const form = useFormContext();
  const error = form.formState.errors[name];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
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
