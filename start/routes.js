'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get("/", "UserController.index");
Route.get("/blog", "PostController.index");
Route.get("/post/:id", "PostController.show");


Route.get("/cerrar-sesion", "SessionController.delete").middleware(['auth']);

Route.group(() => {
    Route.get("iniciar-sesion", "SessionController.create");
    Route.post("iniciar-sesion", "SessionController.store");
  
    Route.get("registrarse", "UserController.create");
  Route.post("registrarse", "UserController.store");
  
}).middleware(["guest"]);


Route.group(() => {
  Route.get("admin", "Admin/UserController.index");
  Route.get("admin/posts/", "Admin/PostController.index").as('posts.pagination');
  Route.get("admin/posts/create", "Admin/PostController.create");
  Route.post("admin/posts/create", "Admin/PostController.store");

  Route.get("admin/posts/edit/:id", "Admin/PostController.edit");
  Route.put("admin/posts/edit/:id", "Admin/PostController.update");
  Route.get("admin/posts/delete/:id", "Admin/PostController.delete");

  Route.get("admin/roles/", "Admin/RoleController.index").as('roles.pagination');

  Route.get("admin/roles/edit/:id", "Admin/RoleController.edit").middleware('can:update_users');
  Route.put("admin/roles/edit/:id", "Admin/RoleController.update");

}).middleware("auth", 'is:(administrator or moderator)');
