# Deploy the Angular Client to github.io

1. git clone https://github.com/mrstefangrimm/opteamate.git
1. git checkout -b docs
1. cd OpteaMate/ClientApp/
1. npm install
1. ng build --configuration production
1. cp dist ../../
1. mv dist docs
1. git add docs
1. git commit
1. git push

Do not merge the `docs` branch into the `master` branch as we do not want the build artefacts in the source code branch.