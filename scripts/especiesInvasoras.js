
let url = 'https://api-colombia.com/api/v1/InvasiveSpecie'

fetch(url)
    .then(response => response.json())
    .then(data => {
        let tableBody = document.getElementById('species-container')
        tableBody.innerHTML = ''

        data.forEach((specie) => {
            let row = document.createElement('tr')
            let riskLevel = parseInt(specie.riskLevel)

            if (riskLevel === 1) {
                row.classList.add('table-primary')
            } else if (riskLevel === 2) {
                row.classList.add('table-success')
            } else {
                row.classList.add('table-warning')
            }

            row.innerHTML = `
                    <th>${specie.name}</th>
                    <td>${specie.scientificName}</td>
                    <td>${specie.impact}</td>
                    <td>${specie.manage}</td>
                    <td>${riskLevel}</td>
                    <td><img src="${specie.urlImage}" alt="${specie.name}" class="img-thumbnail" id="imgTabla"></td>
                `
            tableBody.appendChild(row)
        })
    })
    
    .catch(e => console.log(e))