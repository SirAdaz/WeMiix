



Cahier des charges  
WeMiix




Planquelle Adrien
Quehen Timéo
Vambre Théo
Tanguy Van Hullebusch 
Table des matières
1. Présentation du projet	3
2. Objectifs du projet	4
3. Charte graphique	5
4. Accès et utilisateurs	6
5. Modes enfant et adulte	7
5.1. Mode Enfant	7
5.2. Mode Adulte	7
6. Fonctionnalités musicales	9
6.1. Karaoké	9
6.2. Blind test	9
6.3. Playlists collaboratives	10
6.4. Mini-jeux musicaux	10
7. Plateforme et interface	11
7.1. Approche Mobile First et PWA	11
7.2. Conception de l'Interface Utilisateur (UI)	12
7.3. Exigence de Compatibilité	12
7.4. Accessibilité : Un Pilier de la Conception	12
7.5. Paramètres d'Accessibilité Avancés	12
8. Modèle économique	14
8.1. Version Gratuite :	14
8.2. Version Premium (Abonnement) :	14
9. Technologies envisagées	15
9.1 Frontend	15
9.2 Backend	15
9.3 Base de donnée	15
9.4 Authentification et services musicaux	16
9.5 API	16
9.6 Paroles pour le karaoké	16
10. Sécurité et données	17
11. Évolutions possibles	18
11.1. Élargissement des Sources Musicales	18
11.2. Développement d'une Application Mobile Native	18
11.3. Enrichissement du Catalogue de Mini-Jeux	19
11.4. Implémentation de Statistiques Avancées	19
12. Organisation de l’équipe	21
13. Infrastructure	22
13.1 Hébergement & réseau	22
13.2 Contrôle d’accès	22
13.3 Mise en place d’un pare-feu	22
13.4 Configuration des sauvegardes	23
13.5 Traçabilité des logs	23
1. Présentation du projet
WeMiix est une application web musicale conçue pour dynamiser les soirées festives en proposant une expérience interactive centrée sur la musique. Accessible directement via un navigateur web, avec une priorité donnée à l’utilisation mobile, elle ne nécessite aucun téléchargement, facilitant ainsi son accès et son utilisation par l’ensemble des participants. L’application intègre plusieurs fonctionnalités principales : des mini-jeux musicaux (tels que des blind tests), un système de karaoké avec paroles synchronisées, ainsi que des playlists collaboratives permettant aux utilisateurs de proposer des titres et de voter en temps réel pour influencer la programmation musicale. WeMiix a pour objectif de rendre chaque participant acteur de la soirée en favorisant l’interaction, l’engagement collectif et le partage autour de la musique.

2. Objectifs du projet
Pour ce projet on a défini une liste d’objectifs, dont voici la liste ci-dessous.
L’objectif principal étant de créer une plateforme musicale interactive principalement destinée pour les soirées, la création de WeMiix sera bâtie autour d’une interaction accrue entre les différents participants.
Afin de rendre WeMiix plus accessible et dans une optique de rejouabilité, l’application doit rester simple à prendre en main, et ce peu importe l’expérience de l’utilisateur avec les nouvelles technologies. Seront proposés des jeux qui sont assez dynamiques, avec possibilité de génération de playlists aléatoires par algorithmes.
Le contenu de l’application sera également séparé en deux catégories : Adulte et Enfant, afin de permettre une utilisation adaptée à tout type d’âge, pour tout type de soirées. 
Pour finir le dernier objectif de ce projet, c’est de mettre en place un modèle économique qui convainc tout le monde, pour cela on va mettre en place le modèle économique du freemium, c’est-à-dire proposer certains minis-jeux tout en mettant des pubs à la fin des jeux.


3. Charte graphique 

En ce qui concerne l’apparence de l’application, nous nous sommes orientés vers un design sombre, faisant appel aux couleurs néon pour les accents, ayant pour volonté de référencer les univers sombres mais pétillants des boîtes de nuit. Les différences de couleurs symbolisent le profil de l’utilisateur (gratuit / abonné, particulier / professionnel), et la version claire permet d’établir une séparation évidente entre les modes mature et familial, laissant place à un contrôle facilité.
L’objectif du logo est de ressembler à une table de mixage, qui intègre un vinyl et des barres de progressions qui remplacent les “i” du nom de l’application. Enfin, l’ombrage permet une cassure ainsi qu’une profondeur dans le logo, qui aide la perspective donnée et assiste l’utilisateur dans la reconnaissance de l’application.

