import React, { Component } from 'react';
import {ImageBackground, Text, View, StyleSheet, TextInput, TouchableOpacity, Platform, Alert} from 'react-native'

import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyles'
import AuthInput from '../components/AuthInput'
import {server, showError, showSuccess} from '../common'


import axios from 'axios'

const initialState = {
        
    name:'',
        email: 'denisfirstwp@gmail.com',
        password: '123456',
        confirmPassword:'',
        stageNew: false // altera entre a tela de login e cadastro
}

export default class Auth extends Component {

    state= { 
        ...initialState 
    } 
    

    signinOrSignup = () => {
        if(this.state.stageNew) {
            this.signup()
        }else {
            this.signin()
        }
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email:this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })

            showSuccess('Usuario cadastrado com sucesso !')
            this.setState({ ...initialState })
        }catch(err) {
            showError(err)
        }
    }

    signin = async () => {
        try {
           const res =  await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password
            })

            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}` // colocando o token gravado no banco de dados dentro do Header bearer
            this.props.navigation.navigate('Home', res.data)// Indo para a pagina home depois de logar e registrar o token no Header - res.data como parametro
           
        }catch(e){
            showError(e)
        }

    }

    render(){

        const validations = []
        validations.push(/*this.state.email && */this.state.email.includes('@')) // validando campo email
        validations.push(/*this.state.password && */this.state.password.length >= 6 ) // tem que ter no minimo uma senha de 6 digitos

        if(this.state.stageNew) {
            validations.push(/*this.state.name && */this.state.name.trim().length >= 3) //só coloca o nome no vetor se o nome for maior ou igual a 3 letras
            validations.push(this.state.confirmPassword) // coloca a confirmaçao de senha no vetor
            validations.push(this.state.password === this.state.confirmPassword ) // só coloca a senha no vetor se  a senha for igual ao confirmar senha
            console.log(validations)
        }

        const validForm = validations.reduce((total, atual)=> total && atual) // so tem um formulario valido se todas as validaçoes anteriores forem verdadeiras.


        return(
            
            <ImageBackground source={backgroundImage}
            style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados' }
                    </Text>
                    {
                        this.state.stageNew && <AuthInput icon='user' placeholder='Nome' value={this.state.name}
                        style={styles.input} onChangeText={name => this.setState({ name })} />
                    }

                    <AuthInput icon='at' 
                    placeholder='E-mail' 
                    value={this.state.email}
                    style={styles.input} 
                    onChangeText={email => this.setState({ email })} />

                    <AuthInput icon='lock'
                    placeholder='Senha' 
                    value={this.state.password}
                    style={styles.input} 
                    onChangeText={password => this.setState({ password })} 
                    secureTextEntry={true} />

                    {this.state.stageNew && 
                    <AuthInput icon='asterisk' 
                    placeholder='Confirmação de senha' 
                    value={this.state.confirmPassword}
                    style={styles.input} 
                    onChangeText={confirmPassword => this.setState({ confirmPassword })} 
                    secureTextEntry={true} />}

                    <TouchableOpacity onPress={this.signinOrSignup}
                    disabled={!validForm} /*desabilita o botao se eu nao tiver um formulario valido */ > 
                        <View style={[styles.button, validForm ? {} : {backgroundColor: '#AAA'}]}>
                            <Text style={styles.buttonText}>{this.state.stageNew ? 'Registrar': 'Entrar'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{padding:10}} onPress={()=>this.setState({stageNew: !this.state.stageNew})}>
                    <Text style={{fontFamily:commonStyles.fontFamily, color:'#FFF', fontSize:18}}>
                        {this.state.stageNew ? 'Já possui conta ? ': 'Ainda não possui conta ?'}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background:{
        flex: 1,
        width: '100%',
        alignItems:'center',
        justifyContent:'center'
    },
    title: {
        
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secundary,
        fontSize: 70,
        marginBottom: 10
    },

    subtitle:{
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize:20,
        marginBottom:10,
        textAlign:'center'
    },
    formContainer: {
        backgroundColor:'rgba(0, 0, 0, 0.7)',
        padding:20,
        width:'90%',
        
    },
    input:{
        marginTop: 10,
        backgroundColor:'#FFF',
        padding: Platform.OS == 'ios' ? 15 : 10      

    },
    button:{
        backgroundColor: '#080',
        marginTop:10,
        padding:10,
        alignItems: 'center',
        borderRadius:5
    },
    buttonText:{
        fontFamily:commonStyles.fontFamily,
        color:'#FFF',
        fontSize:20

    }
})