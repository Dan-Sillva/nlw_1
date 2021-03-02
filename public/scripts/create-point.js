
function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
    .then(res => res.json())
    .then(states => {

        for( const state of states ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
        
    })
}

populateUFs()

function getCities(event){
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then(res => res.json())
    .then(cities => {
     

        for( const city of cities ) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
        
    })

}


document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

    //ITENS DE COLETA=>

const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect){
    item.addEventListener("click", handlerSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handlerSelectedItem(){
//Adicionar ou remover classe com JavaScript
    const itemLi = event.target
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

//Verificar e adicionar itens selecionados, caso o item já esteja selecionado, tira-lo da lista
//Atualizar campo escondido com dados selecionados

    const allreadySelected = selectedItems.findIndex( item =>{
        const itemFound = item == itemId //Isso será true ou false 
        return itemFound

    })

    if(allreadySelected >= 0 ){
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId //Isso seá true ou false
            return itemIsDifferent
        })

        selectedItems = filteredItems
    }   
    else {
        selectedItems.push(itemId)
    }

    collectedItems.value = selectedItems

}

