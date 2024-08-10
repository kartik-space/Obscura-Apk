import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

const DetailRow = ({ label, value }: { label?: string; value?: string }) => (
  <View style={styles.detailRowContainer}>
    <Text style={styles.detailLabel}>{label || 'Unknown Label'}</Text>
    <Text style={styles.detailValue}>{value || 'Unknown Value'}</Text>
  </View>
);

const OrderCard = ({
  from = 'Unknown From',
  to = 'Unknown To',
  date = 'Unknown Date',
  time = 'Unknown Time',
  phoneNo = 'Unknown Phone',
  driver = 'No Driver',
  userName = 'Unknown User',
  status,
  backgroundColor = '#fff', // Default background color
  type, // Add the type prop
  onPressAllotDriver
}: any) => {


  // Determine the image source based on order type
  let imageSource;
  switch (type) {
    case 'CAB':
      imageSource = require('../../assets/images/smallCab.png');
      break;
    case 'AMBULANCE':
      imageSource = require('../../assets/images/ambulance.png');
      break;
    case 'COURRIER':
      imageSource = require('../../assets/images/courier.png');
      break;
    default:
      imageSource = require('../../assets/images/courier.png'); 
  }

  return (
    <View style={[styles.orderItemContainer, { backgroundColor }]}>
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
          source={imageSource}
          style={styles.orderItemImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderItemContainer: {
    height: 'auto',
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
    fontWeight: '600'
  },
  orderItemImageContainer: {
    width: '24%',
  },
  orderItemImage: {
    width: 90,
    height: 80,
  },
});

export default OrderCard;