4. Accès et utilisateurs
Nous souhaitons que notre site soit le plus accessible possible, c’est pour ça que l’accès aux jeux est possible en tant qu’invité, ce n’est pas obligatoire de créer un compte pour avoir accès au jeu.
La connexion à Spotify sera obligatoire pour pouvoir écouter la musique, c’est cette connexion à l’API de Spotify qui va permettre d’écouter les différents morceaux proposés par Spotify. Nous ne prévoyons pas de système d’amis, car l’idée n’est pas de créer un réseau social, mais de favoriser une utilisation simple et centrée sur l’instant. Les différentes interactions se feront uniquement via des groupes, ce qui correspond mieux au fonctionnement en soirée et permet de rassembler les participants dans un même espace de jeu.
Les groupes seront accessibles grâce à un lien d’invitation unique, généré par le QR pendant la création du groupe en mode anonyme si on n’a pas de compte créé sinon il faut une connexion requise.



5. Modes enfant et adulte
Afin d'optimiser le contenu de notre application et de libérer toute notre créativité sans être soumis à des restrictions liées à l'âge des utilisateurs, nous avons pris la décision stratégique de concevoir l'application avec deux modes distincts pour la Version Minimale Viable (MVP).
5.1. Mode Enfant
Le Mode Enfant est conçu pour offrir un environnement de divertissement sûr et approprié aux plus jeunes utilisateurs (âgés de 16 ans ou plus, conformément à la limite d'âge de l'application, mais considérés comme 'enfants' par rapport au mode adulte). La principale caractéristique est un filtrage rigoureux du contenu musical pour exclure tout contenu jugé inapproprié, comme les paroles explicites, les thèmes violents ou suggestifs, assurant ainsi une bibliothèque musicale saine. Ce mode peut également entraîner la restriction de certaines fonctionnalités pour simplifier l'interface, empêcher l'accès à des interactions sociales non surveillées (comme des fonctions de chat public) ou limiter les options d'achat intégrées. L'objectif est de garantir une expérience utilisateur encadrée et sécurisée.
5.2. Mode Adulte
Le Mode Adulte s'adresse aux utilisateurs qui souhaitent accéder à l'intégralité de l'offre et des fonctionnalités de la plateforme. Ce mode donne accès à l'ensemble des fonctionnalités de WEMIIX, incluant la bibliothèque musicale complète sans filtrage thématique, les outils de personnalisation avancés, les interactions sociales complètes, la possibilité de créer et de gérer des listes de lecture sans restriction, et l'accès à toutes les options de partage et de connexion. Les utilisateurs en Mode Adulte bénéficient d'une expérience non bridée, pensée pour un public mature capable d'exercer son jugement sur le contenu et les interactions disponibles.

Ce choix initial permet à WEMIIX d'assurer une expérience utilisateur personnalisée et conforme aux attentes de sécurité et de liberté d'accès de ses différents segments d'utilisateurs, tout en respectant sa politique d'âge minimum de 16 ans.

6. Fonctionnalités musicales
L’application intègre l’API Spotify afin de proposer une lecture directe des morceaux. La connexion à Spotify est obligatoire dès qu’il s’agit d’écouter la musique, car c’est elle qui autorise la lecture via les services Spotify et, à terme, via des services compatibles si on élargit l’intégration. L’application permet de gérer des playlists de soirée, et l’ordre de lecture peut être ajusté automatiquement en fonction des votes du groupe.
6.1. Karaoké
Karaoké en groupe


Paroles synchronisées avec la musique 
https://lrclib.net/docs

Système de vote pour élire le meilleur chanteur


Attribution de points dans le groupe


