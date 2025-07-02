import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Doctor, Patient } from "@/generated/prisma";

import { getAvailableTimes } from "../../doctors/actions/get-available-times";
import { createAppointment } from "../actions";
import { AppointmentFormData, appointmentSchema } from "../schemas";

interface UseAddAppointmentFormProps {
  patients: Patient[];
  doctors: Doctor[];
  onSuccess?: () => void;
}

export function useAddAppointmentForm({
  patients,
  doctors,
  onSuccess,
}: UseAddAppointmentFormProps) {
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    shouldUnregister: true,
    defaultValues: {
      patientId: "",
      doctorId: "",
      priceInCents: 0,
      date: undefined,
      time: "",
    },
  });

  const selectedDoctorId = form.watch("doctorId");
  const selectedPatientId = form.watch("patientId");
  const selectedDate = form.watch("date");

  useEffect(() => {
    if (selectedDoctorId) {
      const selectedDoctor = doctors.find(
        (doctor) => doctor.id === selectedDoctorId,
      );

      if (selectedDoctor) {
        form.setValue("priceInCents", selectedDoctor.appointPriceInCents / 100);
      }
    }
  }, [selectedDoctorId, doctors, form]);

  const { data: availableTimes } = useQuery({
    queryKey: ["available-times", selectedDoctorId, selectedDate],
    queryFn: () =>
      getAvailableTimes({
        id: selectedDoctorId,
        data: dayjs(selectedDate).format("YYYY-MM-DD"),
      }),
    enabled: !!selectedDate && !!selectedDoctorId,
  });

  const createAppointmentAction = useAction(createAppointment, {
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso!");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toast.error(
        typeof error === "string"
          ? error
          : error instanceof Error && error.message
            ? error.message
            : "Erro ao criar agendamento.",
      );
      console.error(error);
    },
  });

  const onSubmit = async (values: AppointmentFormData) => {
    await createAppointmentAction.execute({
      ...values,
      priceInCents: values.priceInCents * 100,
    });
  };

  const isDateAvailable = (date: Date) => {
    if (!selectedDoctorId) return false;

    const selectedDoctor = doctors.find(
      (doctor) => doctor.id === selectedDoctorId,
    );

    if (!selectedDoctor) return false;

    const dayOfWeek = date.getDay();

    return (
      dayOfWeek >= selectedDoctor?.availableFromWeekday &&
      dayOfWeek <= selectedDoctor?.availableToWeekday
    );
  };

  const isDateTimeEnabled = selectedPatientId && selectedDoctorId;

  return {
    form,
    availableTimes,
    createAppointmentAction,
    onSubmit,
    isDateAvailable,
    isDateTimeEnabled,
    selectedDate,
    selectedDoctorId,
    selectedPatientId,
    patients,
    doctors,
  };
}
