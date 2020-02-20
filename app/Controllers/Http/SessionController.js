'use strict'

class SessionController {

    
    /**
     * Show the form for creating a new resource.
     */
    create({view}) {
        return view.render('sesion.iniciarsesion')
    }

    async store({ auth, request, response, session }) {
        const { email, password } = request.all()
        
        try {
            await auth.attempt(email, password)
        } catch (e) {
          
            session.flashExcept(['password'])
               
            session.flash({ error: ' No pudimos encontrar una cuenta con esas credenciales.' })
      
            return response.redirect('iniciar-sesion')
        }
        
          return response.redirect('/')
    }

    async delete({ auth, response }) {
        
        await auth.logout()

        return response.redirect('/')
    }
    
}

module.exports = SessionController
