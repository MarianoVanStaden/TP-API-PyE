document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "https://apidemo.geoeducacion.com.ar/api/testing/encuesta/1";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const  registrosEstudiantes = data.data;
                cargarTablaPoblacion( registrosEstudiantes);
                cargarTablaFrecuencia( registrosEstudiantes);
                cargarTablaEstadistica( registrosEstudiantes);
            }
        })
        .catch(error => console.error("Error fetching data:", error));

    function cargarTablaPoblacion( registrosEstudiantes) {
        const tablaBody = document.getElementById("poblacionTablaBody");
        tablaBody.innerHTML =  registrosEstudiantes.map(registro => `
            <tr>
                <td>${registro.nombre} ${registro.apellido}</td>
                <td>${registro.Edad}</td>
                <td>${registro.curso}</td>
                <td>${registro.nivel}</td>
            </tr>
        `).join("");
    }

    function  cargarTablaFrecuencia( registrosEstudiantes) {
        const nivelesFrecuencia = {};
        const cursosFrecuencia = {};

         registrosEstudiantes.forEach(registro => {
            nivelesFrecuencia[registro.nivel] = (nivelesFrecuencia[registro.nivel] || 0) + 1;
            if (registro.nivel === "Secundario") {
                cursosFrecuencia[registro.curso] = (cursosFrecuencia[registro.curso] || 0) + 1;
            }
        });

        populateFrecuenciaTable(nivelesFrecuencia, "frecuenciaNivelesTablaBody");
        populateFrecuenciaTable(cursosFrecuencia, "frecuenciaCursosTablaBody");
    }

    function populateFrecuenciaTable(frecuenciaData, tablaBodyID) {
        const tablaBody = document.getElementById(tablaBodyID);
        const total = Object.values(frecuenciaData).reduce((sum, freq) => sum + freq, 0);
        let acumulada = 0;

        tablaBody.innerHTML = Object.entries(frecuenciaData).map(([key, freq]) => {
            acumulada += freq;
            return `
                <tr>
                    <td>${key}</td>
                    <td>${freq}</td>
                    <td>${acumulada}</td>
                    <td>${(freq / total * 100).toFixed(2)}%</td>
                </tr>
            `;
        }).join("");
    }

    function  cargarTablaEstadistica( registrosEstudiantes) {
        const edades =  registrosEstudiantes.map(registro => registro.Edad).sort((a, b) => a - b);
        const n = edades.length;
        const media = (edades.reduce((sum, edad) => sum + edad, 0) / n).toFixed(2);
        const mediana = (n % 2 === 0) ? ((edades[n / 2 - 1] + edades[n / 2]) / 2).toFixed(2) : edades[Math.floor(n / 2)].toFixed(2);
        const maximo = Math.max(...edades);
        const minimo = Math.min(...edades);
        const q1 = (edades[Math.floor(n / 4)]).toFixed(2);
        const q3 = (edades[Math.ceil((3 * n) / 4) - 1]).toFixed(2);
        const desviacionEstandar = Math.sqrt(edades.map(edad => (edad - media) ** 2).reduce((sum, sq) => sum + sq, 0) / n).toFixed(2);

        const tablaBody = document.getElementById("estadisticosTablaBody");
        tablaBody.innerHTML = `
            <tr>
                <td>${media}</td>
                <td>${mediana}</td>
                <td>${maximo}</td>
                <td>${minimo}</td>
                <td>${q1}</td>
                <td>${q3}</td>
                <td>${desviacionEstandar}</td>
            </tr>
        `;
    }
});
