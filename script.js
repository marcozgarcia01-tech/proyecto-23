
let entradaUbicacion = document.getElementById("ubicacion");
let botonBuscar = document.getElementById("botonBuscar");
let climaActual = document.getElementById("climaActual");
let listaHoras = document.getElementById("listaHoras");


function buscarClima() {
    let ciudad = entradaUbicacion.value;

    climaActual.innerHTML = "<p>Buscando...</p>";
    listaHoras.innerHTML = "";

        let urlGeo = "https://geocoding-api.open-meteo.com/v1/search?name=" 
        + encodeURIComponent(ciudad) + "&count=1&language=es&format=json";

    fetch(urlGeo)
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datosGeo) {
        
        if (!datosGeo.results) {
            throw new Error("Ciudad no encontrada");
        }

        
        let latitud = datosGeo.results[0].latitude;
        let longitud = datosGeo.results[0].longitude;
        let nombreCompleto = datosGeo.results[0].name + ", " + datosGeo.results[0].country;

    
        let urlClima = "https://api.open-meteo.com/v1/forecast?latitude=" + latitud 
            + "&longitude=" + longitud 
            + "&current_weather=true&hourly=temperature_2m,precipitation_probability,windspeed_10m,weathercode" 
            + "&past_days=1&forecast_days=1&timezone=auto";

        return fetch(urlClima)
            .then(function(respuesta) { return respuesta.json(); })
            .then(function(datosClima) {
                return { datosClima: datosClima, nombre: nombreCompleto };
            });
    })
    .then(function(resultado) {
        let datos = resultado.datosClima;
        let nombre = resultado.nombre;

        
        let actual = datos.current_weather;
        climaActual.innerHTML = `
            <h2>${nombre}</h2>
            <p><strong>Temperatura:</strong> ${actual.temperature} °C</p>
            <p><strong>Viento:</strong> ${actual.windspeed} km/h</p>
            <p><strong>Condición:</strong> Código ${actual.weathercode}</p>
        `;

        
        listaHoras.innerHTML = "";
        let horas = datos.hourly.time;
        let temps = datos.hourly.temperature_2m;
        let lluvias = datos.hourly.precipitation_probability;
        let vientos = datos.hourly.windspeed_10m;

        for (let i = 0; i < horas.length; i++) {
            let horaCorta = horas[i].slice(11, 16);
            listaHoras.innerHTML += `
                <div class="hora">
                    <span>${horaCorta}</span>
                    <span>${temps[i]}°C |  ${vientos[i]} km/h |  ${lluvias[i]}%</span>
                </div>
            `;
        }
    })
    .catch(function(error) {
      
        climaActual.innerHTML = "<p style='color: red;'>Error: No se encontró la ciudad o hubo un problema de conexión.</p>";
        console.log(error);
    });
}


botonBuscar.onclick = buscarClima;


buscarClima();