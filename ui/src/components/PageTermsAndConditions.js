import React, {Component} from "react";
import {withRouter, Link} from "react-router-dom";
import {Button, Header, Icon} from "semantic-ui-react";
import {AppContext, setData} from "../context";
import {MENU} from "../enums";

const MenuHeaderRender = ({history}) => {
    return <>
        <Button className={'header-back-arrow'} icon onClick={() => history.goBack()}>
            <Icon name={'arrow left'}/>
        </Button>
        Términos de uso
    </>
}

class PageTermsAndConditions extends Component {
    static contextType = AppContext

    render2() {
            return (
                <>
                        TÉRMINOS Y CONDICIONES GENERALES DE USO DEL SITIO

                        Los presentes Términos y Condiciones Generales de Uso (en adelante, los “Términos y Condiciones”) regulan el acceso y utilización, por parte del Usuario (conforme se define más adelante), de la página web Leandro Hereñu CUIT 20-38635468-6.app (en adelante, “la Página Web”), así como la contratación de productos y servicios a través de la misma.

                        La Página Web es propiedad de Leandro Hereñu CUIT 20-38635468-6 (MIDIRECCION, CABA), CUIT MICUIT y es operada por él y/o por quién él designe (en adelante “los Administradores”, indistintamente).

                        El Usuario (conforme se define más adelante) deberá sujetarse a estos Términos y Condiciones, junto con todas las demás políticas y principios que rigen a la Página Web y que son incorporados al presente por referencia.

                        CUALQUIER PERSONA QUE NO ACEPTE ESTOS TÉRMINOS Y CONDICIONES Y LOS PARTICULARES QUE LE RESULTAREN APLICABLES, LOS CUALES TIENEN CARÁCTER DE OBLIGATORIOS Y VINCULANTES, DEBERÁ ABSTENERSE DE UTILIZAR LA PÁGINA WEB Y/O CUALQUIER OTRO SERVICIO DE LOS ADMINISTRADORES RELACIONADO CON LA PÁGINA WEB.

                        El Usuario deberá leer, entender y aceptar todas las condiciones establecidas en los Términos y Condiciones y demás documentos incorporados a éstos por referencia, previo a su registro como Usuario de Leandro Hereñu CUIT 20-38635468-6.

                        A. Capacidad

                        Por medio de la aceptación de los presentes Términos y Condiciones, el Usuario declara:

                        Que ha leído y comprende lo expuesto en el presente instrumento; que es una persona con capacidad suficiente para contratar conforme a la legislación de su país, con el fin de dar plena validez, eficacia y utilidad práctica a todas y cada una de las estipulaciones de los presentes Términos y Condiciones; que asume todas las obligaciones aquí dispuestas.

                        El mero hecho de la navegación y/o utilización de la Página Web atribuye a quien lo realice la condición de Usuario de la misma (previamente y en adelante, “el Usuario”) e implica la aceptación de estos Términos y Condiciones en todas y cada una de sus partes. En consecuencia, no podrán utilizar los servicios de la Página Web las personas que no tengan capacidad para contratar, los menores de edad y/o quienes hayan sido suspendidos o inhabilitados por los Administradores para utilizar la Página Web.

                        B. Modificaciones

                        El Usuario deberá leer atenta y comprensivamente los presentes Términos y Condiciones cada vez que acceda a la Página Web, ya que ambos pueden sufrir modificaciones.

                        La Página Web se reserva el derecho de modificar, a su sola discreción, los Términos y Condiciones en cualquier momento, o suspender, cambiar o terminar el Servicio, lo cual se publicará oportunamente en la Página Web. Toda modificación será comunicada con una antelación de 10 (diez) días a su entrada en vigencia. En caso de no estar de acuerdo con dichas modificaciones, dentro del plazo de 10 (diez) días de comunicada la modificación, el Usuario deberá comunicar vía e-mail a la casilla info@Leandro Hereñu CUIT 20-38635468-6.app que no acepta las mismas; en ese caso quedará disuelto el vínculo contractual y será inhabilitado como Usuario. Vencido este plazo, se considerará que el Usuario acepta los nuevos Términos y Condiciones, los que regirán la relación contractual a partir de su entrada en vigencia.

                        C. Condiciones de Uso

                        1. Acceso a la Página Web.

                        El acceso a la Página Web y el registro en la Página Web son gratuitos, salvo en lo relativo al coste de la conexión a través de la red de telecomunicaciones suministrada por el proveedor de acceso contratado (ISP) por el Usuario, que estará a su exclusivo cargo.

                        2. Necesidad de Registro

                        Por regla general, para el acceso a los contenidos de la Página Web no será necesario el registro del Usuario. No obstante ello, la utilización de determinados servicios estará condicionada al registro previo del Usuario, quien deberá completar todos los campos del formulario de inscripción con datos válidos (en adelante el “Usuario Registrado”). Quien aspire a convertirse en Usuario Registrado deberá verificar que la información que pone a disposición de la Página Web y los Administradores a fin de registrarse en la Página Web sea exacta, precisa y verdadera (en adelante los “Datos Personales”); asimismo asumirá el compromiso de actualizar los Datos Personales cada vez que los mismos sufran modificaciones. Los Administradores podrán utilizar diversos medios para identificar a los Usuarios Registrados, pero no se responsabilizan por la certeza de los Datos Personales que sus Usuarios Registrados pongan a su disposición. Los Usuarios Registrados garantizan y responden, en cualquier caso, de la veracidad, exactitud, vigencia y autenticidad de los Datos Personales puestos a disposición de los Administradores mediante la Página Web.

                        El Usuario Registrado podrá subir, dar de alta, incorporar y/o ingresar un proyecto (en adelante un “Proyecto”), mediante los procedimientos, mecanismos y con pleno respeto a estos Términos y Condiciones.

                        Los Términos y Condiciones serán de aplicación tanto para los Usuarios como para los Usuarios Registrados.

                        3. Obligación de mantener actualizados los Datos Personales.

                        Los Datos Personales introducidos por todo Usuario Registrado en la Página Web, deberán ser exactos, actuales y veraces en todo momento. Los Administradores se reservan el derecho de solicitar algún comprobante y/o dato adicional a efectos de corroborar los Datos Personales, y de suspender temporal y/o definitivamente a aquellos Usuarios Registrados cuyos datos no hayan podido ser confirmados. La baja o inhabilitación de un Usuario Registrado podrá implicar la baja de todos los proyectos que hubiere publicado, sin que ello genere derecho a resarcimiento o indemnización alguna.

                        4. Acceso a la cuenta personal y obligación de confidencialidad de la Clave de Seguridad.

                        Para transformarse en Usuario Registrado, el Usuario tendrá acceso a una cuenta personal ("Cuenta") mediante el ingreso de una cuenta de mail personal, su nombre y apellido y clave de seguridad personal elegida ("Clave de Seguridad"). Esta Clave de Seguridad es personal e intransferible. El Usuario Registrado se obliga a mantener en estricta confidencialidad su Clave de Seguridad. El Usuario Registrado será, en todo caso, responsable por todo daño, perjuicio, lesión o detrimento que del incumplimiento de esta obligación de confidencialidad se genere por cualquier causa.

                        Es posible que un Usuario se registre en la Página Web a través de su cuenta personal en una red social u otra página web ("Cuenta Personal"), y acceda a la Página Web a través de ella. En este caso, el Usuario consiente expresamente que la Página Web acceda, en cualquier momento, a la información contenida en su Cuenta Personal, que el usuario accede a compartir al momento de registrarse en la Página Web.

                        La Cuenta es personal, única e intransferible, y está prohibido que un mismo Usuario Registrado registre o posea más de una Cuenta. En caso que los Administradores que correspondan, detecte distintas Cuentas que contengan datos coincidentes o relacionados, podrá cancelarlas, suspenderlas o inhabilitarlas, a su sola discreción, siendo el mismo motivo suficiente para dar de baja al Usuario Registrado, incluso en su primer Cuenta. El Usuario Registrado será responsable por todas las operaciones efectuadas desde su Cuenta, pues el acceso a la misma está restringido al ingreso y uso de su Clave de Seguridad, de conocimiento exclusivo del Usuario y cuya confidencialidad es de su exclusiva responsabilidad. El Usuario Registrado se compromete a notificar a los Administradores, en forma inmediata y por medio idóneo, fehaciente, eficiente y eficaz, cualquier uso no autorizado de su Cuenta, así como el ingreso por terceros no autorizados a la misma. La notificación de ningún modo liberará de responsabilidad por su Cuenta al Usuario ni transferirá responsabilidad a la Página Web. Se encuentra prohibida la venta, cesión, transferencia o transmisión de la Cuenta bajo cualquier título, ya sea oneroso o gratuito.

                        Los Administradores se reservan el derecho de rechazar cualquier solicitud de registro o de cancelar un registro previamente aceptado, cuando a su sola discreción considere que no se ha dado cumplimiento a la totalidad de las pautas establecidas en los Términos y Condiciones, sin que esté obligado a comunicar o exponer las razones de su decisión y sin que ello genere derecho a indemnización o resarcimiento alguno a favor del Usuario Registrado alcanzado por dicha decisión.

                        5. Normas generales de utilización de la Página Web.

                        Los servicios ofrecidos en la Página Web se dirigen exclusivamente a personas mayores edad.

                        El Usuario y/o el Usuario Registrado, manifiesta, garantiza y declara que tiene la edad legal para formalizar un contrato vinculante, plenamente válido y eficaz, y que toda la información de registro que presenta es exacta, veraz y actualizada.

                        El Usuario y/o el Usuario Registrado, se obliga a utilizar la Página Web y todo su contenido y servicios conforme a lo establecido en la ley, la moral, el orden público y los presentes Términos y Condiciones que en cada caso resulten aplicables. Asimismo, se obliga a hacer un uso adecuado de los servicios y/o contenidos de la Página Web y a no emplearlos para realizar actividades ilícitas o constitutivas de delito, que atenten contra los derechos de terceros y/o que infrinjan la regulación sobre propiedad intelectual e industrial, o cualesquiera otras normas del ordenamiento jurídico que puedan resultar aplicables y, en especial, el principio de buena fe que obliga a actuar leal, correcta y honestamente tanto en los tratos preliminares, celebración y ejecución de todo contrato. Como consecuencia de lo anterior, el Usuario se obliga a no difundir, transmitir, introducir y poner a disposición de terceros, cualquier tipo de material e información (datos, contenidos, mensajes, dibujos, archivos de sonido e imagen, fotografías, software, etc.) que sean contrarios a la ley, la moral, el orden público, los presentes Términos y Condiciones, que resulten aplicables.

                        A título meramente enunciativo, y en ningún caso limitativo, taxativo o excluyente, el Usuario y/o el Usuario Registrado, se compromete a:

                        (a) No introducir o difundir contenidos o propaganda de carácter racista, xenófobo o, en general, discriminatorio, pornográfico, de apología del terrorismo o que atenten, vulneren o pudieren atentar o vulnerar los derechos humanos. (b) No introducir o difundir en la red programas de datos (virus y/o software nocivos) susceptibles de provocar daños en los sistemas informáticos de Leandro Hereñu CUIT 20-38635468-6, sus proveedores, terceros o, en general, cualquier usuario de la red Internet. (c) No difundir, transmitir o poner a disposición de terceros cualquier tipo de información, elemento o contenido que atente contra los derechos fundamentales y las libertades públicas reconocidos constitucionalmente y en los tratados internacionales. (d) No difundir, transmitir o poner a disposición de terceros cualquier tipo de información, elemento o contenido que constituya publicidad ilícita o desleal.(e) No introducir o difundir cualquier información y contenidos falsos, ambiguos o inexactos de forma que induzca a error a los receptores de la información. (f) No difundir, transmitir o poner a disposición de terceros cualquier tipo de información, elemento o contenido que suponga una violación de los derechos de propiedad intelectual e industrial, patentes, marcas o copyright que correspondan a la Compañía o a terceros. (h) No difundir, transmitir o poner a disposición de terceros cualquier tipo de información, elemento o contenido que suponga una violación del secreto de las comunicaciones y la legislación de datos de carácter personal y, en general, toda las normas jurídicas que regulen la protección y promoción del respeto a la vida privada e intimidad de las personas y sus familias.

                        El Usuario y/o el Usuario Registrado, se obliga a mantener indemne a los Administradores ante cualquier posible reclamación, multa, pena, sanción o indemnización que pueda venir obligada a soportar como consecuencia del incumplimiento por parte del Usuario de cualquiera de las normas de utilización antes indicadas, reservándose, además, la Página Web, el derecho a solicitar la indemnización por daños y perjuicios que corresponda. Asimismo, se reserva el derecho de anular la Cuenta de Usuarios Registrados.

                        6. Responsabilidad de la Página Web que corresponda.

                        Por cuanto la Página Web sólo pone a disposición de los Usuarios un espacio virtual que permite a los Usuarios Registrados poner sus Proyectos a disposición de los Usuarios y/o Usuarios Registrados mediante internet:

                        (a) La Página Web no asume ninguna responsabilidad sobre la actualización de la Página Web, en especial, respecto del contenido o información, ni garantiza que la información publicada contenida en la Página Web sea precisa ni completa. Por lo tanto, cada Usuario será responsable de confirmar que la información publicada en la Página Web sea precisa y completa antes de tomar alguna decisión relacionada con cualquier servicio o contenido descrito en la misma. (b) El acceso del Usuario a la Página Web no implica para los Administradores la obligación de informar, controlar o, actuación alguna referente a la ausencia o presencia de virus, gusanos o cualquier otro elemento informático dañino. Los Usuarios no podrán imputarle responsabilidad alguna a los Administradores, ni exigir indemnización bajo ningún concepto, por los perjuicios resultantes de dificultades técnicas o fallas en los sistemas o en internet. (c) Los Administradores no garantizan el acceso y uso continuado e ininterrumpido de la Página Web. La Página Web puede eventualmente no estar disponible debido a dificultades técnicas o fallas de internet, o por cualquier otra circunstancia ajena y no imputable a los Administradores. Los Administradores no serán responsables por ningún error u omisión contenidos en la Página Web. (d) Corresponde al Usuario, en todo caso, la disponibilidad de herramientas adecuadas para la detección y desinfección de programas informáticos dañinos. (e) Los Administradores no se responsabilizan de los daños o perjuicios de cualquier tipo producidos en el Usuario a causa de fallos o desconexiones en las redes de telecomunicaciones que produzcan la suspensión, cancelación o interrupción del servicio de la Página Web durante la prestación del mismo o con carácter previo. (f) Los Administradores no se hacen responsables de la actuación de los Usuarios Registradores que cargan sus Proyectos en la Página Web. Los Administradores no son propietarios ni poseedores de los Proyectos publicados, ni los ofrecen en venta. Los Administradores no intervienen en la entrega de las Recompensas por parte de los Usuarios Creadores ni en las características por ellos estipuladas para las mismas, por ello no serán responsables respecto de la existencia, calidad, cantidad, disponibilidad, estado, integridad, legitimidad o condiciones de entrega de las Recompensas ofrecidas, así como de la capacidad para contratar de los Usuarios Creadores o de la veracidad de los Datos Personales por ellos ingresados. El Usuario Registrado conoce y acepta ser el exclusivo responsable por los Proyectos que publica y que no existe ninguna restricción y/o que cuenta con las autorizaciones necesarias para su publicación. Asimismo los Administradores no intervienen en la entrega de Contribuciones por parte de los Usuarios Registrados, por lo que no será responsable respecto de la existencia, procedencia, cantidad, estado, integridad o legitimidad de los Contribuciones, así como de la capacidad para contratar de los Usuarios Registrados o de la veracidad de los Datos Personales por ellos ingresados.

                        Debido a que los Administradores no tienen ninguna participación durante todo el tiempo en que el Proyecto se publica, difunde, promociona o publicita con la finalidad de recaudar fondos, no será responsable por el efectivo cumplimiento de las Recompensas ofrecidas por los Usuarios Registrados. El Usuario conoce y acepta que al realizar operaciones con otros Usuarios o terceros lo hace bajo su propio riesgo. En ningún caso los Administradores serán responsable por lucro cesante, o por cualquier otro daño y/o perjuicio que haya podido sufrir el Usuario, debido a los Proyectos publicados a través de Leandro Hereñu CUIT 20-38635468-6.

                        Dado que la Página Web es un medio para el encuentro entre Usuarios y/o Usuarios Registrados, y siendo que los Administradores no participan de las prestaciones que se realizan entre aquellos, el Usuario y/o Usuario Registrado será responsable por todas las obligaciones fiscales y cargas impositivas que correspondan por su Proyecto y las Recompensas ofrecidas, sin que pudiera imputársele a los Administradores algún tipo de responsabilidad por incumplimientos en tal sentido.

                        Los Administradores se reservan el derecho de cancelar los Proyectos promocionados a través de la Página Web sin previo aviso y por cualquier motivo, cuando a su sola discreción considere que no se ha dado cumplimiento a la totalidad de las pautas establecidas en los Términos y Condiciones.

                        7. Contenidos y servicios enlazados a través de la Página Web.

                        El servicio de acceso a la Página Web puede incluir dispositivos técnicos de enlace, directorios e incluso instrumentos de búsqueda que permitan al Usuario acceder a otras páginas y portales de Internet (en adelante, “Sitios Enlazados”). En estos casos los Administradores no serán responsables de los contenidos y servicios suministrados en los Sitios Enlazados.

                        En el supuesto que el Usuario considere que existe un Sitio Enlazado con contenidos ilícitos o inadecuados podrá comunicárselo a los Administradores, sin que en ningún caso esta comunicación conlleve la obligación de los Administradores de retirar el correspondiente enlace.

                        En ningún caso, la existencia de Sitios Enlazados debe presuponer la formalización de acuerdos ni asociación con los responsables o titulares de los mismos, ni la recomendación, promoción o identificación de la Página Web o los Administradores con las manifestaciones, contenidos o servicios proveídos por dichos sitios.

                        Los Administradores no conocen los contenidos y servicios de los Sitios Enlazados y, por tanto, no se hacen responsables por los daños producidos por la ilicitud, calidad, desactualización, indisponibilidad, error e inutilidad de los contenidos y/o servicios de los Sitios Enlazados ni por cualquier otro daño que no les sea directamente imputable.

                        8. Propiedad intelectual e industrial.

                        Todos los contenidos de la Página Web, entendiendo por éstos, a título meramente enunciativo y no taxativo, los textos, fotografías, gráficos, imágenes, iconos, tecnología, software, links y demás contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente, son propiedad intelectual de los Administradores, sin que puedan entenderse cedidos al Usuario ninguno de los derechos de explotación reconocidos por la normativa vigente en materia de propiedad intelectual sobre los mismos. Asimismo, las marcas, nombres comerciales o signos distintivos son propiedad de los Administradores o terceros, sin que pueda entenderse que el acceso a la Página Web atribuye algún derecho sobre los mismos.

                        El Usuario Registrado declara y garantiza que los proyectos que publique en la Página Web serán únicamente obras originales, creadas por él mismo y que de ningún modo se tratará de copias o reproducciones que violen derechos de propiedad intelectual de terceros. Los Administradores podrán cancelar las Cuentas de aquellos Usuarios Registrados que infrinjan cualquier derecho de propiedad intelectual de terceros. Los Administradores podrán eliminar los materiales constitutivos de infracción de conformidad con la normativa vigente de propiedad intelectual e industrial.

                        Los Administradores no poseerán ningún derecho de propiedad sobre el contenido de los proyectos publicados por los Usuarios Registrados en la Página Web. Sin embargo, el Usuario Registrado otorga a los Administradores una licencia gratuita y no exclusiva, para todo el ámbito territorial mundial y por el máximo período legal de protección, en virtud de la cual podrán: comunicar públicamente, reproducir, distribuir y transformar el contenido del proyecto para poder desempeñar el servicio.

                        Cualquier intromisión, tentativa o actividad violatoria o contraria a las leyes sobre derecho de propiedad intelectual y/o a las prohibiciones estipuladas en este contrato harán pasible a su responsable de las acciones legales pertinentes, y a las sanciones previstas por este acuerdo, así como lo hará responsable de indemnizar los daños ocasionados.

                        9. Sanciones

                        Sin perjuicio de otras medidas, los Administradores podrán advertir, suspender en forma temporal o inhabilitar definitivamente la cuenta de un Usuario Registrado, iniciar las acciones que estimen pertinentes y/o suspender la prestación de sus servicios, si; (a) se quebranta o incumple alguna ley, o cualquiera de las estipulaciones de los presentes Términos y Condiciones y/o demás políticas de Leandro Hereñu CUIT 20-38635468-6; (b) incumple sus obligaciones como Usuario Registrado; (c) no pudiere verificarse la identidad del Usuario Registrado o cualquier información proporcionada por el mismo fuere errónea; o, (d) si se incurriera a criterio de los Administradores, en conductas o actos dolosos o fraudulentos. En el caso de suspensión o inhabilitación de un Usuario Registrado, todos sus Proyectos podrán ser removidos por los Administradores de la Página Web.

                        10. Tarifas

                        La Página Web no es un procesador de pagos. Los pagos son hechos por el Usuario al el Usuario Registrado utilizando los servicios de un tercero. Al usar la Página Web el Usuario y/o el Usuario Registrado aceptan los términos y condiciones del procesador de pagos, que será el único responsable por cualquier asunto relacionado con el pago. Los Administradores se reservan el derecho a cobrar tarifas por cualquier tipo de transacción y/o a cobrar tarifas por encima de las cobradas por el procesador de pagos.

                        11. Impuestos

                        El Usuario y/o el Usuario Registrado es responsable de determinar cuáles impuestos aplican y/o deberá pagar, y pagar cualquier impuesto asociado con su uso de la Página Web.

                        12. Indemnidad

                        El Usuario indemnizará y mantendrá indemnes a los Administradores, sus filiales, empresas controladas y/o controlantes, directores administradores, representantes y empleados, por cualquier reclamo o demanda de otros Usuarios o de terceros por sus actividades en la Página Web o por el incumplimiento de los Términos y Condiciones, de las demás políticas que se entienden incorporadas al presente instrumento incluyendo los honorarios de abogados en una cantidad razonable.

                        13. Nulidad e ineficacia de las cláusulas.

                        Si cualquier cláusula incluida en los Términos y Condiciones fuese declarada total o parcialmente, nula o ineficaz en alguna de las jurisdicciones en las que los Administradores tienen presencia, tal nulidad o ineficacia tan sólo afectará a dicha disposición o a la parte de la misma que resulte nula o ineficaz, subsistiendo los Términos y Condiciones en todo lo demás, considerándose tal disposición total o parcialmente no incluida o aplicable en aquella jurisdicción.

                        14. Privacidad de la información.

                        Para utilizar los Servicios ofrecidos por los Administradores o la Pagina Web, los Usuarios que deseen convertirse en Usuarios Registrados, se obligan a facilitar determinados datos de carácter personal prestando su consentimiento para el uso del website. Su información personal se procesa y almacena en servidores o medios magnéticos que mantienen altos estándares de seguridad y protección tanto física como tecnológica. Los Administradores de la Página Web se reservan el derecho a hacer uso y ceder a terceros la información personal procesada y almacenada.

                        15. Alcance de los servicios de la Página Web.

                        Este acuerdo no crea ningún contrato de sociedad, de mandato, de franquicia, o relación laboral entre el Usuario y los Administradores. El Usuario reconoce y acepta que los Administradores no son parte en ninguna operación, ni tienen control alguno sobre la calidad, seguridad o legalidad de los proyectos publicados y la veracidad o exactitud de sus características. Los Administradores no pueden asegurar que un Usuario Registrado completará el proyecto publicado y entregará las recompensas prometidas ni podrán verificar la identidad o Datos Personales ingresados por los Usuarios Registrados. Los Administradores no garantizan la veracidad de la publicidad de terceros que aparezca en el sitio y no será responsable por la correspondencia y/o contratos que el Usuario celebre con dichos terceros o con otros Usuarios.

                        16. Preguntas frecuentes.

                        Las respuestas a preguntas frecuentes vinculadas a la participación de los Usuarios constituyen una descripción genérica que sólo tiene propósitos de información general. Las respuestas a las preguntas frecuentes no hacen referencia a todas las consecuencias legales, impositivas, cambiarias posibles relacionadas con la participación de los Usuarios y/o de los Usuarios Registrados. Las respuestas a las preguntas frecuentes no implican en ningún caso asesoramiento legal o impositivo por parte de los Administradores. Estos Términos y Condiciones prevalecerán siempre sobre el contenido de la información relativa a Preguntas Frecuentes.

                        17. Legislación aplicable y jurisdicción competente.

                        Estos Términos y Condiciones se regirán o interpretarán conforme a la legislación de la República Argentina. Los Administradores y el Usuario podrán someter cualquier controversia que pudiera suscitarse de la prestación de los productos o servicios objeto de éstos Términos y Condiciones, a los Juzgados y Tribunales de la Ciudad Autónoma de Buenos Aires, a menos que legalmente se establezca lo contrario con carácter de orden público.

                        © 2023 Leandro Hereñu CUIT 20-38635468-6.
                </>
            )
    }

