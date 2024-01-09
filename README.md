# DT162G Projekt REST-webbtjänst
Repo för del av projektarbete i kursen *JavaScriptbaserad Webbutveckling*.

## Efter kloning av repo
1. Kör kommandot *npm install* i projektkatalogen
2. Skapa en .env-fil med följande konfigurationsvariabler:

        CORS_ORIGIN=domän_från_vilken/vilka_REST-webbtjänsten_ska_kunna_anropas (separera flera domän med ett komma utan mellanslag)  
        DATABASE_URL=anslutningssträng_till_mongodb  
        PORT=portnummer  
        TOKEN_SECRET=nyckel_för_token_secret  
        JWT_EXPIRES_IN=60000 (motsvarar 1 minut, kan ändras till önskat värde)  
        REFRESHTOKEN_EXPIRES_IN=7200000 (motsvarar 2 timmar, kan ändras till önskat värde)  

3. Kör kommandot npm start