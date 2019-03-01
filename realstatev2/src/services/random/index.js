const S = require('string');

const str_nombres = "Juan Manuel,Santiago,Eduardo,Víctor,Mario,Roberto,Jaime,Francisco José,Ignacio,Marcos,Alfonso,Jorge,Salvador,Ricardo,Emilio,Hugo,Guillermo,Gabriel,Julián,Julio,Marco Antonio,Tomas,José Miguel,Gonzalo,Agustín,Simón,José Ramón,Félix,Nicolás,Juan,Martín,Ismael,Cristian,Samuel,Aitor,Juan Francisco,José,Héctor,Mariano,Domingo,José Carlos,Alfredo,Sebastián,Iker,Cesar,Felipe,Alex,Lucas,José Ángel,José Ignacio,Víctor Manuel,Luis Miguel,Rodrigo,Gregorio,José Francisco,Juan Luis,Javier,Alberto,Mario,Antonio,María Carmen,María,Carmen,Josefa,Ana María,Isabel,María Pilar,María Dolores,Laura,María Teresa,Ana,Cristina,María Ángeles,Marta,Francisca,Antonia,María Isabel,María José,Dolores,Lucia,Sara,Paula,María Luisa,Elena,Pilar,Concepción,Raquel,Rosa María,Manuela,Mercedes,María Jesús,Rosario,Beatriz,Juana,Teresa,Julia,Nuria,Silvia,Encarnación,Irene,Alba,Patricia,Montserrat,Andrea,Rosa,Rocío,Mónica,María Mar,Alicia,Angela,Sonia,Sandra,Marina,Susana,Yolanda,Natalia,Margarita,María Josefa,María Rosario,Eva,Inmaculada,Claudia,María Mercedes,Ana Isabel,Esther,Noelia,Carla,Verónica,Sofía,Ángeles,Carolina,Nerea,María Victoria,María Rosa,Eva María,Amparo,Míriam,Lorena,Inés,María Concepción,Ana Belén,María Elena,Victoria,María Antonia,Daniela,Catalina,Consuelo,Lidia,María Nieves,Celia,Alejandra,Olga,Emilia,Gloria,Luisa,Ainhoa,Aurora,María Soledad,Martina,Fátima";
const str_apellidos = "García,González,Rodríguez,Fernández,López,Martínez,Sánchez,Pérez,Gómez,Martín,Jiménez,Ruiz,Hernández,Diez,Moreno,Muñoz,Álvarez,Romero,Alonso,Gutiérrez,Navarro,Torres,Domínguez,Vázquez,Ramos,Gil,Ramírez,Serrano,Blanco,Molina,Morales,Suárez,Ortega,Delgado,Castro,Ortiz,Rubio,Marín,Sanz,Núñez,Iglesias,Medina,Garrido,Cortes,Castillo,Santos,Lozano,Guerrero,Cano,Prieto,Méndez,Cruz,Calvo,Gallego,Herrera,Márquez,León,Vidal,Peña,Flores,Cabrera,Campos,Vega,Fuentes,Carrasco,Diez,Reyes,Caballero,Nieto,Aguilar,Pascual,Santana,Herrero,Montero,Lorenzo,Hidalgo,Giménez,Ibáñez,Ferrer,Duran,Santiago,Benítez,Vargas,Mora,Vicente,Arias,Carmona,Crespo,Román,Pastor,Soto,Sáez,Velasco,Moya,Soler,Parra,Esteban,Bravo,Gallardo,Rojas,Pardo,Merino,Franco,Lara,Espinosa,Rivera,Rivas,Izquierdo,Camacho,Casado,Silva,Arroyo,Redondo,Vera,Rey,Galán,Luque,Ríos,Montes,Sierra,Otero,Segura,Carrillo,Mendoza,Marcos,Soriano,Martí,Bernal,Robles,Heredia,Vila,Valero,Palacios,Expósito,Macias,Varela,Benito,Guerra,Andrés,Roldan,Conteras,Mateo,Bueno,Villar,Pereira,Miranda,Guillen,Mateos,Escudero,Aguilera";

const nombres = str_nombres.split(",");
const apellidos = str_apellidos.split(",");
const dominios = ["gmail.com", "hotmail.com", "outlook.es"]

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}  


function nombreAleatorio() {
    return nombres[getRndInteger(0, nombres.length-1)] + " " + apellidos[getRndInteger(0, apellidos.length-1)] + " " + apellidos[getRndInteger(0, apellidos.length-1)];
}

function nombreYEmailAleatorio() {
    let nombre = nombres[getRndInteger(0, nombres.length-1)];
    let nombreEmail = S(nombre).replaceAll(' ', '').s;
    let apellido1 = apellidos[getRndInteger(0, apellidos.length-1)];
    let apellido2 = apellidos[getRndInteger(0, apellidos.length-1)];
    let dominio = dominios[getRndInteger(0,dominios.length-1)];
    let numero = getRndInteger(1,50);

    let fullName = `${nombre} ${apellido1} ${apellido2}`;
    let email = `${nombreEmail}.${apellido1}.${apellido2}${numero}@${dominio}`;
    email = S(email).latinise().s;
    return ({
        nombre: fullName,
        email: email
    })

}

module.exports.nombreAleatorio = nombreAleatorio;
module.exports.nombreYEmailAleatorio = nombreYEmailAleatorio;
module.exports.enteroAleatorio = getRndInteger;