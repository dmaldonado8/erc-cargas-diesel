import configureStore from './redux/store';
import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-ionicons';
import AuthValidator from './screens/AuthValidator';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import SettingsScreen from './screens/SettingsScreen';
import SyncScreen from './screens/SyncScreen';
import 'react-native-gesture-handler';
import CargasScreen from './screens/CargasScreen';
import ReabastecimientoScreen from './screens/ReabastecimientoScreen';

// *Definición de stacks para hacer uso de react-native-navigator
const NoSignInStack = createStackNavigator({
  //Stack para el usuario si no está aún logueado
  LoginScreen: {
    screen: LoginScreen,
  },
});

const SettingsStack = createStackNavigator({
  SettingsScreen: {
    screen: SettingsScreen,
  },
  SyncScreen: {
    screen: SyncScreen,
  },
});

const MainStackOptions = createStackNavigator({
  MainScreen: {
    screen: MainScreen,
  },
});

const MisCargasStack = createStackNavigator({
  Cargas: {
    screen: CargasScreen,
  },
});

const ReabastecimientoStack = createStackNavigator({
  Reabastecimiento: {
    screen: ReabastecimientoScreen,
  },
});

// *Crear el navegador en la parte baja de la aplicación
const SignInStack = createBottomTabNavigator(
  {
    Abastecer: MainStackOptions,
    Reabastecer: ReabastecimientoStack,
    Listado: MisCargasStack,
    Ajustes: SettingsStack,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        // *Según el nombre de la pantalla se asigna un ícono
        if (routeName === 'Abastecer') {
          iconName = 'ios-home';
        } else if (routeName === 'Listado') {
          iconName = 'ios-list';
        } else if (routeName === 'Reabastecer') {
          iconName = 'ios-arrow-down';
        } else if (routeName === 'Ajustes') {
          iconName = 'ios-settings';
        }
        return <Icon name={iconName} size={25} color={tintColor} />;
      },
    }),
    // Preferencias de diseño de las opciones del navigator
    tabBarOptions: {
      activeTintColor: '#4286f4',
      inactiveTintColor: 'gray',
    },
  },
);

let Nav = createAppContainer(
  createSwitchNavigator(
    {
      AuthValidator: AuthValidator,
      NoSignIn: NoSignInStack,
      SignInStack: SignInStack,
    },
    {
      initialRouteName: 'AuthValidator',
    },
  ),
);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      store: configureStore(() =>
        this.setState({
          isLoading: true,
        }),
      ),
    };
  }

  render() {
    return (
      <Provider store={this.state.store.store}>
        <PersistGate loading={null} persistor={this.state.store.persistor}>
          <Nav />
        </PersistGate>
      </Provider>
    );
  }
}
