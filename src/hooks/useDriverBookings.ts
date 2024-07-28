import { useQuery } from '@tanstack/react-query';
import { fetchDriverBookings } from '../service/driver';

// Custom hook to fetch driver bookings
const useDriverBookings = (driverId: string | null) => {
  return useQuery({
    queryKey: ['driverBookings', driverId],
    queryFn: () => fetchDriverBookings(driverId!),
    enabled: !!driverId,
  });
};

export default useDriverBookings;
