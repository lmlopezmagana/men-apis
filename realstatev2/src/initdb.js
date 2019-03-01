import { User } from './api/user'
import { Property } from './api/property'
import { Photo } from './api/photo'
import { Category } from './api/category'

const fetch = require('node-fetch');
const flatten = require('array-flatten');
const nombres_aleatorios = require('./services/random');
const municipios = require('./services/random/municipios')





module.exports.initdb = function() {
    
    const pageSize = 20;   
    let types = ['buy', 'rent']
    let propietarioActual = null;

    let obraNueva = null;
    let venta = null; 
    let alquiler = null;

    const arr = [{name: "Obra nueva"}, {name: "Alquiler"}, {name: "Venta"}];

    Category.insertMany(arr)
    .then((docs) => {
        docs.forEach((category) => {
            switch(category.name) {
                case "Obra nueva": obraNueva = category.id; break;
                case "Alquiler": alquiler = category.id; break;
                case "Venta": venta = category.id; break;
            }
        })
    })
    .then(() => {
    return Promise.all(municipios.municipios().forEach((valor, clave)=> {    
        return Promise.all(types.map(function(type) {
            let numPages = Math.round(valor.numHabitantes/10000);
            let pages = [...Array(numPages).keys()].map(x => x++);
            return Promise.all(pages.map(function(page){
                let url = `https://api.nestoria.es/api?encoding=json&pretty=1&action=search_listings&country=es&listing_type=${type}&place_name=${clave}&has_photo=1&number_of_results=${pageSize}&page=${page}`;
                console.log(url);
                return fetch(url).then(res => res.json());
            }))
        }))
        .then(json => flatten(json))
        .then(objetos => objetos.map(req => {
            let actualType = req.request.listing_type;
            req.response.listings.map((propiedad) => propiedad['category'] = actualType)
            return req.response.listings
        })
        )
        .then(coleccion => flatten(coleccion))
        .then((viviendas) => viviendas.map((vivienda) => ({
            title: vivienda.title,
            description: vivienda.summary,
            price: vivienda.price,
            rooms: vivienda.bedroom_number,
            size: vivienda.size,       
            city: valor.poblacion,
            province: valor.provincia,
            loc: vivienda.latitude.toString() + ", " + vivienda.longitude.toString(),
            zipcode: valor.codPostal,
            photo: vivienda.img_url,
            category: vivienda.category
        })))
        .then(viviendas => {
            let total_actual = viviendas.length;
            let datos = new Map();
            while(total_actual > 0) {
                let pisosUsuario = nombres_aleatorios.enteroAleatorio(1, (3 > total_actual) ? total_actual : 3);
                let usuarioAleatorio = nombres_aleatorios.nombreYEmailAleatorio();
                let newUser = {
                    email: usuarioAleatorio.email,
                    name: usuarioAleatorio.nombre,
                    password: "12345678"
                }
                
                let arrayPisosUsuario = new Array();
                for(let i=0; i < pisosUsuario; i++) {
                    arrayPisosUsuario.push(viviendas.pop());
                }
                datos.set(newUser, arrayPisosUsuario);
                total_actual = total_actual - pisosUsuario;
            }

            return Promise.all(datos.forEach((value,key) => {
                User.create(key, (err, data) => {
                    console.log(data);
                    if (!err) {
                        propietarioActual = data;
                        return Promise.all(value.map((vivienda) => {
                            // Obra nueva 5c76d516711ae258dc04c35c
                            // Alquiler 5c76d53d711ae258dc04c35d
                            // Venta 5c76d54e711ae258dc04c35e
                            let cat = null;
                            if (vivienda.category == 'rent') 
                                // cat = "5c76d53d711ae258dc04c35d"
                                cat = alquiler;
                            else 
                                if (Date.now() % 5 == 0) 
                                    // cat = "5c76d516711ae258dc04c35c"
                                    cat = obraNueva;
                                else
                                    // cat = "5c76d54e711ae258dc04c35e"
                                    cat = venta;
                            Property.create({
                                title: vivienda.title,
                                description: vivienda.description,
                                price: vivienda.price,
                                rooms: vivienda.bedroom_number,
                                size: vivienda.size,
                                ownerId: propietarioActual.id,
                                city: vivienda.city,
                                zipcode: vivienda.zipcode,
                                province: vivienda.province, 
                                categoryId: cat,
                                loc: vivienda.loc,
                                rooms: vivienda.rooms   
                            }, (err, nuevoInmueble) =>  {
                                if (err) console.log(err);
                                return Photo.create({
                                    propertyId: nuevoInmueble.id,
                                    imgurLink: vivienda.photo
                                })
                            })
                        }))
                    } else console.log(err);
                });
            }))
        })
    }))
})
    .catch(err => console.log(err));
}
