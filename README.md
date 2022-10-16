# Grob


## OBIETTIVO DEL PROGETTO
In questo progetto è presente un back-end che implementa il gioco degli scacchi. Il codice è stato realizzato con l'utilizzo di [Node.js] (https://nodejs.org/en/) e del modulo <a href="https://www.npmjs.com/package/js-chess-engine">JS-CHESS-ENGINE<a>, necessario per gestire tutti i possibile eventi generati dal utente.
 
Gli obiettivi di realizzazione sono: 
 
Si realizzi un sistema che consenta di gestire il gioco di scacchi. In particolare, il sistema si basa sul un utente (sempre autenticato con JWT) che gioca contro l’intelligenza artificiale. Ci possono essere più partite attive in un dato momento. Un utente può allo stesso tempo partecipare ad una ed una sola partita.
•	Dare la possibilità di creare una nuova partita seguendo <a href="https://www.npmjs.com/package/js-chess-engine">JS-CHESS-ENGINE<a> ; 
 la partita può essere:
1.	Utente contro intelligenza artificiale (IA) scegliendo il livello di difficoltà.
 
•	In particolare, è necessario validare la richiesta di creazione della partita. Per ogni partita viene addebitato un numero di token in accordo con quanto segue:
1.	0.40 all’atto della creazione
2.	0.01 per ogni mossa (anche IA)
3.	Il modello può essere creato se c’è credito sufficiente ad esaudire la richiesta (se il credito durante la partita scende sotto lo zero si può continuare comunque).
 
•	Creare la rotta per effettuare una mossa in una data partita verificando se questa è ammissibile o meno (si consiglia di valutare quanto presente in Board Configuration – JSON)

•	Creare una rotta per verificare le partite svolte riportando se sono state vinte o perse il numero di mosse totali,filtrando anche per data di avvio della partita (si ponga attenzione alla validazione delle date)
 
•	Creare una rotta per valutare lo stato di una data partita (di chi è il turno, se è terminata, scacco, scacco matto,…); una partita si considera chiusa quando:
1.	C’è uno scacco matto.
2. L’utente abbandona.
3.	Per ogni partita vinta al giocatore si dà 1 punto; per ogni partita interrotta -0.5 punti;
 
•	Creare una rotta per restituire lo storico delle mosse di una data partita con la possibilità di esportare in formato JSON
•	Restituire la classifica dei giocatori dando la possibilità di scegliere l’ordinamento ascendente / discendente. Questa rotta è pubblica e non deve essere autenticata.
 
- Le richieste devono essere validate (es. utente che scelga un evento che non esistente).
- Ogni utente autenticato (ovvero con JWT) ha un numero di token (valore iniziale impostato nel seed del database). 
- Nel caso di token terminati ogni richiesta da parte dello stesso utente deve restituire 401 Unauthorized. 
- Prevedere una rotta per l’utente con ruolo admin che consenta di effettuare la ricarica per un utente fornendo la mail ed il nuovo “credito” (sempre mediante JWT).
- I token JWT devono contenere i dati essenziali.
- Il numero residuo di token deve essere memorizzato nel db sopra citato.
- Si deve prevedere degli script di seed per inizializzare il sistema.
- Si chiede di utilizzare le funzionalità di middleware.
- Si chiede di gestire eventuali errori mediante gli strati middleware sollevando le opportune eccezioni.
- Si chiede di commentare opportunamente il codice.

## COSA SI PUO' FARE?
### Diagramma dei casi d'uso dell'utente:
<p align="center" style="margin-top: 10px;">
<img src="https://github.com/alexxdediu/Grob/blob/main/UML/casi-duso-user.jpg" width="450" height="300"> 
 </p>
 
 ### Diagramma dei casi d'uso dell'amministratore:
 <p align="center" style="margin-top: 10px;">
<img src="https://github.com/alexxdediu/Grob/blob/main/UML/casi-duso-admin.jpg" width="450" height="300"> 
 </p>




