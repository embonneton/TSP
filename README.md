# Projet dans le cadre du cursus d’ingénieur à Télécom SudParis – Module Responsabilité Sociétale des Entreprises (RSE)

Ce projet consiste en la conception d’un outil permettant de sélectionner le datacenter Azure le plus adapté aux besoins des utilisateurs. L’outil a été développé à partir des sources de données suivantes :  
- [Régions Azure – Données sur la durabilité](https://github.com/autosysops/azure_sustainability_data/blob/main/regiondata.json)  
- [Performances et coûts des services cloud](https://cloudprice.net/performance)  
- [Produits Azure par région](https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/table)  
- [Informations sur les datacenters Microsoft](https://datacenters.microsoft.com/globe/data/geo/regions.json)  

## Mode d’emploi :
1. **Sélectionnez** le pays des consommateurs du service.  
2. **Ajoutez** les services Azure prévus à l’aide des boutons "Ajouter un Service" ou "Enlever le Dernier Service".  
3. **Cliquez sur "Calculer"** pour comparer les options disponibles.  

## Résultats :
- **Onglet "Top 5"** : Affiche les cinq datacenters les plus proches.  
- **Onglet "Toutes les régions"** : Liste complète de toutes les régions Azure.  

Chaque onglet présente les résultats sous forme de tableau avec les colonnes suivantes :  
- **Nom** : Nom de la région.  
- **Ville** : Ville où se situe le datacenter.  
- **Disponibilité des services sélectionnés** : Indique si les services sont disponibles (en vert) ou non disponibles (en rouge).  
- **Efficacité énergétique** : Plus la valeur est élevée, meilleure est l’efficacité énergétique.  
- **Impact environnemental** : Plus la valeur est basse, mieux c’est pour l’environnement.  
- **Coût des services** : Plus la valeur est basse, plus le coût est avantageux.  

Les résultats sont exprimés sans unité de mesure pour simplifier la comparaison.




# Règle de Calcul pour l'efficacité énergétique 

## Chargement des Données

La fonction commence par charger les données des régions depuis un fichier JSON nommé `regions_conso.json`. Elle vérifie ensuite si la région spécifiée par `regionId` existe dans les données chargées.

## Extraction des Valeurs

Si la région existe, les valeurs suivantes sont extraites et converties en nombres flottants :
- `pue` : Power Usage Effectiveness.
- `renewable` : Pourcentage d'énergie renouvelable (le symbole '%' est retiré).
- `wue` : Water Usage Effectiveness.

## Calcul des Scores Individuels

### PUE Score

La note pour le PUE est calculée en soustrayant 1 du PUE et en soustrayant ce résultat de 10. Plus le PUE est bas, plus la note est élevée.
\[
\text{pueScore} = 10 - (\text{pue} - 1)
\]

### Renewable Score

La note pour l'énergie renouvelable est calculée en convertissant le pourcentage en une note sur 10.
\[
\text{renewableScore} = \left(\frac{\text{renewable}}{100}\right) \times 10
\]

### WUE Score

La note pour le WUE est calculée en soustrayant le WUE de 10. Plus le WUE est bas, plus la note est élevée.
\[
\text{wueScore} = 10 - \text{wue}
\]

## Calcul de la Note Finale

La note finale est la moyenne des trois scores calculés précédemment.
\[
\text{finalScore} = \frac{\text{pueScore} \times \text{renewableScore} \times \text{wueScore}}{3}
\]
La note finale est arrondie à deux décimales pour plus de précision.

## Gestion des Erreurs

Si une erreur survient lors du chargement des données ou si la région n'est pas trouvée, la fonction retourne "Non connu".
