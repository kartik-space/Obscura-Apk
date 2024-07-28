import { useQuery } from '@tanstack/react-query';
import { fetchDriverProfile } from '../service/driver';

export const useDriverProfile = (id: string) => {
    return useQuery({
      queryKey: ['driverProfile', id],
      queryFn: () => fetchDriverProfile(id),
      enabled: !!id // Ensure the query is only enabled when ID is available
    });
};