## ROUTES
Le richieste vengono effettuate con [POSTMAN](https://www.postman.com/).
Di seguito vengono riportate le possibili richieste:
|ROTTA | BODY | TIPO | 
|---|---|---|
| /login |Email e password |POST|
|/model|Modello da creare |POST|
|/model/:modelid/:version?|Start,goal |POST|
|/model/:modelid|Arco e peso da modifica |PUT|
|/admin|Email dell'utente e nuovi crediti |PUT|
|/filters/:modelid|Data,numero di nodi,numero di archi |POST|

 ### Descrizione delle rotte
 
 > **POST** /login
 
 Utilizzando questa rotta è possibile ottenere un [Json Web Token](https://jwt.io/) composto dalla chiave segreta e dai dati inseriti nella request (email,password)
 
  ### Esempio di body
 ```
 {
    "email": "prova@prova.it",
    "pwd" : "prova"
 }
 ```
 ### Esempio di response
 ```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByb3ZhQHByb3ZhLml0IiwicHdkIjoicHJvdmEiLCJpYXQiOjE2NjE3ODUwMjl9.61Y780uCOtoJsFOLnhWqk86AjEN381XT89OJGwC1Gac"
```
 > **POST** /model
 
 Utilizzando questa rotta è possibile è possibile creare ed inserire un modello nel database
 
  ### Esempio di body
 ```
 {
    "A": {
        "B":1,
        "C":2,
        "F":6,
        "L":9
    },
    "R":{
        "A":6,
        "N":5
    } 
 }
 ```
 ### Esempio di response
 
 la response corrisponde ad un messaggio di errore o di creazione avvenuta con successo
 ```
 "modello aggiunto con successo"
 ```
 
 


 > **POST** /model/:modelid/:version?
 
 Utilizzando questa rotta è possibile esegurie un modello inserendo come parametri in numero identiicativo del modello e la versione (non abbligatorio),
 il body della richiesta è composto da due valori che rappresentano il nodo di partenza ed il nodo di arrivo.
 La response è composta da un array contente il percorso (che ha come estremi i dati inseriti nel body) ed il costo (in termini di peso degli archi).
 
 ### Esempio di body
 ```
{
    "start" : "A",
    "goal" : "G"
}
 ```
 ### Esempio di response

 ```
{
    "path": [
        "A",
        "G"
    ],
    "cost": 2
}
 ```
 
 > **PUT** /model/:modelid
 
 Utilizzando questa rotta è possibile modificare il peso di uno o più archi di un modello.
 Il numero identificativo del modello viene inserito come parametro nella rotta, nel body della richiesta è necessario inserire gli archi con i rispettivi pesi    aggiornati
 
 

 ### Esempio di body
 ```
{  
    "R": {
        "N":19.6
    
    }   
}
 ```
 ### Esempio di Response
 ```
"Modifiche effettuate con successo per il modello n.7"

 ```
 > **PUT** /admin
 
 da finire
 
 ### Esempio di body
 ```
{
    "email":"prova@progettopa.it",
    "credits":39
}
 ```
 ### Esempio di Response
 ```
"Il credito è stato aggiornato con successo"

 ```
 > **POST** /filters/:modelid
 da finire
 
  ### Esempio di body
 ```
{
    "date" : [
        "2022-08-22",
        "2022-08-30"
    ],
    "numNodes" :8,
    "numEdges":6
    
    
}
 ```
 ### Esempio di Response
 ```
[
    "{\"A\":{\"B\":1,\"C\":2,\"F\":6,\"L\":9},\"R\":{\"A\":6,\"N\":4}}",
    "{\"A\":{\"B\":1,\"C\":2,\"F\":6,\"L\":9},\"R\":{\"A\":6,\"N\":10}}",
    "{\"A\":{\"B\":1,\"C\":2,\"F\":6,\"L\":9},\"R\":{\"A\":6,\"N\":13.84}}"
]
 ```
 
 ## Design Pattern
 ### M(V)C
 Per lo sviluppo dell'applicazione è stato utilizzato il pattern M(V)C, che consente di suddividere il progetto in 2 parti:
 
*  Models
*  Controllers

Nei ***models*** sono presenti le classi utilizzare per mappare le tabelle del database, il collegamento avviene con con l'utilizzo dei metodi dell'ORM
[Sequelize](https://sequelize.org/) che vengono attivati su istanze dei model.
I ***controllers*** vengono utilizzati come intermediario tra views e models, in particolare nell'applicazione vengono utilizzati per la gestione delle richieste e delle risposte ottenute utilizzando le rotte. Le classi controller richiamano i metodi utilizzati per mappare i dati nel database e per la creazione dei dati che costituiscono la response.

 <p align="center" style="margin-top: 10px;">
<img src="https://miro.medium.com/max/1000/1*23_6IjYfnybitGq4jO0QCg.gif" width="400" height="300"> 
 </p>
 
 I models utilizzati sono presenti nel file ***models.ts***  e sono stati definiti con ***sequelize.define(modelName, attributes, options)***
 #### Esempio model sequelize
  ```
  const users = sequelize.define(constantsdb.TABLE_USER, {
    name: { type: Sequelize.STRING },
    surname: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    pwd: { type: Sequelize.STRING },
    credits: { type: Sequelize.INTEGER },
    isadmin: { type: Sequelize.BOOLEAN },


 }, { timestamps: false })
 ```
Tra i controllers sono presenti gli effettivi controllers e  i file ***auth*** e  ***routes.ts*** che contengono rispettivamente i middleware e le rotte utilizzare

#### Esempio rotta
 ```
 app.put("/model/:modelid",jwtAuth ,function ( req,res){
 controller.updateWeights(req,res)
 })
  ```

 
 ### Middleware
  Le funzioni middleware sono funzioni con accesso all’oggetto richiesta (req), all’oggetto risposta (res) e alla successiva funzione middleware nel ciclo   richiesta-risposta dell’applicazione. La successiva funzione middleware viene comunemente denotata da una variabile denominata next.
  Nell'applicazione i middleware sono stati utilizzati principalmente per l'autenticazione dell'utente e per la gestione delle eccezioni
  
 <p align="center" style="margin-top: 10px;">
<img src="https://iq.opengenus.org/content/images/2019/08/Add-a-subheading--1-.png" width="700" height="300"> 
 </p>
 
## DIAGRAMMI DELLE SEQUENZE 

## AVVIO DEL PROGETTO CON DOCKER

## SOFTWARE/FRAMEWORK/LIBRERIE UTILIZZATI

*  [VS CODE](https://www.eclipse.org/downloads/)
*  [EXPRESS.JS](https://maven.apache.org/)
*  [SEQUELIZE](https://spring.io/)
*  [DOTENV]
*  [TS-NODE]
*  [NODEJS]
*  [POSTGRES]

## AUTORE

**Alexandru Dediu**


