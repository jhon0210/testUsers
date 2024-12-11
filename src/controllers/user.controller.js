import { connect } from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

//**************************************Funcion para la utenticacion************************************** */
export const login = async (req, res) => {
    const { usuario, clave } = req.body;
    const [result] = await connect.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    const usuarioEncontrado = result[0];
    if (!usuarioEncontrado) {
        res.status(404).json({ mensaje: 'El usuario no existe' });
    }else{

        const claveCorrecta = await bcrypt.compare(clave, usuarioEncontrado.clave);

        
        if (claveCorrecta) {
            const user = {usuario: usuario};
            const accessToken = generateAccessToken(user);
            return res.header('authorization', accessToken).json({
                message: 'Usuario Autenticado',
                token: accessToken
            });
            
        }else{
            return res.status(401).json({ mensaje: 'Credenciales incorrectas', passord:usuarioEncontrado.clave} );
        }
        
    }
}

//*************************************************************************************** */

//**************************Funciones para generar y validar los tokens*********************************** */

function generateAccessToken (user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '10m'})
}

export const validarToken = (req, res, next) => {
    const accessToken =  req.headers['authorization'] || req.query.accessToken;
    if (!accessToken)  {
        res.send('Acceso denegado');
    }else{    
        jwt.verify(accessToken, process.env.SECRET, (err, user) => {
            if (err) {
                res.send('Acceso denegado, el token ya expiro o es incorrecto')
                
            }else{
                req.user = user;
                next();
            }
        })
        
    }
}

//*************************************************************************************** */

//**************************Funcion para listar usuarios*********************************** */

export const listaUsuarios = async (req, res) => {
    try {
        const [fila] = await connect.query('SELECT * FROM usuarios');
        res.json(fila); 
    } catch (error) {
        return res.status(404).json({
            message: 'Ha ocurrido un error'
        })
    }
}

//*************************************************************************************** */

//**************************Funcion para listar un usuario especifico*********************************** */

export const usuario = async (req, res) => {
    try {
        const id = req.params.id;
        const [fila] = await connect.query('SELECT * FROM usuarios WHERE id = ?', [id]);   
        if (fila.length <= 0) return res.status(404).json({
            message: 'Usuario no encontrado'            
        }) 
        res.json(fila);        
    } catch (error) {
        return res.status(404).json({
            message: 'Ha ocurrido un error'
        })
    }  
}

//*************************************************************************************** */

//**************************Funcion para agregar usuarios*********************************** */

export const agregarUsuario = async (req, res) => {
   const { nombre, usuario, clave } = req.body 
   try {
       const hashedClave = await bcrypt.hash(clave, 10);
       const [fila] = await connect.query('INSERT INTO usuarios (nombre, usuario, clave) VALUES (?, ?, ?)', [nombre, usuario, hashedClave])
       res.send({ 
          id: fila.insertId,
          nombre,
          usuario,
          clave:hashedClave,
        });
   } catch (error) {
    console.error(error); // Imprime el error en la consola
    return res.status(500).json({
        message: 'Error al agregar el usuario',
        error: error.message // Devuelve el mensaje de error
    });
   }
}


//*************************************************************************************** */

//**************************Funcion para vincular*********************************** */

export const vincularUsuario = async (req, res) => {
    const { usuario_id, empresa_id, rol_id } = req.body 
    try {
        const [fila] = await connect.query('INSERT INTO usuarios_empresas (usuario_id, empresa_id, rol_id) VALUES (?, ?, ?);', [usuario_id, empresa_id, rol_id])
        res.send({ 
           id: fila.insertId,
           usuario_id,
           empresa_id,
           rol_id,
         });
    } catch (error) {
     console.error(error); // Imprime el error en la consola
     return res.status(500).json({
         message: 'Error al intentar vincular el usuario',
         error: error.message // Devuelve el mensaje de error
     });
    }
 }

//*************************************************************************************** */

//**************************Funcion para editar usuarios*********************************** */

export const editarUsuario = async (req, res) => {
    const { id } = req.params
    const  { nombre, usuario, clave } = req.body
    try {
        const [result] = await connect.query('UPDATE usuarios SET nombre = IFNULL(?, nombre), usuario = IFNULL(?,usuario), clave = IFNULL(?, clave) WHERE id = ?', [nombre, usuario, clave, id])
        if (result.affectedRows <= 0) {
            return res.status(404).json({
                message: 'usuario no encontrado'
            })       
        }
        const [fila] =  await connect.query('SELECT * FROM usuarios WHERE id = ?', [id])  
        res.json(fila[0])
    } catch (error) {
        return res.status(404).json({
            message: 'usuario no encontrado'
        })
    }
}

//*************************************************************************************** */

//**************************Funcion para eliminar usuarios*********************************** */

export const eliminarUsuario = async (req, res) => {

    const  { id } = req.params;
    const [fila] = await connect.query("DELETE FROM usuarios WHERE id = ?", [id]);
    if (fila.affectedRows <= 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.sendStatus(204);
     
}

//*************************************************************************************** */

//**************************Funcion para Asignar a las empresas el punto de venta*********************************** */

export const asignarPuntoVenta = async (req, res) => {
    const { empresa_id, punto_venta_id } = req.body 
    try {
        const [fila] = await connect.query('INSERT INTO empresas_puntos_venta (empresa_id, punto_venta_id) VALUES (?, ?);', [empresa_id,punto_venta_id])
        res.send({ 
           id: fila.insertId,
           empresa_id,
           punto_venta_id,
         });
    } catch (error) {
     console.error(error); // Imprime el error en la consola
     return res.status(500).json({
         message: 'Error al intentar vincular el usuario',
         error: error.message // Devuelve el mensaje de error
     });
    }
 }

