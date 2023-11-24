# Projet Devops

### Branches Principales
+ main: La branche principale contenant le code de production. Toutes les fonctionnalités développées sont finalement fusionnées dans cette branche.
+ staging: Une branche de mise en scène où toutes les fonctionnalités, corrections et mises à jour sont d'abord fusionnées. Une fois testées et approuvées, elles sont fusionnées dans la branche main.
### Branches de Fonctionnalités
+ feature/<nom_de_la_fonctionnalité>: Pour chaque nouvelle fonctionnalité, créez une branche à partir de staging. Par exemple, feature/new-login-page. Une fois la fonctionnalité terminée et testée, fusionnez-la dans staging.
### Branches de Correction
+ fix/<nom_du_bug>: Pour les corrections urgentes, créez une branche fix à partir de main. Après correction, fusionnez-la à la fois dans main et staging.
### Branches de Version
+ release/<version>: Pour préparer une nouvelle version, créez une branche release à partir de staging. Une fois prête, fusionnez-la dans main et staging, et marquez la version dans main.
### Règles de Protection de Branches
+ main et staging: Ces branches sont protégées. Les modifications directes sont interdites. Les pull requests nécessitent des revues de code et le passage réussi des tests CI avant la fusion.
+ Restrictions: Les pushs directs sur main et staging sont interdits pour garantir que tout le code passe par une revue.
### Flux de Travail
+ Nouvelle Fonctionnalité: Créez une feature branch à partir de staging, développez et testez. Faites une pull request vers staging pour la revue.
+ Correction: Créez une fix branch à partir de main, corrigez le bug, puis fusionnez dans main et staging.
+ Nouvelle Version: Créez une release branch, finalisez la version, puis fusionnez dans main et staging.



## PlanodeZoo

+ Gestion des espaces CRUD (nom, description, images, type, capacité, durée, horaires d’ouverture, accès handicapé)  
  
+ Un espace peut être mis en maintenance à tout moment, uniquement par un utilisateur admin. Un carnet d’entretien des espaces doit être mis en place afin de limiter les problèmes : un système permettant de dire quel est le meilleur mois pour réparer un espace doit être disponible pour les admins  
  
+ Gestion des animaux par espaces : Il est possible d'avoir différentes espèces dans le même espace. Il doit impérativement y avoir un carnet de suivi de traitements des animaux édité uniquement par un vétérinaire.  
  
+  Gestion  hebdomadaire  des  employés  :  le  zoo  ne  peut  pas  ouvrir  s'il  n'y  a  PAS  au  moins  1  personne  à l'accueil, 1 soigneur, 1 agent d’entretien ainsi qu’ 1 vendeur.  
  
+ Gestion des billets dans le zoo: Un billet donne accès à certains espaces.  
 - Il y a différent type de PASS. (PASS journée, PASS Week-end, PASS Annuel, PASS 1daymonth(un jour par mois toute l'année)  
 -  Contrôle  des  billets:  Avant  chaque  espace,  l’API  devra  valider  ou  non  si  l’utilisateur  peut  accéder  à  l’espace  
 -  PASS  Escape  game:  Certains  billet  donneront  accès  aux  espaces  selon  un  ordre  prédéfini  (exemple: tigre/lion/singe)  
  
+  Des  statistiques  quotidiennes  et  hebdomadaires  devront  permette  de mettre  en  évidence  l’affluence  de notre magnifique zoo par espace.  
  
+ Taux de fréquentation du zoo et des espaces en temps reel  
  
+ Ouverture nocturne du zoo avec PASS Night (par un admin)  
  
+ Afin d'accéder à l'API il faudra avoir un compte, seul un employé peut faire des actions pour le parc.  
  
faire en POO
