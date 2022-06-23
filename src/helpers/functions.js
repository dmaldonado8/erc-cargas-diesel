export const generarNombreImagen = () => {
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var hours = new Date().getHours();
  var min = new Date().getMinutes();
  var sec = new Date().getSeconds();
  var mls = new Date().getMilliseconds();
  var random = Math.floor(Math.random() * 100);
  const name = `${year}${date}${month}${hours}${min}${sec}${mls}${random}_report`;
  return name;
};

export function calcularDuracion(horaInicio, horaFin) {
  let hin = new Date('01-01-2017' + ' ' + horaInicio);
  let hfin = new Date('01-01-2017' + ' ' + horaFin);
  var msec = hfin - hin;
  var mins = Math.round(msec / 1000 / 60);
  console.log(mins);

  return mins;
}

export const makeid = () => {
  const l = 10;
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < l; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
