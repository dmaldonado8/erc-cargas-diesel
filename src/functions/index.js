import {url} from '../constants';
import {addSesionData, removeEventoJornada} from '../redux/actions';
import thunk from 'redux-thunk';

/**
 * @param rut rut del usuario, se obtiene el parámetro desde la vista -> LoginScreen
 * @param pass Contraseña del usuario para acceder al sistema, se obtiene el parámetro desde la vista
 * @returns Mensaje de validación de acceso
 */
export const iniciarSesion = (rut, pass) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      console.log(
        JSON.stringify({
          name: 'loginOperadorDieselMobile',
          param: {
            rut: rut,
            pass: pass,
          },
        }),
      );
      // *Variable con los datos que serán enviados en la solicitud a la api
      const myInit = {
        method: 'POST',
        body: JSON.stringify({
          name: 'loginOperadorDieselMobile',
          param: {
            rut: rut,
            pass: pass,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      fetch(url, myInit)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // ?Validación de la respuesta del servidor
          if (data.response.status == 200) {
            const dataLogin = data.response.result;
            //*Respuesta exitosa
            if (dataLogin.hasOwnProperty('ID')) {
              // *Se setean el estado de sesion
              dispatch(
                addSesionData([
                  {
                    rut: dataLogin.RUT,
                    userId: dataLogin.ID,
                    nombre: dataLogin.NOMBRE,
                  },
                ]),
              );
              //* Los datos son válidos la promesa devuelve 200 indicador de lo anterior
              return resolve(200);
            } else {
              //* Los datos ingresados no corresponden a un usuario del sistema
              return reject('Credenciales no válidas');
            }
          } else {
            // *El nivel del usuario que intenta ingresar no es 'despachador'
            return reject('Credenciales no válidas');
          }
        })
        .catch(error => {
          console.log(error);
          // Error de conexión con la api
          reject('Error al conectar con el servidor' + error);
        });
    });
  };
};

export const subirDataAsync = () =>
  makeOfflineInterceptable((dispatch, getState) => {
    const eventosJornada = [...getState().eventosJornada];
    console.log(eventosJornada);
    if (eventosJornada.length > 0) {
      eventosJornada.forEach((item, idx) => {
        const rut = item.RUT;
        const usuarioId = item.USUARIOID;
        subirEventoJornada(item, rut, usuarioId)
          .then(() => {
            dispatch(removeEventoJornada(item));
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  }, 'subirDataAsync');

const subirEventoJornada = (item, rut, usuarioId) => {
  return new Promise((resolve, reject) => {
    const myInit = {
      name: 'ingresarMovimientoJornadaAbastecimiento',
      param: {
        tipoEventoJornadaId: item.EVENTO_JORNADA,
        fecha: item.FECHA,
        hora: item.HORA,
        lat: item.LAT,
        lng: item.LNG,
        estadoSistemaElectrico: item.ESTADO_SISTEMA_ELECTRICO,
        estadoSistemaFrenos: item.ESTADO_SISTEMA_FRENOS,
        estadoNeumaticos: item.ESTADO_NEUMATICOS,
        nivelAceite: item.ESTADO_NIVEL_ACEITE,
        nivelAgua: item.NIVEL_DE_AGUA,
        observacion: item.OBSERVACION,
        usuarioId: usuarioId,
        kilometraje: item.KILOMETRAJE,
        fechaJornada: item.FECHA_JORNADA,
        litros: item.LITROS,
        rut: rut,
      },
    };
    console.log(myInit);

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(myInit),
      headers: {
        'Content-Type': 'application/json',
        Authorization: rut,
      },
    })
      .then(response => response.json())
      .then(json => {
        if (json.response.result.status == 'success') {
          resolve();
        } else {
          reject(json);
        }
      })
      .catch(error => {
        console.log('Ha ocurrido un error ', error);
        reject(error);
      });
  });
};

const makeOfflineInterceptable = (thunk, name) => {
  thunk.interceptInOffline = true;
  thunk.meta = {
    retry: true, //*Define si la función se ejecutará al encontrar conexión
    name: name, //*Nombre de la función, !Necesaria para hacer que la función en cola quede almacenada en memoria
    args: [url],
  };
  return thunk;
};
