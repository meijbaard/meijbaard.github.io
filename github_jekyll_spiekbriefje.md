# 🔧 GitHub + Jekyll Spiekbriefje

## 📥 Wijzigingen van GitHub ophalen
```bash
git fetch origin
git pull --rebase origin main   # of: master
```

## ✍️ Wijzigingen lokaal committen & pushen
```bash
git add .                        # voeg alle wijzigingen toe
git commit -m "Korte omschrijving van je wijziging"
git push origin main             # of: master
```

## 🌐 Je site lokaal draaien
```bash
bundle exec jekyll serve
# → open http://localhost:4000
```

## 📦 Gems bijwerken (alleen als nodig)
```bash
bundle update github-pages
```

## 🔒 Ruby-versie vastzetten (eenmalig)
```bash
echo "3.2.4" > .ruby-version
git add .ruby-version
git commit -m "Pin Ruby version to 3.2.4"
```

---

💡 **Tip:** Altijd `bundle exec` gebruiken voor Jekyll-commando’s, dan ben je zeker dat de juiste versies van gems gebruikt worden.
