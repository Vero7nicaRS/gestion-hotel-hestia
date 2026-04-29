import "../styles/ReglasHotel.css"
export default function ReglasHotel({tipo}) {

    
    const esSala = tipo.toUpperCase() === "SALA";
    const normasComunes = [
        { id: "dni", texto: "Es obligatorio presentar DNI o pasaporte a la llegada al hotel." },
        { id: "mascotas", texto: "No se permiten mascotas, excepto animales de asistencia." },
        { id: "fumar", texto: "Está prohibido fumar en zonas comunes y habitaciones del hotel." },
        { id: "instalaciones", texto: "Se deben utilizar las instalaciones de manera responsable y respetuosa, evitando ruidos excesivos o comportamientos que puedan molestar a otros huéspedes." },
        { id: "descanso", texto: "Se debe respetar el descanso de los demás huéspedes, especialmente durante la noche." },
        { id: "personal", texto: "Se debe ser respetuoso con el personal del hotel y otros huéspedes." },
        { id: "daño", texto: "Cualquier daño material, el huesped es responsable del mismo y deberá abonar el coste de reparación o reposición." }
    ];

    const normasHabitacion = [
        { id: "fiestas", texto: "Está prohibido realizar fiestas o eventos en las habitaciones del hotel." }
    ];
    const normasSala = [
        { id: "estadoSala", texto: "Se debe devolver la sala en un estado similar al que se entregó, limpia y ordenada." },
    ]

    const normas = esSala ? [...normasComunes, ...normasSala] 
                          : [...normasComunes, ...normasHabitacion];
    return(
        <div className="rh-contenedor-reglas">
            <h3 className="rh-h3">REGLAS</h3>       

            <div className="rh-contenedor-reglas-izq-der"> 

                {esSala ? (
                    // Si es una SALA.
                      <>
                        <div className="rh-reglas-check-in">
                            <h4 className="rh-h4">Inicio de la reserva</h4>
                            <ul className="rh-reglas-check-inout-guiones"> 
                                <li>
                                    A partir de la hora reservada.
                                </li>
                            </ul>
                        </div>
                        <div className="rh-reglas-check-out">
                            <h4 className="rh-h4">Fin de la reserva</h4>
                            <ul className="rh-reglas-check-inout-guiones">
                                <li>
                                    Hasta la hora reservada.
                                </li>
                            </ul>
                        </div>  
                    </> 
                ) : (
                    // Si es una HABITACIÓN.
                   <>
                        <div className="rh-reglas-check-in">
                            <h4 className="rh-h4">Check-in</h4>
                            <ul className="rh-reglas-check-inout-guiones"> 
                                <li>
                                    A partir de las 14:00 horas.
                                </li>
                            </ul>
                        </div>
                        <div className="rh-reglas-check-out">
                            <h4 className="rh-h4">Check-out</h4>
                            <ul className="rh-reglas-check-inout-guiones">
                                <li>
                                Hasta las 12:00 horas.
                                </li>
                            </ul>
                        </div>  
                    </>   
                )}


                <div className="rh-reglas-check-in">
                    <h4 className="rh-h4">Normas del hotel</h4>

                    <ul className="rh-reglas-check-inout-guiones"> 
                        {normas.map ((norma) => (
                            <li key={norma.id}>{norma.texto}</li>
                        ))}  
                    </ul>
                    <p className="rh-text"> 
                        El incumplimiento de estas normas puede provocar la <b>cancelación</b> de la reserva <b>sin reembolso</b>. 
                        En casos graves, en la <b>expulsión</b> del hotel sin derecho a reembolso.
                    </p>
                </div>
            </div>

        </div>
    )
}
