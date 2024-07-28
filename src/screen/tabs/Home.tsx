import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import OrderCard from '../../components/cards/OrderCard';
import FilterTabs from '../../components/filterTabs/FilterTabs';
import useDriverBookings from '../../hooks/useDriverBookings';
import { useDriverProfile } from '../../hooks/useDriverProfile'; // Import your custom hook
import useUpdateDriverStatus from '../../hooks/useUpdateDriverStatus';
import { getAddressFromCoordinates } from '../../utils/geocoding'; // Import your geocoding utility

interface Order {
  _id: string;
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
  startAddress: string;
  endAddress: string;
  date: string;
  time: string;
  driver: {
    name: string;
  } | null;
  status: string;
  user: {
    name: string;
    phoneNo: string;
  };
}

const Home: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [originalOrders, setOriginalOrders] = useState<Order[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { updateStatus, isLoading: isStatusUpdating, error: statusError } = useUpdateDriverStatus(driverId);
  const { data: orders, isLoading: isOrdersLoading, error: ordersError, refetch } = useDriverBookings(driverId);
  const { data: driverProfile, isLoading: isProfileLoading, error: profileError } = useDriverProfile(driverId || '');

  useEffect(() => {
    const fetchDriverId = async () => {
      const storedDriverId = await AsyncStorage.getItem('driverId');
      if (storedDriverId) {
        setDriverId(storedDriverId);
      }
    };
    fetchDriverId();
  }, []);

  useEffect(() => {
    if (orders) {
      fetchAddresses();
    }
  }, [orders]);

  useEffect(() => {
    if (driverProfile) {
      setIsActive(driverProfile.status); // Update the toggle switch based on the profile status
    }
  }, [driverProfile]);

  useEffect(() => {
    filterOrders(selectedFilter);
  }, [orders, selectedFilter]);

  const fetchAddresses = async () => {
    try {
      const updatedOrders = await Promise.all(
        orders.map(async order => {
          const startAddress = await getAddressFromCoordinates(order.start.latitude, order.start.longitude);
          const endAddress = await getAddressFromCoordinates(order.end.latitude, order.end.longitude);
          return { ...order, startAddress, endAddress };
        })
      );
      setOriginalOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filterOrders = (filter: string) => {
    let filtered: Order[];
    const today = new Date();
    switch (filter) {
      case 'Today':
        filtered = originalOrders.filter(order => {
          const orderDate = new Date(order.date);
          return orderDate.toDateString() === today.toDateString();
        });
        break;
      case 'Requested':
        filtered = originalOrders.filter(order => order.status === 'REQUESTED');
        break;
      case 'Upcoming':
        filtered = originalOrders.filter(order => {
          const orderDate = new Date(order.date);
          return orderDate > today;
        });
        break;
      case 'Previous':
        filtered = originalOrders.filter(order => {
          const orderDate = new Date(order.date);
          return orderDate < today;
        });
        break;
      default:
        filtered = originalOrders;
        break;
    }
    setFilteredOrders(filtered);
  };

  const toggleSwitch = async () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    if (driverId) {
      try {
        await updateStatus(newStatus);
      } catch (err) {
        console.error('Error updating status:', err);
      }
    } else {
      console.error('Driver ID is not available');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isOrdersLoading || isProfileLoading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#0000ff']}
          tintColor="#0000ff"
        />
      }
    >
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome {driverProfile?.name || 'Driver'}</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Set Status</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.statusText}>
              {isActive ? 'Active' : 'Inactive'}
            </Text>
            <Switch
              trackColor={{ false: '#FF6347', true: '#32CD32' }}
              thumbColor='#FFFFFF'
              ios_backgroundColor="#E0E0E0"
              onValueChange={toggleSwitch}
              value={isActive}
              disabled={isStatusUpdating}
            />
          </View>
        </View>
        <FilterTabs
          filters={[
            { label: 'All' },
            { label: 'Today' },
            { label: 'Requested' },
            { label: 'Upcoming' },
            { label: 'Previous' },
          ]}
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />
        <View style={styles.ordersContainer}>
          {ordersError ? (
            <Text>Error: {ordersError.message}</Text>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order: Order) => (
              <View key={order._id}>
                <OrderCard
                  from={order.startAddress}
                  to={order.endAddress}
                  date={order.date}
                  time={order.time}
                  userName={order.user.name}
                  phoneNo={order.user.phoneNo}
                />
              </View>
            ))
          ) : (
            <Text style={styles.noOrdersText}>No orders found.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {

    height: 100,
    backgroundColor: '#000',
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  welcomeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Poppins-ExtraBold',
    color: '#212121',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    color: '#212121',
    marginRight: 12,
  },
  ordersContainer: {
    flex: 1,
  },
  noOrdersText: {
    textAlign: 'center',
    marginTop: 20,
  },
  allotDriverButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  allotDriverButtonText: {
    color: '#fff',
  },
});

export default Home;
