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
