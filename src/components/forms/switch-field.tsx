import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface SwitchFieldProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  labelClassName?: string;
}

export function SwitchField({
  name,
  label,
  description,
  required = false,
  labelClassName = "text-base",
}: SwitchFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            {label && (
              <FormLabel className={labelClassName}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
            )}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={form.formState.errors[name] ? "true" : "false"}
              aria-describedby={`${name}-error`}
            />
          </FormControl>
          <FormMessage id={`${name}-error`} className="mt-2 w-full" />
        </FormItem>
      )}
    />
  );
}
