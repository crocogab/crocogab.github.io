# crocogab.github.io

Site perso (portfolio, CV, blog) construit avec [Hugo](https://gohugo.io), déployé sur GitHub Pages par `.github/workflows/hugo.yml` à chaque push sur `main`.

## Écrire un article

```bash
hugo new content writeups/mon-ctf/challenge.md   # ou recherche/…
hugo server -D                                    # aperçu sur http://localhost:1313 (brouillons inclus)
```

Front matter utile : `title`, `date`, `tags`, `description`, `draft: true` (non publié), `toc: true` (sommaire).
Pour une série ordonnée (comme Nebula) : `weight` sur chaque page, `series: "…"`, et `order: weight` dans le `_index.md` de la section.

## Où modifier quoi

- Infos perso et liens : `hugo.toml` (`[params]`, menu)
- CV : `content/a-propos.md`
- Projets : `data/projets.toml`
- Thème : `layouts/`, `assets/css/main.css`
