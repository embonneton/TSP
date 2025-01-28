// Fonction pour calculer la distance haversine entre deux points
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

// Fonction pour trouver les 5 datacenters les plus proches
function findClosestDataCenters(country, dataCenters, countryData) {
    const userLat = countryData[country].lat;
    const userLon = countryData[country].lon;
    let closestDataCenters = [];

    dataCenters.forEach(dataCenter => {
        const distance = haversineDistance(userLat, userLon, dataCenter.latitude, dataCenter.longitude);
        dataCenter.distance = distance;
        closestDataCenters.push(dataCenter);
    });

    closestDataCenters.sort((a, b) => a.distance - b.distance);
    return closestDataCenters;
}


// Fonction pour afficher le résultat sous forme de tableau
async function displayResult(dataCenters, totalConso, selectedServices) {
    const top5ResultDiv = document.getElementById('top5Result');
    const allRegionsResultDiv = document.getElementById('allRegionsResult');

    // Récupération des prix des régions
    const regionPrices = await fetchRegionPrices();

    // Obtenir les disponibilités de services pour chaque dataCenter de manière asynchrone
    const dataCentersAvailability = await Promise.all(dataCenters.map(async dataCenter => {
        const servicesAvailability = await Promise.all(selectedServices.map(service => getServiceAvailability(service, dataCenter)));
        return { ...dataCenter, servicesAvailability };
    }));

    const dataCentersWithScores = await Promise.all(dataCentersAvailability.map(async dataCenter => {
        const score = await calculateRegionScore(dataCenter.id);
        const price = regionPrices[dataCenter.id.toLowerCase()] || "-";
        return { ...dataCenter, score, price };
    }));

    const top5Table = `
        <table>
            <tr>
                <th>Nom</th>
                <th>Ville</th>
                <th>Disponibilités des Services Sélectionnés</th>
                <th>Efficacité énergétique</th>
                <th>Impact environnemental</th>
                <th>Coût des services</th>
            </tr>
            ${dataCentersWithScores.slice(0, 5).map(dataCenter => 
                `<tr>
                    <td><a href="${dataCenter.announcementLink}" target="_blank">${dataCenter.displayName}</a></td>
                    <td>${dataCenter.location}</td>
                    <td>${dataCenter.servicesAvailability.join(', ')}</td>
                    <td>${dataCenter.score}</td>
                    <td>${isNaN(totalConso * dataCenter.score) ? "-" : (totalConso * dataCenter.score).toFixed(2)}</td>
                    <td>${isNaN(totalConso * dataCenter.price) ? "-" : (totalConso * dataCenter.price).toFixed(2)}</td>
                </tr>`
            ).join('')}
        </table>
    `;

    const AllTable = `
        <table>
            <tr>
                <th>Nom</th>
                <th>Ville</th>
                <th>Disponibilités des Services Sélectionnés</th>
                <th>Coût des Services Sélectionnés</th>
                <th>Efficacité énergétique</th>
                <th>Impact environnemental</th>
                <th>Coût des services</th>
            </tr>
            ${dataCentersWithScores.map(dataCenter => 
                `<tr>
                    <td><a href="${dataCenter.announcementLink}" target="_blank">${dataCenter.displayName}</a></td>
                    <td>${dataCenter.location}</td>
                    <td>${dataCenter.servicesAvailability.join(', ')}</td>
                    <td>${totalConso}</td>
                    <td>${dataCenter.score}</td>
                    <td>${isNaN(totalConso * dataCenter.score) ? "-" : (totalConso * dataCenter.score).toFixed(2)}</td>
                    <td>${isNaN(totalConso * dataCenter.price) ? "-" : (totalConso * dataCenter.price).toFixed(2)}</td>
                </tr>`
            ).join('')}
        </table>
    `;

    top5ResultDiv.innerHTML = top5Table;
    allRegionsResultDiv.innerHTML = AllTable;

    // Afficher les cartes
    displayMap('top5Map', dataCentersWithScores.slice(0, 5)); // Pour afficher les 5 premiers centres de données sur la carte 'top5Map'
    displayMap('allRegionsMap', dataCentersWithScores); // Pour afficher tous les centres de données sur la carte 'allRegionsMap'
}


