import { Router } from "express";

import { 
    listaUsuarios,
    usuario,
    agregarUsuario,
    vincularUsuario,
    asignarPuntoVenta,
    editarUsuario,
    eliminarUsuario,
    login,
    validarToken
    } from '../controllers/user.controller.js';

const router = Router();

router.post('/auth', login)

router.get('/users', validarToken, listaUsuarios)

router.get('/users/:id', validarToken, usuario)

router.post('/users', agregarUsuario)

router.post('/vincular', validarToken, vincularUsuario) 

router.post('/asignar', validarToken, asignarPuntoVenta)

router.patch('/users/:id', validarToken, editarUsuario)

router.delete('/users/:id', validarToken, eliminarUsuario)

export default router;