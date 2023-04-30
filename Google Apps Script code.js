// YOUTUBE !S2
// Com 💜 por DaniFluffyCat (https://danifluffy.dev)

/* 
Customize abaixo as mensagens que você quer que o bot envie como resposta.

Você pode colocar quantas mensagens quiser, e o bot vai sortear uma delas 
para usar quando for chamado. As mensagens devem ser colocadas sempre entre
aspas, terminar com uma vírgula depois das aspas, e conter os nomes:

${channelname} - Para preencher com o nome do canal;
${link} - Para preencher com o link do canal. 
*/


const MSG_add = [ // Canal adicionado no banco de dados
  "${channelname} adicionado ao !s2 💜!",
]

const MSG_remove = [ // Canal removido do banco de dados
  "${channelname} removido do !s2.",
]

const MSG_s2 = [ // Chamando !s2 para um canal
  "Chat, conheça o canal de ${channelname}! 💜 ${link}",
  "Dá uma conferida no canal de ${channelname}! 💜 ${link}",
  "Se inscreve no canal de ${channelname}! 💜 ${link}",
]

const MSG_err_channelnameNotFound = [ // Mensagem de erro, caso não tenha nome do usuário
  "Erro: falta o @ do canal."
]

const MSG_err_linkNotFound = [ // Mensagem de erro, caso não tenha link de canal do Youtube
  "Erro: falta o link do canal, ou este não é um link do Youtube."
]

const MSG_err_channelnameNotInDB = [  // Mensagem de erro, canal não cadastrado
  "Erro: canal não está cadastrado no !s2. Cadastre enviando !s2 add [link do canal] @fulano."
]

/* 
Para o bot funcionar, ele precisa de uma Planilha do Google para usar como
banco de dados. Essa planilha deve ter apenas uma página, e essa página 
deve ter 2 colunas. Recomendo você não editar essa planilha, para evitar
que o bot tenha problemas pra manipulá-la.

Cole o link da planilha na variável abaixo. */

const DATABASE = "INSIRA AQUI O LINK DA SUA PLANILHA"

/*
Feito isso: salve, clique em "Implantar", e em "Nova Implantação".
Em "Selecione o tipo", clique em "⚙" e em "App da Web".
Em "Executar como", selecione "Eu (seu.email@gmail.com)", e em 
"Quem pode acessar", selecione "Qualquer pessoa", e clique em "Implantar".

Dê as permissões que o bot precisa (ele solicita acesso às Planilhas do Google, apenas).

Feito isso, copie o link que vai aparecer em "URL".

No StreamElements, crie um comando novo, chamado "!s2", defina-o para "Apenas Moderadores"
(recomendado), e como resposta, digite:

${urlfetch "link que você copiou, sem aspas"?${0:}}

Deve ficar algo como assim:

${urlfetch https://script.google.com/macros/s/AbcdEfgHIJklm/exec?${0:}}

E isso é tudo que o bot precisa para funcionar. ^^
*/





/*
A partir dessa linha, o código começa a rodar, portanto EDITE APENAS SE
SOUBER O QUE ESTÁ FAZENDO.
*/

function doGet(url) {
  try {

    // Reformatando comando recebido pela URL
    url = decodeURI(url.queryString)

    // Coleta de dados
    let sheet = SpreadsheetApp.openByUrl(DATABASE).getSheets()[0]
    let query = {
      command: regex(url, /((!s2)\ (add|remove))|(!s2)/),
      link: regex(url, /(youtu).*(?=\ @)/),
      channelname: regex(url, /(?<=\ )@.*/),
    }

    // Checa se a entrada atual existe na base de dados
    let channelID = sheet.getRange("a:a").getValues()
      .findIndex(e => e[0] == query.channelname) + 1

    // Execução do comando
    switch (query.command) {

      // Adicionar ou atualizar entrada
      case "!s2 add":

        // Se não houver link, retornar erro
        if (query.link == null)
          return sendMsg(MSG_err_linkNotFound, query)

        // Se não houver channelname, retornar erro
        if (query.channelname == null)
          return sendMsg(MSG_err_channelnameNotFound, query)

        // Se entrada existe, remover
        if (channelID != 0)
          sheet.getRange(`a${channelID}:b${channelID}`)
            .deleteCells(SpreadsheetApp.Dimension.ROWS)

        // Adiciona nova entrada
        sheet.appendRow([query.channelname, query.link])

        // Envia mensagem de adição com sucesso
        return sendMsg(MSG_add, query)

      // Remover entrada
      case "!s2 remove":

        // Se não houver channelname, retornar erro
        if (query.channelname == null)
          return sendMsg(MSG_err_channelnameNotFound, query)

        // Se channelname não consta na DB, retornar erro
        if (channelID == 0)
          return sendMsg(MSG_err_channelnameNotInDB, query)

        // Se entrada existe, remover
        if (channelID != 0)
          sheet.getRange(`a${channelID}:b${channelID}`)
            .deleteCells(SpreadsheetApp.Dimension.ROWS)

        // Envia mensagem de remoção com sucesso
        return sendMsg(MSG_remove, query)

      // Retornar link do canal
      default:

        // Se não houver channelname, retornar erro
        if (query.channelname == null)
          return sendMsg(MSG_err_channelnameNotFound, query)

        // Se channelname não consta na DB, retornar erro
        if (channelID == 0)
          return sendMsg(MSG_err_channelnameNotInDB, query)

        // Obter link da planilha
        query.link = sheet.getRange(`b${channelID}`).getValue()

        // Envia mensagem com link
        return sendMsg(MSG_s2, query)
    }

  } catch (e) {

    // Erro grave no código
    console.error(e.stack)
    return ContentService.createTextOutput().append("Erro na API, consultar log.")
  }

}

// Função para sortear uma mensagem da Array e enviar ela como resposta pro chat
function sendMsg(message, query) {
  let random = Math.trunc((Math.random() - 0.000001) * message.length)
  message = message[random]
    .replaceAll("${channelname}", query.channelname)
    .replaceAll("${link}", query.link)
  return ContentService.createTextOutput().append(message)
}

// Função para facilitar formatação com regex
function regex(string, regex) {
  let value = string.match(regex)
  if (value == null) return value
  else return value[0]
}












