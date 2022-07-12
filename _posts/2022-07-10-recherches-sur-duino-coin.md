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

### Premières recherches de vulnérabilités

#### La fonction Math.random() 

Un premier aspect qui m'a interressé est la génération de nombres aléatoires.
En effet lorsque l'on génère un nombre aléatoire en informatique il n'est jamais réellement aléatoire (cf [Wikipedia](https://fr.wikipedia.org/wiki/G%C3%A9n%C3%A9rateur_de_nombres_al%C3%A9atoires)).


<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">Earlier in the <a href="https://twitter.com/DuinoCoin?ref_src=twsrc%5Etfw">@DuinoCoin</a> saga, I reported an RNG state recovery vuln in their mining protocol. They responded by banning me from their discord server.<a href="https://twitter.com/CryptoHack__?ref_src=twsrc%5Etfw">@CryptoHack__</a> user someone12469 has implemented an exploit for this, and currently controls &gt;95% of the mining hashrate. <a href="https://t.co/3BNuVJML0W">pic.twitter.com/3BNuVJML0W</a></p>&mdash; David Buchanan (@David3141593) <a href="https://twitter.com/David3141593/status/1445361492979851267?ref_src=twsrc%5Etfw">October 5, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


