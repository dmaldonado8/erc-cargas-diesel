import {createStore, compose, applyMiddleware} from 'redux';
import {persistStore, persistReducer, createTransform} from 'redux-persist';
import rootReducer from './reducer';
import {
  createNetworkMiddleware,
  checkInternetConnection,
  offlineActionTypes,
} from 'react-native-offline';
import thunk from 'redux-thunk';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './saga';
import {subirDataAsync} from '../functions/';

const actions = {subirDataAsync};

// Transformar a como el persistor lee el store
// Necesario para almacenar queues de acciones con redux thunk
const networkTransform = createTransform(
  (inboundState, key) => {
    const actionQueue = [];
    inboundState.actionQueue.forEach(action => {
      if (typeof action === 'function') {
        actionQueue.push({
          function: action.meta.name,
          args: action.meta.args,
        });
      } else if (typeof action === 'object') {
        actionQueue.push(action);
      }
    });

    return {
      ...inboundState,
      actionQueue,
    };
  },
  (outboundState, key) => {
    const actionQueue = [];

    outboundState.actionQueue.forEach(action => {
      if (action.function) {
        const actionFunction = actions[action.function];
        actionQueue.push(actionFunction(...action.args));
      } else {
        actionQueue.push(action);
      }
    });

    return {
      ...outboundState,
      actionQueue,
    };
  },
  {
    whitelist: ['network'],
  },
);

const sensitiveStorage = createSensitiveStorage({
  keychainService: 'myKeychain',
  sharedPreferencesName: 'mySharedPrefs',
});

// Creación de middlewares para el store redux
const networkMiddleware = createNetworkMiddleware();
const sagaMiddlware = createSagaMiddleware();

// Configuración del stores redux
const config = {
  key: 'root',
  storage: sensitiveStorage,
  transforms: [networkTransform],
};

export default function configureStore(callback) {
  var persistedReducer = persistReducer(config, rootReducer);
  const store = createStore(
    persistedReducer,
    undefined,
    compose(applyMiddleware(networkMiddleware, sagaMiddlware, thunk)),
  );
  sagaMiddlware.run(rootSaga);
  const persistor = persistStore(store, null, () => {
    // Detectar conexió al iniciar la app
    checkInternetConnection().then(isConnected => {
      store.dispatch({
        type: offlineActionTypes.CONNECTION_CHANGE,
        payload: isConnected,
      });
      // Notifica al root component que si se puede actuar
      callback();
    });
  });

  return {
    store,
    persistor,
  };
}
