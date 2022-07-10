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

``` 
for result in range(int(diff)*100+1): # test des possibilités
    temp_hash = base_hash.copy()
    temp_hash.update(str(result).encode('ascii'))
    ducos1 = temp_hash.hexdigest()

    if hash_searched ==ducos1:
        print('Found hash key:',result) 
```


