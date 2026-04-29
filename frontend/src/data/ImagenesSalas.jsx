// Importar imágenes locales
import SalaEco1 from '../assets/salas/Sala-eco-1.jpg'
import SalaEco2 from '../assets/salas/Sala-eco-2.jpg'
import SalaEco3 from '../assets/salas/Sala-eco-3.jpg'
import SalaEco4 from '../assets/salas/Sala-eco-4.jpg'

import SalaPro1 from '../assets/salas/Sala-pro-1.jpg'
import SalaPro2 from '../assets/salas/Sala-pro-2.webp'
import SalaPro3 from '../assets/salas/Sala-pro-3.png'
import SalaPro4 from '../assets/salas/Sala-pro-4.jpg'
// Es un objeto que contiene las imágenes de cada tipo de sala, relacionadas por su id.
const ImagenesSalas = {
  eco: [
    { id: "eco-1", src: SalaEco1 },
    { id: "eco-2", src: SalaEco2 },
    { id: "eco-3", src: SalaEco3 },
    { id: "eco-4", src: SalaEco4 },
  ],
  pro: [
    { id: "pro-1", src: SalaPro1 },
    { id: "pro-2", src: SalaPro2 },
    { id: "pro-3", src: SalaPro3 },
    { id: "pro-4", src: SalaPro4 },
  ]
};

export default ImagenesSalas;