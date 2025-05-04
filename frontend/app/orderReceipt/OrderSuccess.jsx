import { View, Text ,Image,StyleSheet,TouchableOpacity} from 'react-native'
import React,{useState,useEffect} from 'react'
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
export default function OrderSuccess() {
    const navigation=useNavigation();
    const router=useRouter();
    useEffect(() => {
        navigation.setOptions({
          headerShown: false,
        });
      }, []);
      const searchParams = useLocalSearchParams();
      const { orderId,foodName, totalPrice, pickupTimeRange, quantity,rest_name,requestId,paymentMethod} = searchParams;

  return (
  
    <View style={styles.container}>
      <View style={styles.imgContainer}>
      <Image source={require('./../../assets/images/orderSuccess.png')} style={styles.img} />
      </View>

      <TouchableOpacity style={styles.btn} onPress={()=>router.push({
        pathname:'./OrderReceipt',
        params:{
          orderId,
          requestId,
          foodName,
          totalPrice,
          quantity,
          rest_name,
          paymentMethod,
          pickupTimeRange,
          status:'processing'
        }})}>
        <View>
            <Text style={styles.btnText}>Generate Receipt</Text>
        </View>

      </TouchableOpacity>

    </View>
    
  )
}
const styles=StyleSheet.create({
    container:{
        alignItems:'center',
        justifyContent:'center',
        flex:1,

    },
    imgContainer:{
        alignSelf:'center',
        width:'80%',
        height:'45%',
        alignItems:'center',
        justifyContent:'center'
        
    },
    // img:{
    //     width:'106%',
    //     height:'118%',
    // },
    btn:{
        margin:20,
        marginTop:70,
        width:'85%',
        height:'6.5%',
        borderRadius:20,
        backgroundColor:Colors.primary,
        justifyContent:'center',
        alignItems:'center'
    },
    btnText:{
        color:Colors.White,
        //alignSelf:'center',
        fontSize:18,
        
    },
    
}); 