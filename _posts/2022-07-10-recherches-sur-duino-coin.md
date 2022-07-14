## Premières recherches sur DuinoCoin ᕲ 

Tout d'abord c'est quoi DuinoCoin ? 

DuinoCoin est une crypto qui se veut de pouvoir être minée par tous et "éco responsable".

Le but de cette crypto est de pouvoir être minée par tous, sur n'importe quel appareil et d'être accessible aux débutants.

---

### Mining et récompenses

#### Fonctionnement des pools

Le fonctionnement des pools est assez simple à comprendre.
Un mineur se connecte à la pool et demande un `job` , la pool analyse le type d'appareil connecté et renvoie un `job` contenant deux hash et une difficulté sous cette forme `hash1,hash2,difficulté`.

![Pool fonctionnement](/img/test1.png)

Le hash 1 est le hash originel donné par la pool, le hash 2 est le hash recherché par le mineur et la difficulté donne le niveau de difficulté du hash.

Pour miner il suffit de bruteforcer toutes les nombres entre `0` et `difficulté*100+1` 

Lorsque hash 1 et hash 2 sont identiques, le mineur renvoie son resultat et se voit attribuer une récompense.

```python 
for result in range(int(diff)*100+1): # test des possibilités
    temp_hash = base_hash.copy() #on copie le hash original
    temp_hash.update(str(result).encode('ascii')) #auquel on ajoute le nombre actuel
    ducos1 = temp_hash.hexdigest()

    if hash_searched ==ducos1: # si le hash cherché est le même que le hash généré alors on a trouvé
        print('Found hash key:',result) 
```

Le fonctionnemment des pools est assez basique. De plus il est impossible de miner en solo on est obligé de demander un job à l'un des serveurs principaux.

#### Les récompenses

Le système de récompense lui est plus complexe, il est propre à ce coin et a été créé pour récompenser les mineurs qui polluent le moins, autrement dit les mineurs qui minent le moins vite de plus, la difficulté du travail dépend du type de miner ⇒ PC / AVR / ESP.

Ce système s'appelle *Kolka* et les récompensent dépendent :
- Du **hashrate** ⇒ plus il est bas plus les récompenses sont importantes
- Du **temps de travail** ⇒ plus il est long plus les récompenses sont importantes
- Du **nombre de hash résolus** ⇒ plus il y a de hash résolus plus les récompenses sont importantes
- De **la difficulté** ⇒ plus elle est grande plus les récompenses sont importantes
- De **l'aléatoire** ⇒ permet d'équilibrer le système de récompense lié à l'aléatoire

De plus le système ajuste la difficulté des `jobs` en fonction du temps prévu pour résoudre le hash et du temps mis.

---

### **Premières recherches de vulnérabilités**

#### La fonction Math.random() 

