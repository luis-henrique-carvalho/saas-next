export type Patient = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  sex: "MALE" | "FEMALE";
  createdAt: string;
  updatedAt: string;
  clinicId: string;
};
