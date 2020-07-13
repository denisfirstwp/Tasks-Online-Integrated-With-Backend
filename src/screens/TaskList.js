import React, {Component} from 'react';
import {Alert, View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform} from 'react-native';




import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/pt-br' // traduz o valor das datas para o portugues
import AsyncStorage from '@react-native-community/async-storage'

import {server, showError} from '../common'
import Task from '../components/Tasks'
import AddTask from './AddTask'
import commonStyles from '../commonStyles'

import todayImage from '../../assets/imgs/today.jpg';
import tomorrowImage from '../../assets/imgs/tomorrow.jpg';
import weekImage from '../../assets/imgs/week.jpg';
import monthImage from '../../assets/imgs/month.jpg';


const initialState = {
    showDoneTasks: true,
    showAddTask:false,
    visibleTasks: [],
    tasks: []
    }

export default class TaskList extends Component {

    state = {
       ...initialState
    }

    componentDidMount = async () => {
        const  stateString = await AsyncStorage.getItem('ZICA')
        const savedState = JSON.parse(stateString) || initialState
        this.setState({
            showDoneTasks: savedState.showDoneTasks
        }, this.filterTasks)

        this.loadTasks()
    }

    loadTasks = async  () => {

        try{
            const maxDate = moment().add({ days: this.props.daysAhead}).format('YYYY-MM-DD 23:59:59') // passing the date of today, with the format that is accepted for the Postgree
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            this.setState({ tasks: res.data}, this.filterTasks) // returning the tasks for today's date
        }catch(e){
            showError(e)
        }

    }

    toggleFilter =  () => {
        this.setState({showDoneTasks: !this.state.showDoneTasks }, this.filterTasks) // EXECUTA A FUNCAO DEPOIS QUE O STATE FOR ALTERADO

       // this.filterTasks();     
    }

    filterTasks = async () => {
        let visibleTasks = null
        if(this.state.showDoneTasks){
            visibleTasks = [...this.state.tasks] // CLONANDO O ARRAY 
        }else{
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter((pending))
        }

        this.setState({visibleTasks:visibleTasks})
        //console.log(JSON.stringify(this.state))

        await AsyncStorage.setItem('ZICA', JSON.stringify({showDoneTasks: this.state.showDoneTasks}))
        
        
    }

   
    toggleTask = async taskId => {
        
        try {
            await axios.put(`${server}/tasks/${taskId}/toggle`)
            await this.loadTasks()
        } catch(error) {
            showError(error)
        }
      
    }

    addTask = async newTask => {
        
        if(!newTask.desc || !newTask.desc.trim()) { //SE A STRING FOR FALSA ENTRE          
            Alert.alert('Dados Inválidos', 'Descrição não informada !')
            return
        }

       try{
           
           await axios.post(`${server}/tasks`,  // url para cadastrar nova task no banco de dados
               {
               desc: newTask.desc,
               estimateAt: newTask.date 
           })
           
           this.setState({showAddTask: false}, this.loadTasks)
           
        } catch(error){
            showError(error)
        }
        

        
    }

    deleteTask = async taskId => {
       try{
           await axios.delete(`${server}/tasks/${taskId}`)
           this.loadTasks()
       }catch(e){
           showError(e)
       }
    }

    getImage = () =>{
        switch(this.props.daysAhead) {
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            default: return monthImage
        }
    }

    getColor = () =>{
        switch(this.props.daysAhead) {
            case 0: return commonStyles.colors.today
            case 1: return commonStyles.colors.tomorrow
            case 7: return commonStyles.colors.week
            default: return commonStyles.colors.month   
        }
    }


    // Componente baseado em classe precisa definir função render
    render(){
        const today = moment().locale('pt-br').format('ddd,D [de] MMMM')
        return(
            <View style={styles.container}>
                <AddTask 
                isVisible={this.state.showAddTask} 
                onCancel={() => this.setState({showAddTask:false})}
                onSave={this.addTask} />
                <ImageBackground style={styles.background} source={this.getImage()} >
                    <View style={styles.iconBar}> 
                    <TouchableOpacity onPress={()=> this.props.navigation.openDrawer()}>
                        <Icon name='bars'
                        size={20}
                        color={commonStyles.colors.secundary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.toggleFilter}>
                        <Icon color={commonStyles.colors.secundary} size={30} name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} />
                    </TouchableOpacity>

                    </View>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.subtitle}>{today}</Text>
                </View>
                </ImageBackground>
                <View style={styles.taskList}>
                <FlatList data={this.state.visibleTasks} // passando um array para o flatlist
                keyExtractor={(item) => `${item.id}`} // definindo a key (todo array precisa de key)
                renderItem={({item})=> <Task {...item} 
                toggleTask={this.toggleTask}
                onDelete={this.deleteTask} />} // renderizando componente array com valores do array
                />
                </View>
                <TouchableOpacity style={[
                    styles.addButton,
                    {backgroundColor: this.getColor()}]}
                 onPress={()=> this.setState({showAddTask:true})}
                 activeOpacity={0.7}>
                    <Icon name="plus" size={20} color={commonStyles.colors.secundary} />
                </TouchableOpacity>

               
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    background:{
        flex:3
    },
    taskList: {
        flex: 7 
    },
    titleBar:{
        flex:1,
        justifyContent:'flex-end'   
    },
    title:{
        fontFamily: commonStyles.fontFamily,
        fontSize: 50,
        color:commonStyles.colors.secundary,
        fontSize:50,
        marginLeft:20,
        marginBottom:20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color:commonStyles.colors.secundary,
        fontSize:20,
        marginLeft:20,
        marginBottom:30
    },
    iconBar:{
        flexDirection:'row',
        marginHorizontal:20,
        justifyContent:'space-between',
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },

    addButton:{
        position: 'absolute',
        right:30,
        bottom:30,
        width:50,
        height:50,
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center'
    }


})