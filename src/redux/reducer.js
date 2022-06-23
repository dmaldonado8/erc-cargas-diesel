import {
  ADD_SESION_DATA,
  REMOVE_SESION_DATA,
  ADD_EQUIPO_SUMINISTRO_DATA,
  REMOVE_EQUIPO_SUMINISTRO_DATA,
  ADD_FUNDOS_DATA,
  REMOVE_FUNDOS_DATA,
  ADD_OPERADORES_DATA,
  REMOVE_OPERADORES_DATA,
  DEFINIR_EQUIPO_OPERADOR,
  RESET_EQUIPO_OPERADOR,
  DEFINIR_ESTADO_CARGA,
  SIN_CARGA,
  REMOVE_DATA_CARGAS_GENERADAS,
  ADD_DATA_CARGAS_GENERADAS,
  RESET_DATA_CARGA_DIESEL,
  ADD_DATA_INICIO_CARGA,
  ADD_DATA_TERMINO_CARGA,
  ADD_IMAGE,
  REMOVE_IMAGE,
  ACTUALIZAR_LITROS,
  RESETEAR_LITROS,
  ADD_CARGA_REABASTECIMIENTO,
  REMOVE_CARGA_REABASTECIMIENTO,
  CAMBIAR_ESTADO_JORNADA,
  ADD_EVENTO_JORNADA,
  REMOVE_EVENTO_JORNADA,
  SIN_INICIAR,
  DEFINIR_FECHA_JORNADA,
  RESET_FECHA_JORNADA,
  DEFINIR_ULTIMA_JORNADA,
  DEFINIR_VALIDACION_JORNADA,
  DEFINIR_VALIDAR_GPS,
} from './constants';
import {combineReducers} from 'redux';
import {reducer as network, offlineActionTypes} from 'react-native-offline';
import storage from 'redux-persist/lib/storage';
import {makeid} from '../helpers/functions';

function signInData(state = [], action) {
  switch (action.type) {
    case ADD_SESION_DATA:
      return action.payload;
      break;
    case REMOVE_SESION_DATA:
      return [];
      break;
    default:
      return state;
      break;
  }
}

function dataEquiposSuministro(state = [], action) {
  switch (action.type) {
    case ADD_EQUIPO_SUMINISTRO_DATA:
      return action.payload;
      break;
    case REMOVE_EQUIPO_SUMINISTRO_DATA:
      return [];
      break;
    default:
      return state;
      break;
  }
}

function dataFundos(state = [], action) {
  switch (action.type) {
    case ADD_FUNDOS_DATA:
      return action.payload;
      break;
    case REMOVE_FUNDOS_DATA:
      return [];
      break;
    default:
      return state;
      break;
  }
}

function dataOperadores(state = [], action) {
  switch (action.type) {
    case ADD_OPERADORES_DATA:
      return action.payload;
      break;
    case REMOVE_OPERADORES_DATA:
      return [];
      break;
    default:
      return state;
      break;
  }
}

function equipoOperador(state = null, action) {
  switch (action.type) {
    case DEFINIR_EQUIPO_OPERADOR:
      return action.payload;
      break;
    case RESET_EQUIPO_OPERADOR:
      return null;
      break;
    default:
      return state;
      break;
  }
}

function estadoSuministro(state = SIN_CARGA, action) {
  switch (action.type) {
    case DEFINIR_ESTADO_CARGA:
      return action.payload;
      break;
    default:
      return state;
      break;
  }
}

function dataCargasGeneradas(state = [], action) {
  switch (action.type) {
    case ADD_DATA_CARGAS_GENERADAS:
      return [...state, action.payload];
      break;
    case REMOVE_DATA_CARGAS_GENERADAS:
      let acgCopia = [...state];
      let as = acgCopia.filter(item => {
        return item.ID != action.payload.ID;
      });
      return as;
      break;
    default:
      return state;
      break;
  }
}