    componentDidMount() {
        this.context.dispatch(setData({MenuHeaderRender: <MenuHeaderRender history={this.props.history}/>}))
    }

    render() {
        return (
            <>
                <p>Gracias por usar una de nuestras aplicaciones. Lea esto detenidamente antes de utilizarla.</p>

                <p>Estos Términos de uso ("Términos") establecen información importante sobre sus derechos, obligaciones y las restricciones que pueden aplicarse cuando utiliza cualquier aplicación de Beauty Of Strength Team ("Aplicación").</p>

                <p>Estos Términos rigen la relación entre usted y Leandro Hereñu CUIT 20-38635468-6 cuando accede y utiliza nuestro Servicios. Cualquier referencia a "usted" o "su", significa usted como usuario de la Aplicación. Cualquier referencia a "nosotros", "Nosotros", "nuestro" es para el equipo de Beauty Of Strength.</p>

                <p>Le recomendamos que lea estos Términos detenidamente antes de usar la Aplicación. Al acceder y continuar utilizando la Aplicación, usted acepta las obligaciones legales de estos Términos. Si no esta de acuerdo con los Términos, debe descontinuar el uso de la Aplicación. Usted acepta cumplir con las leyes de propiedad intelectual, y todos los términos y condiciones de estos Términos.</p>

                <p>Usted declara que tiene 18 años o más.</p>

                <p>AVISO IMPORTANTE: Antes de participar en cualquier programa de ejercicios, consulte a su médico. No haga uso de los programas, planificaciones y rutinas de ejercicios si está embarazada, tiene lesiones o una afección médica, o es mayor de 65 años de edad.</p>

                <p>Para aprovechar los beneficios de la aplicación y los programas, planificaciones y rutinas cargadas en él, es importante que honre sus habilidades personales y limitaciones.</p>

                <p>Si siente algún dolor o molestia mientras practica, tome un descanso o pare por completo. Si no estás seguro de su capacidad, consulte a un médico antes de comenzar.</p>

                <p>Los programas, planificaciones y rutinas no proporcionan orientación médica, sino que se basan en que usted escuche a su cuerpo y se mueva conscientemente y respetando sus capacidades.</p>

                <p>Los creadores, productores y distribuidores de los programas, planificaciones y rutinas no aceptan ninguna responsabilidad por cualquier lesión o accidente incurrido como resultado de seguir los ejercicios en ellos descriptos.</p>

                <p>Sujeto a los términos de estos Términos, Beauty Of Strength Team le otorga una licencia limitada, no exclusiva, no transferible, revocable, de alcance limitado, sin derecho a sublicencia, para utilizar la Aplicación con el fin de ver y usar la Aplicación y el contenido de acuerdo con estos Términos.</p>

                <p>Esta aplicación contiene material con derechos de autor, secretos comerciales y otro material patentado. Usted no deberá, y no deberá intentar en ningún momento, modificar, realizar ingeniería inversa, desmontar, descompilar, mostrar, transmitir o vender, en cualquier forma o por cualquier medio, la Aplicación. Tampoco puede crear trabajos derivados u otros trabajos basados o derivados de la Aplicación en forma total o parcial, y cualquier tipo de reproducción o redistribución de materiales que no cumpla con estos Términos, se encuentra expresamente prohibido.</p>

                <p>Todos los materiales que forman parte de la Aplicación (incluidos, entre otros, diseños, texto, gráficos, aplicaciones, software, música, sonido, video y otros archivos) están protegidos por la ley contra su uso no autorizado. La ley de derechos de autor y las disposiciones de los tratados internacionales de derechos de autor protegen todo el contenido de la aplicación.</p>

                <p>Todos los derechos de propiedad intelectual en la Aplicación serán, en todo momento, únicos y exclusivos, y propiedad del equipo Beauty Of Strength o sus licenciantes.</p>

                <p>Aparte de una licencia limitada, personal, revocable, intransferible y no sublicenciable para usar la Aplicación, no tiene ningún derecho o título en la Aplicación ni en ninguno de los contenidos que contiene. Usted acepta no utilizar la aplicación para actuaciones públicas.</p>

                <p>El equipo de Beauty Of Strength tiene el derecho absoluto y exclusivo de administrar, regular, controlar, modificar y/o eliminar contenido audiovisual según lo considere conveniente, y el equipo de Beauty Of Strength no será responsable ante usted por el ejercicio de tal derecho.</p>

                <p>Deberá utilizar la Aplicación de conformidad con todas las leyes aplicables, y no con propósito ilegal. Sin limitar lo anterior, cualquier uso, visualización o distribución de la Aplicación junto con material pornográfico, racista, vulgar, obsceno, difamatorio, calumnioso, abusivo, promoviendo el odio, discriminando o mostrando prejuicios basados en religión, etnia, raza, orientación sexual o edad, están estrictamente prohibidas.</p>

                <p>El uso de la Aplicación también se rige por nuestra Política de privacidad, que se incorpora a estos términos y condiciones por esta referencia. Para ver la Política de privacidad, haga clic en {<Link to={'/privacy-policies'}>este enlace</Link>}.</p>

                <p>Usted acepta que su uso de la Aplicación será bajo su propio riesgo. La solicitud se proporciona con base en "en el estado en el que se encuentra" y "según disponibilidad". La calidad de la visualización del contenido de video dentro de la aplicación varía de un dispositivo a otro y está sujeto a la calidad de la conectividad a Internet del dispositivo. Usted es responsable de todos los cargos de acceso a internet. De ser necesario, consulte con su proveedor de internet para información sobre posibles cargos por uso de datos de Internet.</p>

                <p>En la medida permitida por la ley, Beauty Of Strength Team, sus funcionarios, directores, empleados y los agentes renuncian a todas las garantías, expresas o implícitas, en relación con la Aplicación y su uso (usuario) de los mismos, incluidas las garantías implícitas de título, comerciabilidad, idoneidad para un propósito particular o no incumplimiento, precisión, autoridad, integridad, utilidad y oportunidad.</p>

                <p>No hacemos ninguna declaración, promesa o garantía de que la Aplicación estará libre de errores u omisiones ni que estará disponible ininterrumpidamente y en condiciones de funcionamiento completo y excluyen expresamente otras garantías, expresas o implícitas, orales o escritas, que incluyen, entre otras, cualquier garantía implícita de calidad comercial o idoneidad para un propósito particular. No asumimos ninguna obligación o responsabilidad por (i) errores, equivocaciones o imprecisiones de contenido, (ii) lesiones personales o daños a la propiedad, de cualquier naturaleza, como resultado de su acceso y uso de la Aplicación, (iii) cualquier uso o acceso no autorizado de nuestros servidores seguros y/o cualquier información personal y/o información financiera almacenada en el mismo, (iv) cualquier interrupción o cese de transmisión desde o hacia la Aplicación, (v) cualquier error, virus, troyano o similar que pueda transmitirse hacia o a través de la Aplicación por parte de un tercero, o (vi) en el caso de que la Aplicación sea descontinuada o modificada en forma parcial o total.</p>

                <p>En ningún caso (incluido, entre otros, el caso de negligencia), Beauty Of Strength, sus funcionarios, directores, empleados y agentes serán responsables de cualquier daño consecuencial, incidental, directo, indirecto, especial o punitivo de cualquier tipo (incluidos, entre otros, daños por pérdida de ganancias, pérdida de uso, interrupción del negocio, pérdida de información o datos, o pérdida pecuniaria), en relación con o derivada de o relacionado con este Acuerdo, la Aplicación o el uso o la imposibilidad de usar la Aplicación para el suministro, el desempeño o el uso de cualquier otro asunto a continuación, ya sea por contrato, agravio o cualquier otra teoría, ya sea que el equipo de Beauty Of Strength haya sido informado o no de la posibilidad de estos daños. La limitación de responsabilidad anterior se aplicará en la mayor medida permitida por la ley en el jurisdicción aplicable.</p>

                <p>Usted indemnizará, mantendrá indemne y defenderá al equipo de Beauty Of Strength, sus funcionarios, directores, empleados y agentes contra todos y cada uno de los reclamos, procedimientos, demandas y costos resultantes de, o de alguna manera conectados con su uso de la Aplicación.</p>

                <p>Estos Términos están disponibles en español y se regirán e interpretarán de acuerdo con las leyes de Argentina. Las disputas que surjan en relación con estos Términos de uso estarán sujetas a la exclusiva jurisdicción de los tribunales de Argentina. Si alguna disposición se considera ilegal, nula o de otra manera inaplicable, entonces esa disposición se considerará separable de este Acuerdo y no afectará la validez y aplicabilidad de cualquier otra disposición.</p>

                <p>El equipo de Beauty Of Strength se reserva el derecho, a su exclusivo criterio, de modificar estos Términos en cualquier momento, y es su responsabilidad de revisar estos Términos para cualquier cambio. Notificaremos cualquier cambio en la parte superior de estos Condiciones. Su uso de la Aplicación después de cualquier modificación de estos Términos significará su consentimiento y aceptación de sus términos revisados.</p>

                <h2>Suscripciones a los planes pagos de Beauty Of Strength</h2>

                <p>Para desbloquear el acceso a todo el contenido obtenga alguna de las suscripciones ofrecidas de Beauty Of Strength.</p>

                <p>El pago de la suscripción se facturará de forma mensual o anual en el día calendario correspondiente con la fecha de inicio de su suscripción paga. Si un pago no se realiza con éxito, podemos suspender su acceso a la Aplicación o su contenido hasta que recibamos un pago válido.</p>

                <p>Las suscripciones se renuevan automáticamente al finalizar por un periodo igual al de la suscripción elegida.</p>

                <p>Usted puede cancelar su suscripción en cualquier momento comunicandose con el equipo de Beauty Of Strength o según corresponda, hasta 24h antes de la fecha de renovación automática de la suscripción. No proporcionamos reembolsos por períodos parciales de suscripción ni en caso de compras accidentales. Para cancelar, siga las instrucciones correspondientes. Más info en el Centro de ayuda y soporte.</p>

                <p>Los precios de los planes pagos de Beauty Of Strength pueden variar según la ubicación geográfica y en cualquier momento.</p>

                <p>Última edición: 02/11/2023</p>
                <p>Copyright © 2023 Beauty Of Strength bOS</p>
            </>
        )
    }
}

export default withRouter(PageTermsAndConditions)