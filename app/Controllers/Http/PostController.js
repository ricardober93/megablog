'use strict'

const Post = use('App/Models/Post')

class PostController {
  
  /**
   * Display a listing of the resource.
   */
  async index({
    view,
    params,
  })  {
   

    const page = params.page || 1
    const posts = await Post.query()
      .paginate(page, 10)
    
    const pagination = posts.toJSON()
    pagination.offset = (pagination.page - 1) * pagination.perPage

      return view.render('post.index',{ posts: pagination } )
  }
  
  
  async show({ view, params }) {
    

    const posts = await Post.query().limit(5)
      .fetch()
    

    const post = await Post.find(params.id)
    
    return view.render('post.show', {post: post.toJSON(), posts: posts.toJSON() })
  }
  
}


module.exports = PostController
