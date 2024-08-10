import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <View style={styles.detailRowContainer}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

interface OrderItemProps {
  from: string;
  to: string;
  date: string;
  time: string;
  phoneNo: string;
  driver: string;
  userName: string;
  status: string;
  onPressAllotDriver: () => void; // Define this if you use it
}

const OrderItem: React.FC<OrderItemProps> = ({
  from,
  to,
  date,
  time,
  phoneNo,
  driver,
  userName,
  status,
  onPressAllotDriver
}) => (
  <View style={styles.orderItemContainer}>
    <View style={styles.orderItemLeft}>
      <DetailRow label="From" value={from} />
      <DetailRow label="To" value={to} />
      <DetailRow label="Date" value={date} />
      <DetailRow label="Time" value={time} />
      <DetailRow label="User" value={userName} />
      <DetailRow label="Mob." value={phoneNo} />
      <DetailRow label="Driver" value={driver} />
    </View>
    <View style={styles.orderItemImageContainer}>
      <Image
        source={require("../../assets/images/ambulance.png")}
        style={styles.orderItemImage}
        resizeMode="contain"
      />
    </View>
  </View>
);

export default OrderItem;

const styles = StyleSheet.create({
  orderItemContainer: {
    backgroundColor: '#FFE9EC',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  orderItemLeft: {
    width: '76%',
  },
  detailRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 4,
  },
  detailLabel: {
    fontFamily: 'Poppins-Regular',
    flexWrap: 'wrap',
    width: '20%',
    color: '#000',
    fontSize: 17,
    fontWeight: '500',
  },
  detailValue: {
    fontFamily: 'Poppins-ExtraBold',
    width: '80%',
    flexWrap: 'wrap',
    color: '#000',
    fontWeight: '600',
  },
  orderItemImageContainer: {
    width: '24%',
  },
  orderItemImage: {
    width: 90,
    height: 80,
  },
});