function dataCargaDiesel(state = {ID: null}, action) {
  switch (action.type) {
    case ADD_DATA_INICIO_CARGA:
      let actualDICD = {...state};
      actualDICD.ID = makeid();
      actualDICD.TIPO = 1;
      actualDICD.DATA_INICIO_CARGA = action.payload;
      return actualDICD;
      break;
    case ADD_DATA_TERMINO_CARGA:
      let actualDTCD = {...state};
      actualDTCD.DATA_TERMINO_CARGA = action.payload;
      return actualDTCD;
      break;
    case RESET_DATA_CARGA_DIESEL:
      return {ID: null};
      break;
    default:
      return state;
      break;
  }
}

function fotos(state = [], action) {
  switch (action.type) {
    case ADD_IMAGE:
      return [...state, action.payload];
      break;
    case REMOVE_IMAGE:
      let fotosCopia = [...state];
      let fc = fotosCopia.filter(item => {
        return item.name != action.payload.name;
      });
      return fc;
      break;
    default:
      return state;
      break;
  }
}

function litrosEstanque(state = 0, action) {
  switch (action.type) {
    case ACTUALIZAR_LITROS:
      return action.payload;
      break;
    case RESETEAR_LITROS:
      return 0;
      break;
    default:
      return state;
      break;
  }
}

function cargasReabastecimiento(state = [], action) {
  switch (action.type) {
    case ADD_CARGA_REABASTECIMIENTO:
      return [...state, action.payload];
      break;
    case REMOVE_CARGA_REABASTECIMIENTO:
      let cop = [...state];
      let rt = cop.filter(item => {
        return item.ID != action.payload.ID;
      });
      return rt;
      return;
      break;
    default:
      return state;
      break;
  }
}

function estadoJornada(state = SIN_INICIAR, action) {
  switch (action.type) {
    case CAMBIAR_ESTADO_JORNADA:
      return action.payload;
      break;
    default:
      return state;
      break;
  }
}

function eventosJornada(state = [], action) {
  switch (action.type) {
    case ADD_EVENTO_JORNADA:
      return [...state, action.payload];
      break;
    case REMOVE_EVENTO_JORNADA:
      let eJornada = [...state];
      let ej = eJornada.filter(item => {
        return item.ID != action.payload.ID;
      });
      return ej;
      break;
    default:
      return state;
      break;
  }
}

function fechaJornada(state = null, action) {
  switch (action.type) {
    case DEFINIR_FECHA_JORNADA:
      return action.payload;
      break;
    case RESET_FECHA_JORNADA:
      return null;
      break;
    default:
      return state;
      break;
  }
}

function ultimaJornada(state = null, action) {
  switch (action.type) {
    case DEFINIR_ULTIMA_JORNADA:
      return action.payload;
      break;
    default:
      return state;
      break;
  }
}

function validadorJornada(state = 1, action) {
  switch (action.type) {
    case DEFINIR_VALIDACION_JORNADA:
      return action.payload;
      break;
    default:
      return state;
      break;
  }
}

function validarGPSActivo(state = 2, action) {
  switch (action.type) {
    case DEFINIR_VALIDAR_GPS:
      return action.payload;
      break;
    default:
      return state;
      break;
  }
}

const appReducer = combineReducers({
  network: network,
  signInData: signInData,
  dataEquiposSuministro: dataEquiposSuministro,
  dataFundos: dataFundos,
  dataOperadores: dataOperadores,
  equipoOperador: equipoOperador,
  estadoSuministro: estadoSuministro,
  dataCargasGeneradas: dataCargasGeneradas,
  dataCargaDiesel: dataCargaDiesel,
  fotos: fotos,
  litrosEstanque: litrosEstanque,
  cargasReabastecimiento: cargasReabastecimiento,
  estadoJornada: estadoJornada,
  eventosJornada: eventosJornada,
  fechaJornada: fechaJornada,
  ultimaJornada: ultimaJornada,
  validadorJornada: validadorJornada,
  validarGPSActivo: validarGPSActivo,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
