'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with roles
 */

const User = use('App/Models/User')
const Role = use('Adonis/Acl/Role')
const Permission = use('Adonis/Acl/Permission')
class RoleController {
  /**
   * Show a list of all roles.
   * GET roles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({
    view,
    params,
    request,
    response}) {

    const page = params.page || 1
    const search = request.input('search') || ''
    const users = await User.query()
                                    .where('username', 'LIKE', '%' + search + '%')
                                    .paginate(page, 10)
    
    const pagination = users.toJSON()
    pagination.route = 'roles.pagination'

    if(pagination.lastPage < page && page != 1) {
      response.route(pagination.route, { page: 1 }, null, true)
    }
    else {
      pagination.offset = (pagination.page - 1) * pagination.perPage
      pagination.search = search
      return view.render('admin.role.index', { users: pagination })
    }

  }

 

  async edit({ params, request, response, view }) {

    
    const user = await User.find(params.id)
    const roles = await Role.all()
    const permisos = await Permission.all()

    return view.render('admin.role.edit', {
      user: user.toJSON(),
      roles: roles.toJSON(),
      permisos : permisos.toJSON()
    })

  }


  async update({ params, request, response }) {

    
    const username = request.input('username')
    const email = request.input('email')
    const rol = request.input('rol')
    
    const userNuevo = {
      username,
      email
    }
    
    const user = await User.findOrFail(params.id)
    const rolName = await Role.findBy('id', rol)
    
    await user.roles().sync(rolName.id)

    await user.permissions().detach()

    if (request.input('Update Users') ) {
      const UpdateUsersUI = request.input('Update Users') 
      const UpdateUsersPermiso = await Permission.findBy( 'id', UpdateUsersUI)
      await user.permissions().attach(UpdateUsersPermiso.id)
    }
    if (request.input('Delete Users')) {
      const DeleteUsersUI = request.input('Delete Users') 
      const DeleteUsersPermiso = await Permission.findBy( 'id',DeleteUsersUI)
      await user.permissions().attach(DeleteUsersPermiso.id)
    }
    if (request.input('Read Users')) {
      const ReadUsersUI   = request.input('Read Users') 
      const ReadUsersPermiso = await Permission.findBy( 'id',ReadUsersUI)
      await user.permissions().attach(ReadUsersPermiso.id)
    }
    if (request.input('Create posts')) {
      const CreatepostsUI = request.input('Create posts')
      const CreatepostsPermiso =  await Permission.findBy( 'id',CreatepostsUI)
      await user.permissions().attach(CreatepostsPermiso.id)
    }
    if (request.input('Update posts')) {
      const UpdatepostsUI = request.input('Update posts')
      const UpdatepostsPermiso = await Permission.findBy( 'id',UpdatepostsUI)
      await user.permissions().attach(UpdatepostsPermiso.id)
    }
    if (request.input('Delete posts')) {
      const DeletepostsUI = request.input('Delete posts')
      const DeletepostsPermiso =  await Permission.findBy( 'id',DeletepostsUI)
      await user.permissions().attach(DeletepostsPermiso.id)
    }
    if (request.input('Read posts')) {
      const ReadpostsUI   = request.input('Read posts')
      const ReadpostsPermiso = await Permission.findBy( 'id',ReadpostsUI)
      await user.permissions().attach(ReadpostsPermiso.id)
    }
 
    user.merge(userNuevo)
    await user.save()

    return response.redirect('/admin/roles/')
  }

  async destroy({ params, request, response }) {
    const user = await User.findOrFail(params.id)

    await user.roles().detach()
    await user.permissions().detach()
  }
}

module.exports = RoleController
