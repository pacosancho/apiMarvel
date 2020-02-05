// you will also have to setup the referring domains on your marvel developer portal
const PRIV_KEY = 'd965fd4337d81e5090a6273d81059d1e3967451c'
const PUBLIC_KEY = '80643e8d67e791c18c29687ecabda385'
const maxResultados = 40
addEventListener('load', inicializarEventos, false)
let delaySearch

/**
 *
 *  Inicializa los eventos de la app
 */
function inicializarEventos () {
  const maxLength = $('option').length
  for (let i = 0; i < maxLength; i++) {
    $('select').eq(i).change(function () {
      const valSelect = $('select').val()
      resetContainers()
      if (valSelect !== '') {
        $('input').val('')
        $('.form-group').children('div').show(300)
        eventInput(valSelect)
      } else {
        $('.form-group').children('div').hide(300)
      }
    })
  }

  // eventInput()
}

/**
 * Añade el evento input y llama dependiendo del parametro recibido
 *
 * @param {String} tipoBusqueda
 */
function eventInput (tipoBusqueda) {
  $('input').on('input', function () {
    clearTimeout(delaySearch)
    const valorBusqueda = $(this).val()

    resetContainers()

    if (valorBusqueda !== '') {
      switch (tipoBusqueda) {
        case '0':
          delaySearch = setTimeout(() => { getHeroesResponse(valorBusqueda) }, 1000)
          break

        case '1':
          delaySearch = setTimeout(() => { getComicsResponse(valorBusqueda) }, 1000)
          break
        case '2':
          delaySearch = setTimeout(() => { getMarvelResponse(valorBusqueda) }, 1000)
          break
      }
    }
  })
}
/**
 * Resetea la paginacion y El contenido mostrado
 *
 */
function resetContainers () {
  $('#cardsContainer').children().remove()
  if ($('#pagination').data('twbs-pagination')) { $('#pagination').twbsPagination('destroy') }
}

/**
 *Pide a la api una lista de heroes y comics filtrando por los que comienzan por el parametro recibido
 *
 * @param {String} valorBusqueda
 */
function getMarvelResponse (valorBusqueda) {
  page = 1

  // valorBusqueda='Storm'
  // you need a new ts every request
  const ts = new Date().getTime()

  // cuidado si no pones un ajax dentro de otro al llamar al mismo metodo se puede liar, se lia vaya

  // the api deals a lot in ids rather than just the strings you want to use
  // var characterId = '1009718'; // wolverine

  $('#overlay').fadeIn(300)
  const nameSart = '&nameStartsWith=' + valorBusqueda

  let url = `https://gateway.marvel.com/v1/public/characters?limit=${maxResultados}${nameSart}`

  console.log(url)
  $.getJSON(url, {
    ts: ts,
    apikey: PUBLIC_KEY,
    hash: CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString() // 'c35ada298100e73e41554af65a93a157',
    // characters: characterId
  })

    .done(function (response) {
      // sort of a long dump you will need to sort through
      console.log(response)

      showResults(response.data.results)

      const titleStart = '&titleStartsWith=' + valorBusqueda
      url = `https://gateway.marvel.com/v1/public/comics?limit=${maxResultados}${titleStart}`

      console.log(url)
      $.getJSON(url, {
        ts: ts,
        apikey: PUBLIC_KEY,
        hash: CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString() // 'c35ada298100e73e41554af65a93a157',
        // characters: characterId
      })

        .done(function (response) {
          // sort of a long dump you will need to sort through
          console.log(response)

          showResults(response.data.results)
          if (response.data.results.length > 0) {
            paginate()
          }
        })
        .fail(function (response) {
          // the error codes are listed on the dev site
          console.log(response)
        })
        .always(function () {
          $('#overlay').fadeOut(300)
        })
    })
    .fail(function (response) {
      // the error codes are listed on the dev site
      $('#cardsContainer').append(`<p id="error" class="text-center">Ha ocurrido un error en la busqueda, 
      reintentelo de nuevo o si persiste el problema contacte con el administrador 
      del lugar</p>`)

      console.log(response)
    })
    .always(function () {
      $('#overlay').fadeOut(300)
    })
};

/**
 *Pide a la api una lista de comics filtrando por los que comienzan por el parametro recibido
 *
 * @param {String} valorBusqueda
 */
function getComicsResponse (valorBusqueda) {
  const ts = new Date().getTime()
  const titleStart = '&titleStartsWith=' + valorBusqueda
  const url = `https://gateway.marvel.com/v1/public/comics?limit=${maxResultados}${titleStart}`
  page = 1
  $('#overlay').fadeIn(300)

  console.log(url)
  $.getJSON(url, {
    ts: ts,
    apikey: PUBLIC_KEY,
    hash: CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString() // 'c35ada298100e73e41554af65a93a157',
    // characters: characterId
  })

    .done(function (response) {
      // sort of a long dump you will need to sort through
      console.log(response)

      showResults(response.data.results)
      if (response.data.results.length > 0) {
        paginate()
      }
    })
    .fail(function (response) {
      // the error codes are listed on the dev site
      console.log(response)
      $('#cardsContainer').append(`<p id="error" class="text-center">Ha ocurrido un error en la busqueda, 
      reintentelo de nuevo o si persiste el problema contacte con el administrador 
      del lugar</p>`)
    })
    .always(function () {
      $('#overlay').fadeOut(300)
    })
}

