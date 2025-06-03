import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DoctorFormData } from "../schemas";

type DoctorFormFieldNames = keyof DoctorFormData;

const TimeSelectField = ({
  label,
  name,
  control,
}: {
  label: string;
  name: DoctorFormFieldNames;
  control: Control<DoctorFormData>;
}) => {
  const timeOptions = [
    {
      label: "Manhã",
      values: [
        "05:00:00",
        "05:30:00",
        "06:00:00",
        "06:30:00",
        "07:00:00",
        "07:30:00",
        "08:00:00",
        "08:30:00",
        "09:00:00",
        "09:30:00",
        "10:00:00",
        "10:30:00",
        "11:00:00",
        "11:30:00",
        "12:00:00",
        "12:30:00",
      ],
    },
    {
      label: "Tarde",
      values: [
        "13:00:00",
        "13:30:00",
        "14:00:00",
        "14:30:00",
        "15:00:00",
        "15:30:00",
        "16:00:00",
        "16:30:00",
        "17:00:00",
        "17:30:00",
        "18:00:00",
        "18:30:00",
      ],
    },
    {
      label: "Noite",
      values: [
        "19:00:00",
        "19:30:00",
        "20:00:00",
        "20:30:00",
        "21:00:00",
        "21:30:00",
        "22:00:00",
        "22:30:00",
        "23:00:00",
        "23:30:00",
      ],
    },
  ];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={
              field.value !== undefined ? String(field.value) : undefined
            }
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {timeOptions.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.values.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value.slice(0, 5)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TimeSelectField;