// Fonction pour ajouter un sélecteur de service
function addServiceSelect() {
    const serviceContainer = document.getElementById('serviceContainer');
    const serviceCount = document.querySelectorAll('select[name="service"]').length;
    const newServiceSelect = document.createElement('select');
    newServiceSelect.id = `service${serviceCount}`;
    newServiceSelect.name = 'service';
    newServiceSelect.required = true;

    // Charger les données des services et remplir la liste déroulante
    fetch('services_conso.json')
        .then(response => response.json())
        .then(servicesConso => {
            for (const service in servicesConso) {
                const option = document.createElement('option');
                option.value = service;
                option.textContent = service;
                newServiceSelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données des services:', error);
        });

    const label = document.createElement('label');
    label.htmlFor = newServiceSelect.id;
    label.textContent = `Service Azure ${serviceCount + 1} :`;

    serviceContainer.appendChild(label);
    serviceContainer.appendChild(newServiceSelect);
    serviceContainer.appendChild(document.createElement('br'));
}

// Fonction pour enlever le dernier sélecteur de service
function removeServiceSelect() {
    const serviceContainer = document.getElementById('serviceContainer');
    const serviceSelects = document.querySelectorAll('select[name="service"]');
    if (serviceSelects.length > 1) {
        const lastServiceSelect = serviceSelects[serviceSelects.length - 1];
        const lastLabel = lastServiceSelect.previousSibling;
        const lastBr = lastServiceSelect.nextSibling;
        serviceContainer.removeChild(lastBr);
        serviceContainer.removeChild(lastServiceSelect);
        serviceContainer.removeChild(lastLabel);
    }
}

// Ajouter des gestionnaires d'événements pour les boutons d'ajout et de suppression de service
document.getElementById('addServiceButton').addEventListener('click', addServiceSelect);
document.getElementById('removeServiceButton').addEventListener('click', removeServiceSelect);

// Fonction pour ouvrir les onglets
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // Mise à jour des cartes après l'ouverture de l'onglet
    console.log("mise à jour des cartes lancé");
    handleFormSubmit(evt);
}

// Ouvrir l'onglet par défaut
document.getElementById("defaultOpen").click();


// Charger les données des pays et remplir la liste déroulante
fetch('countries.json')
    .then(response => response.json())
    .then(countryData => {
        const countrySelect = document.getElementById('country');
        for (const country in countryData) {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        }
    })
    .catch(error => {
        console.error('Erreur lors du chargement des données des pays:', error);
    });

// Charger les données des services et remplir la liste déroulante
fetch('services_conso.json')
    .then(response => response.json())
    .then(servicesConso => {
        const serviceSelect = document.getElementById('service0');
        for (const service in servicesConso) {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = service;
            serviceSelect.appendChild(option);
        }
    })
    .catch(error => {
        console.error('Erreur lors du chargement des données des services:', error);
    });

function handleFormSubmit(event) {
    event.preventDefault();
    const country = document.getElementById('country').value;
    const services = [];
    document.querySelectorAll('select[name="service"]').forEach(select => {
        services.push(select.value);
    });

    // Charger les données des datacenters depuis le fichier JSON
    fetch('regions.json')
        .then(response => response.json())
        .then(dataCenters => {
            // Charger les données des pays depuis le fichier JSON
            fetch('countries.json')
                .then(response => response.json())
                .then(countryData => {
                    // Charger les données des services depuis le fichier JSON
                    fetch('services_conso.json')
                        .then(response => response.json())
                        .then(servicesConso => {
                            const closestDataCenters = findClosestDataCenters(country, dataCenters, countryData);
                            const totalConso = services.reduce((total, service) => total + servicesConso[service].quotient, 0);
                            displayResult(closestDataCenters, totalConso, services);

                            // Mettre à jour les cartes avec les nouveaux datacenters
                            displayMap('top5Map', closestDataCenters.slice(0, 5)); // Mettre à jour la carte avec les 5 datacenters les plus proches
                            displayMap('allRegionsMap', closestDataCenters); // Mettre à jour la carte avec tous les datacenters
                            console.log("réussite mise à jour des cartes");

                        })
                        .catch(error => {
                            console.error('Erreur lors du chargement des données des services:', error);
                            document.getElementById('result').innerText = 'Erreur lors du chargement des données des services.';
                        });
                })
                .catch(error => {
                    console.error('Erreur lors du chargement des données des pays:', error);
                    document.getElementById('result').innerText = 'Erreur lors du chargement des données des pays.';
                });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données des datacenters:', error);
            document.getElementById('result').innerText = 'Erreur lors du chargement des données des datacenters.';
        });
}

