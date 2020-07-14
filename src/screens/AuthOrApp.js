// ESTA TELA DEFINE SE O USUARIO PRECISA IR PARA A TELA DE AUTENTIFICAÇÃO OU VAI DIRETO PARA AS TAREFAS


import React, { Component } from 'react'


import { 
    View,
    ActivityIndicator,
    StyleSheet
 } from 'react-native'

 export default class AuthOrApp extends Component {

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