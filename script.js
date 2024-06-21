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
        const tableBody = document.getElementById("poblacionTableBody");
        tableBody.innerHTML =  registrosEstudiantes.map(record => `
            <tr>
                <td>${record.nombre} ${record.apellido}</td>
                <td>${record.Edad}</td>
                <td>${record.curso}</td>
                <td>${record.nivel}</td>
            </tr>
        `).join("");
    }

    function  cargarTablaFrecuencia( registrosEstudiantes) {
        const nivelesFrecuencia = {};
        const cursosFrecuencia = {};

         registrosEstudiantes.forEach(record => {
            nivelesFrecuencia[record.nivel] = (nivelesFrecuencia[record.nivel] || 0) + 1;
            if (record.nivel === "Secundario") {
                cursosFrecuencia[record.curso] = (cursosFrecuencia[record.curso] || 0) + 1;
            }
        });

        populateFrecuenciaTable(nivelesFrecuencia, "frecuenciaNivelesTableBody");
        populateFrecuenciaTable(cursosFrecuencia, "frecuenciaCursosTableBody");
    }

    function populateFrecuenciaTable(frecuenciaData, tableBodyId) {
        const tableBody = document.getElementById(tableBodyId);
        const total = Object.values(frecuenciaData).reduce((sum, freq) => sum + freq, 0);
        let acumulada = 0;

        tableBody.innerHTML = Object.entries(frecuenciaData).map(([key, freq]) => {
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
        const edades =  registrosEstudiantes.map(record => record.Edad).sort((a, b) => a - b);
        const n = edades.length;
        const media = (edades.reduce((sum, edad) => sum + edad, 0) / n).toFixed(2);
        const mediana = (n % 2 === 0) ? ((edades[n / 2 - 1] + edades[n / 2]) / 2).toFixed(2) : edades[Math.floor(n / 2)].toFixed(2);
        const maximo = Math.max(...edades);
        const minimo = Math.min(...edades);
        const q1 = (edades[Math.floor(n / 4)]).toFixed(2);
        const q3 = (edades[Math.ceil((3 * n) / 4) - 1]).toFixed(2);
        const desviacionEstandar = Math.sqrt(edades.map(edad => (edad - media) ** 2).reduce((sum, sq) => sum + sq, 0) / n).toFixed(2);

        const tableBody = document.getElementById("estadisticosTableBody");
        tableBody.innerHTML = `
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
