import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from '@radix-ui/react-icons';
import { DateValidationOptions } from '@/lib/validations/date-schema';

interface DateFieldProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  validationOptions?: DateValidationOptions;
  required?: boolean;
}

export function DateField({
  name,
  label = 'Fecha',
  description,
  placeholder = 'Seleccionar fecha',
  validationOptions = {},
  required = true,
}: DateFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                  aria-invalid={form.formState.errors[name] ? 'true' : 'false'}
                  aria-describedby={`${name}-error`}
                >
                  {field.value ? format(field.value, 'PPP') : <span>{placeholder}</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  (validationOptions.minDate ? date < validationOptions.minDate : false) ||
                  (validationOptions.maxDate ? date > validationOptions.maxDate : false)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage id={`${name}-error`} />
        </FormItem>
      )}
    />
  );
}
