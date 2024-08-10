import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

const DetailRow = ({ label, value }: any) => (
  <View style={styles.detailRowContainer}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const OrderItem = ({ from, to, date, time, phoneNo, userName, type }: any) => {
  let backgroundColor;
  let imageSource;

  // Determine background color and image source based on the type
  switch (type) {
    case 'CAB':
      backgroundColor = '#bcf5f9';
      imageSource = require("../../assets/images/smallCab.png");
      break;
    case 'COURRIER':
      backgroundColor = '#FFE9EC';
      // No image for COURRIER
      break;
    case 'AMBULANCE':
      backgroundColor = '#F5DDFB';
      imageSource = require("../../assets/images/ambulance.png");
      break;
    default:
      backgroundColor = '#13beca'; // default background color
      imageSource = require("../../assets/images/smallCab.png"); // default image
  }

  return (
    <View style={[styles.orderItemContainer, { backgroundColor }]}>
      <View style={[styles.orderItemLeft, { width: type === 'COURRIER' ? '100%' : '76%' }]}>
      <DetailRow label="Type" value={type} />
        <DetailRow label="From" value={from} />
        <DetailRow label="To" value={to} />
        <DetailRow label="Date" value={date} />
        <DetailRow label="Time" value={time} />
        <DetailRow label="User" value={userName} />
        <DetailRow label="Mob." value={phoneNo} />
      </View>
      {type !== 'COURRIER' && (
        <View style={styles.orderItemImageContainer}>
          <Image
            source={imageSource}
            style={styles.orderItemImage}
            resizeMode="contain"
          />
        </View>
      )}
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
  orderType: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
  orderItemLeft: {
    width: '76%', // default width
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

export default OrderItem;