// Ajoutez un écouteur d'événement à votre formulaire
document.getElementById('locationForm').addEventListener('submit', handleFormSubmit);
    
    

// Fonction pour vérifier la disponibilité d'un service dans une région
async function getServiceAvailability(service, dataCenter) {
    try {
        // Charger les données depuis le fichier JSON
        const response = await fetch('services_regions.json');
        const serviceRegions = await response.json();
        
        // Obtenir les régions disponibles pour le service donné
        const regions = serviceRegions[service] || [];
        const isAvailable = regions.includes(dataCenter.displayName);

        return `<span style="color: ${isAvailable ? 'green' : 'red'}">${service}</span>`;
    } catch (error) {
        console.error('Erreur lors du chargement des données des services:', error);
        return `<span style="color: red">${service}</span>`;
    }
}


// Fonction pour calculer la note de la région en fonction du PUE, du renouvelable et du WUE
async function calculateRegionScore(regionId) {
    try {
        // Charger les données des régions depuis le fichier JSON
        const response = await fetch('regions_conso.json');
        const regionsConso = await response.json();

        // Vérifier si la région existe dans les données
        const regionData = regionsConso[regionId];

        if (!regionData) {
            console.error('Région non trouvée dans les données:', regionId);
            return "-";
        }

        const pue = parseFloat(regionData.carbon.pue);
        const renewable = parseFloat(regionData.carbon.renewable.replace('%', ''));
        const wue = parseFloat(regionData.water.wue);

        // Calculer le score pour chaque facteur
        const pueScore = 10 - (pue - 1); // Plus PUE est bas, plus la note est élevée
        const renewableScore = (renewable / 100) * 10; // Part d'énergie renouvelable
        const wueScore = 10 - wue; // Plus WUE est bas, plus la note est élevée

        // La note finale est la moyenne des 3 scores
        const finalScore = (pueScore * renewableScore * wueScore) / 3;
        return finalScore.toFixed(2); // On arrondit à 2 décimales
    } catch (error) {
        console.error('Erreur lors du chargement des données des régions:', error);
        return "-";
    }
}


// Variable globale pour stocker les instances de carte
let mapInstances = {};

// Fonction pour afficher la carte
function displayMap(mapContainerId, dataCenters) {
    // Vérifie si une instance de carte existe déjà pour le conteneur donné
    if (mapInstances[mapContainerId]) {
        mapInstances[mapContainerId].remove(); // Détruit l'instance de carte existante
    }

    // Crée une nouvelle instance de carte
    const map = L.map(mapContainerId).setView([dataCenters[0].latitude, dataCenters[0].longitude], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Ajoute les marqueurs pour chaque centre de données
    dataCenters.forEach(dataCenter => {
        L.marker([dataCenter.latitude, dataCenter.longitude])
            .bindPopup(`${dataCenter.displayName}<br>${dataCenter.location}<br><a href="${dataCenter.productsByRegionLink}" target="_blank">Services</a><br><a href="${dataCenter.announcementLink}" target="_blank">Présentation</a>`)
            .addTo(map);
    });

    // Stocke l'instance de carte dans la variable globale
    mapInstances[mapContainerId] = map;
}


async function fetchRegionPrices() {
    const response = await fetch('regions_prix.json');
    const regionPrices = await response.json();
    return regionPrices;
}
