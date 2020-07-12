import React from 'react'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createDrawerNavigator} from 'react-navigation-drawer'

import Auth from './screens/Auth'
import TaskList from './screens/TaskList'

const menuRoutes = {
    Today:{
        name: 'Today',
        screen: props =><TaskList title='Hoje' daysAhead={0} {...props} />,
        navigationOptions:{
            tilte: 'Hoje'
        }
    },
    Tomorrow:{
        name: 'Tomorrow',
        screen: props =><TaskList title='Amanhã' daysAhead={1} {...props} />,
        navigationOptions:{
            tilte: 'Amanhã'
        }
    },
    Week:{
        name: 'Week',
        screen: props =><TaskList title='Semana' daysAhead={7} {...props} />,
        navigationOptions:{
            tilte: 'Semana'
        }
    },
    Month:{
        name: 'Month',
        screen: props =><TaskList title='Mês' daysAhead={30} {...props} />,
        navigationOptions:{
            tilte: 'Mês'
        }
    },

}

const menuNavigator = createDrawerNavigator(menuRoutes)

const mainRoutes = { // Criando as rotas
    Auth: {
        name:'Auth',
        screen: Auth
    },
    Home: {
        name:'Home',
        //screen: TaskList
        screen:menuNavigator
    }
}

const mainNavigator = createSwitchNavigator(mainRoutes, {
    initialRouteName:'Auth'
})

export default createAppContainer(mainNavigator)