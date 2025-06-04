import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxOption } from "@/lib/validations/checkbox-schema";

interface CheckboxGroupFieldProps {
  name: string;
  label?: string;
  description?: string;
  options: CheckboxOption[];
  required?: boolean;
  orientation?: "vertical" | "horizontal";
}

export function CheckboxGroupField({
  name,
  label,
  description,
  options,
  required = false,
  orientation = "vertical",
}: CheckboxGroupFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <div
            className={`space-y-3 ${
              orientation === "horizontal"
                ? "sm:space-y-0 sm:space-x-5 sm:flex"
                : ""
            }`}
          >
            {options.map((option) => (
              <FormItem
                key={option.value}
                className="flex flex-row items-start space-x-3 space-y-0"
              >
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      // Convertimos a array si no lo es
                      const currentValues = Array.isArray(field.value)
                        ? field.value
                        : [];

                      if (checked) {
                        // Agregamos el valor si está marcado
                        field.onChange([...currentValues, option.value]);
                      } else {
                        // Eliminamos el valor si está desmarcado
                        field.onChange(
                          currentValues.filter(
                            (value) => value !== option.value
                          )
                        );
                      }
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">{option.label}</FormLabel>
              </FormItem>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
