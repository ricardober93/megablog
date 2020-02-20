'use strict'
const User = use('App/Models/User')
const { validate } = use('Validator')

class UserController {


    index({ view }){
        return view.render('inicio')
    }
    
    /**
     * Show the form for creating a new resource.
     */
    create({view}) {
     
        return view.render('user.create')
    }
    
    async store({ session, request, response, auth }) {
        
        const data = request.only(['username', 'email', 'password', 'password_confirmation'])

        const validation = await validate(data, {
            username: 'required|unique:users',
            email: 'required|email|unique:users',
            password: 'required',
            password_confirmation: 'required_if:password|same:password',
        })

        if (validation.fails()) {
            session
                .withErrors(validation.messages())
                .flashExcept(['password'])
        
            return response.redirect('back')
        }
        
        delete data.password_confirmation



        try {
            // save user to database
            const user = await User.create(data)
            // generate JWT token for user
            await auth.login(user)
            
            return response.redirect('/')
        }
             catch (error) {
              return response.status(400).json({
                status: 'error',
                message: 'There was a problem creating the user, please try again later.'
            })
        }

       

}  

       
}


module.exports = UserController
