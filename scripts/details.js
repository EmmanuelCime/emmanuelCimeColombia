document.addEventListener('DOMContentLoaded', () => {
    let departmentId = new URLSearchParams(window.location.search).get('id')
    let departmentDetailsContainer = document.getElementById('department-details')
    let citiesAreasContainer = document.getElementById('cities-areas-container')
    let filterCities = document.getElementById('filter-cities')
    let filterAreas = document.getElementById('filter-areas')
    let filterCitiesText = document.getElementById('filter-cities-text')
    let filterAreasText = document.getElementById('filter-areas-text')

    let departmentDetails = async () => {
        try {
            let response = await fetch(`https://api-colombia.com/api/v1/Department/${departmentId}`)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            let data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching department details:', error)
            departmentDetailsContainer.innerHTML = '<p>Error al obtener los datos del departamento</p>'
            return null
        }
    }

    let citiesInfo = async () => {
        try {
            let response = await fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/cities`)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            let data = await response.json()
            return data.map(city => city.name)
        } catch (error) {
            console.error('Error fetching cities:', error)
            return []
        }
    };

    let areasInfo = async () => {
        try {
            let response = await fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/naturalareas`)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            let dataAreas = await response.json()
            return dataAreas
                .flatMap(area => area.naturalAreas)
                .map(naturalArea => naturalArea.name)
                .filter((value, index, self) => self.indexOf(value) === index)
        } catch (error) {
            console.error('Error fetching natural areas:', error)
            return []
        }
    }

    let departmentsCard = (department) => {
        departmentDetailsContainer.innerHTML = `
            <h2>${department.name}</h2>
            <img id="imgDetails" src="../resources/detallesDepartamento.png" alt="${department.name}">
            <p>${department.description}</p>
            <p>Tipo: ${department.type === 'department' ? 'Departamento' : 'Municipio'}</p>
            <p>Poblacion: ${department.population}</p>
            <p>Municipalidades: ${department.municipalities}</p>
            <p>Prefijo numerico: ${department.phonePrefix}</p>
            <p>Región ID: ${department.regionId}</p>
            <p>Departamento ID: ${department.id}</p>
            <p>Superficie: ${department.surface}</p>
        `
    }

    let cardGenerator = (name, type) => {
        let card = document.createElement('div')
        card.className = 'card d-flex align-items-center justify-content-around'
        let imageUrl = type === 'city' ? '../resources/cuidadesTarjeta.png' : '../resources/areasTarjeta.png'
    
        card.innerHTML = `
            <h3>${name}</h3>
            <p>${type === 'city' ? 'Ciudad' : 'Área Natural'}</p>
            <img src="${imageUrl}" alt="${type === 'city' ? 'Imagen de Ciudad' : 'Imagen de Área Natural'}" />
        `
        return card
    }
    
    let createNoResultsCard = (type) => {
        let card = document.createElement('div')
        card.className = 'card no-results'
        card.innerHTML = `
            <h3>No se encontraron ${type === 'city' ? 'ciudades' : 'áreas naturales'}</h3>
        `
        return card
    }


    let filters = (cities, areas) => {
        let cityFilterText = filterCitiesText.value.toLowerCase()
        let areaFilterText = filterAreasText.value.toLowerCase()
        let filteredCities = filterCities.checked ? cities.filter(city => city.toLowerCase().includes(cityFilterText)) : []
        let filteredAreas = filterAreas.checked ? areas.filter(area => area.toLowerCase().includes(areaFilterText)) : []
        citiesAreasContainer.innerHTML = ''
        let resultsDisplayed = false

        if (filterCities.checked) {
            if (filteredCities.length > 0) {
                filteredCities.forEach(city => {
                    let card = cardGenerator(city, 'city')
                    citiesAreasContainer.appendChild(card)
                })
                resultsDisplayed = true
            }
        }

        if (filterAreas.checked) {
            if (filteredAreas.length > 0) {
                filteredAreas.forEach(area => {
                    let card = cardGenerator(area, 'area')
                    citiesAreasContainer.appendChild(card)
                })
                resultsDisplayed = true
            }
        }

        if (!resultsDisplayed) {
            if (filterCities.checked && !filterAreas.checked) {
                let noResultsCard = createNoResultsCard('city')
                citiesAreasContainer.appendChild(noResultsCard)
            } else if (filterAreas.checked && !filterCities.checked) {
                let noResultsCard = createNoResultsCard('area')
                citiesAreasContainer.appendChild(noResultsCard)
            }
        }

        if (!filterCities.checked && !filterAreas.checked) {
            citiesAreasContainer.innerHTML = '<h4>Seleccione alguna opción para filtrar los resultados de la búsqueda especificada</h4>'
        }
    }

    let loadFunctions = async () => {
        let department = await departmentDetails()
        if (department) {
            let cities = await citiesInfo()
            let naturalAreas = await areasInfo()
            departmentsCard(department)
            filters(cities, naturalAreas)

            filterCities.addEventListener('change', () => {
                filters(
                    filterCities.checked ? cities : [],
                    filterAreas.checked ? naturalAreas : []
                )
            })

            filterAreas.addEventListener('change', () => {
                filters(
                    filterCities.checked ? cities : [],
                    filterAreas.checked ? naturalAreas : []
                )
            })

            filterCitiesText.addEventListener('input', () => {
                filters(
                    filterCities.checked ? cities : [],
                    filterAreas.checked ? naturalAreas : []
                )
            })

            filterAreasText.addEventListener('input', () => {
                filters(
                    filterCities.checked ? cities : [],
                    filterAreas.checked ? naturalAreas : []
                )
            })
        }
    }

    loadFunctions()
})