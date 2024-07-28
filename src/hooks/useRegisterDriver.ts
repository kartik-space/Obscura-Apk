import { useMutation } from '@tanstack/react-query';
import { registerDriver } from '../service/driver';
import { DriverData } from '../types/driverTypes'; // Adjust import path

interface RegisterDriverResponse {
  message: string;
  driver: any;
}

const useRegisterDriver = () => {
  const mutation = useMutation<RegisterDriverResponse, Error, DriverData>({
    mutationFn: registerDriver,
    onError: (error) => {
      console.error('Error registering driver:', error);
    },
    onSuccess: (data) => {
      console.log('Driver registration successful:', data);
    },
  });

  return {
    registerDriver: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
};

export default useRegisterDriver;
