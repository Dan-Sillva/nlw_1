const express = require("express")
const server = express()

//Pegar banco de dados 
const db = require("./database/db.js")

//Config pasta public
server.use(express.static("public"))

// Habilitar uso do req.body
server.use(express.urlencoded({extended:true}))

//Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
})

/*Configurar caminos para minha aplicação. pagina inicial.
______________________________________ req = requisição, res = respostas._________________________________*/

server.get("/", (req, res) => {
    res.render("index.html")
})

server.get("/create-point", (req, res) => {

    //req.query: Query Strings da nossa url
    //console.log(req.query)
    
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    //req.body = O corpo do nosso formulario
    //console.log(req.body)

    //Inserir dados no banco dados
    const query = `
        INSERT INTO places (
            name,
            image,
            address,
            address2,
            state,
            city, 
            items
        ) VALUES (?,?,?,?,?,?,?);            
    `

    const values = [
       req.body.name,
       req.body.image,
       req.body.address,
       req.body.address2,
       req.body.state,
       req.body.city,
       req.body.items
    ]

    function afterInsertData (err){
        if (err) {
            console.log( err )
            return res.send("Erro no cadastro!")
        }
        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved : true})
    }

    db.run(query, values, afterInsertData)

   
})

server.get("/search", (req, res) => {

    const search = req.query.search

    if( search == ""){
        //pesquisa vazia
        return res.render("search-results.html", { total: 0})
    }



    //pegar os dados do db
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err)
        }
        console.log("Aqui estão seus registros: ")
        console.log(rows)

        const total = rows.length

        //Mostrar o html com banco de dados 
        return res.render("search-results.html", { places: rows, total: total})
    })

   
})


//Ligar o servidor
server.listen(3000)