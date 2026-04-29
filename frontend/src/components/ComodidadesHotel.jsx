import '../styles/ComodidadesHotel.css';
// Iconos
import iconoCama from "../assets/iconos/cama.png";
import iconoBano from "../assets/iconos/bano.png";
import iconoCocina from "../assets/iconos/cocina.png";
import iconoDesayuno from "../assets/iconos/desayuno.png";
import iconoWifi from "../assets/iconos/wifi.png";
import iconoTelevision from "../assets/iconos/television.png";
import iconoCoche from "../assets/iconos/parqueadero.png";
import iconoCajaFuerte from "../assets/iconos/caja-fuerte.png";
import ReglasHotel from '../components/ReglasHotel';

export default function ComodidadesHotel({tipo}) {
    const esSala = tipo.toUpperCase() === "SALA";
    return ( 
        <>
            <div className="ch-contenedor-comodidades">
                <h3 className="ch-h3">COMODIDADES</h3>
                {esSala ? (
                    // Si es una SALA.
                    <p className="ch-text"> 
                        Todas nuestras salas disponen de conexión Wi-Fi gratuita, televisión y parking privado.
                                
                        Están diseñadas para ofrecer una estancia comoda y acogedora, con todo lo necesario para que los huéspedes disfruten de su visita y
                        se sientan como en casa. 
                    </p>
                ):
                    // Si es una HABITACIÓN.
                    <p className="ch-text"> 
                        Todas nuestras habitaciones disponen de conexión Wi-Fi gratuita, televisión, parking privado, servicio de desayuno y caja fuerte.
                                
                        Están diseñadas para ofrecer una estancia comoda y acogedora, con todo lo necesario para que los huéspedes disfruten de su visita y
                        se sientan como en casa. 
                    </p>
                }
            
                    
                <div className="ch-contenedor-comodidades-izq-der"> 
                    <div className="ch-comodidades-izq">
                        <div className="ch-precios-iconos">     
                            <img className="ch-iconos" src={iconoWifi} alt = "Icono rojo WiFi"/>
                            <span className="ch-iconos-texto">WiFi</span>
                        </div>
                
                        <div className="ch-precios-iconos">     
                            <img className="ch-iconos" src={iconoTelevision} alt = "Icono rojo televisión"/>
                            <span className="ch-iconos-texto">Televisión</span>
                        </div>
                
                        <div className="ch-precios-iconos">     
                            <img className="ch-iconos" src={iconoCoche} alt = "Icono rojo coche"/>
                            <span className="ch-iconos-texto">Parqueadero</span>
                        </div>
                            
                    </div>
                    {!esSala && (
                        <>
                            <div className="ch-comodidades-der">
                                <div className="ch-precios-iconos">     
                                    <img className="ch-iconos" src={iconoDesayuno} alt = "Icono rojo desayuno"/>
                                    <span className="ch-iconos-texto">Desayuno</span>
                                </div>
                            
                                <div className="ch-precios-iconos">     
                                    <img className="ch-iconos" src={iconoCajaFuerte} alt = "Icono rojo caja fuerte"/>
                                    <span className="ch-iconos-texto">Caja fuerte</span>
                                </div>
                            </div>  
                        </>

                    )}
                
                </div>
            </div>
        </>
    
    )
}