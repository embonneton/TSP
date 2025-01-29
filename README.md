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







# Documentation des Résultats Affichés dans les Colonnes

## Contexte

Le script `script.js` gère la soumission d'un formulaire pour calculer et afficher divers résultats liés à la consommation de services dans des datacenters. Les résultats sont affichés dans un tableau avec les colonnes suivantes :
- Coût des Services Sélectionnés
- Efficacité énergétique
- Impact environnemental
- Coût des services

## Fichiers Utilisés

- `regions.json` : Données des datacenters.
- `countries.json` : Données des pays.
- `services_conso.json` : Données des services et leur consommation.
- `services_regions.json` : Disponibilité des services dans les régions.
- `regions_conso.json` : Données de consommation des régions.
- `regions_prix.json` : Prix des services dans les régions.

## Formule de Calcul et Conclusion pour Chaque Résultat

### 1. Coût des Services Sélectionnés

#### Contexte

Cette colonne affiche le coût total des services sélectionnés par l'utilisateur.

#### Formule de Calcul

Le coût total des services sélectionnés est calculé en additionnant les quotients de consommation de chaque service sélectionné.

\[
\text{totalConso} = \sum_{\text{service} \in \text{services}} \text{servicesConso}[\text{service}].\text{quotient}
\]

#### Conclusion

Le coût total des services sélectionnés est une somme des quotients de consommation de chaque service. Cette valeur est utilisée pour calculer d'autres métriques comme l'impact environnemental et le coût des services.

### 2. Efficacité énergétique

#### Contexte

Cette colonne affiche l'efficacité énergétique de chaque datacenter.

#### Formule de Calcul

L'efficacité énergétique est calculée en fonction du PUE (Power Usage Effectiveness), du pourcentage d'énergie renouvelable, et du WUE (Water Usage Effectiveness).

\[
\text{pueScore} = 10 - (\text{pue} - 1)
\]
\[
\text{renewableScore} = \left(\frac{\text{renewable}}{100}\right) \times 10
\]
\[
\text{wueScore} = 10 - \text{wue}
\]
\[
\text{finalScore} = \frac{\text{pueScore} \times \text{renewableScore} \times \text{wueScore}}{3}
\]

#### Conclusion

L'efficacité énergétique est une moyenne pondérée des scores PUE, renouvelable, et WUE. Plus la note est élevée, plus le datacenter est énergétiquement efficace.

### 3. Impact environnemental

#### Contexte

Cette colonne affiche l'impact environnemental des services sélectionnés dans chaque datacenter.

#### Formule de Calcul

L'impact environnemental est calculé en multipliant la consommation totale des services par le score d'efficacité énergétique du datacenter.

\[
\text{impactEnvironnemental} = \text{totalConso} \times \text{score}
\]

#### Conclusion

L'impact environnemental est une mesure de l'effet environnemental des services sélectionnés dans un datacenter donné. Plus la valeur est élevée, plus l'impact environnemental est significatif.

### 4. Coût des services

#### Contexte

Cette colonne affiche le coût total des services sélectionnés dans chaque datacenter.

#### Formule de Calcul

Le coût des services est calculé en multipliant la consommation totale des services par le prix des services dans le datacenter.

\[
\text{coûtDesServices} = \text{totalConso} \times \text{price}
\]

#### Conclusion

Le coût des services est une mesure du coût financier des services sélectionnés dans un datacenter donné. Plus la valeur est élevée, plus le coût des services est important.

## Conclusion Générale

Le script `script.js` utilise plusieurs fichiers JSON pour calculer et afficher divers résultats liés à la consommation de services dans des datacenters. Les résultats sont affichés dans un tableau avec des colonnes pour le coût des services sélectionnés, l'efficacité énergétique, l'impact environnemental, et le coût des services. Chaque colonne utilise des formules spécifiques pour calculer les valeurs affichées, fournissant ainsi une vue d'ensemble des coûts et des impacts des services sélectionnés dans différents datacenters.
