// ESTA TELA DEFINE SE O USUARIO PRECISA IR PARA A TELA DE AUTENTIFICAÇÃO OU VAI DIRETO PARA AS TAREFAS


import React, { Component } from 'react'


import { 
    View,
    ActivityIndicator,
    StyleSheet,
    Alert
 } from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

 export default class AuthOrApp extends Component {

    componentDidMount = async () => {
        const userDataJson = await AsyncStorage.getItem('userData')
        let userData = null // passando um valor inicial antes para ter certeza que o userDataJson vai ser recebido com sucesso na variavel 
        
        try{
            //console.log('passo aqui')
            userData = JSON.parse(userDataJson)
            
        }catch(error){
            
            Alert.alert(error)
            // userData está inválido
        }
        if(userData && userData.token){ 
            
            axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}` // colocando o token no header da requisição
            this.props.navigation.navigate('Home', userData)
            
        }else{
           
            this.props.navigation.navigate('Auth')
            
        }
    }

    render(){
        return(
            <View style={styles.container}>
               <ActivityIndicator size='large' />
            </View>
        )
    }
 }

 const styles = StyleSheet.create({

    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#000',

    }

 })