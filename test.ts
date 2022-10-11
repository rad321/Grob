const str1 = {
    "nome" : "ciccio",
    "cognome" : "carlo"
}
const str2 = {
    "sesso" : "m",
    "domicilio" : "ciao"
}


const merge = {
    str1,
    str2

}
console.log(JSON.stringify(merge))