/**
 *Pide a la api una lista de heroes filtrando por los que comienzan por el parametro recibido
 *
 * @param {String} valorBusqueda
 */
function getHeroesResponse (valorBusqueda) {
  const ts = new Date().getTime()
  const nameSart = '&nameStartsWith=' + valorBusqueda
  const url = `https://gateway.marvel.com/v1/public/characters?limit=${maxResultados}${nameSart}`
  page = 1
  $('#overlay').fadeIn(300)

  console.log(url)
  $.getJSON(url, {
    ts: ts,
    apikey: PUBLIC_KEY,
    hash: CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString() // 'c35ada298100e73e41554af65a93a157',
    // characters: characterId
  })

    .done(function (response) {
      // sort of a long dump you will need to sort through
      console.log(response)

      showResults(response.data.results)
      if (response.data.results.length > 0) {
        paginate()
      }
    })
    .fail(function (response) {
      // the error codes are listed on the dev site
      console.log(response)
      $('#cardsContainer').append(`<p id="error" class="text-center">Ha ocurrido un error en la busqueda, 
      reintentelo de nuevo o si persiste el problema contacte con el administrador 
      del lugar</p>`)
    })
    .always(function () {
      $('#overlay').fadeOut(300)
    })
}

let contRow = 0

let divRow = ''
let page = 1

/**
 *Muestra los resultados de la peticion y monta el html
 *
 * @param {Object} results
 */
function showResults (results) {
  contRow = 0
  divRow = ''

  // $('#cardsContainer').append(`<h2 class="ml-5">${type}</h2>`)

  results.forEach((objResultado) => {
    let card = createcard(objResultado)
    card = $(card)

    if (contRow % 4 === 0 || contRow === 0) {
      const classPage = `page${page}`
      const divPage = $('<div></div>').addClass('page').attr('id', classPage)

      $('#cardsContainer').append(divPage)
      divRow = $('<div class="row justify-content-center"></div>')
      divRow.append(card)
      // $('#cardsContainer').append(divRow)
      divPage.append(divRow)
      page++
    } else {
      divRow = ''
      $('.row').last().append(card)
    }

    contRow++

    const maxLetras = 20
    let fullText = ''
    let myText = ''
    if (objResultado.title !== undefined) {
      objResultado.textObjects[0] !== undefined ? myText = objResultado.textObjects[0].text : ''

      if (myText.length > maxLetras) {
        fullText = myText.substring(30, myText.length)
        myText = myText.substring(0, 30)
        $(card).find('.card-text').text(myText + '...')
        $(card).find('.card-text').append(`<span>${fullText}</span>`)
        card.children('.card-body').append('<a class="d-flex justify-content-end" href="#">read more</a>')
        $('a').last().prev().children('span').slideToggle(1)
        $('a').last().click(function (ev) {
          ev.preventDefault() // link no hace de link, el uso de event directamente esta deprecated
          if ($(this).text() === 'read more') { $(this).text('read less') } else { $(this).text('read more') }
          $(this).prev().children('span').slideToggle(400)
        })
      }
    }
  })
}

/**
 *Crea la carta del comic o heroe en cuestión
 *
 * @param {Object} objResultado
 * @returns CardsConstruida
 */
function createcard (objResultado) {
  let title = ''

  if (objResultado.title !== undefined) {
    title = objResultado.title
  } else { title = objResultado.name }
  return `
  <div class="card col-2 m-4 pt-4">
    <img class="card-img-top" src="${objResultado.thumbnail.path + '.' + objResultado.thumbnail.extension}" alt="Imagen de heroe o comic">
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text mb-0"></p>
    </div>
  </div>
  `
}

/**
 *Crea la paginación
 *
 */
function paginate () {
  $('#pagination').twbsPagination({
    totalPages: $('.page').length,
    // the current page that show on start
    startPage: 1,

    // maximum visible pages
    visiblePages: $('.page').length,

    initiateStartPageClick: true,

    // template for pagination links
    href: false,

    // variable name in href template for page number
    hrefVariable: '{{number}}',

    // Text labels
    first: 'First',
    prev: 'Previous',
    next: 'Next',
    last: 'Last',

    // carousel-style pagination
    loop: false,

    // callback function
    onPageClick: function (event, page) {
      $('.page-active').removeClass('page-active')
      $('#page' + page).addClass('page-active')
    },

    // pagination Classes
    paginationClass: 'pagination',
    nextClass: 'next',
    prevClass: 'prev',
    lastClass: 'last',
    firstClass: 'first',
    pageClass: 'page',
    activeClass: 'active',
    disabledClass: 'disabled'

  })
}
