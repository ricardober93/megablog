//resources/presenters/PaginationPresenter.js
const { BasePresenter } = require('edge.js')

class PaginationPresenter extends BasePresenter {

  //Retorna el desplazamiento inicial
  offset(pagination) {
    return (pagination.page - 1) * pagination.perPage
  }

  //Retorna el estatus de la paginación
  label(pagination) {
    const offset = this.$presenter.offset(pagination)
    const rows = pagination.data.length
    return (rows == 0) ? '' : 'Mostrando ' + rows + ' registros, del ' + (offset + 1) + ' al ' + (offset + rows) + ' de ' + pagination.total + ' - Página ' + pagination.page + ' de ' + pagination.lastPage
  }

  //Retorna todas las páginas disponibles del listado
  pages(pagination) {
    return Array(pagination.lastPage).fill(null).map( (x,i) => i + 1 )
  }

  //Define si es la primera página
  isFirstPage(pagination) {
    return pagination.page == 1
  }

  //Define si es la página actual
  isCurrentPage(pagination, page) {
    return pagination.page == page
  }

  //Define si es la última página
  isLastPage(pagination) {
    return pagination.page == pagination.lastPage
  }

  //Retorna la ruta de la página indicada
  getRoute(pagination, page) {
    const search = (pagination.search != '') ? '?search=' + pagination.search : ''
    return this.$globals.route(pagination.route, {page: page}) + search
  }

}

module.exports = PaginationPresenter