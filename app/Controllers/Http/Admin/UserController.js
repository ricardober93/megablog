'use strict'

class UserController {
  
  /**
   * Display a listing of the resource.
   */
  async index({view}) {
      return view.render('admin.index')
  }
  
}

module.exports = UserController
