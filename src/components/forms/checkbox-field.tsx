import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxFieldProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}

export function CheckboxField({ name, label, description, required = false }: CheckboxFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={form.formState.errors[name] ? 'true' : 'false'}
              aria-describedby={`${name}-error`}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
            )}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage id={`${name}-error`} />
          </div>
        </FormItem>
      )}
    />
  );
}
