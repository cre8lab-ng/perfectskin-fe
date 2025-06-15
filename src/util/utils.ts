import { toast } from "sonner";

export const notifySuccess = (successMessage: string) => {
    return toast.success(successMessage);
  };
  