Un premier aspect qui m'a interressé est la génération de nombres aléatoires.
En effet lorsque l'on génère un nombre aléatoire en informatique il n'est jamais réellement aléatoire (cf [Wikipedia](https://fr.wikipedia.org/wiki/G%C3%A9n%C3%A9rateur_de_nombres_al%C3%A9atoires)).
De plus il existe en informatique 2 types de générateurs de nombres aléatoires :
- **Le générateur de nombres pseudos-aléatoires** ⇒ il génère des nombres pseudos-aléatoires. Ce n'est pas un probleme mais **IL NE DOIT ABSOLUMENT PAS ÊTRE UTILISE DANS UN CADRE CRYPTOGRAPHIQUE CAR SA GENERATION PEUT ÊTRE PRÉDITE**
- **Le générateur de nombres aléatoires cryptographique** ⇒ il génère des nombres réellements aléatoires. Il est certes plus lent mais il peut être utilisé en cryptographie.

Dans le cadre d'une crypto monnaie  il est donc essentiel d'utiliser le deuxième générateur.

Or d'après le thread twitter suivant il semblait que les précédentes versions de duinoCoin utilisaient la fonction math.random() pour générer des nombres aléatoires.
Or celle ci n'est pas cryptographique et donc possible à prédire.

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">Earlier in the <a href="https://twitter.com/DuinoCoin?ref_src=twsrc%5Etfw">@DuinoCoin</a> saga, I reported an RNG state recovery vuln in their mining protocol. They responded by banning me from their discord server.<a href="https://twitter.com/CryptoHack__?ref_src=twsrc%5Etfw">@CryptoHack__</a> user someone12469 has implemented an exploit for this, and currently controls &gt;95% of the mining hashrate. <a href="https://t.co/3BNuVJML0W">pic.twitter.com/3BNuVJML0W</a></p>&mdash; David Buchanan (@David3141593) <a href="https://twitter.com/David3141593/status/1445361492979851267?ref_src=twsrc%5Etfw">October 5, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Après des recherches pour savoir si cette fonction était toujours utilisée par Duinocoin je suis tombé sur le code source d'une pool Duinocoin :

```javascript
const getRand = (max) => {
    try {
        return crypto.randomInt(max); // cette fonction est cryptographique
    } catch (err) {
        console.log(err);
        return Math.floor(Math.random() * max);
    }
}
```
On voit bien ici qu'il s'agit bien cette fois d'une focntion cryptographique. 
Cet exploit n'est donc plus possible. 

---

### **Deuxième aspect de recherches**

#### L'émulation d'appareil

En effet imaginons qu'à la place d'utiliser notre PC pour miner nous simulions d'autres mineurs moins puissants. Notre rendement se verrait alors grandement augmenté.

On peut aisément représenter cela par le schéma qui suit.

![Emulation](/img/test2.png)

Pour pouvoir faire cela il faut s'interesser au fichier python permettant le minage.

Pour cela je vais essayer de comprendre comment fonctionne le fichier `Minimal_PC_Miner.py`

Tout d'abord miner récupère l'***IP*** et le ***PORT*** grâce aux lignes 35 à 39.

```python
response = requests.get(
                "https://server.duinocoin.com/getPool"
            ).json() #récupère la pool grâce à l'API de duinocoin
NODE_ADDRESS = response["ip"] # on obtient l'IP
NODE_PORT = response["port"] # puis le port
```

Ensuite on se connecte à la pool grâce à la librairie socket.
Lors de la connection le serveur envoie la version de son logiciel.
Le code suivant en montre le fonctionnement :

```python
soc.connect((str(NODE_ADDRESS), int(NODE_PORT))) #se connecte à la pool
print(f'{current_time()} : Fastest connection found') #debug
server_version = soc.recv(100).decode() #récupère la version du serveur
print (f'{current_time()} : Server Version: '+ server_version)#debug
```
On arrive ensuite sur la partie intéressante : **la fonction de minage**.

Le code est vraiment facile à comprendre :
```python
while True:
    if UseLowerDiff: # si la difficulté est faible
        # envoie la requête demandant un job
        soc.send(bytes(
            "JOB,"
            + str(username)
            + ",LOW," # difficulté du job
            + str(mining_key),
            encoding="utf8"))
    else:
        # envoie la requête demandant un job
        soc.send(bytes(
            "JOB,"
            + str(username)
            + ",MEDIUM,"  # difficulté du job
            + str(mining_key),
            encoding="utf8"))
```
Il s'agit donc du client qui fait une demande de `job` au serveur.
Cette demande se fait sous la forme de `bytes` (car on utilise des sockets).
La demande est sous la forme type suivante : `JOB,username,difficulty,mining_key`.

Ce à quoi le serveur réponds par : `hash1,hash2,difficulté` (cf [explication](#Fonctionnement-des-pools))

Mais il ne s'agit ici que du mineur PC, et nous ne savons pas comment fonctionne le mineur arduino.
Quelle requête est envoyée au serveur lorsqu'il s'agit d'un arduino ?
Notre réponse se trouve aux lignes 655/656 du fichier `Esp32_Code.ino`
```ino
jobClient.print("JOB," + String(DUCO_USER) + ",ESP32," + String(MINER_KEY) + "," +
                        String(temp.temperature) + "@" + String(hum.relative_humidity) +  MSGNEWLINE);
```
La structure de la requête est la même qu'en python sauf qu'à la place de la difficulté on a : `ESP32`

Voyons voir si en changeant cela dans notre requête python la difficulté change, ce qui signifierait que le serveur nous considère comme un arduino.

On commence par tester notre mineur comme si on était un PC :

```python
from socket import socket
import requests


soc = socket()

response = requests.get(
                "https://server.duinocoin.com/getPool"
            ).json()
NODE_ADDRESS = response["ip"]
NODE_PORT = response["port"]

soc.connect((str(NODE_ADDRESS), int(NODE_PORT)))
server_version = soc.recv(100).decode()
print(server_version)

soc.send(bytes(
                    "JOB,"
                    + str('crocogab')
                    + ",LOW,"
                    + str('crocogab'),
                    encoding="utf8"))

job = soc.recv(1024).decode().rstrip("\n")
print(job)

>>>3.0
>>>874c201bb638b0c33d5e00d32dbb73bd60e4487b,f8ee59a0e57264b2e531158bb1f12126c6188123,25000
```
On voit bien ici que la difficulté est de `25000`.
Maitenant changeons la difficulté dans la requête.
Le code est identique sauf à la ligne `19`. On obtient le code suivant :

```python
from socket import socket
import requests


soc = socket()

response = requests.get(
                "https://server.duinocoin.com/getPool"
            ).json()
NODE_ADDRESS = response["ip"]
NODE_PORT = response["port"]

soc.connect((str(NODE_ADDRESS), int(NODE_PORT)))
server_version = soc.recv(100).decode()
print(server_version)

soc.send(bytes(
                    "JOB,"
                    + str('crocogab')
                    + ",ESP32," # CHANGEMENT ICI
                    + str('crocogab'),
                    encoding="utf8"))

job = soc.recv(1024).decode().rstrip("\n")
print(job)

>>>3.0
>>>18aea142ebd5aabcf309cb66149e2c8b0d07d75a,55df133b7e1f2f43054537b622644e8e32954926,1500
```
De plus la difficulté a été changé on est passé à `1500` ce qui signifie que le serveur nous considère comme un arduino.
Essayons maitenant de miner quelques bloc pour voir si le web wallet nous considère bien comme un arduino.
Pour cela il nous faut aussi changer la requête pour envoyer le résultat.

```python
soc.send(bytes(
                        str(result)
                        + ","
                        + str(hashrate)
                        + ",ESP32", # et non pas PC
                        encoding="utf8"))
```

Et cela fonctionne !

![Resultats](/img/test3.png)
![Resultats](/img/test4.png)

Malheureusement l'accuracy tends vers 50% et je ne sais pas pourquoi.
