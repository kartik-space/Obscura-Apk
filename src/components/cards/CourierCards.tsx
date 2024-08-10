import React from 'react';
import {
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

  const OrderItem = ({ from, to, date, time, phoneNo, driver, userName, status, onPressAllotDriver,  desc }: any) => (
    <View style={styles.orderItemContainer}>
      <View style={styles.orderItemLeft}>
        <DetailRow label="From" value={from} />
        <DetailRow label="To" value={to} />
        <DetailRow label="Date" value={date} />
        <DetailRow label="Time" value={time} />
        <DetailRow label="User" value={userName} />
        <DetailRow label="Mob." value={phoneNo} />
        <DetailRow label="Driver" value={driver} />
        <DetailRow label="desc." value={desc} />
      </View>
    </View>
  );

  export default OrderItem;


  const styles = StyleSheet.create({
    orderItemContainer: {
        backgroundColor: '#F5DDFB',
        height: 'auto',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        paddingHorizontal:15,
        paddingVertical:10,
      },
      orderItemLeft: {
        width: '100%',
      },
      detailRowContainer :{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        paddingVertical:4,
      },
      detailLabel:{
        fontFamily: 'Poppins-Regular',
        flexWrap:'wrap',
        width:'20%',
        color: '#000',
        fontSize: 17,
        fontWeight: '500',
      },
      detailValue:{
        fontFamily: 'Poppins-ExtraBold',
        width:'80%',
        flexWrap:'wrap',
        color: '#000',
        fontWeight:'600'
      },
      orderItemImageContainer:{
        width: '24%',
      },
      orderItemImage: {
        width: 90,
        height: 80,
      },
  })