Classement interne au groupe. Algorithme / IA de playlists
On prévoit un module de recommandation de playlists basé sur plusieurs signaux simples et utiles en soirée. Les propositions peuvent varier selon le genre musical choisi, selon les écoutes récentes, et selon les notes ou votes donnés par les utilisateurs du groupe, afin d’adapter la musique à l’ambiance en temps réel, il sera possible d’utiliser l'intelligence artificielle pour générer des playlist en fonction de nos genre ou goût musicaux.
6.2. Blind test
Le blind test peut fonctionner en mode aléatoire, c’est-à-dire en sélectionnant des musiques parmi l’ensemble des titres disponibles. Il est également possible de choisir un blind test aléatoire en fonction d’un genre (par exemple rap US) grâce à un système de filtres. On peut aussi sélectionner des musiques selon leur année de sortie, comme les titres sortis en 2025.
Les blind tests peuvent également être créés par un membre du groupe, qui sélectionne les morceaux de son choix, à partir de ses propres playlists, d’une playlist publique ou de son compte personnel.
Le principe est simple : le premier à écrire le bon titre (ou le bon artiste) remporte des points. Une variante en présentiel (IRL) est aussi proposée : les utilisateurs peuvent attribuer les points eux-mêmes ou choisir de jouer sans système de points, afin d’éviter que tout le monde reste constamment sur son téléphone.
6.3. Playlists collaboratives
Les playlists collaboratives sont liées à une soirée, et donc à un groupe précis. Elles sont pensées comme une playlist d’événement : tout le monde y contribue.

Les participants peuvent ajouter des titres à la playlist pendant la session via une recherche intégrée. Pour éviter le désordre, l’ajout peut être encadré par des règles simples : nombre maximum d’ajouts par personne sur une période donnée, pas de doublons possible et la possibilité pour le créateur de la playist de retirer un titre.
Un système de vote est mis en place pour prioriser les titres : ça peut être positif ou négatif, il y'a un classement automatique en fonction du score. Les morceaux les plus votés positivement remontent dans la playlist, tandis que ceux qui reçoivent trop de votes négatifs sont retirés à partir d'un certain nombre de votes (selon les paramètres du groupe). L’affichage doit être clair pour tout le monde : score visible, nombre de votes, et éventuellement qui a ajouté le titre (avec option d’anonymisation si souhaité).
6.4. Mini-jeux musicaux
L’application propose des mini-jeux en temps réel, basés sur la rapidité, la réactivité et l’attention des participants. Une partie dure en moyenne cinq minutes, ce qui permet d’enchaîner facilement plusieurs manches sans casser le rythme d’une soirée. Les jeux sont pensés pour être simples à comprendre, accessibles en quelques secondes, et jouables même par des personnes qui ne sont pas expertes en musique.

Les manches se lancent directement depuis le groupe, avec un compte à rebours commun et des interactions synchronisées. Des points sont attribués aux participants en fonction des performances (bonne réponse, rapidité, séries de bonnes réponses), et un classement visible dans le groupe permet de garder une dynamique de compétition légère. À la fin de chaque manche, un récapitulatif affiche les résultats, les meilleurs scores et éventuellement des statistiques amusantes (temps de réponse moyen, nombre de bonnes réponses, progression par rapport aux manches précédentes).

Pour favoriser l’engagement, l’application peut proposer des variations et des niveaux de difficulté (facile/normal/difficile), des thèmes (années 80, rap, pop, rock, bandes originales, etc). Les mini-jeux doivent aussi rester équilibrés : limiter l’avantage des joueurs qui jouent beaucoup, et encourager la participation de tout le monde par exemple des bonus de rattrapage.

Enfin, un point important côté expérience : la navigation et l’animation des mini-jeux doivent rester fluides, avec des retours visuels clairs (validation de réponse, temps restant, score en direct), et une tolérance raisonnable aux latences réseau afin d’éviter les frustrations.

