// hooks/useLoginDriver.ts
import { useMutation } from '@tanstack/react-query';
import { loginDriver } from '../service/driver';


interface LoginData {
  phone: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  driver: {
    id: string;
    name: string;
    phone: string;
    carNumber: string;
    carModel: string;
    carYear: number;
    carType: string;
    status: boolean;
    driverType: string;
  };
}

const useLoginDriver = () => {
  const mutation = useMutation<LoginResponse, Error, LoginData>({
    mutationFn: loginDriver,
    onError: (error) => {
      console.error('Error logging in driver:', error);
    },
    onSuccess: (data) => {
      console.log('Login successful:', data);
      // Save token and driver details to context or local storage
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
};

export default useLoginDriver;
