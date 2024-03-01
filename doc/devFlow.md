npx @angular/cli@15 new sandbox

cd sandbox

ng g library AlphaLbs

cd projects/alpha-lbs

... edit project, readme, unit tests...

npm init --scope @pvway

edit the name into the angular.json file

ng build AlphaLbs

cd ../../dist/alpha-lbs

npm publish --access public