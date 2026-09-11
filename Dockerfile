# markeijbaard.nl — publicatie-image
#
# Dit image bevat de al gebouwde site, niets meer. De Jekyll-build draait in
# GitHub Actions (.github/workflows/build-jekyll.yml) en levert ./_site op;
# hier wordt dat resultaat in een nginx gezet.
#
# Gevolg: `docker build` werkt alleen als ./_site bestaat. Op een verse clone is
# die map er niet — dat is geen fout in dit bestand, dan moet er eerst gebouwd
# worden. Actions doet dat in de stap vóór deze.
#
# Versie bewust vastgezet: geen 'latest' op de server, conform de serverregels.
#
# Dit bestand bevat met opzet geen RUN-instructie. Daardoor hoeft buildx niets
# uit te voeren en kan het image voor meerdere architecturen tegelijk worden
# samengesteld zonder emulatie. De nginx-configuratie wordt in de workflow
# gecontroleerd, in een aparte stap die wel native draait.
FROM nginx:1.30.4-alpine

# Eigen serverblok in plaats van de standaard default.conf van het image.
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# De gebouwde site.
COPY _site/ /usr/share/nginx/html/

LABEL org.opencontainers.image.title="markeijbaard.nl" \
      org.opencontainers.image.description="Statische Jekyll-site van Mark Eijbaard, uitgeleverd door nginx" \
      org.opencontainers.image.source="https://github.com/meijbaard/meijbaard.github.io" \
      org.opencontainers.image.licenses="MIT"

EXPOSE 80
