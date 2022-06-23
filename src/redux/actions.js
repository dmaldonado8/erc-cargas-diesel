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
  REMOVE_DATA_CARGAS_GENERADAS,
  ADD_DATA_CARGAS_GENERADAS,
  RESET_DATA_CARGA_DIESEL,
  ADD_DATA_INICIO_CARGA,
  ADD_DATA_TERMINO_CARGA,
  DEFINIR_ESTADO_CARGA,
  ADD_IMAGE,
  REMOVE_IMAGE,
  ACTUALIZAR_LITROS,
  RESETEAR_LITROS,
  ADD_CARGA_REABASTECIMIENTO,
  REMOVE_CARGA_REABASTECIMIENTO,
  CAMBIAR_ESTADO_JORNADA,
  ADD_EVENTO_JORNADA,
  REMOVE_EVENTO_JORNADA,
  DEFINIR_FECHA_JORNADA,
  RESET_FECHA_JORNADA,
  DEFINIR_ULTIMA_JORNADA,
  DEFINIR_VALIDACION_JORNADA,
  DEFINIR_VALIDAR_GPS,
} from './constants';

export const definirValidarGPS = payload => ({
  type: DEFINIR_VALIDAR_GPS,
  payload,
});

export const definirValidacionJornada = payload => ({
  type: DEFINIR_VALIDACION_JORNADA,
  payload,
});

export const definirUltimaJornada = payload => ({
  type: DEFINIR_ULTIMA_JORNADA,
  payload,
});

export const definirFechaJornada = payload => ({
  type: DEFINIR_FECHA_JORNADA,
  payload,
});

export const resetFechaJornada = () => ({
  type: RESET_FECHA_JORNADA,
});

//* Eventos Jornada

export const addEventoJornada = payload => ({
  type: ADD_EVENTO_JORNADA,
  payload,
});

export const removeEventoJornada = payload => ({
  type: REMOVE_EVENTO_JORNADA,
  payload,
});

//* Acciones jornada

export const cambiarEstadoJornada = payload => ({
  type: CAMBIAR_ESTADO_JORNADA,
  payload,
});

export const actualizarLitros = payload => ({
  type: ACTUALIZAR_LITROS,
  payload,
});

export const resetearLitros = () => ({
  type: RESETEAR_LITROS,
});

export const addDataCargasReabastecimiento = payload => ({
  type: ADD_CARGA_REABASTECIMIENTO,
  payload,
});

export const removeCargaReabastecimiento = payload => ({
  type: REMOVE_CARGA_REABASTECIMIENTO,
  payload,
});

//* Acciones fotos

export const addImage = payload => ({
  type: ADD_IMAGE,
  payload,
});

export const removeImage = payload => ({
  type: REMOVE_IMAGE,
  payload,
});

//* Acciones sesión

export const addSesionData = payload => ({
  type: ADD_SESION_DATA,
  payload,
});

export const removeSesionData = () => ({
  type: REMOVE_SESION_DATA,
});

//* ------------------------------------

export const addEquipoSuministroData = payload => ({
  type: ADD_EQUIPO_SUMINISTRO_DATA,
  payload,
});

export const removeEquipoSuministroData = () => ({
  type: REMOVE_EQUIPO_SUMINISTRO_DATA,
});

//* ------------------------------------

export const addFundosData = payload => ({
  type: ADD_FUNDOS_DATA,
  payload,
});

export const removeFundosData = () => ({
  type: REMOVE_FUNDOS_DATA,
});

//* ------------------------------------

export const addOperadoresData = payload => ({
  type: ADD_OPERADORES_DATA,
  payload,
});

export const removeOperadoresData = () => ({
  type: REMOVE_OPERADORES_DATA,
});

//* -----------------------------------

export const definirEquipoOperador = payload => ({
  type: DEFINIR_EQUIPO_OPERADOR,
  payload,
});

export const resetEquipoOperador = () => ({
  type: RESET_EQUIPO_OPERADOR,
});

export const removeDataCargasGeneradas = payload => ({
  type: REMOVE_DATA_CARGAS_GENERADAS,
  payload,
});

export const addDataCargasGeneradas = payload => ({
  type: ADD_DATA_CARGAS_GENERADAS,
  payload,
});

export const resetCargaDiesel = () => ({
  type: RESET_DATA_CARGA_DIESEL,
});

export const addDataInicioCarga = payload => ({
  type: ADD_DATA_INICIO_CARGA,
  payload,
});

export const addDataTerminoCarga = payload => ({
  type: ADD_DATA_TERMINO_CARGA,
  payload,
});

export const definirEstadoCarga = payload => ({
  type: DEFINIR_ESTADO_CARGA,
  payload,
});
