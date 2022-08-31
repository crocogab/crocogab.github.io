## Writeup JSON WebToken (JWT) - Introduction-Rootme

Le challenge est disponible à l'adresse suivante : https://www.root-me.org/fr/Challenges/Web-Serveur/JSON-Web-Token-JWT-Introduction

Description : Pour valider le challenge, connectez vous en tant qu’admin.

---

## Compréhension

Grâce au titre il est assez facile à comprendre que le challenge portera sur les token JWT.
Un token JWT permet un échange sécurisé entre plusieurs parties et cela se traduit par une vérification de l'intégrité des donnes grace à l'algorithme HMAC ou RSA.


---

## Structure d'un token JWT

Un token JWT se décompose en 3 parties: 
- Un Header : une entête contenant l'algorithme de chiffrement 
- Un payload : une partie contenant des paramètres et des données. C'est cette partie qui contient les informations sensibles et importantes.
- Une signature : contient une signature encryptée qui assure l'authenticité des données.

![Structure d'un token JWT](/img/jwt.png)

---

## Le challenge

Une fois le challenge démarré on arrive sur une page de connexion.

![Login Page](/img/challenge.PNG)

Sahant que le challenge porte sur les tokens JWT je commence par regarder dans mon navigateur si je possède déjà un token JWT.

Or rien ce n'est pas le cas comme on peut le voir sur l'image suivante.

![Token](/img/token.PNG)

Une information attire mon attention :  il est possible de se connecter en tant qu'invité !

Une fois cette potion cliquée on obtient instantanément un token JWT.

On obtient le token JWT suivant: 

`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imd1ZXN0In0.OnuZnYMdetcg7AWGV6WURn8CFSfas6AQej4V9M13nsk`

Grâce au site https://jwt.io/ il est possible de lire et décoder un token JWT.

Une fois le token entré on obtient les informations suivantes :

![Token decoded](/img/decoded.PNG)

On comprend alors que le but du challenge va être de changer la valeur de username de 'guest' à 'admin'.

De plus le site nous avertit car la signature n'est pas valide. Il s'agit d'une erreur grave qui va nous permettre de contourner la sécurité de ce token.

![Signature](/img/signature.PNG)

L'attaque la plus simple pouvant être utilisée contre un token JWT consiste à supprimer l'algorithme de sécurité et de manipuler les données à notre guise.

Mais comment cela-est-il possible ?

Les tokens JWT sont encodés en base64 c'est à dire qu'il est reès facile de les décoder.

C'est pour cela que si l'on copie le token sur cyberchef on obtient: 

![Token decoded](/img/cyberchef.PNG)

La 1ère partie contient le type d'algorithme utilisé, la 2ème partie le payload et enfin la 3ème partie la signature du token.

Imaginons qu'à la place de l'algorithme nous entrions la valeur `none` et que nous supprimions la signature du token. Si celui-ci n'est pas bien programmé nous pourrions alors changer les données car aucune sécurité ne serait en place.

Essayons de faire cela:

`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9 = {"typ":"JWT","alg":"HS256"}` (décodé de base64)

On change maintenant l'algorithme en `none`

`eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0 = {"typ":"JWT","alg":"none"}`

On vient aussi changer les données du payload :

`eyJ1c2VybmFtZSI6Imd1ZXN0In0 = {"username":"guest"}`

Changeons `guest` pour `admin` :

`eyJ1c2VybmFtZSI6ImFkbWluIn0 = {"username":"admin"}`

Nous supprimons la signature car nous n'utilisons pas d'algorithme pour vérifier l'authenticité des données.

On obtient alors le token JWT suivant : `eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJ1c2VybmFtZSI6ImFkbWluIn0`

Si on vient changer sa valeur dans le navigateur et qu'on actualise la page.

![New Token](/img/changed.PNG)

On obtient le flag :)

![Flag](/img/flag.PNG)

Ce challenge était vraiment simple mais il nous permettait de comprendre le fonctionnement basique d'un challenge JWT.

Merci d'avoir lu :)
