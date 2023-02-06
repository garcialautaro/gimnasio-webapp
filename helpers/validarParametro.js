//validadores
const idIsNaN = async (listaId) => {
    let msj = undefined;
    listaId.forEach(id => {
        if(!id.valor) {
            msj = `El parámetro '${id.nombre}' es un campo requerido`;
        } else if(isNaN(id.valor)) {
            msj = `El parámetro ${id.nombre} = '${id.valor}' no es un número`;
        }
    });
    return msj;
}

const parameterIsNotNull = async (listaId) => {
    let msj = undefined;
    listaId.forEach(param => {
        console.log(param.valor.length);
        if(!param.valor) {
            msj = `El parámetro '${param.nombre}' es un campo requerido`;
        } else if(param.valor.length > param.length) {
            msj = `El parámetro ${param.nombre} = '${param.valor}' no puede contener mas de ${param.length} caracteres`;
        }
    });
    return msj;
}

const parameterIsValidGenre = async (listaId) => {
    const validGenres = ['N','M','F'];
    let msj = undefined;
    listaId.forEach(id => {
        if(!id.valor) {
            msj = `El parámetro '${id.nombre}' es un campo requerido`;
        } else if(!validGenres.includes(id.valor)) {
            msj = `El parámetro ${id.nombre} = '${id.valor}' no es un género valido. Utilice N para No binario, F para Femenino y M para Masculino`;
        }
    });
    return msj;
}

const parameterIsDate = async (listaPar) => {
    let msj = undefined;
    listaPar.forEach(par => {
        const parValor = Date.parse( par.valor );
        if(!par.valor) {
            msj = `El parámetro '${par.nombre}' es un campo requerido`;
        } else if(isNaN(parValor)) {
            msj = `El parámetro '${par.nombre}' no es una fecha válida`;
        }
    });
    return msj;
}

module.exports = {
    parameterIsDate,
    idIsNaN,
    parameterIsNotNull,
    parameterIsValidGenre,
}