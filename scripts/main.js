document.addEventListener('DOMContentLoaded', () => {
    let departmentsContainer = document.getElementById('departments-container')
    let textFilter = document.getElementById('text-filter')
    let showAll = document.getElementById('show-all')
    let popUnderMill = document.getElementById('pop-under-mill')
    let popOverMill = document.getElementById('pop-over-mill')
    let allDepartments = []
    let countryUrl = 'https://api-colombia.com/api/v1/Country/Colombia'

    fetch(countryUrl)
        .then(response => response.json())
        .then(countryData => countryInfo(countryData))

    function countryInfo(countryData) {
        let title = document.querySelector('h1')
        title.innerHTML = countryData.name
        let description = document.getElementById('countryDescription')
        description.innerHTML = countryData.description
    }

    let fetchDepartments = async () => {
        try {
            let response = await fetch('https://api-colombia.com/api/v1/Department')
            let data = await response.json()
            allDepartments = data
            applyFilters()
        } catch (error) {
            console.error('Error fetching departments:', error)
            departmentsContainer.innerHTML = '<p>Error al obtener los datos de los departamentos</p>'
        }
    }

    let displayDepartments = (departments) => {
        departmentsContainer.innerHTML = ''

        if (departments.length === 0) {
            let noResultsCard = document.createElement('div')
            noResultsCard.className = 'no-results-card'
            noResultsCard.innerHTML = `<h2>No se encontraron resultados con la búsqueda especificada</h2>`
            departmentsContainer.appendChild(noResultsCard)
            return
        }

        departments.sort((a, b) => a.regionId - b.regionId)

        departments.forEach(department => {
            let card = document.createElement('div')
            card.className = 'card'
            card.innerHTML = `
                <img src="./resources/1981departamentos.png">
                <h2>${department.name}</h2>
                <p class="card-text">Región ID: ${department.regionId}</p>
                <p class="card-text">Población: ${department.population}</p>
                <button onclick="window.location.href='../pages/details.html?id=${department.id}'">Detalles</button>
            `
            departmentsContainer.appendChild(card)
        })
    }

    let applyFilters = () => {
        let searchText = textFilter.value.toLowerCase()
        let selectedFilter = document.querySelector('input[name="population-filter"]:checked').value

        let filteredDepartments = allDepartments

        if (searchText) {
            filteredDepartments = filteredDepartments.filter(department =>
                department.name.toLowerCase().includes(searchText)
            )
        }

        if (selectedFilter === 'under') {
            filteredDepartments = filteredDepartments.filter(department => department.population < 1000000)
        } else if (selectedFilter === 'over') {
            filteredDepartments = filteredDepartments.filter(department => department.population >= 1000000)
        }

        displayDepartments(filteredDepartments)
    }

    textFilter.addEventListener('input', applyFilters)
    document.querySelectorAll('input[name="population-filter"]').forEach(radio =>
        radio.addEventListener('change', applyFilters)
    )

    fetchDepartments()
})