'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

const User = use('App/Models/User')
const Role = use('Role')
const Permission = use('Permission')

class UserSeeder {
  async run() {
    
    const adminUser = await new User
    adminUser.username = 'administrator'
    adminUser.email = 'admin@test.com'
    adminUser.password = 'admin' 

    await adminUser.save()

    const administratorRole = await new Role
    administratorRole.name = 'Administrator'
    administratorRole.slug = 'administrator'
    administratorRole.description = 'Otorga los privilegios de Administrator'
    await administratorRole.save() 


    const moderadorRole = new Role()
    moderadorRole.name = 'Moderator'
    moderadorRole.slug = 'moderator'
    moderadorRole.description = ' Otorga los privilegios de moderador'
    await moderadorRole.save() 

    await adminUser.roles().attach([administratorRole.id, moderadorRole.id])

    const updateUsersPermission = new Permission()
    updateUsersPermission.slug = 'update_users'
    updateUsersPermission.name = 'Update Users'
    updateUsersPermission.description = 'Actualizar permisos de usuarios'
    await updateUsersPermission.save()
    
    const deleteUsersPermission = new Permission()
    deleteUsersPermission.slug = 'delete_users'
    deleteUsersPermission.name = 'Delete Users'
    deleteUsersPermission.description = 'Eliminar permisos de usuarios'
    await deleteUsersPermission.save()
    
    const readUsersPermission = new Permission()
    readUsersPermission.slug = 'read_users'
    readUsersPermission.name = 'Read Users'
    readUsersPermission.description = 'Leer los permisos de los usuarios'
    await readUsersPermission.save()
      
     const createPostPermission = new Permission()
    createPostPermission.slug = 'create_posts'
    createPostPermission.name = 'Create posts'
    createPostPermission.description = 'Permisos para crear neuvos posts'
    await createPostPermission.save()
    
    const updatePostsPermission = new Permission()
    updatePostsPermission.slug = 'update_posts'
    updatePostsPermission.name = 'Update posts'
    updatePostsPermission.description = 'Permiso para actualizar los posts'
    await updatePostsPermission.save()
    
    const deletePostsPermission = new Permission()
    deletePostsPermission.slug = 'delete_posts'
    deletePostsPermission.name = 'Delete posts'
    deletePostsPermission.description = 'permiso para eliminar los posts'
    await deletePostsPermission.save()
    
    const readPostsPermission = new Permission()
    readPostsPermission.slug = 'read_posts'
    readPostsPermission.name = 'Read posts'
    readPostsPermission.description = 'permiso para leer los posts'
    await readPostsPermission.save() 
   
    await administratorRole.permissions().attach([
      updateUsersPermission.id,
      deleteUsersPermission.id,
      readUsersPermission.id,
      createPostPermission.id,
      updatePostsPermission.id,
      deletePostsPermission.id,
      readPostsPermission.id
  ])
      
    
  await adminUser.permissions().attach([
    updateUsersPermission.id,
    deleteUsersPermission.id,
    readUsersPermission.id,
    createPostPermission.id,
    updatePostsPermission.id,
    deletePostsPermission.id,
    readPostsPermission.id
  ])

  }
}

module.exports = UserSeeder