7. Plateforme et interface
7.1. Approche Mobile First et PWA
Le projet WEMIIX est fondamentalement conçu comme une application web, mais avec une orientation stratégique forte vers le mobile first. Cette approche est justifiée par le contexte d'utilisation principal : les soirées et événements, où l'accès se fera majoritairement via un smartphone. Pour optimiser l'expérience utilisateur mobile, nous développerons une Progressive Web App (PWA). Ce choix technologique permettra d'offrir une expérience proche d'une application native (accès hors ligne, ajout à l'écran d'accueil, notifications) tout en conservant la facilité de déploiement et l'accessibilité du web.
7.2. Conception de l'Interface Utilisateur (UI)
L'interface utilisateur sera un point clé de la réussite. Elle devra impérativement rester simple et claire, pour permettre une navigation intuitive, même dans des environnements potentiellement peu propices à la concentration (comme une soirée animée). Cependant, l'esthétique générale se doit d'être festive et engageante pour correspondre à l'ambiance du projet.
7.3. Exigence de Compatibilité
La compatibilité est une exigence non négociable. L'application devra fonctionner sans accroc avec les principaux navigateurs web (Chrome, Safari, Firefox, Edge) sur tous les systèmes d'exploitation mobiles et de bureau, afin d'éviter tout problème d'accès ou de fonctionnalité pour les utilisateurs.
7.4. Accessibilité : Un Pilier de la Conception
L'accessibilité est au cœur de notre démarche éthique et de conception. Nous visons une accessibilité complète pour toutes les personnes, sans exception. Cela se traduit par une attention particulière au responsive design, garantissant que l'application s'affiche et fonctionne parfaitement sur tablettes, ordinateurs et téléphones.
7.5. Paramètres d'Accessibilité Avancés
De plus, l'interface utilisateur intégrera des paramètres d'accessibilité avancés pour répondre aux besoins spécifiques :
Personnes malvoyantes : Mise en place de descriptions alternatives (alt-text) complètes pour toutes les images et éléments graphiques non textuels, permettant l'utilisation aisée avec des lecteurs d'écran.
Ajustements visuels : Les utilisateurs auront la possibilité de modifier la taille du texte pour une meilleure lisibilité.
Aide aux daltoniens : Une palette de couleurs adaptative sera proposée. Les utilisateurs pourront choisir entre des schémas de couleurs plus ou moins flashy ou contrastés, garantissant que les informations essentielles ne dépendent pas uniquement de la perception des couleurs. Le contraste entre le texte et l'arrière-plan sera également optimisé pour respecter les normes d'accessibilité (WCAG).
Chorégraphie : Un nouveau mini jeux dans l’univers de just dance mais avec les musique de l’on aime pour plus de dynamisme dans nos soirée

8. Modèle économique
Le modèle économique adopté pour PROJET WEMIIX est le freemium, une stratégie éprouvée combinant gratuité et offre premium.
8.1. Version Gratuite :
La version de base de WEMIIX sera accessible gratuitement à tous les utilisateurs. Elle donnera accès à l'ensemble des fonctionnalités de base de la plateforme, permettant une utilisation complète et pertinente pour les besoins essentiels. Pour soutenir cette gratuité et les coûts d'infrastructure, cette version sera financée par des publicités discrètes et non intrusives, assurant une expérience utilisateur agréable tout en générant des revenus.
8.2. Version Premium (Abonnement) :
Pour les utilisateurs souhaitant une expérience optimisée et des outils plus puissants, une version premium sera disponible via un abonnement mensuel de 5 €. Cet abonnement offre des avantages significatifs :
Suppression des Publicités : L'expérience utilisateur est entièrement dénuée de toute interruption publicitaire.
Déblocage de Fonctionnalités Avancées : Le premium donne accès à des outils et options supérieurs, notamment :
Options liées à l’Intelligence Artificielle (IA) : Accès à des algorithmes d'IA plus sophistiqués pour l'analyse, la recommandation ou la création de contenu (selon la nature exacte de WEMIIX).
Personnalisation Poussée : Options étendues pour l'interface, les thèmes, les tableaux de bord et la configuration des outils, permettant aux utilisateurs d'adapter l'environnement WEMIIX à leurs flux de travail spécifiques.
Ce modèle vise à maximiser l'adoption grâce à la version gratuite tout en fidélisant une base d'utilisateurs payants grâce à la valeur ajoutée des fonctionnalités avancées et à l'expérience sans publicité..
9. Technologies envisagées
Frontend : NEXT.js
Backend : JAVA
Base de données : PostgreSQL, MongoDB


