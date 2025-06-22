//Exportamos el modulo que que contiene la contraseña JWT y el tiempo en que expirael token
module.exports = {
  secret: process.env.JWT_SECRET || 'contraseñaSecretaDeMIAT',
  expiresIn: '1h' // El token expira en 1 hora
};