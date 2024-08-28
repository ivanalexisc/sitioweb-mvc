const { User} = require("../../database/models");

const controller = {

    getUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: ['nombre', 'apellido', 'direccion', 'email']
              });
            if (users.length > 0) {
                let respuesta = {
                  metadata: {
                    status: 200,
                    cantidad: users.length,
                  },
                  resultados: users,
                }
                res.json(respuesta);
              } else {
                respuesta = {
                    metadata:{
                        status:204,
                        length:users.length
                    }
                }
              }
        } catch (error) {
            console.log(error);
        }
} 

}
module.exports = controller