Authentification via Spotify/Deezer/Apple Music/Amazon Music (OAuth) et better auth
API SPOTIFY (https://developer.spotify.com/documentation/web-api) 
Récupération des paroles (pour le karaoké)
Gratuit (https://lrclib.net/docs) au cas ou si on trouve pas les paroles avec le premier
https://github.com/tranxuanthang/lrclib 
Choix (https://lyricsovh.docs.apiary.io/#reference/0/lyrics-of-a-song) https://lyrics.ovh 

9.1 Frontend
Le frontend sera développé avec Next.js afin d’offrir une interface rapide et fluide, adaptée à un usage mobile et à des interactions en temps réel pendant les soirées. Ce choix facilite aussi le déploiement web (type PWA) et l’évolution du produit avec un socle moderne et maintenable.

9.2 Backend
Le backend sera développé en Java, pour assurer une logique métier solide et centraliser la gestion des groupes, des sessions, des scores, des votes et des règles anti-abus. L’objectif est d’avoir une API fiable et sécurisée, capable de supporter des connexions simultanées et des échanges en direct.

9.3 Base de donnée 
La base de données principale sera PostgreSQL, utilisée pour stocker les données structurées (utilisateurs, groupes, rôles, paramètres, résultats, etc.). MongoDB pourra être utilisé en complément si certains besoins apparaissent plus tard, notamment pour des données plus flexibles ou des contenus évolutifs (configurations de jeux, statistiques, événements), mais ce n’est pas indispensable au MVP.

9.4 Authentification et services musicaux
L’authentification pourra s’appuyer sur une solution comme Better Auth pour gérer les sessions, la connexion et les providers, avec une attention particulière à la sécurité des sessions. En parallèle, WeMiix prévoit la connexion aux services musicaux via OAuth (Spotify, Deezer, Apple Music, Amazon Music) afin de permettre l’accès aux fonctionnalités liées à la lecture, à la recherche et à la gestion de playlists, selon les possibilités de chaque plateforme.

9.5 API
L’intégration Spotify se base sur la Spotify Web API, qui sert à récupérer les informations nécessaires à l’expérience WeMiix (recherche de titres, ajout à une playlist, etc.). Les autres services musicaux pourront être intégrés progressivement, en gardant une logique commune côté application pour éviter de multiplier des comportements différents selon la plateforme.

9.6 Paroles pour le karaoké
Pour le module karaoké, WeMiix prévoit une récupération des paroles via une première API de paroles, et une solution de secours en cas d’indisponibilité ou d’absence de résultats. LRCLIB est envisagé comme option gratuite possible, et lyrics.ovh comme alternative, afin d’améliorer la couverture et la fiabilité de la fonctionnalité.


10. Sécurité et données
La séparation entre le contenu destiné aux enfants et aux adultes doit être stricte pour éviter tout contournement. Cela implique des règles d’accès distinctes selon le mode, des paramètres plus protecteurs par défaut en mode enfant par exemple une visibilité réduite, des interactions limitées, le filtrage des musiques explicites, désactivation ou restriction des fonctionnalités sensibles), et une isolation claire des parcours et des écrans afin d’éviter qu’un utilisateur puisse basculer vers le mode adulte sans contrôle. Les éléments adultes ne seront pas disponibles via une simple manipulation de lien, d’URL ou de paramètres.

Au niveau de la conformité au RGPD, WeMiix prévoit une adresse mail de support dédiée pour exercer les droits (accès, rectification, suppression/effacement, opposition, limitation et, lorsque applicable, portabilité). Les demandes sont enregistrées, traitées dans les délais légaux (en principe sous un mois, avec possibilité de prolongation si la demande est complexe). Enfin, l’application applique les principes de minimisation et de privacy by default : seules les données nécessaires au service sont collectées, la conservation est limitée (notamment pour les données de session/soirée), et les utilisateurs disposent de paramètres simples pour gérer leurs informations et supprimer leur compte ou leur historique le cas échéant.

11. Évolutions possibles
Ce chapitre est consacré à l'exploration des évolutions potentielles et imaginables destinées à perfectionner l'application et l'expérience utilisateur.
11.1. Élargissement des Sources Musicales
À l'heure actuelle, le système est principalement conçu autour d'une intégration native avec Spotify. Cependant, une expansion progressive et stratégique des sources musicales est envisagée comme une évolution naturelle et nécessaire pour maximiser l'accessibilité et l'attractivité du service. L'objectif à long terme est d'intégrer de manière transparente les plateformes majeures du marché, permettant ainsi aux utilisateurs de WEMIIX d'utiliser leur service de streaming préféré sans friction.
Cette feuille de route inclut l'ajout progressif des plateformes suivantes :
Apple Music : Pour capter les utilisateurs de l'écosystème Apple.
Deezer : Essentiel pour le marché européen et les utilisateurs fidèles à cette plateforme.
YouTube Music : Crucial pour l'accès à un catalogue de vidéos et de contenus souvent introuvables ailleurs.
Amazon Music : Ciblant la base d'abonnés Amazon Prime.
Tidal : Pour les audiophiles recherchant une qualité sonore supérieure (Hi-Fi).
Autres sources spécifiques : Éventuellement SoundCloud ou Bandcamp pour des genres musicaux de niche ou des artistes indépendants.
11.2. Développement d'une Application Mobile Native
Afin d'optimiser l'expérience utilisateur, d'assurer une meilleure performance et de profiter des fonctionnalités spécifiques des systèmes d'exploitation (notifications, accès hors ligne), le développement d'une application mobile native (iOS et Android) est une amélioration stratégique envisagée.
Cette application permettrait de :
Améliorer la Rétention d'Utilisateur : Une expérience plus fluide et dédiée encourage une utilisation régulière et prolongée.
Acquisition de Nouveaux Utilisateurs : La présence sur les stores (App Store et Google Play) augmente la visibilité et la découvrabilité du service.
Fonctionnalités Spécifiques : Intégration potentielle de la réalité augmentée, de l'accès facilité aux playlists de la plateforme mobile, et d'une meilleure gestion des sessions de jeu.Le développement de cette application native (mobile) offrirait les avantages suivants :
11.3. Enrichissement du Catalogue de Mini-Jeux
L'évolution la plus prometteuse réside dans l'expansion du catalogue de mini-jeux. L'approche adoptée est celle d'un socle technique commun modulaire. Ce socle sera conçu pour accueillir de nouveaux jeux comme des "modules" indépendants, ce qui garantira une évolutivité rapide et une maintenance simplifiée.
Le cadre technique commun couvrira les aspects fondamentaux suivants pour chaque nouveau jeu :
Gestion de Lobby : Création, invitation, configuration des paramètres de jeu.
Lancement Synchronisé : Démarrage simultané pour tous les participants.
Système de Timer : Gestion du temps de réponse et de la durée des manches.
Mécanisme de Scoring : Attribution des points selon des règles prédéfinies.
Anti-Triche Léger : Pour assurer l'équité de la compétition.
Affichage des Résultats : Classement final et statistiques de la partie.
Une fois ce cadre établi, le catalogue pourra être enrichi sans avoir de problème technique et donc l'implantation des mini-jeux pourra se faire simplement. Une fois ce cadre défini, le catalogue pourra être étoffé sans entraîner de problème technique, simplifiant ainsi l'implémentation des mini-jeux.
11.4. Implémentation de Statistiques Avancées
pour révéler les profils musicaux dominants du groupe. L'intégration de Statistiques avancées est essentielle pour dynamiser l'engagement et offrir une réelle valeur ajoutée aux utilisateurs. Ces données seront disponibles à deux niveaux : individuel et groupal. Les objectifs et avantages sont de Stimuler l'engagement et la discussion grâce à l'ajout de statistiques concrètes et ludiques qui favoriseront la création de sujets de conversation, encourageant les compétitions amicales et les échanges entre utilisateurs, et de Valoriser la performance et encourager la compétition car ces indicateurs permettront de reconnaître les meilleurs joueurs et d'intensifier la rivalité saine. 
Les exemples de Statistiques Clés pour les Statistiques Individuelles incluent le taux de réussite global par genre, la précision moyenne au blind test, l’artiste le plus souvent deviné, le nombre de parties jouées et le score moyen. 
Pour les Statistiques groupées, seront enregistrés le classement historique du groupe, le genre musical d'excellence du groupe, les records de score en équipe et les statistiques de l'activité « Qui serait le plus probable d’écouter ce titre ? » (afin d'identifier les profils musicaux dominants).


12. Organisation de l’équipe
Pour assurer une gestion efficace du code source et un suivi rigoureux des tâches au sein de l'équipe, nous avons opté pour l'utilisation de Git comme système de contrôle de version et de GitHub comme plateforme d'hébergement des dépôts et d'outillage pour la gestion de projet. Cette combinaison nous permet de garantir une traçabilité complète des modifications, de faciliter la collaboration par des pull requests et des revues de code, et de structurer le travail grâce aux fonctionnalités de Issues pour la gestion des tâches.

Concernant la communication, l'équipe a établi un groupe Discord dédié exclusivement au projet WEMIIX. Ce canal centralisé sert de point de rencontre pour les discussions rapides, les annonces importantes, les sessions de brainstorming et la résolution de problèmes en temps réel, garantissant ainsi une fluidité et une réactivité maximales.

La répartition des tâches est effectuée en tenant compte des compétences spécifiques de chaque membre de l'équipe. Cette approche, axée sur l'adéquation entre la difficulté de la tâche et l'expertise individuelle, maximise l'efficacité et la qualité du travail produit. Cependant, cette spécialisation n'empêche en rien l'entraide : un principe fondamental de notre collaboration est que chaque personne se tient disponible pour apporter son aide au reste de l'équipe, que ce soit par du mentorat, de l'assistance technique ou du pair-programming.

De surcroît, toute question considérée comme importante ou stratégique pour l'évolution du projet, qu'elle concerne l'architecture technique, les choix de design, ou la planification des fonctionnalités, est systématiquement discutée en amont et de manière collégiale. Cette démarche préventive assure un alignement constant de toute l'équipe sur les objectifs et les méthodes, minimisant ainsi les risques de malentendus ou de déviations tardives.




13. Infrastructure
L'infrastructure étant un pilier fondamental du projet, nous devons accorder une attention particulière à sa préparation. C'est dans cette optique que nous avons défini plusieurs étapes et concepts clés à mettre en œuvre.
13.1 Hébergement & réseau
L’hébergement doit garantir une latence faible (temps réel), une bonne disponibilité, et la possibilité de monter en charge lors des pics (soirées). Une approche “cloud-ready” convient bien : un front statique/PWA servi via CDN, et une API + temps réel derrière un point d’entrée unique (reverse proxy / load balancer). Vous pouvez viser un fournisseur unique (ex. OVHcloud ou Amazon Web Services) et poser une base qui reste portable.

13.2 Contrôle d’accès
Le contrôle d’accès doit être strict et reposer sur une gestion des identités et des permissions au moindre privilège, avec une séparation claire des rôles (développement, exploitation, administration) afin de limiter les risques d’erreur ou d’abus. Les accès d’administration doivent être restreints via une white liste d’adresses IP, pour éviter toute exposition inutile. Les bases de données et services internes ne doivent en aucun cas être accessibles directement depuis Internet et doivent rester isolés sur un endroit privé.

13.3 Mise en place d’un pare-feu
Le réseau doit être durci pour réduire la surface d’attaque et protéger l’application contre les abus notamment en mettant en place un pare-feu, des protections contre le DDoS, et des mécanismes de limitation de trafic. En cas de comportements suspects, l’infrastructure doit savoir limiter les connexions simultanées par adresse IP et appliquer des règles de firewall qui n’ouvrent que les ports strictement nécessaires.
13.4 Configuration des sauvegardes
Les sauvegardes doivent être automatisées et testées régulièrement afin de garantir qu’une restauration est réellement possible en cas d’incident, et un plan de reprise d’activité doit être défini avec des objectifs réalistes de continuité (RPO/RTO). On doit éviter au maximum la perte des données les plus importantes.
13.5 Traçabilité des logs
Les logs doivent permettre de tracer les accès administration, toutes les actions des utilisateurs et des changements de configuration, avec une conservation encadrée et une centralisation des logs pour faciliter les investigations. Des alertes doivent être configurées sur les comportements anormaux (notamment un pics d’activité, changements de permissions, accès inhabituels, hausse soudaine des erreurs), de manière à détecter rapidement un incident et à réagir avant qu’il n’impacte les utilisateurs.

