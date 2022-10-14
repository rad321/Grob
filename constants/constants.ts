export const databaseConstants ={
    BOARDS_TABLE : "boards",
    USERS_TABLE : "users"

}
export const dateConstants = {
    START_DATE : "01/01/2022",
    END_DATE : "15/01/2050",
    DATE_FORMAT : "DD/MM/YYYY",
}
export const boardConstants = {
    PLAYER : "player",
    BOARD_CONFIGURATION : "config",
    COLOR : "color",
    BOARD_HISTORY : "history",
    GAME_LEVEL : "level",
    GAME_STATE : "state",
    STATE_STOPPED : "stopped",
    PIECE_COLOR_BLACK : "black",
    STATE_WIN : "win",
    STATE_DEFEAT : "defeat",
    STATE_ABANDONED : "abandoned"




}
export const constants = {
    ORD_ASCENDENTE : "asc",
    ORD_DISCENDENTE : "desc",
    EMPTY_PARAM_BOARDID : ":boardid",
    UNDEFINED : 'undefined'

}
export const exceptionMsg = {
    UTENTE_INESISTENTE : "Utente inesistente, verifica le credenziali inserite",
    ERR_CREAZIONE_PARTITA : "La partita non è stata creata con successo, si è verificato il seguente errore: ",
    PARTITE_INESISTENTI_BY_DATE : "Non ci sono partite nella data inserita",
    PARTITA_INESISTENTE_BY_ID : "Non è stata trovata alcuna partita, inserire un id differente",
    ERR_PARTITA_ABBANDONATA : "Non è possibile abbandonare la partita, è presente il seguente errore: ",
    ERR_CAMPO_COLOR : "Request errata, il campo 'color' può essere solo 'white' o 'black'",
    ERR_CAMPO_COLOR_TIPO : "Request errata,'color' deve essere una stringa",
    ERR_PARAM_BOARDID : "Il parametro 'boardid' è errato",
    ERR_MOSSA_NON_VALIDA : "mossa non valida, modificare lo spostamento",
    PARTITA_ABBANDONATA : "Questa partita è stata abbandonata, inserire un id diverso",
    CREDITO_INSUFFICIENTE : "Credito insufficiente",
    ERR_RANGE_DATE : "Body Errato, la data deve essere inclusa nel range ammissibile e il suo formato deve essere 'dd/mm/yyyy' (vedi doc.)",
    ERR_CAMPO_SORT : "Body errato, il campo 'sort' può essere solo 'desc' o 'asc'",
    ERR_JWT_EMAIL :"Non esiste un account associato all'email ",
    ERR_JWT : "JWT errato, il payload presente nella stringa jwt non corrisponde ad alcuna utenza",
    ERR_CREAZIONE_UTENZA : "L'email inserita è già stata utilizzata per creare un account",
    ERR_STATO_STOPPED : "Lo partita è già stata interrotta"
    

}
export const successMsg = {
    SIGNUP_EFFETTUATO : "Registrazione effettuata con successo!",
    PARTITA_INIZIATA : "Partita iniziata!",
    PARTITA_CONCLUSA : "partita conclusa",
    PARTITA_ABBANDONATA : "La partita è stata abbandonata",
    PARTITA_INTERROTTA : "La partita è stata interrotta"

   

}