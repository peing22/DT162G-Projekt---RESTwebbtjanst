# DT162G Projekt REST-webbtjänst
Repo för del av projektarbete i kursen *JavaScriptbaserad Webbutveckling*.

## Efter kloning av repo
1. Kör kommandot *npm install*
2. Skapa en .env-fil med följande konfigurationsvariabler

        CORS_ORIGIN=domän_från_vilken/vilka_REST-webbtjänsten_ska_acceptera_anrop (separera flera domän med ett komma utan mellanslag)  
        DATABASE_URL=anslutningssträng_till_mongodb  
        PORT=portnummer_för_servern
        TOKEN_SECRET=nyckel_för_token_secret  
        JWT_EXPIRES_IN=60000 (motsvarar 1 minut, kan ändras till önskat värde)  
        REFRESHTOKEN_EXPIRES_IN=7200000 (motsvarar 2 timmar, kan ändras till önskat värde)  

3. Kör kommandot *npm start*

## Tillgängliga routes
* `POST` `/register` för att registrera ett nytt användarkonto.

* `POST` `/login` för att logga in användare och returnera JWT och refreshtoken.

* `POST` `/refreshtoken` för att förnya JWT.

* `POST` `/logout/{id}` för att logga ut användare utifrån id.

* `GET` `/exercises` för att läsa ut samtliga övningar.

* `GET` `/exercises/{id}` för att läsa ut en övning utifrån id.

* `POST` `/exercises` för att lägga till en övning.

* `PUT` `/exercises/{id}` för att uppdatera en övning utifrån id.

* `DELETE` `/exercises/{id}` för att radera en övning utifrån id.