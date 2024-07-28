// src/hooks/useUpdateDriverStatus.ts
import { useMutation } from '@tanstack/react-query';
import { updateDriverStatus } from '../service/driver';

interface UpdateDriverStatusResponse {
  message: string;
  driver: any;
}

// Update the driverId parameter to be string | null
const useUpdateDriverStatus = (driverId: string | null) => {
  const mutation = useMutation<UpdateDriverStatusResponse, Error, boolean>({
    mutationFn: (status: boolean) => {
      if (!driverId) {
        return Promise.reject(new Error('Driver ID is missing'));
      }
      return updateDriverStatus(driverId, status);
    },
    onError: (error) => {
      console.error('Error updating driver status:', error);
    },
    onSuccess: (data) => {
      console.log('Driver status update successful:', data);
    },
  });

  return {
    updateStatus: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
};


export default useUpdateDriverStatus;
