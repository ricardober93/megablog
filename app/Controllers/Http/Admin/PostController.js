'use strict'


const Post = use('App/Models/Post')
const {
  validate
} = use('Validator')
const Helpers = use('Helpers')

class PostController {


  /**
   * Display a listing of the resource.
   */
  async index({
    view,
    params,
    request,
    response
  }) {
    const page = params.page || 1
    const search = request.input('search') || ''
    const posts = await Post.query()
                                    .where('titulo', 'LIKE', '%' + search + '%')
                                    .paginate(page, 10)
    
    const pagination = posts.toJSON()
    pagination.route = 'posts.pagination'

    if(pagination.lastPage < page && page != 1) {
      response.route(pagination.route, { page: 1 }, null, true)
    }
    else {
      pagination.offset = (pagination.page - 1) * pagination.perPage
      pagination.search = search
      return view.render('admin.posts.index', { posts: pagination })
    }
  }


  /**
   * Show the form for creating a new resource.
   */
  create({
    view
  }) {
    return view.render('admin.posts.create')
  }



  /**
   * Store a newly created resource in storage.
   */
  async store({
    request,
    response,
    auth,
    session
  }) {

    const titulo = request.input('titulo')
    const contenido = request.input('contenido')
    const imagen = request.file('foto', {
      types: ['image'],
      size: '2mb'
    })

    const data = {
      titulo: titulo,
      imagen: imagen.clientName,
      contenido: contenido
    }


    const validation = await validate(data, {
      titulo: 'required',
      contenido: 'required',
      imagen: 'required'
    })

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashAll('Problemas con los datos del formulario')

      return response.redirect('back')
    }

    await imagen.move(Helpers.publicPath('/uploads/'), {
      name: imagen.clientName,
      overwrite: true
    })

    data.user_id = auth.user.id
    await Post.create(data)

    response.redirect('/admin/posts/')

  }

  
  /**
   * Show the form for editing the specified resource.
  */
  async edit({ view, params }) {
    const post = await Post.findOrFail(params.id)
    return  view.render('admin.posts.edit', { post: post.toJSON() })
  }

  async update({ params, session, request, response }) {
    
    const titulo = request.input('titulo')
    const contenido = request.input('contenido')
    const imagen = request.file('foto', {
      types: ['image'],
      size: '2mb'
    })

    const data = {
      titulo: titulo,
      imagen: imagen.clientName,
      contenido: contenido
    }


    const validation = await validate(data, {
      titulo: 'required',
      contenido: 'required',
      imagen: 'required'
    })

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashAll('Problemas con los datos del formulario')

      return response.redirect('back')
    }

    await imagen.move(Helpers.publicPath('/uploads/'), {
      name: imagen.clientName,
      overwrite: true
    })

    const post = await Post.findOrFail(params.id)
    post.merge(data)
    await post.save()


    return response.redirect('/admin/posts/')
    
  }

  async delete({ params, response }) {
    

    const post = await Post.findOrFail(params.id)
    await post.delete()

    return response.redirect('/')
  }
  

}

module.exports = PostController
