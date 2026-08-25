"use strict";
const LOGO_COTO =
    "@@ASSET:assets/logo-coto.png@@",
  LOGO_APR =
    "@@ASSET:assets/logo-aprendizaje.png@@";
function logoLockup() {
  return (
    '<span class="logo-lockup"><img class="logo-img" src="' +
    LOGO_COTO +
    '" alt="COTO CICSA"><span class="logo-div"></span><img class="logo-img" src="' +
    LOGO_APR +
    '" alt="Aprendizaje"></span>'
  );
}
const EDU_DB = [
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "MANUALES",
      nom: "Reconocimiento de Pesos",
      tipo: "PDF",
      nota: "Reemplazar por nuevo 15, 16 y 27 (separarlo del manual) · Pre publi",
      est: "rehacer",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "MANUALES",
      nom: "Reconocimiento de Dólares",
      tipo: "PDF",
      nota: "Reempalzar por resumen · Post publi",
      est: "rehacer",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "MANUALES",
      nom: "Rreconocimiento de Euros",
      tipo: "PDF",
      nota: "Reemplazar por nuevo 19 y 20 manual + resumen (juntarlo en un mismo pdf) · De cero",
      est: "nuevo",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "MANUALES",
      nom: "Billetera - Cuenta DNI",
      tipo: "PDF",
      nota: "Ok (darle la onda) · Gasti pre publi",
      est: "listo",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "MANUALES",
      nom: "Billetera - Mercado Pago",
      tipo: "PDF",
      nota: "Modificar existente con pantalla de cash luego del cobro",
      est: "rehacer",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "MANUALES",
      nom: "Billetera - MODO",
      tipo: "PDF",
      nota: "Manual de cajas pag. 26 manual + armar desde el word",
      est: "rehacer",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "MANUALES",
      nom: "Tecnología NFC",
      tipo: "PDF",
      nota: "Curso medios de pagos ( billeteras virtuales)",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "MANUALES",
      nom: "Manual de cajas",
      tipo: "PDF",
      nota: "46136 · Ok // Actualizar diseño",
      est: "revisar",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "MANUALES",
      nom: "Manual de cajero inductores",
      tipo: "PDF",
      nota: "Ok (darle la onda)",
      est: "listo",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "MANUALES",
      nom: "Circuito de cajas",
      tipo: "IMG",
      nota: "Ok (darle la onda)",
      est: "listo",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "MANUALES",
      nom: "Ayuda memoria de Funciones",
      tipo: "IMG",
      nota: "Pag 5 manual",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Inicio del día",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Ingreso de dotación",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Venta - Fase 1",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Venta - Fase 2",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Cash back - Mercado Pago",
      tipo: "VIDEO",
      nota: "Ok  // Corregir marca Aprendizaje (cambiar gris por blanco)",
      est: "revisar",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Cash back - Débito",
      tipo: "VIDEO",
      nota: "Ok  // Corregir marca Aprendizaje (cambiar gris por blanco)",
      est: "revisar",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Retiro de fondos con MAE",
      tipo: "VIDEO",
      nota: "Ok  // Corregir marca Aprendizaje (cambiar gris por blanco) y chequear colores intro",
      est: "revisar",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Retiro de fondos con bala",
      tipo: "VIDEO",
      nota: "X · ELIMINADO",
      est: "eliminado",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Billetera - Mercado pago",
      tipo: "VIDEO",
      nota: "Ok  // Corregir marca Aprendizaje (cambiar gris por blanco)",
      est: "revisar",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Billetera - Cuenta DNI",
      tipo: "VIDEO",
      nota: "Ok  // Corregir marca Aprendizaje (cambiar gris por blanco)",
      est: "revisar",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Billetera - MODO",
      tipo: "VIDEO",
      nota: "Ok  // Corregir marca Aprendizaje (cambiar gris por blanco)",
      est: "revisar",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Posnet / Verifone",
      tipo: "VIDEO",
      nota: "Ok  // Corregir marca Aprendizaje (cambiar gris por blanco) y chequear colores intro",
      est: "revisar",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Cobro del resumen TCI",
      tipo: "VIDEO",
      nota: "Nuevo desarrollo",
      est: "nuevo",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CONTENIDO AUDIOVISUAL",
      nom: "Tecnología NFC",
      tipo: "VIDEO",
      nota: "Ok  // Corregir marca Aprendizaje (cambiar gris por blanco)",
      est: "revisar",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Manual a distancia",
      tipo: "PDF",
      nota: "Ok (darle la onda)",
      est: "listo",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Desconexión de caja - Sin arqueo",
      tipo: "VIDEO",
      nota: "Ok // Futuro rediseño completo (Falta locución en título // La intro esta rapidísima y chequear colores",
      est: "rehacer",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Desconexión de caja - Con arqueo",
      tipo: "VIDEO",
      nota: "Ok // Futuro rediseño completo (Falta locución en título // La intro esta rapidísima y chequear colores",
      est: "rehacer",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Calculadora",
      tipo: "VIDEO",
      nota: "Ok // Futuro rediseño completo (Falta locución en título // Esta mal encuadrada la intro // Chequear colores",
      est: "rehacer",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Posnet / Verifone",
      tipo: "VIDEO",
      nota: "Igual que el de contenido audiovisual",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Retiro de fondos con MAE",
      tipo: "VIDEO",
      nota: "Igual que el de contenido audiovisual",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Retiro de fondos con bala",
      tipo: "VIDEO",
      nota: "X · ELIMINADO",
      est: "eliminado",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Billetera - Mercado pago",
      tipo: "VIDEO",
      nota: "Igual que el de contenido audiovisual",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Billetera - Cuenta DNI",
      tipo: "VIDEO",
      nota: "Igual que el de contenido audiovisual",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Billetera - MODO",
      tipo: "VIDEO",
      nota: "Igual que el de contenido audiovisual",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Cash back - Mercado Pago",
      tipo: "VIDEO",
      nota: "Igual que el de contenido audiovisual",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Cash back - Débito",
      tipo: "VIDEO",
      nota: "Igual que el de contenido audiovisual",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CURSO A DISTANCIA",
      nom: "Tecnología NFC",
      tipo: "VIDEO",
      nota: "Igual que el de contenido audiovisual",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CAJAS ZONA E!",
      nom: "Manual Multi Game Z",
      tipo: "PDF",
      nota: "Ok (darle la onda)",
      est: "listo",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CAJAS ZONA E!",
      nom: "Manual de Comanda",
      tipo: "PDF",
      nota: "- · Desarrollo a futuro (Hay algo de material, falta diseño)",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CAJAS ZONA E!",
      nom: "Conexión",
      tipo: "VIDEO",
      nota: "- · Desarrollo a futuro",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CAJAS ZONA E!",
      nom: "Ingreso de dotación",
      tipo: "VIDEO",
      nota: "- · Desarrollo a futuro",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CAJAS ZONA E!",
      nom: "Desconexión con arqueo",
      tipo: "VIDEO",
      nota: "- · Desarrollo a futuro",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CAJAS ZONA E!",
      nom: "Carga de tarjetas",
      tipo: "VIDEO",
      nota: "- · Desarrollo a futuro",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CAJAS ZONA E!",
      nom: "Consuta de últimos movimientos",
      tipo: "VIDEO",
      nota: "- · Desarrollo a futuro",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CAJAS ZONA E!",
      nom: "Cobro de Multirrubro",
      tipo: "VIDEO",
      nota: "- · Desarrollo a futuro",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CAJAS ZONA E!",
      nom: "Bajada de pre-ticket",
      tipo: "VIDEO",
      nota: "- · Desarrollo a futuro",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CAJAS ZONA E!",
      nom: "Cobro con efectivo + Controles",
      tipo: "VIDEO",
      nota: "- · Desarrollo a futuro",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CAJAS ZONA E!",
      nom: "Cobro con tarjetas + Controles",
      tipo: "VIDEO",
      nota: "- · Desarrollo a futuro",
      est: "pendiente",
    },
    {
      sec: "cajas",
      secNom: "CAJAS",
      sub: "CAJAS ZONA E!",
      nom: "Cobro con billeteras + Controles",
      tipo: "VIDEO",
      nota: "- · Desarrollo a futuro",
      est: "pendiente",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Colita de cuadril",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Picaña",
      tipo: "VIDEO",
      nota: "46136 · Ok // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Cuadril y riñonada",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Tapa de nalga",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Nalga",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Tortuguita",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Peceto",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Cuadrada",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Chiquizuela",
      tipo: "VIDEO",
      nota: "46136 · Ok // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Bola de lomo",
      tipo: "VIDEO",
      nota: "46136 · Ok // Esta muy espaciado",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Arañita",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Osobuco y Hueso con Carne",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Osobuco del rey",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto trasero - Máquina de milanesas",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Bife a 10 costillas",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Modo 1",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Modo 2",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Modo 3",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Bife con lomo",
      tipo: "VIDEO",
      nota: "46136 · Ok  // Va lento // ESTA ROSA!",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Bife angosto",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Bife ancho",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Asado de bife",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Bife parrilla",
      tipo: "VIDEO",
      nota: "46136 · Ok // Va lento // ESTA ROSA!",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Lomo",
      tipo: "VIDEO",
      nota: "46136 · Ok // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Marucha",
      tipo: "VIDEO",
      nota: "46136 · Ok // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Bife de chorizo",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Ojo de bife",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Tomahawk",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Entraña",
      tipo: "VIDEO",
      nota: "46136 · Ok // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Matambre",
      tipo: "VIDEO",
      nota: "46136 · Ok // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Vacío",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Tapa de asado",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Cuarto delantero - Asado",
      tipo: "VIDEO",
      nota: "46136 · Ok  // Va lento // ESTA ROSA!",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Pecho - Azotillo",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Pecho - Carnaza común",
      tipo: "VIDEO",
      nota: "46136 · Ok // Cambiar marca Formación por Aprendizaje",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Pecho - Espinazo",
      tipo: "VIDEO",
      nota: "46136 · Ok // Va lento",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Pecho - Hueso con carne",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Pecho - Paleta y Bife americano",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Pecho - Palomita",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Pecho - Parrillada de puchero",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Pecho - Roast beaf",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CORTES DE MEDIA RES",
      nom: "Pecho - Picadas",
      tipo: "VIDEO",
      nota: "46136 · Ok para publicar",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "ARMADO DE GÓNDOLA",
      nom: "Armado de góndola de carne",
      tipo: "VIDEO",
      nota: "46136 · Ok // Cambiar marca Formación por Aprendizaje",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "ARMADO DE GÓNDOLA",
      nom: "Armado de góndola de cerdo",
      tipo: "VIDEO",
      nota: "46136 · Ok // Cambiar marca Formación por Aprendizaje",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "ARMADO DE GÓNDOLA",
      nom: "Góndola de carne",
      tipo: "PDF",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "ARMADO DE GÓNDOLA",
      nom: "Góndola de cerdo",
      tipo: "PDF",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CONTROL DE CALIDAD",
      nom: "Limpieza de picadora",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CONTROL DE CALIDAD",
      nom: "Limpieza de sierra sin fin",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CONTROL DE CALIDAD",
      nom: "Limpieza de milanesera",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CONTROL DE CALIDAD",
      nom: "Limpieza de resinitadora",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CONTROL DE CALIDAD",
      nom: "Limpieza de mesa de trabajo",
      tipo: "VIDEO",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-1",
      secNom: "CARNICERÍA",
      sub: "CONTENIDOS EXTRA",
      nom: "Reunión de Frescos 1 14/04/2026",
      tipo: "PDF",
      nota: "46136 · Ok",
      est: "listo",
    },
    {
      sec: "frescos-2",
      secNom: "PESCADERÍA",
      sub: "EXHIBICIÓN DE PRODUCTOS DE PESCADERÍA",
      nom: "Exhibición en heladeras",
      tipo: "VIDEO",
      nota: "Ok // Actualizar diseño audiosual (intro y outro)",
      est: "revisar",
    },
    {
      sec: "frescos-2",
      secNom: "PESCADERÍA",
      sub: "EXHIBICIÓN DE PRODUCTOS DE PESCADERÍA",
      nom: "Exibición en pozos",
      tipo: "VIDEO",
      nota: "Ok // Actualizar diseño audiosual (intro y outro)",
      est: "revisar",
    },
    {
      sec: "frescos-2",
      secNom: "PESCADERÍA",
      sub: "EXHIBICIÓN DE PRODUCTOS DE PESCADERÍA",
      nom: "Producto rebozado",
      tipo: "VIDEO",
      nota: "Ok // Actualizar diseño audiosual (intro y outro)",
      est: "revisar",
    },
    {
      sec: "frescos-2",
      secNom: "PESCADERÍA",
      sub: "EXHIBICIÓN DE PRODUCTOS DE PESCADERÍA",
      nom: "Armado de mostrador",
      tipo: "VIDEO",
      nota: "Ok // Actualizar diseño audiosual (intro y outro)",
      est: "revisar",
    },
    {
      sec: "frescos-2",
      secNom: "PESCADERÍA",
      sub: "EXHIBICIÓN DE PRODUCTOS DE PESCADERÍA",
      nom: "Exhibición en mostrador",
      tipo: "VIDEO",
      nota: "Ok // Actualizar diseño audiosual (intro y outro)",
      est: "revisar",
    },
    {
      sec: "frescos-2",
      secNom: "PESCADERÍA",
      sub: "EXHIBICIÓN DE PRODUCTOS DE PESCADERÍA",
      nom: "Acopio de producto congelado",
      tipo: "VIDEO",
      nota: "Ok // Actualizar diseño audiosual (intro y outro)",
      est: "revisar",
    },
    {
      sec: "frescos-2",
      secNom: "PESCADERÍA",
      sub: "EXHIBICIÓN DE PRODUCTOS DE PESCADERÍA",
      nom: "Acopio de producto descongelado",
      tipo: "VIDEO",
      nota: "Ok // Actualizar diseño audiosual (intro y outro)",
      est: "revisar",
    },
    {
      sec: "frescos-2",
      secNom: "QUESOS Y FIAMBRES",
      sub: "ARMADO DE PICADAS",
      nom: "Preparación de los productos",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual (cambiar salmón por amarillo, actualizar marca Aprendizaje y corregir tipografías)",
      est: "revisar",
    },
    {
      sec: "frescos-2",
      secNom: "QUESOS Y FIAMBRES",
      sub: "ARMADO DE PICADAS",
      nom: "Picada tradicional",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual (cambiar salmón por amarillo, actualizar marca Aprendizaje y corregir tipografías)",
      est: "revisar",
    },
    {
      sec: "frescos-2",
      secNom: "QUESOS Y FIAMBRES",
      sub: "ARMADO DE PICADAS",
      nom: "Picada variada",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual (cambiar salmón por amarillo, actualizar marca Aprendizaje y corregir tipografías)",
      est: "revisar",
    },
    {
      sec: "frescos-2",
      secNom: "QUESOS Y FIAMBRES",
      sub: "ARMADO DE PICADAS",
      nom: "Picada premium",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual (cambiar salmón por amarillo, actualizar marca Aprendizaje y corregir tipografías)",
      est: "revisar",
    },
    {
      sec: "elaborados",
      secNom: "ROTISERÍA",
      sub: "-",
      nom: "-",
      tipo: "",
      nota: "- · - · -",
      est: "pendiente",
    },
    {
      sec: "elaborados",
      secNom: "PANADERÍA",
      sub: "ELABORACIÓN DE FACTURAS",
      nom: "-",
      tipo: "",
      nota: "- · - · Gasti busca videos",
      est: "pendiente",
    },
    {
      sec: "elaborados",
      secNom: "PANADERÍA",
      sub: "CONTENIDOS EXTRAS",
      nom: "-",
      tipo: "",
      nota: "- · - · -",
      est: "pendiente",
    },
    {
      sec: "seguridad-higiene",
      secNom: "SEGURIDAD E HIGIENE",
      sub: "CAPACITACIÓN ANUAL 2026",
      nom: "Riesgo de incendio",
      tipo: "VIDEO",
      nota: "46190 · Ok",
      est: "listo",
    },
    {
      sec: "seguridad-higiene",
      secNom: "SEGURIDAD E HIGIENE",
      sub: "CAPACITACIÓN ANUAL 2026",
      nom: "Plan de evacuación",
      tipo: "VIDEO",
      nota: "46190 · Ok",
      est: "listo",
    },
    {
      sec: "seguridad-higiene",
      secNom: "SEGURIDAD E HIGIENE",
      sub: "CAPACITACIÓN ANUAL 2026",
      nom: "Uso seguro de montacargas",
      tipo: "VIDEO",
      nota: "46190 · Ok",
      est: "listo",
    },
    {
      sec: "seguridad-higiene",
      secNom: "SEGURIDAD E HIGIENE",
      sub: "NORMAS BÁSICAS",
      nom: "Accidente e incidente",
      tipo: "VIDEO",
      nota: "46190 · Ok",
      est: "listo",
    },
    {
      sec: "seguridad-higiene",
      secNom: "SEGURIDAD E HIGIENE",
      sub: "NORMAS BÁSICAS",
      nom: "EPP, máquinas y equipos",
      tipo: "VIDEO",
      nota: "46190 · Ok CORREGIR TÍTULO EN WEB NO ES MÁQUINAS ES EQUIPO",
      est: "revisar",
    },
    {
      sec: "seguridad-higiene",
      secNom: "SEGURIDAD E HIGIENE",
      sub: "NORMAS BÁSICAS",
      nom: "Uso de extintor",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar marca Aprendizaje",
      est: "revisar",
    },
    {
      sec: "seguridad-higiene",
      secNom: "SEGURIDAD E HIGIENE",
      sub: "CONTENIDOS EXTRAS",
      nom: "-",
      tipo: "",
      nota: "- · - · -",
      est: "pendiente",
    },
    {
      sec: "salon",
      secNom: "SALÓN",
      sub: "SURTIDO SIN VENTA",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "salon",
      secNom: "SALÓN",
      sub: "FLUJO DEL HUECO",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "salon",
      secNom: "SALÓN",
      sub: "PRIORIDAD DE REPOSICIÓN",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "salon",
      secNom: "SALÓN",
      sub: "RELEVAMIENTO DE CLASES",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "salon",
      secNom: "SALÓN",
      sub: "TRASPASOS A 126",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "frescos-1",
      secNom: "VERDULERÍA",
      sub: "ARMADO DE GÓNDOLA",
      nom: "Armado de verduras",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual (cambiar rojo por verde)",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "VERDULERÍA",
      sub: "ARMADO DE GÓNDOLA",
      nom: "Armado de bananero",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual (cambiar rojo por verde)",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "VERDULERÍA",
      sub: "ARMADO DE GÓNDOLA",
      nom: "Armado de frutas",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual (cambiar rojo por verde)",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "VERDULERÍA",
      sub: "ARMADO DE GÓNDOLA",
      nom: "Armado del módulo de frutas",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual (cambiar rojo por verde)",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "VERDULERÍA",
      sub: "ARMADO DE GÓNDOLA",
      nom: "Armado de hortalizas pesadas",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual (cambiar rojo por verde)",
      est: "revisar",
    },
    {
      sec: "frescos-1",
      secNom: "VERDULERÍA",
      sub: "CONTENIDOS EXTRAS",
      nom: "Reunión de Frescos 1 14/04/2026",
      tipo: "PDF",
      nota: "Preguntar a Valdez si repite el archivo acá",
      est: "pendiente",
    },
    {
      sec: "mantenimiento",
      secNom: "MANTENIMIENTO",
      sub: "CONTROL DE VEHÍCULOS INDUSTRIALES",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "mantenimiento",
      secNom: "MANTENIMIENTO",
      sub: "CONTENIDOS EXTRAS",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "LIMPIEZA CON ECONOR",
      nom: "Explicación de equipo DUAL",
      tipo: "VIDEO",
      nota: "46190 · Ok // Corregir título DUAL en mayúscula",
      est: "revisar",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "LIMPIEZA CON ECONOR",
      nom: "Explicación del equipo UNI",
      tipo: "VIDEO",
      nota: "46190 · Ok // Corregir título UNI en mayúscula",
      est: "revisar",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "LIMPIEZA CON ECONOR",
      nom: "Carga y uso de GR520 y LV100 en DUAL",
      tipo: "VIDEO",
      nota: "46190 · Ok // Corregir título DUAL en mayúscula",
      est: "revisar",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "LIMPIEZA CON ECONOR",
      nom: "Carga y uso de GR520 en pulverizador",
      tipo: "VIDEO",
      nota: "46190 · Ok",
      est: "listo",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "LIMPIEZA CON ECONOR",
      nom: "Carga y uso de LF1212 en UNI",
      tipo: "VIDEO",
      nota: "46190 · Ok // Corregir título UNI en mayúscula",
      est: "revisar",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "LIMPIEZA CON ECONOR",
      nom: "Uso del GR545 en UNI",
      tipo: "VIDEO",
      nota: "46190 · Ok // Corregir título UNI en mayúscula",
      est: "revisar",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "LIMPIEZA CON ECONOR",
      nom: "Uso del GRHSC en UNI",
      tipo: "VIDEO",
      nota: "46190 · Ok // Corregir título UNI en mayúscula",
      est: "revisar",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "LIMPIEZA CON VICTORY",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "FRESCOS",
      nom: "Limpieza de picadora",
      tipo: "VIDEO",
      nota: "46190 · Ok",
      est: "listo",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "FRESCOS",
      nom: "Limpieza de sierra sin fin",
      tipo: "VIDEO",
      nota: "46190 · Ok",
      est: "listo",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "FRESCOS",
      nom: "Limpieza de milanesera",
      tipo: "VIDEO",
      nota: "46190 · Ok",
      est: "listo",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "FRESCOS",
      nom: "Limpieza de resinitadora",
      tipo: "VIDEO",
      nota: "46190 · Ok",
      est: "listo",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "FRESCOS",
      nom: "Limpieza de mesa de trabajo",
      tipo: "VIDEO",
      nota: "46190 · Ok",
      est: "listo",
    },
    {
      sec: "control-de-calidad",
      secNom: "CONTROL DE CALIDAD",
      sub: "CONTENIDOS EXTRAS",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "ARMADORES",
      nom: "Inicio del día y preparación",
      tipo: "VIDEO",
      nota: "Ok // Futuro rediseño completo (Falta locución en título)",
      est: "rehacer",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "ARMADORES",
      nom: "Comenzamos nuestro pedido",
      tipo: "VIDEO",
      nota: "Ok // Futuro rediseño completo (Falta locución en título)",
      est: "rehacer",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "ARMADORES",
      nom: "Productos faltantes y posibles errores",
      tipo: "VIDEO",
      nota: "Ok // Futuro rediseño completo (Falta locución en título)",
      est: "rehacer",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "ARMADORES",
      nom: "Sectores de producción",
      tipo: "VIDEO",
      nota: "Ok // Futuro rediseño completo (Falta locución en título)",
      est: "rehacer",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "ARMADORES",
      nom: "Pesaje y puesto de aduana",
      tipo: "VIDEO",
      nota: "Ok // Futuro rediseño completo (Falta locución en título)",
      est: "rehacer",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "ARMADORES",
      nom: "Cierre del pedido y cobro",
      tipo: "VIDEO",
      nota: "Ok // Futuro rediseño completo (Falta locución en título)",
      est: "rehacer",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "AUXILIARES ADMINISTRATIVOS",
      nom: "Facturación de reservas",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "AUXILIARES ADMINISTRATIVOS",
      nom: "Control de reservas",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "AUXILIARES ADMINISTRATIVOS",
      nom: "Solicitud de cupones",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "AUXILIARES ADMINISTRATIVOS",
      nom: "Reclamos CRM",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "AUXILIARES ADMINISTRATIVOS",
      nom: "Atenciones",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "AUXILIARES ADMINISTRATIVOS",
      nom: "Control de reimpresiones",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "AUXILIARES ADMINISTRATIVOS",
      nom: "Control de OC pendientes de cancelar",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "AUXILIARES ADMINISTRATIVOS",
      nom: "Control de OC genéricas o ya emitidas",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "AUXILIARES ADMINISTRATIVOS",
      nom: "Diferencia de precio por motivo",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "AUXILIARES ADMINISTRATIVOS",
      nom: "Mesa de rendiciones",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "AUXILIARES ADMINISTRATIVOS",
      nom: "Mesa de ticket",
      tipo: "VIDEO",
      nota: "Ok",
      est: "listo",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "- PRIORIDAD DE REPOSICIÓN",
      nom: "Aplicación de Reportes Generales NOA",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual",
      est: "revisar",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "- PRIORIDAD DE REPOSICIÓN",
      nom: "Prioridad de reposición GESCOM - Acceso 1",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual",
      est: "revisar",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "- PRIORIDAD DE REPOSICIÓN",
      nom: "Prioridad de reposición GESCOM - Acceso 2",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual",
      est: "revisar",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "- PRIORIDAD DE REPOSICIÓN",
      nom: "Prioridad de reposición Sucursales 3",
      tipo: "VIDEO",
      nota: "46190 · Ok // Actualizar diseño audiovisual",
      est: "revisar",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "- RELEVAMIENTO DE CLASES",
      nom: "Consulta GESCOM",
      tipo: "VIDEO",
      nota: "46190 · Ok // Cambiar marca Formación por Aprendizaje",
      est: "revisar",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "- RELEVAMIENTO DE CLASES",
      nom: "Consulta Sucursales 3",
      tipo: "VIDEO",
      nota: "46190 · Ok // Cambiar marca Formación por Aprendizaje",
      est: "revisar",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "- RELEVAMIENTO DE CLASES",
      nom: "Uso de PDA",
      tipo: "VIDEO",
      nota: "46190 · Ok // Cambiar marca Formación por Aprendizaje",
      est: "revisar",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "- RELEVAMIENTO DE CLASES",
      nom: "Análisis GESCOM",
      tipo: "VIDEO",
      nota: "46190 · Ok // Cambiar marca Formación por Aprendizaje",
      est: "revisar",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "- RELEVAMIENTO DE CLASES",
      nom: "Análisis Sucursales 3",
      tipo: "VIDEO",
      nota: "46190 · Ok // Cambiar marca Formación por Aprendizaje",
      est: "revisar",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "- RELEVAMIENTO DE CLASES",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "TEXTIL Y BAZAR",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "COTO HOGAR",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "coto-digital",
      secNom: "COTO DIGITAL",
      sub: "CONTENIDOS EXTRAS",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "administracion",
      secNom: "STOCK Y MERMAS / ADMINISTRACIÓN",
      sub: "-",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "seguridad",
      secNom: "SEGURIDAD",
      sub: "MODALIDADES DE HURTO",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "seguridad",
      secNom: "SEGURIDAD",
      sub: "CONTROLES DE SEGURIDAD",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "seguridad",
      secNom: "SEGURIDAD",
      sub: "CUMPLES DE ZONA",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "seguridad",
      secNom: "SEGURIDAD",
      sub: "ZONA GOURMET",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "seguridad",
      secNom: "SEGURIDAD",
      sub: "CAJAS DE ZONA",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
    {
      sec: "seguridad",
      secNom: "SEGURIDAD",
      sub: "CONTENIDOS EXTRAS",
      nom: "-",
      tipo: "",
      nota: "- · -",
      est: "pendiente",
    },
  ],
  EST_META = {
    listo: {
      l: "Listo",
      c: "#2E9E8F",
    },
    revisar: {
      l: "Revisar",
      c: "#E2A03F",
    },
    rehacer: {
      l: "Rehacer",
      c: "#E2671E",
    },
    pendiente: {
      l: "Pendiente",
      c: "#8A97B4",
    },
    nuevo: {
      l: "Nuevo",
      c: "#2896E6",
    },
    eliminado: {
      l: "Eliminado",
      c: "#D8553F",
    },
  },
  EDU_TIPO_IC = {
    PDF: "📄",
    IMG: "🖼️",
    VIDEO: "🎬",
  },
  TEAM = [
    {
      id: "vivi",
      nombre: "Vivi",
      rol: "Jefa de Aprendizaje",
      color: "#00466E",
    },
    {
      id: "dami",
      nombre: "Dami",
      rol: "Líder e-Learning",
      color: "#006EA0",
    },
    {
      id: "vane",
      nombre: "Vane",
      rol: "Identidad visual · Auditoría",
      color: "#7E57C2",
    },
    {
      id: "eve",
      nombre: "Eve",
      rol: "Audiovisual",
      color: "#E5736F",
    },
    {
      id: "flor",
      nombre: "Flor",
      rol: "Contenido · Instruccional",
      color: "#2E9E8F",
    },
    {
      id: "gasti",
      nombre: "Gasti",
      rol: "Storyline · Gamificación",
      color: "#E2A03F",
    },
  ];
function ensureTeam() {
  const v1 = TEAM.find((v2) => v2.id === "dami");
  v1 && v1.nombre === "Damián" && ((v1.nombre = "Dami"), (v1.rol = "Líder e-Learning"));
  if (!TEAM.find((v3) => v3.id === "vivi"))
    TEAM.unshift({
      id: "vivi",
      nombre: "Vivi",
      rol: "Jefa de Aprendizaje",
      color: "#00466E",
    });
  TEAM.forEach((v4) => {
    if (v4.email == null) v4.email = "";
  });
}
const ESTADOS = [
    {
      id: "pendiente",
      nombre: "Pendiente",
      dot: "#8A97B4",
    },
    {
      id: "en-desarrollo",
      nombre: "En desarrollo",
      dot: "#006EA0",
    },
    {
      id: "en-revision",
      nombre: "En revisión",
      dot: "#E2A03F",
    },
  ],
  TIPOS = {
    curso: {
      nombre: "Curso",
      icon: "🎓",
    },
    "actualizacion-curso": {
      nombre: "Actualización de curso",
      icon: "♻️",
    },
    video: {
      nombre: "Video / Filmación",
      icon: "🎬",
    },
    presencial: {
      nombre: "Capacitación presencial",
      icon: "🧑‍🏫",
    },
    "edu-point": {
      nombre: "Edu Point",
      icon: "📍",
    },
    poes: {
      nombre: "POES / Validación",
      icon: "🧪",
    },
    guia: {
      nombre: "Guía",
      icon: "📖",
    },
    "pedido-insumos": {
      nombre: "Pedido de insumos",
      icon: "📦",
    },
    "app-web": {
      nombre: "Aplicativo web",
      icon: "🖥️",
    },
    "base-sistema": {
      nombre: "Base del sistema",
      icon: "🗄️",
    },
    libre: {
      nombre: "Libre",
      icon: "📝",
    },
  },
  SECTORES = {
    cajas: {
      nombre: "Cajas",
      cat: "#F02850",
    },
    "frescos-1": {
      nombre: "Frescos 1",
      cat: "#F0281E",
    },
    "frescos-2": {
      nombre: "Frescos 2",
      cat: "#FA463C",
    },
    elaborados: {
      nombre: "Elaborados",
      cat: "#FF8200",
    },
    salon: {
      nombre: "Salón",
      cat: "#F0BE00",
    },
    mantenimiento: {
      nombre: "Mantenimiento",
      cat: "#00C88C",
    },
    "coto-digital": {
      nombre: "Coto Digital",
      cat: "#2896E6",
    },
    "flota-propia": {
      nombre: "Flota Propia",
      cat: "#1E5AD2",
    },
    "no-alimentos": {
      nombre: "No Alimentos",
      cat: "#0032C8",
    },
    administracion: {
      nombre: "Administración",
      cat: "#5A1ED2",
    },
    "recursos-humanos": {
      nombre: "Recursos Humanos",
      cat: "#8232C8",
    },
    "gestion-comercial": {
      nombre: "Gestión Comercial",
      cat: "#AA28A0",
    },
    "atencion-al-cliente": {
      nombre: "Atención al Cliente",
      cat: "#BE1478",
    },
    tci: {
      nombre: "TCI",
      cat: "#D71E50",
    },
    seguridad: {
      nombre: "Seguridad",
      cat: "#646464",
    },
    sistemas: {
      nombre: "Sistemas",
      cat: "#1E78DC",
    },
    "control-de-calidad": {
      nombre: "Control de Calidad",
      cat: "#1EAADC",
    },
    "servicio-medico": {
      nombre: "Servicio Médico",
      cat: "#1EB4BE",
    },
    "panol-base-12": {
      nombre: "Pañol y Base 12",
      cat: "#6EBE50",
    },
    "seguridad-higiene": {
      nombre: "Seguridad e Higiene",
      cat: "#F0A032",
    },
    "zona-e": {
      nombre: "Zona E!",
      cat: "#5A5A5A",
    },
    "zona-gourmet": {
      nombre: "Zona Gourmet",
      cat: "#CD1E1E",
    },
    "zona-cumples": {
      nombre: "Zona Cumples",
      cat: "#6E328C",
    },
  },
  OFFICIAL_CATS = new Set(Object.keys(SECTORES)),
  SLUG_MAP = {
    calidad: "control-de-calidad",
    medico: "servicio-medico",
    flota: "flota-propia",
    "seg-higiene": "seguridad-higiene",
    frescos1: "frescos-1",
    frescos2: "frescos-2",
    cajas: "cajas",
    mantenimiento: "mantenimiento",
    digital: "coto-digital",
    sistemas: "sistemas",
    rrhh: "recursos-humanos",
    admin: "administracion",
    salon: "salon",
    elaborados: "elaborados",
    fyv: "frescos-1",
    frutas: "frescos-1",
    verduras: "frescos-1",
    carniceria: "frescos-1",
    pescaderia: "frescos-1",
    lacteos: "frescos-2",
    congelados: "frescos-2",
    fiambres: "frescos-2",
    quesos: "frescos-2",
    panaderia: "elaborados",
    carnes: "frescos-1",
    almacen: "no-alimentos",
    bebidas: "no-alimentos",
    perfumeria: "no-alimentos",
    textil: "no-alimentos",
    bazar: "no-alimentos",
    limpieza: "mantenimiento",
    qr: "coto-digital",
    carteles: "coto-digital",
    "frutas-y-verduras": "frescos-1",
    "lacteos-y-congelados": "frescos-2",
    "carteles-qr": "coto-digital",
  };
function toSector(v5) {
  if (!v5) return null;
  const v6 = String(v5).toLowerCase().trim();
  if (SECTORES[v6]) return v6;
  if (SLUG_MAP[v6]) return SLUG_MAP[v6];
  return v6;
}
const TEMPLATES = {
    curso: {
      fases: ["Guion", "Diseño visual", "Producción Storyline", "Revisión", "Publicación"],
      checklist: [
        "Brief aprobado",
        "Objetivos de aprendizaje",
        "Guion validado",
        "Maqueta visual",
        "Montaje Storyline",
        "QA funcional",
        "Alta en Moodle",
      ],
    },
    "actualizacion-curso": {
      fases: ["Relevamiento de cambios", "Reescritura", "Rearmado", "Revisión", "Republicación"],
      checklist: [
        "Detectar desactualizaciones",
        "Actualizar guion",
        "Actualizar piezas",
        "QA",
        "Republicar en Moodle",
      ],
    },
    video: {
      fases: ["Pre-producción", "Rodaje", "Post-producción"],
      checklist: [
        "Guion / storyboard",
        "Coordinar rodaje",
        "Filmación",
        "Edición",
        "Musicalización",
        "Aprobación",
        "Entrega final",
      ],
    },
    presencial: {
      fases: ["Preparación", "Dictado", "Cierre"],
      checklist: [
        "Definir temario",
        "Material de soporte",
        "Convocatoria",
        "Logística de sala",
        "Dictado",
        "Registro de asistencia",
      ],
    },
    "edu-point": {
      fases: [],
      checklist: [
        "Definir contenido",
        "Diseño de pieza",
        "Generar QR",
        "Validar enlace",
        "Impresión",
        "Colocación en sala",
      ],
    },
    poes: {
      fases: [],
      checklist: ["Relevar procedimiento", "Redactar POES", "Validación técnica", "Aprobación"],
    },
    guia: {
      fases: [],
      checklist: ["Esquema", "Redacción", "Diseño", "Revisión", "Publicación"],
    },
    "pedido-insumos": {
      fases: [],
      checklist: ["Detectar necesidad", "Cotizar", "Aprobar", "Comprar", "Recibir"],
    },
    "app-web": {
      fases: ["Relevamiento", "Desarrollo", "QA", "Puesta en producción"],
      checklist: ["Definir alcance", "Diseño de interfaz", "Desarrollo", "Pruebas", "Deploy"],
    },
    "base-sistema": {
      fases: [],
      checklist: ["Definir esquema", "Cargar datos", "Validar", "Documentar"],
    },
    libre: {
      fases: [],
      checklist: [],
    },
  },
  CURSOS = [
    {
      categoria: "administracion",
      titulo: "Administración de personal - Operatoria de cajas",
      bajada: "Organizá tu equipo y asegurá la cobertura de la línea de cajas.",
      anio: 2016,
      duracion: "Curso medio",
      imagen: "",
      personas: "Postulantes a Auxiliar, Auxiliares, postulantes a Jefe de Caja y Jefes de Caja.",
      descripcion:
        "Este curso reúne las tareas vinculadas a la administración del personal de Cajas en la sucursal. Aprendemos a calcular y controlar el FTE, generar requerimientos de dotación y cargar horarios web. Además, abordamos la organización diaria de cajeros y el uso de herramientas clave como reuniones de equipo e informes de transferencia de sector.",
    },
    {
      categoria: "administracion",
      titulo: "Análisis de Mermas",
      bajada: "Identificá causas, circuitos y estándares para interpretar los reportes de merma..",
      anio: 2016,
      duracion: "Curso medio",
      imagen: "",
      personas: "Gerentes, Jefes de todos los sectores y empleados de Administración",
      descripcion:
        "Este curso brinda las herramientas necesarias para comprender qué es una merma, cómo se calcula y cuáles son sus causas, tanto naturales como no naturales. Aprendemos a leer e interpretar los reportes del circuito de análisis, desde la detección de desvíos hasta la elaboración del informe y el seguimiento de los resultados en la sucursal.",
    },
    {
      categoria: "administracion",
      titulo: "Cajas - Apertura del sector",
      bajada:
        "Un repaso por las tareas necesarias para abrir correctamente el sector de cajas antes de la atención al público.",
      anio: 2016,
      duracion: "Curso medio",
      imagen: "",
      personas: "Jefes de Administración y Cajas.",
      descripcion:
        "Este curso guía el procedimiento de apertura para que todo esté listo antes de recibir al cliente. Repasamos el inicio de la jornada: encendido y control de terminales, validación de precios y promociones, gestión del fondo fijo, registro de novedades del sector y verificación del correcto funcionamiento de las cajas de autocobro.",
    },
    {
      categoria: "administracion",
      titulo: "Qué es un inventario",
      bajada:
        "Conceptos fundamentales para comprender el inventario y su impacto en la gestión diaria de la sucursal.",
      anio: 2020,
      duracion: "Curso medio",
      imagen: "",
      personas: "Auxiliares y Jefes de Administración y Jefes de todos los sectores.",
      descripcion:
        "En este curso abordamos la diferencia entre stock físico y stock teórico, y cómo realizar conteos mediante RF o PDA, considerando el impacto de ventas, recepciones y decomisos. Además, analizamos por qué un inventario correctamente ejecutado es clave para detectar desvíos y tomar decisiones operativas acertadas.",
    },
    {
      categoria: "administracion",
      titulo: "Stock - Conceptos Básicos",
      bajada:
        "Introducción al circuito de la mercadería y a los principios fundamentales de la gestión de stock.",
      anio: 2015,
      duracion: "Curso largo",
      imagen: "",
      personas: "Auxiliares y Jefes de Administración, Gerentes de Sucursales y Jefes de todos los sectores.",
      descripcion:
        "En este curso aprenderemos qué es el stock y cómo funciona el circuito de la mercadería desde el pedido hasta la venta. Abordaremos los conceptos generales, los movimientos de stock y los estados en los que puede encontrarse la mercadería, junto con el rol del sistema GDM y su interacción con otros sistemas para el análisis y control del stock.",
    },
    {
      categoria: "administracion",
      titulo: "Introductorio de toma de inventario",
      bajada: "Bases para el control de stock y prevención de mermas.",
      anio: 2025,
      duracion: "Curso largo",
      imagen: "",
      personas: "Todos los colaboradores, postulantes a jefes, jefes y gerentes de Sucursal.",
      descripcion:
        "En este curso aprenderán las bases teóricas y prácticas para realizar inventarios correctos. Veremos la diferencia entre stock físico y teórico para evitar mermas, los tipos de inventarios generales y parciales, y cómo la planificación asegura la disponibilidad de mercadería en cada sucursal.",
    },
    {
      categoria: "administracion",
      titulo: "Uso de balanzas",
      bajada: "Funcionamiento del sistema de balanzas y procesos de actualización de precios en la sucursal.",
      anio: 2019,
      duracion: "Curso medio",
      imagen: "",
      personas: "Gerentes de Sucursal, Jefes de todos los sectores y Personal de Administración.",
      descripcion:
        "En este curso nos enfocaremos en el sistema de balanzas, su funcionamiento y los distintos tipos de actualización de precios. Abordaremos los procesos de Novedades, Cambios Online, Total y Completo, y aprenderemos cómo actuar ante una desactualización de precios en la sucursal. El objetivo es garantizar que los precios se mantengan siempre actualizados.",
    },
    {
      categoria: "administracion",
      titulo: "Tipos de Inventario",
      bajada:
        "Un recorrido por los distintos tipos de inventarios que utilizamos en Coto y su planificación.",
      anio: 2020,
      duracion: "Curso largo",
      imagen: "",
      personas: "Auxiliares y Jefes de Administración, Gerentes de Sucursal y Jefes de todos los sectores.",
      descripcion:
        "Aquí aprendemos a identificar los dos grandes grupos de inventarios (parciales y totales), sus objetivos, formas de ejecución y responsables. Vemos ejemplos como rebalance, inventarios críticos, falsos stocks y sorpresas. Además, distinguimos los niveles de planificación y analizamos qué tipo de toma corresponde a cada situación.",
    },
    {
      categoria: "administracion",
      titulo: "Toma de inventario - Electro",
      bajada: "Bases para el control de stock y prevención de mermas.",
      anio: 2026,
      duracion: "Curso largo",
      imagen: "",
      personas: "Colaboradores del sector Electro, postulantes a jefes, jefes y gerentes de Sucursal.",
      descripcion:
        "En este curso se abordan los conceptos fundamentales del inventario aplicados al sector Electro. Se desarrollan nociones de stock, su clasificación, la diferencia entre stock real y distorsionado, los tipos de inventarios y la planificación necesaria para una correcta organización del proceso.",
    },
    {
      categoria: "tci",
      titulo: "Uso del aplicativo – Tarjeta TCI",
      bajada: "Gestión integral de solicitudes y consultas de Tarjeta TCI desde el aplicativo.",
      anio: 2025,
      duracion: "Curso medio",
      imagen: "",
      personas: "Jefes y Auxiliares de Cajas.",
      descripcion:
        "En este curso aprenderemos a utilizar el aplicativo TCI para gestionar solicitudes de Tarjeta TCI, desde la carga de clientes hasta el seguimiento de estados y la atención de consultas frecuentes. Abordaremos cómo actuar ante los distintos resultados de una solicitud para acompañar correctamente cada trámite.",
    },
    {
      categoria: "tci",
      titulo: "Contrato de la tarjeta TCI",
      bajada:
        "Guía práctica para asistir al cliente en la correcta confección del contrato de la Tarjeta TCI.",
      anio: 2025,
      duracion: "Curso medio",
      imagen: "",
      personas: "Jefes y Auxiliares de Cajas.",
      descripcion:
        "En este curso aprenderemos cómo asistir al cliente en la correcta confección del contrato de la Tarjeta TCI y su documentación anexa. Abordaremos las partes del contrato, las firmas requeridas, los controles a realizar y el correcto cierre, envío y resguardo del legajo en la sucursal, asegurando una gestión prolija y conforme a los procedimientos.",
    },
    {
      categoria: "tci",
      titulo: "Prevención de LA/FT/FP",
      bajada: "Gestión de riesgos y cumplimiento normativo para Tarjeta Coto Inteligente.",
      anio: 2025,
      duracion: "Curso corto",
      imagen: "",
      personas: "Directores, gerentes, jefaturas y colaboradores cuyas funciones impacten en la TCI.",
      descripcion:
        "En este curso conocerás las obligaciones, responsabilidades y procedimientos vinculados a la prevención del Lavado de Activos (LA), Financiación del Terrorismo (FT) y de la Proliferación (FP). Su objetivo es asegurar el cumplimiento del marco legal y regulatorio vigente en la operatoria de la Tarjeta Coto Inteligente (TCI).",
    },
    {
      categoria: "atencion-al-cliente",
      titulo: "Conociendo al Cliente",
      bajada: "Herramientas prácticas para mejorar la calidad de atención y el vínculo con el cliente.",
      anio: 2013,
      duracion: "Curso largo",
      imagen: "",
      personas: "Jefes de sectores, Postulantes, Personal de línea y Personal de atención al cliente.",
      descripcion:
        "En este curso trabajaremos las habilidades blandas necesarias para brindar una atención de calidad, poniendo el foco en la escucha activa, la empatía y la comunicación clara. Analizaremos distintos perfiles de clientes y cómo responder de forma adecuada ante consultas, reclamos y situaciones de conflicto, fortaleciendo el vínculo y la experiencia de atención.",
    },
    {
      categoria: "cajas",
      titulo: "Cajas – Resolución de conflictos",
      bajada:
        "Pautas para gestionar situaciones sensibles en la línea de cajas de manera respetuosa y profesional.",
      anio: 2018,
      duracion: "Curso medio",
      imagen: "",
      personas: "Cajeros, Auxiliares de Cajas y Jefes de Caja.",
      descripcion:
        "En este curso aprenderemos a gestionar situaciones sensibles en la línea de cajas, especialmente al solicitar al cliente que muestre su bolso o changuito. Abordaremos estrategias de comunicación basadas en el respeto y la empatía, y veremos cómo ofrecer alternativas y aplicar la normativa vigente para actuar de manera profesional ante una negativa.",
    },
    {
      categoria: "cajas",
      titulo: "Envíos – Conceptos básicos",
      bajada: "Todo lo que necesitás saber para la gestión del circuito de envíos.",
      anio: 2016,
      duracion: "Curso largo",
      imagen: "",
      personas: "Jefes, postulantes y auxiliares de Cajas.",
      descripcion:
        "Este curso presenta el circuito completo de un pedido, desde la carga de clientes en Coto Servicios hasta el seguimiento y cierre de los envíos. Se abordan los controles diarios, la gestión de pedidos pendientes, el uso de los sistemas de envíos y las funciones del módulo de Pedidos y Viajes, junto con tareas administrativas clave de la operatoria.",
    },
    {
      categoria: "cajas",
      titulo: "Cadetes de Cajas",
      bajada: "Guía práctica para acompañar el trabajo diario de los cadetes en la línea de cajas.",
      anio: 2017,
      duracion: "Curso medio",
      imagen: "",
      personas: "Cadetes de línea de cajas.",
      descripcion:
        "En este curso aprenderemos las tareas clave que realizan los cadetes durante la jornada laboral, desde la apertura y cierre de la sucursal hasta la gestión de envíos a domicilio. Abordaremos buenas prácticas de orden y limpieza, atención al cliente, uso correcto de los elementos de traslado y criterios para una operatoria segura y eficiente.",
    },
    {
      categoria: "cajas",
      titulo: "Medios de pago",
      bajada: "Procedimientos y buenas prácticas para el cobro en línea de cajas.",
      anio: 2026,
      duracion: "Curso largo",
      imagen: "",
      personas: "Jefes, auxiliares y cajeros de línea de Cajas.",
      descripcion:
        "En este curso se desarrollan los medios de pago habilitados en Coto y sus medidas de seguridad. Se repasan los procedimientos de cobro con efectivo, tarjetas, documentos y billeteras virtuales, incluyendo control de validez, acreditación de identidad y servicio de extracción de efectivo.",
    },
    {
      categoria: "cajas",
      titulo: "Reconocimiento de billetes – Euros",
      bajada: "Herramientas para identificar los euros auténticos y operar con seguridad.",
      anio: 2025,
      duracion: "Curso largo",
      imagen: "",
      personas: "Personal de línea de cajas y personas afectadas al sector o interesadas en la temática.",
      descripcion:
        "Este curso brinda nociones para reconocer los billetes de euro en circulación, sus series y principales diferencias. Se abordan las denominaciones aceptadas en sucursal, las medidas de seguridad vigentes y la identificación de hologramas, marcas visibles y elementos a trasluz, para una correcta validación durante la operatoria diaria.",
    },
    {
      categoria: "cajas",
      titulo: "Reconocimiento de billetes – Dólares",
      bajada: "riterios básicos para identificar billetes de dólar auténticos en la línea de cajas.",
      anio: 2025,
      duracion: "Curso largo",
      imagen: "",
      personas: "Personal de línea de cajas y personas afectadas al sector o interesadas en la temática.",
      descripcion:
        "Este curso brinda nociones para reconocer los billetes de dólar en circulación, sus series y denominaciones. Se trabajan las principales medidas de seguridad, la identificación de la serie alfanumérica y los procedimientos ante la recepción de moneda extranjera, incluyendo el uso de la Lista Negra y las acciones a seguir ante billetes dudosos en la operatoria diaria.",
    },
    {
      categoria: "cajas",
      titulo: "Reconocimiento de billetes – Pesos",
      bajada: "Una mirada práctica para identificar billetes auténticos y garantizar operaciones seguras.",
      anio: 2025,
      duracion: "Curso largo",
      imagen: "",
      personas: "Personal de línea de cajas y personas afectadas al sector o interesadas en la temática.",
      descripcion:
        "Este curso brinda nociones para reconocer los billetes de pesos en circulación, identificando sus distintas series y denominaciones. Se presentan las principales medidas de seguridad a observar al tacto, a simple vista y a trasluz, con el objetivo de facilitar una correcta identificación y prevenir errores durante la operatoria diaria en cajas.",
    },
    {
      categoria: "control-de-calidad",
      titulo: "Productos ECONOR",
      bajada: "Uso de equipamientos y productos ECONOR para los procesos de higiene en la sucursal.",
      anio: 2023,
      duracion: "Curso medio",
      imagen: "",
      personas:
        "Personal operativo de carnicería, pescadería, verdulería, panadería, cocina, rotisería, fiambrería y salón.",
      descripcion:
        "Este curso brinda los conocimientos necesarios para utilizar correctamente los equipamientos y productos del sistema ECONOR en los procesos de higiene de la sucursal. Se abordan los distintos productos de limpieza, su aplicación específica, el funcionamiento de los dosificadores UNI y DUAL, y las pautas generales de uso seguro, incluyendo el proceso de limpieza y el uso adecuado de los EPP.",
    },
    {
      categoria: "control-de-calidad",
      titulo: "Inspecciones – Conceptos básicos",
      bajada: "Qué hacer cuando llega una inspección: procedimientos y responsabilidades.",
      anio: 2012,
      duracion: "Curso medio",
      imagen: "",
      personas: "Gerentes de sucursal y postulantes a Gerencia.",
      descripcion:
        "Este curso presenta los tipos de inspecciones que pueden realizar organismos gubernamentales en la sucursal y los eventos más frecuentes asociados a estos controles. Además, se detalla el procedimiento a seguir ante una inspección, los pasos clave de actuación y las responsabilidades del gerente durante todo el proceso.",
    },
    {
      categoria: "control-de-calidad",
      titulo: "Productos VICTORY",
      bajada: "Uso correcto de productos y equipamiento para los procesos de limpieza y desinfección.",
      anio: 2024,
      duracion: "Curso medio",
      imagen: "",
      personas:
        "Personal operativo de carnicería, pescadería, verdulería, panadería, cocina, rotisería, fiambrería y salón.",
      descripcion:
        "Este curso aborda el uso adecuado de los productos del sistema VICTORY según sector, superficie y tipo de suciedad, junto con el funcionamiento de los dosificadores UNI y DUAL. Además, se trabajan los pasos correctos de limpieza y desinfección, las condiciones de seguridad operativa y el uso responsable de los elementos de protección personal (EPP) en la sucursal.",
    },
    {
      categoria: "control-de-calidad",
      titulo: "Seguridad Alimentaria",
      bajada: "Buenas prácticas para cuidar la salud de los consumidores.",
      anio: 2015,
      duracion: "Curso medio",
      imagen: "",
      personas: "Todo el personal de la compañía (colaboradores, jefes y gerentes).",
      descripcion:
        "Este curso aborda los conceptos básicos de seguridad alimentaria, diferenciando alimentos inocuos, alterados y contaminados. Se trabajan las buenas prácticas de higiene personal y de los ambientes, la prevención de ETAs, el control de temperaturas y la correcta manipulación de los alimentos para evitar la contaminación cruzada durante la operatoria diaria.",
    },
    {
      categoria: "coto-digital",
      titulo: "Armadores de Coto Digital",
      bajada: "Todo lo que necesitás saber para preparar pedidos de Coto Digital.",
      anio: 2023,
      duracion: "Curso medio",
      imagen: "",
      personas: "Personal de Coto Digital.",
      descripcion:
        "Este curso aborda el proceso completo de armado de pedidos de Coto Digital, desde la preparación inicial del armador y el uso de la PDA, hasta el picking, el manejo de faltantes y la organización por sectores. También se trabajan el pesaje, los controles finales, el cierre del pedido y el cobro en la mesa de control, junto con las normas de higiene y seguridad necesarias durante la operatoria.",
    },
    {
      categoria: "coto-digital",
      titulo: "Auxiliares administrativos de Coto Digital - Parte 1",
      bajada: "Control de activos, reservas y gestión administrativa inicial.",
      anio: 2025,
      duracion: "Curso medio",
      imagen: "",
      personas: "Auxiliares, postulantes a jefes y jefes de Coto Digital.",
      descripcion:
        "En este curso vas a aprender a controlar los activos del sector, gestionar las reservas y realizar los controles administrativos esenciales del área. Abordaremos en detalle la planilla de control diario, los procedimientos de facturación y resguardo de mercadería, y la solicitud de cupones, brindándote las herramientas para una gestión eficaz.",
    },
    {
      categoria: "coto-digital",
      titulo: "Auxiliares administrativos de Coto Digital - Parte 2",
      bajada: "Procesos avanzados, devoluciones y resolución de reclamos.",
      anio: 2025,
      duracion: "Curso medio",
      imagen: "",
      personas: "Auxiliares, postulantes a jefes y jefes de Coto Digital.",
      descripcion:
        "En este curso vamos a profundizar en los procesos administrativos del sector y el uso correcto de las herramientas de gestión. Te capacitarás en el control de órdenes de compra, diferencias de precio y manejo de la caja de devoluciones. También veremos la mesa de rendiciones y la gestión de reclamos CRM para resolver incidencias operativas.",
    },
    {
      categoria: "coto-digital",
      titulo: "Coto Digital – Picking",
      bajada: "Los primeros pasos para comenzar el armado de pedidos en Coto Digital.",
      anio: 2020,
      duracion: "Curso medio",
      imagen: "",
      personas: "Gerentes y personal de Coto Digital.",
      descripcion:
        "Este curso introduce el concepto de picking y los elementos necesarios para el armado de pedidos en Coto Digital. Se aborda el uso de la PDA, la carga y seguimiento de la orden, la preparación del carrito y la lógica de armado según el layout del salón, junto con los controles básicos que garantizan un proceso ordenado y eficiente.",
    },
    {
      categoria: "coto-digital",
      titulo: "Coto Digital - Conceptos básicos",
      bajada: "Cómo funciona el circuito completo de compra y entrega en Coto Digital.",
      anio: 2020,
      duracion: "Curso medio",
      imagen: "",
      personas: "Gerentes y personal del sector Coto Digital.",
      descripcion:
        "Este curso presenta el circuito completo de un pedido en Coto Digital, desde la compra realizada por el cliente en la web o la app hasta la entrega final y la rendición. Se repasan los roles involucrados y los pasos clave del proceso, como el armado, el cobro, la logística de distribución y la entrega del pedido.",
    },
    {
      categoria: "elaborados",
      titulo: "Elaboración de facturas",
      bajada: "Lineamientos de elaboración y presentación de facturas en el sector Elaborados.",
      anio: 2020,
      duracion: "Curso medio",
      imagen: "",
      personas: "Personal del sector Elaborados. Flota Propia",
      descripcion:
        "Este curso enseña a elaborar las principales variedades de facturas: medialunas, vigilantes, tortitas negras, cañoncitos, lengüitas rellenas y surtidas. Se trabajan reposo de masas, armado, pintado, horneado, relleno y decoración, respetando recetas, tiempos y presentación.",
    },
    {
      categoria: "flota-propia",
      titulo: "Choferes de Flota Propia",
      bajada: "Todo lo que necesitás saber para desempeñarte como chofer de la Flota Propia de Coto Digital.",
      anio: 2025,
      duracion: "Curso largo",
      imagen: "",
      personas: "",
      descripcion:
        "Este curso recorre la jornada del chofer de Flota Propia, desde la asignación del móvil y los controles previos hasta la entrega de pedidos y el cierre del día. Se abordan las responsabilidades del rol, la documentación requerida, el checklist del vehículo, los controles de seguridad y los procedimientos ante imprevistos durante el recorrido.",
    },
    {
      categoria: "frescos-1",
      titulo: "Cortes de media res - Cuarto delantero",
      bajada: "Técnicas de desposte y presentación de cortes del cuarto delantero.",
      anio: 2024,
      duracion: "Curso largo",
      imagen: "",
      personas: "Personal del sector Frescos",
      descripcion:
        "Este curso aborda el desposte y corte del cuarto delantero de la media res, la obtención de los principales cortes y bifes y las distintas formas de armado del bife a 10 costillas. Además, se trabaja el uso correcto de cuchilla y sierra, la presentación de las piezas y los criterios básicos de higiene y calidad.",
    },
    {
      categoria: "frescos-1",
      titulo: "Cortes de media res - Cuarto trasero",
      bajada: "Cortes, técnicas y presentaciones del cuarto trasero de la media res.",
      anio: 2025,
      duracion: "Curso largo",
      imagen: "",
      personas:
        "Personal del sector Frescos. Armado de góndola de frutas y verduras Criterios esenciales para el cuidado, control de calidad y exhibición de frutas y verduras. Este curso aborda los conceptos fundamentales del sector de frutas y verduras, como la clasificación de productos, la estacionalidad y los controles de calidad. Se trabajan criterios de almacenamiento, control de temperaturas y buenas prácticas de exhibición e higiene para prevenir mermas y asegurar productos frescos y seguros para el consumo.",
      descripcion:
        "Este curso desarrolla técnicas de corte, limpieza y presentación del cuarto trasero de la media res, trabajando piezas internas y externas. Se estudian cortes como cuadril, peceto, nalga, tortuguita, bola de lomo y osobuco, además de emprolijado, milanesas y uso correcto de cuchilla y sierra, cumpliendo normas de calidad y seguridad.",
    },
    {
      categoria: "frescos-1",
      titulo: "Frutas y verduras – Conceptos básicos",
      bajada: "Criterios esenciales para el cuidado, control de calidad y exhibición de frutas y verduras.",
      anio: 2017,
      duracion: "Curso largo",
      imagen: "",
      personas: "Personal del sector Verdulería.",
      descripcion:
        "Este curso aborda los conceptos fundamentales del sector de frutas y verduras, como la clasificación de productos, la estacionalidad y los controles de calidad. Se trabajan criterios de almacenamiento, control de temperaturas y buenas prácticas de exhibición e higiene para prevenir mermas y asegurar productos frescos y seguros para el consumo.",
    },
    {
      categoria: "frescos-1",
      titulo: "Desposte de media res",
      bajada: "Fundamentos clave para el desposte seguro y correcto de la media res.",
      anio: 2016,
      duracion: "Curso largo",
      imagen: "",
      personas: "Personal del sector Frescos",
      descripcion:
        "Este curso presenta los conceptos generales del desposte, abordando herramientas, elementos de seguridad, técnicas de corte y clasificación de piezas. Se aprende a distinguir cortes delanteros y pistola, junto con los cuidados necesarios para el correcto almacenamiento, manipulación y conservación de la carne, respetando normas de calidad e higiene.",
    },
    {
      categoria: "frescos-1",
      titulo: "Cortes de media res - Pecho",
      bajada: "Cortes, técnicas y presentaciones del pecho de la media res.",
      anio: 2025,
      duracion: "Curso largo",
      imagen: "",
      personas: "Colaboradores, postulantes a jefes / jefes de Carnicería y gerentes de sucursal.",
      descripcion:
        "En este curso aprenderán cómo se obtienen, limpian y presentan los cortes del pecho de la media res. Nos enfocaremos en las técnicas correctas de desposte y exhibición para garantizar el correcto aprovechamiento de la pieza, cumpliendo rigurosamente con los estándares de calidad y frescura definidos para nuestra carnicería.",
    },
    {
      categoria: "frescos-1",
      titulo: "Introducción al sector de Carnicería",
      bajada: "Conceptos básicos de recepción, producción y exhibición en el sector Carnicería.",
      anio: 2016,
      duracion: "Curso largo",
      imagen: "",
      personas: "Personal del sector Carnicería.",
      descripcion:
        "Este curso presenta los conceptos fundamentales del sector Carnicería, incluyendo clasificación de la hacienda, recepción, almacenamiento, controles de calidad y seguridad. También aborda producción operativa, uso de maquinarias, limpieza y exhibición en mostrador y góndola para reducir mermas y mejorar la atención al cliente.",
    },
    {
      categoria: "frescos-1",
      titulo: "Uso de la máquina ULMA – Empaquetadora",
      bajada: "Instrucciones clave para operar la empaquetadora ULMA de forma segura y eficiente.",
      anio: 2013,
      duracion: "Curso corto",
      imagen: "",
      personas: "Personal del sector Carnicería.",
      descripcion:
        "Este curso brinda instrucciones para el uso seguro y eficiente de la empaquetadora ULMA en el sector Frescos. Aborda qué productos pueden y no pueden empaquetarse, el manejo del panel de mando, el control del sellado, las malas prácticas a evitar y los procedimientos de limpieza, lubricación y verificación básica por turno.",
    },
    {
      categoria: "frescos-2",
      titulo: "Armado de picadas",
      bajada: "Claves para preparar picadas con buena presentación, peso y frescura.",
      anio: 2020,
      duracion: "Curso corto",
      imagen: "",
      personas: "Personal de Quesos y Fiambres.",
      descripcion:
        "Este curso enseña el armado de picadas de quesos y fiambres, considerando bandeja, cuchillo y orden de armado. Aborda peso estándar, variedades, durabilidad y criterios de higiene y presentación, para lograr una exhibición atractiva y asegurar la aptitud de consumo en góndola según procedimientos del sector.",
    },
    {
      categoria: "frescos-2",
      titulo: "Corte de quesos",
      bajada:
        "Técnicas de corte, manipulación y exhibición para quesos y dulces, priorizando seguridad, calidad y presentación.",
      anio: 2020,
      duracion: "Curso medio",
      imagen: "",
      personas: "Personal de Quesos y Fiambres.",
      descripcion:
        "Este curso enseña técnicas correctas de corte y manipulación de quesos y dulces, diferenciando tipos, herramientas y formas de presentación. Aborda criterios de seguridad, exhibición con o sin bandeja y cuidados específicos de cada variedad, para garantizar productos frescos, seguros y bien presentados en góndola.",
    },
    {
      categoria: "frescos-2",
      titulo: "Pescadería – Exhibición de productos",
      bajada: "Todo lo que necesitás saber para conservar, exhibir y ordenar los productos de pescadería.",
      anio: 2025,
      duracion: "Curso largo",
      imagen: "",
      personas: "Personal del sector Pescadería. g.",
      descripcion:
        "Este curso enseña cómo conservar y presentar correctamente los productos del sector en mostrador, heladeras y pozos. Se abordan temperaturas de referencia, clasificación, almacenamiento seguro, uso del hielo, rotación y normas de higiene, junto con prácticas a evitar para preservar la calidad y prevenir la contaminación.",
    },
    {
      categoria: "gestion-comercial",
      titulo: "Panel de control",
      bajada: "Conocé cómo usar Panel de Control para visualizar y",
      anio: 2018,
      duracion: "Curso corto",
      imagen: "",
      personas: "Personal del área Comercial.",
      descripcion:
        "tomar decisiones basadas en las ventas. Este curso introduce la aplicación Panel de Control en iPad, enseñando a visualizar y comparar ventas a distintos niveles: cadena, sucursal, grupo comercial, departamento, clase, proveedor y PLU. Se aprende a navegar la información, interpretar indicadores y realizar análisis según cada necesidad para optimizar la gestión y la toma de decisiones comerciales.",
    },
    {
      categoria: "gestion-comercial",
      titulo: "Gestión Comercial – Conceptos básicos",
      bajada: "Conocé los procesos, herramientas y estrategias que",
      anio: 2014,
      duracion: "Curso largo",
      imagen: "",
      personas: "Personal de los sectores comerciales y de Administración.",
      descripcion:
        "permiten organizar y optimizar la gestión comercial en Coto. Este curso introduce los fundamentos de la gestión comercial, abordando mantenimiento de artículos, uso de PLU, definición de surtido y reposición, manejo y control de stock, valorización y análisis de precios y competencia, utilizando herramientas internas, sistemas de la compañía y un glosario de términos clave para la gestión diaria.",
    },
    {
      categoria: "gestion-comercial",
      titulo: "Estudio de casos: Clavos",
      bajada: "Aprendé a identificar y gestionar productos que no",
      anio: 2016,
      duracion: "Curso medio",
      imagen: "",
      personas: "Personal del área Comercial.",
      descripcion:
        "rotan para optimizar la venta en sucursales. Este curso enseña a identificar “clavos” o productos sin rotación mediante el uso de iPad y sistema VACA. Se analiza rotación, stock, kardex, precios y relevamientos, y se aplican soluciones específicas según cada caso, con ejemplos prácticos basados en situaciones reales de sucursales que facilitan la toma de decisiones comerciales.",
    },
    {
      categoria: "gestion-comercial",
      titulo: "Uso de aplicativo – Sucursales 3",
      bajada: "Herramienta clave para controlar mercadería, rotación y surtido de tu sucursal desde el iPad.",
      anio: 2019,
      duracion: "Curso corto",
      imagen: "",
      personas: "Gerentes de Sucursal.",
      descripcion:
        "Este curso muestra cómo utilizar el módulo Surtido de Sucursales3 en iPad para consultar y analizar datos de stock, frecuencia de venta y disponibilidad de productos. Se trabaja la interpretación de la información para tomar decisiones estratégicas sobre surtido, rotación, reposición y una gestión eficiente del espacio y la sucursal.",
    },
    {
      categoria: "mantenimiento",
      titulo: "Electricidad – Conceptos básicos",
      bajada: "Fundamentos esenciales para comprender instalaciones eléctricas y trabajar con seguridad.",
      anio: 2014,
      duracion: "Curso medio",
      imagen: "",
      personas:
        "Personal de Mantenimiento y colaboradores que realicen tareas relacionadas con instalaciones eléctricas",
      descripcion:
        "Este curso introduce los conceptos básicos de electricidad, abordando magnitudes eléctricas, tipos de corriente monofásica y trifásica, elementos de maniobra y protección, uso de instrumentos de medición, representación de circuitos y análisis básico de instalaciones, para trabajar con criterio técnico, prevención de riesgos y seguridad operativa.",
    },
    {
      categoria: "mantenimiento",
      titulo: "Detección de incendios",
      bajada: "Conocé los sistemas, dispositivos y procedimientos",
      anio: 2013,
      duracion: "Curso medio",
      imagen: "",
      personas: "Gerentes y jefes de sectores.",
      descripcion:
        "para detectar y actuar ante incendios Este curso brinda conocimientos sobre los sistemas de detección de incendios en sucursales, abordando normativa, tipos de detectores térmicos, de humo, gas y manuales, funcionamiento de la central de alarma, señalización acústica y visual, discador/llamador y sistemas convencionales y analógicos para actuar de forma rápida y correcta ante emergencias.",
    },
    {
      categoria: "mantenimiento",
      titulo: "Circuito de Service",
      bajada: "Cómo gestionar correctamente los pedidos de mantenimiento en la sucursal.",
      anio: 2018,
      duracion: "Curso medio",
      imagen: "",
      personas:
        "Jefes, postulantes y empleados de línea de los sectores Mantenimiento, Administración y Operaciones",
      descripcion:
        "Este curso enseña a gestionar los pedidos de mantenimiento en sucursal, diferenciando Service automáticos y no automáticos. Se abordan todas las etapas del proceso: generación, seguimiento, carga y control de presupuestos, supervisión, valorización y cierre, garantizando un manejo eficiente, correcto y debidamente documentado de cada solicitud.",
    },
    {
      categoria: "mantenimiento",
      titulo: "Puesta a punto de la máquina ULMA",
      bajada: "Ajustes clave para garantizar el funcionamiento seguro y eficiente de la empaquetadora.",
      anio: 2020,
      duracion: "Curso corto",
      imagen: "",
      personas: "Técnicos de mantenimiento de sucursales.",
      descripcion:
        "Este curso enseña a realizar la puesta a punto de los principales componentes de la máquina ULMA, como el empujador, las plegadoras y el carro de alimentación. Se abordan los ajustes necesarios para asegurar un funcionamiento seguro, preciso y continuo del equipo, evitando fallas, detenciones y pérdidas en el proceso de empaquetado.",
    },
    {
      categoria: "mantenimiento",
      titulo: "Seguridad Eléctrica",
      bajada:
        "Fundamentos y prácticas para para prevenir riesgos y trabajar con electricidad de forma segura.",
      anio: 2015,
      duracion: "Curso largo",
      imagen: "",
      personas: "Personal de mantenimiento y colaboradores que realizan tareas con riesgo eléctrico.",
      descripcion:
        "Este curso aborda los riesgos asociados al trabajo con instalaciones eléctricas, como descargas, incendios y explosiones. Enseña el uso correcto de EPP, elementos de maniobra y salvataje, y repasa las 5 reglas de oro de la seguridad eléctrica, promoviendo prácticas seguras, responsables y preventivas en el entorno laboral.",
    },
    {
      categoria: "mantenimiento",
      titulo: "Vehículos Industriales",
      bajada:
        "Checklist y procedimientos para operar de forma segura los principales vehículos del depósito.",
      anio: 2025,
      duracion: "Curso corto",
      imagen: "",
      personas: "Personal de Mantenimiento y todos quienes utilizan vehículos industriales.",
      descripcion:
        "Este curso enseña a realizar los checklists diarios de los tres vehículos industriales principales: autoelevador, apilador y zorra eléctrica. Se aprende a detectar fallas a tiempo, garantizar un uso seguro, prevenir accidentes y prolongar la vida útil de los equipos, promoviendo buenas prácticas operativas y el cumplimiento de normas de seguridad.",
    },
    {
      categoria: "no-alimentos",
      titulo: "Coto Hogar – Conceptos básicos",
      bajada: "Funcionamiento del sector, surtido y criterios para una correcta exhibición.",
      anio: 2013,
      duracion: "Curso largo",
      imagen: "",
      personas: "Repositores de Salón, Jefes de Salón Mixto, Jefes de Coto Hogar y Gerentes de sucursal.",
      descripcion:
        "Este curso brinda una visión integral del sector Coto Hogar. Presenta sus departamentos y líneas de productos, los procesos de recepción y almacenamiento de mercadería, la lógica de surtido por sucursal y los criterios definidos para la exhibición en salón, con foco en el orden, la estacionalidad y la experiencia del cliente.",
    },
    {
      categoria: "no-alimentos",
      titulo: "NOA - Prioridad de reposición",
      bajada: "Herramientas y criterios para asegurar stock y góndolas completas en No Alimentos.",
      anio: 2024,
      duracion: "Curso medio",
      imagen: "",
      personas: "Colaboradores del sector NOA, Electro y responsables de Salón.",
      descripcion:
        "Este curso explica cómo utilizar el Reporte de Prioridad de Reposición para identificar productos agotados o con bajo stock y definir qué reponer primero en góndola. Introduce el concepto de MEG (Mínimo de Exhibición en Góndola), los modos de consulta del reporte y las acciones necesarias para asegurar disponibilidad y una correcta exhibición diaria.",
    },
    {
      categoria: "no-alimentos",
      titulo: "NOA - Relevamiento de clases",
      bajada: "Control de exhibición y disponibilidad en No Alimentos.",
      anio: 2025,
      duracion: "Curso largo",
      imagen: "",
      personas: "Colaboradores, postulantes a jefes y jefes de NOA (Electro, Hogar y Textil).",
      descripcion:
        "En este curso aprenderás a verificar que los productos de Electro, Hogar y Textil estén correctamente exhibidos y disponibles para la venta. Te capacitaremos en el uso de GESCOM, Sucursales 3 y la PDA para realizar el relevamiento semanal de clases, detectar errores de stock o exhibición y cerrar el control garantizando el surtido ideal.",
    },
    {
      categoria: "no-alimentos",
      titulo: "Textil/Bazar – Carpeta compartida",
      bajada: "Gestión centralizada de la información del sector.",
      anio: 2020,
      duracion: "Curso corto",
      imagen: "",
      personas: "Personal de Textil y Bazar.",
      descripcion:
        "Este curso explica cómo crear, acceder y utilizar correctamente la Carpeta Compartida del sector Textil/Bazar. Se aborda su rol como herramienta central de gestión, donde se organiza información clave sobre ofertas, stock, precios y decomisos, y se destaca la importancia de mantenerla siempre actualizada para una correcta toma de decisiones.",
    },
    {
      categoria: "no-alimentos",
      titulo: "Textil/Bazar – Archivos de auditoría",
      bajada: "Análisis de información clave para el control y la toma de decisiones del sector.",
      anio: 2020,
      duracion: "Curso corto",
      imagen: "",
      personas: "Personal de Textil y Bazar.",
      descripcion:
        "Este curso enseña a utilizar los archivos disponibles en la carpeta compartida del sector y a analizar los reportes enviados por auditoría. A partir de esta información, se aprende a evaluar el estado de los productos y a definir acciones como liquidaciones, ajustes por faltantes de stock o decomisos de mercadería no apta para la venta.",
    },
    {
      categoria: "no-alimentos",
      titulo: "Textil/Bazar – Pedido de repuestos",
      bajada: "Cómo solicitar repuestos utilizando el sistema GDM.",
      anio: 2020,
      duracion: "Curso corto",
      imagen: "",
      personas: "Personal del Textil/Bazar.",
      descripcion:
        "Este curso enseña cómo realizar pedidos de repuestos del sector Textil/Bazar a través del módulo Gestión de Pedidos del sistema GDM Sucursales. Se aborda el uso correcto de la herramienta, el seguimiento de pedidos y su importancia para asegurar una gestión comercial eficiente y el abastecimiento oportuno.",
    },
    {
      categoria: "no-alimentos",
      titulo: "Ventas – Conceptos básicos",
      bajada: "Herramientas y técnicas para una atención efectiva y orientada al cierre.",
      anio: 2015,
      duracion: "Curso medio",
      imagen: "",
      personas: "Colaboradores y jefes de bazar, electrodomésticos y atención al cliente..",
      descripcion:
        "Este curso presenta las etapas del proceso de venta, desde la bienvenida hasta la despedida, incluyendo indagación, asesoramiento, manejo de objeciones, cierre y venta adicional. Brinda técnicas de comunicación para adaptarse a distintos perfiles de clientes y nociones de producto para asesorar con seguridad.",
    },
    {
      categoria: "recursos-humanos",
      titulo: "Manual de Recursos Humanos – 3",
      bajada: "Control de fichadas, ausencias y seguimiento operativo del personal.",
      anio: 2018,
      duracion: "Curso largo",
      imagen: "",
      personas: "Auxiliares de Administración de Recursos Humanos en sucursales.",
      descripcion:
        "Este curso aborda la gestión integral del control de personal en sucursal. Incluye el tratamiento de errores de fichadas, control de jornada y horas extras, emisión y uso de ficha rosa, carga y seguimiento de ausencias en SAP, control de libretas sanitarias, gestión de personal tercerizado y elaboración de informes periódicos de RRHH.",
    },
    {
      categoria: "recursos-humanos",
      titulo: "Administración de Recursos Humanos - 1",
      bajada: "Procedimientos y criterios para gestionar ingresos de personal en sucursal.",
      anio: 2023,
      duracion: "Curso largo",
      imagen: "",
      personas: "Auxiliares de Administración de Recursos Humanos en sucursales.",
      descripcion:
        "Este curso aborda el proceso de ingreso de personal en la sucursal, desde la gestión del requerimiento hasta el seguimiento del período de prueba. Incluye recepción del nuevo empleado, verificación de documentación, inducción, entrega de uniformes y EPP, y cierre administrativo, unificando criterios para una correcta incorporación.",
    },
    {
      categoria: "recursos-humanos",
      titulo: "Administración de Recursos Humanos – 2",
      bajada: "Planificación horaria, vacaciones y gestión operativa en SAP.",
      anio: 2024,
      duracion: "Curso largo",
      imagen: "",
      personas: "Auxiliares de Administración de Recursos Humanos en sucursales.",
      descripcion:
        "Este curso aborda la planificación horaria y de vacaciones del personal, desde la carga web y sus etapas de aprobación hasta su imputación en SAP. Incluye modalidades de contrato, control de francos, cambios de horario, notificación al personal y liquidación de vacaciones, asegurando una gestión ordenada y conforme a normativa.",
    },
    {
      categoria: "recursos-humanos",
      titulo: "Manual de Recursos Humanos – 4",
      bajada: "Criterios y procedimientos para el régimen disciplinario en sucursal.",
      anio: 2018,
      duracion: "Curso corto",
      imagen: "",
      personas: "Auxiliares de Administración de Recursos Humanos en las sucursales.",
      descripcion:
        "Este curso describe los principios del régimen disciplinario, los distintos tipos de faltas y sanciones, y cómo deben redactarse, cargarse y archivar. También se abordan los criterios de aplicación y las instancias de reunión vinculadas a la gestión de sanciones.",
    },
    {
      categoria: "recursos-humanos",
      titulo: "Manual de Recursos Humanos – 5",
      bajada: "Procedimientos ante accidentes laborales y uso adecuado del botiquín.",
      anio: 2018,
      duracion: "Curso corto",
      imagen: "",
      personas: "Auxiliares de Administración de Recursos Humanos y responsables de área en las sucursales.",
      descripcion:
        "Este curso presenta los pasos a seguir ante un accidente de trabajo, incluyendo la clasificación de incidentes, qué se considera una enfermedad profesional y el rol del botiquín en la atención inicial. Una guía fundamental para actuar con rapidez y criterio ante situaciones imprevistas.",
    },
    {
      categoria: "recursos-humanos",
      titulo: "Manual de Recursos Humanos – 6",
      bajada: "Cómo actuar correctamente frente a una inspección.",
      anio: 2018,
      duracion: "Curso corto",
      imagen: "",
      personas: "Auxiliares de Administración de Recursos Humanos y responsables operativos.",
      descripcion:
        "Este curso detalla qué organismos pueden presentarse en la sucursal y cuál es el procedimiento adecuado a seguir durante una inspección. Brinda herramientas para garantizar una respuesta clara, ordenada y alineada con la normativa vigente.",
    },
    {
      categoria: "recursos-humanos",
      titulo: "Manual de Recursos Humanos – 7",
      bajada: "Control de pre-liquidación y entrega de recibos.",
      anio: 2018,
      duracion: "Curso corto",
      imagen: "",
      personas: "Auxiliares de Administración de Recursos Humanos en las sucursales.",
      descripcion:
        "Este curso detalla los aspectos fundamentales del proceso de pre-liquidación: desde la pérdida de premio y el control de frío, hasta la apertura y cierre de jornada, el control de preliquidación y la entrega de recibos al personal.",
    },
    {
      categoria: "recursos-humanos",
      titulo: "Manual de Recursos Humanos – 8",
      bajada: "Procedimientos para gestionar correctamente el egreso del personal.",
      anio: 2018,
      duracion: "Curso corto",
      imagen: "",
      personas: "Auxiliares de Administración de Recursos Humanos y responsables de área en las sucursales.",
      descripcion:
        "Este curso aborda las tareas relacionadas con la baja de un colaborador: tipos de egreso, carga en sistema, devolución de indumentaria y generación del listado de bajas. Una guía práctica para asegurar que el cierre del vínculo laboral se realice de forma ordenada y conforme a los procedimientos establecidos.",
    },
    {
      categoria: "salon",
      titulo: "Salón - Prioridad de reposición",
      bajada: "Gestión de reposición en góndola según stock y mínimos de exhibición.",
      anio: 2022,
      duracion: "Curso medio",
      imagen: "",
      personas: "Jefes y colaboradores del Salón de Ventas.",
      descripcion:
        "Este curso explica el uso del reporte de Prioridad de Reposición para identificar productos ingresados con quiebre de stock o por debajo del MEG. Aborda la reposición inmediata según prioridades, el control permanente tras la recepción de mercadería y la impresión de obleas de precio en GESCOM para asegurar góndolas completas y actualizadas.",
    },
    {
      categoria: "salon",
      titulo: "Salón - N días",
      bajada: "Control y gestión de productos sin rotación para mejorar ventas y exhibición.",
      anio: 2022,
      duracion: "Curso corto",
      imagen: "",
      personas: "Jefes y colaboradores del Salón de Ventas.",
      descripcion:
        "Este curso explica el concepto de N días y el uso del reporte para detectar productos que no registran ventas en un período determinado. Aborda la identificación de falsos stocks y problemas de exhibición, y el análisis de acciones comerciales y correctivas necesarias para asegurar la rotación y eficiencia del salón de ventas.",
    },
    {
      categoria: "salon",
      titulo: "Salón - Flujo del hueco",
      bajada: "Gestión diaria de faltantes en góndola para asegurar stock, orden y correcta exhibición.",
      anio: 2022,
      duracion: "Curso medio",
      imagen: "",
      personas: "Jefes y colaboradores del Salón de Ventas.",
      descripcion:
        "Este curso desarrolla el proceso diario de relevamiento y gestión de faltantes en góndola mediante PDA y reportes de GESCOM. Explica la identificación de huecos del jefe, del sistema y coincidentes, el uso de obleas, la detección de falsos stocks, los ajustes correspondientes y el análisis de causas para asegurar una correcta reposición y exhibición.",
    },
    {
      categoria: "salon",
      titulo: "Salón - Traspasos de sucursal a 126",
      bajada: "Gestión de traspasos de mercadería al Centro de Devoluciones.",
      anio: 2022,
      duracion: "Curso medio",
      imagen: "",
      personas: "Colaboradores de Salón y personal de Operaciones.",
      descripcion:
        "Este curso explica el procedimiento para realizar traspasos de mercadería desde la sucursal al Centro de Devoluciones 126. Aborda la identificación de productos con convenio, la preparación y carga del traspaso en el sistema, el uso de obleas, el armado correcto de pallets, los requisitos de envío y la emisión de documentación para asegurar un proceso ordenado y sin desvíos.",
    },
    {
      categoria: "salon",
      titulo: "Salón - Relevamiento de clases",
      bajada: "Control semanal de surtido y correcta exhibición en góndola.",
      anio: 2022,
      duracion: "Curso medio",
      imagen: "",
      personas: "Jefes y colaboradores del Salón de Ventas.",
      descripcion:
        "Este curso explica el relevamiento semanal de clases para verificar que los productos definidos por el sistema estén correctamente exhibidos en góndola. Aborda el uso de PDA y GESCOM, el escaneo de obleas y huecos, la corrección de diferencias y el análisis del cumplimiento por departamento, con el objetivo de superar el 90% y detectar falsos stocks.",
    },
    {
      categoria: "seguridad",
      titulo: "Seguridad - Puestos en Sucursal",
      bajada: "Funciones, responsabilidades y controles del personal de Seguridad en la sucursal.",
      anio: 2021,
      duracion: "Curso largo",
      imagen: "",
      personas:
        "Gerentes, Jefes de Operaciones, Jefes de Recepción, Fiscalizadores y Recepcionistas. Recepción de proveedores Procedimiento estandarizado para una recepción de mercadería precisa y controlada. Este curso explica el procedimiento completo para la recepción de mercadería de proveedores directos. Aborda las etapas de carga de orden de compra, descarga y control de mercadería, registro de embalajes, confirmación del pedido, gestión de devoluciones y salida del proveedor, asegurando una recepción ordenada, precisa y sin desvíos.",
      descripcion:
        "Este curso presenta los distintos puestos del sector Seguridad en la sucursal y sus responsabilidades operativas. Aborda funciones de control en recepción, salón, cajas, electro, bodega, playa y CCTV, incluyendo manejo de productos críticos, control de frío, alarmado, rondines y coordinación con otras áreas para prevenir incidentes y desvíos.",
    },
    {
      categoria: "seguridad",
      titulo: "Controles para modalidades de hurto",
      bajada: "Prevención, detección y control de hurtos en sucursal.",
      anio: 2024,
      duracion: "Curso largo",
      imagen: "",
      personas: "Personal de Seguridad en sucursales.",
      descripcion:
        "Este curso desarrolla las principales modalidades de hurto detectadas en cajas, salón y otras cadenas, como changos con doble fondo, bolsas preparadas, mecheros, cambio de etiquetas y hurtos combinados. Además, aborda los controles clave de seguridad, incluyendo rondines, conteo de críticos, jaula de productos sensibles, control de frío y seguimiento de sospechosos.",
    },
    {
      categoria: "seguridad",
      titulo: "Recepciones del Centro de Distribución",
      bajada: "Control y trazabilidad en la recepción de mercadería desde el CD.",
      anio: 2013,
      duracion: "Curso largo",
      imagen: "",
      personas: "Personal de Seguridad, Jefes y Gerentes de Sucursal.",
      descripcion:
        "Este curso explica el procedimiento de recepción de móviles provenientes del Centro de Distribución, abordando el control de documentación, precintos y obleas, la descarga de pallets y cubetas, el registro de ingresos y egresos, y el uso de PDA y GPS para asegurar una recepción ordenada, segura y con trazabilidad completa.",
    },
    {
      categoria: "seguridad-higiene",
      titulo: "Uso seguro del montacargas",
      bajada: "Las 5 normas básicas para operar montacargas sin riesgos.",
      anio: 2018,
      duracion: "Curso corto",
      imagen: "",
      personas: "Todo el personal de la compañía.",
      descripcion:
        "Este curso presenta las cinco normas básicas para el uso seguro del montacargas. Aborda la verificación previa del equipo, las condiciones de operación, las medidas de seguridad durante su uso y cómo actuar ante fallas o situaciones de riesgo, con el objetivo de prevenir accidentes y promover un entorno de trabajo seguro.",
    },
    {
      categoria: "seguridad-higiene",
      titulo: "Inducción en Seguridad e Higiene - Conceptos básicos",
      bajada: "Una introducción fundamental para cuidar lo más importante: las personas.",
      anio: 2018,
      duracion: "Curso largo",
      imagen: "",
      personas:
        "Todo el personal de la compañía. Seguridad de la Información Lineamientos esenciales para proteger la información y los sistemas de la compañía. Este curso presenta los fundamentos de la Seguridad de la Información en COTO y el uso responsable de la información como activo estratégico. Aborda el Convenio de Confidencialidad, la clasificación de la información, la gestión de accesos y las responsabilidades de Sistemas y de los empleados para prevenir usos indebidos.",
      descripcion:
        "Este curso introduce los conceptos básicos de Seguridad e Higiene laboral en COTO. Aborda actos y condiciones inseguras, el uso correcto de los elementos de protección personal, señalizaciones, tipos de matafuegos y el rol de la ART, con el objetivo de concientizar sobre la prevención de riesgos y el cumplimiento de normas.",
    },
    {
      categoria: "servicio-medico",
      titulo: "Prevención cardiovascular",
      bajada: "Cómo reducir los riesgos de enfermedades cardiovasculares desde el cuidado diario",
      anio: 2023,
      duracion: "Curso medio",
      imagen: "",
      personas:
        "Curso de Cumpleaños de Zona E ¡Todo lo que necesitás para ser un gran anfitrión en los Cumples de Zona E! En este curso conocerás las propuestas de Zona Cumples y cómo comunicarlas de forma clara a los clientes. Se desarrollan las 5 etapas del cumple —venta, contratación, preparación, día del evento y post cumple— y las tareas clave en cada una, reforzando la importancia de una atención al cliente de calidad en todo el proceso.",
      descripcion:
        "Este curso introduce a las enfermedades cardiovasculares como parte de las enfermedades no transmisibles (ENT) y explica cómo prevenirlas. Aborda los principales factores de riesgo, diferenciando entre modificables y no modificables, y promueve hábitos saludables para reducir el impacto de la hipertensión, el colesterol, la diabetes, el sedentarismo y el tabaquismo.",
    },
    {
      categoria: "zona-e",
      titulo: "Anfitriones de Zona E",
      bajada:
        "Herramientas y conocimientos clave para brindar una experiencia de juego segura, ordenada y de calidad.",
      anio: 2014,
      duracion: "Curso largo",
      imagen: "",
      personas: "Anfitriones de Zona E, Cajeros y Jefes.",
      descripcion:
        "Este curso está orientado a anfitriones de Zona Entretenimientos y desarrolla las funciones clave del rol. Aborda las tareas diarias, la apertura y cierre del sector, el cruce de seguridad y el conocimiento del funcionamiento y ubicación de los juegos, con foco en la atención al cliente y el trato cordial.",
    },
    {
      categoria: "zona-e",
      titulo: "Camareros de Zona Gourmet",
      bajada: "Cómo brindar una excelente atención al cliente en el sector de Zona Gourmet.",
      anio: 2024,
      duracion: "Curso largo",
      imagen: "",
      personas:
        "Camareros de Zona Gourmet. Edición 2026 Cualquier consulta comunicarse a aprendizaje@coto.com.ar",
      descripcion:
        "Este curso introduce a los camareros en la experiencia Zona Gourmet y los objetivos del rol. Aborda los preparativos de inicio y cierre de jornada y desarrolla los 16 pasos de la atención al cliente, desde la bienvenida y toma del pedido hasta el cobro, la despedida y la limpieza final de la mesa.",
    },
    {
      categoria: "frescos-1",
      titulo: "Armados de frutas y verduras",
      bajada: "",
      anio: "",
      duracion: "",
      imagen: "",
      personas: "",
      descripcion: "",
    },
    {
      categoria: "seguridad",
      titulo: "Seguridad - Recepción de proveedores",
      bajada: "",
      anio: "",
      duracion: "",
      imagen: "",
      personas: "",
      descripcion: "",
    },
    {
      categoria: "sistemas",
      titulo: "Seguridad de la Información - Conceptos básicos",
      bajada: "",
      anio: "",
      duracion: "",
      imagen: "",
      personas: "",
      descripcion: "",
    },
    {
      categoria: "zona-e",
      titulo: "Cumpleaños de Zona E!",
      bajada: "",
      anio: "",
      duracion: "",
      imagen: "",
      personas: "",
      descripcion: "",
    },
  ],
  $ = (v7) => document.querySelector(v7),
  uid = () => "id-" + Math.random().toString(36).slice(2, 9),
  esc = (v8) =>
    String(v8 == null ? "" : v8).replace(
      /[&<>"]/g,
      (v9) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
        })[v9],
    );
function mentionize(v10) {
  let v11 = esc(v10 || "");
  const v12 = TEAM.map((v13) => v13.nombre).filter(Boolean);
  if (!v12.length) return v11;
  const v14 = new RegExp(
    "@(" + v12.map((v15) => v15.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")).join("|") + ")\\b",
    "gi",
  );
  return v11.replace(v14, '<span class="mention">@$1</span>');
}
const pad = (v16) => String(v16).padStart(2, "0"),
  isoOf = (v17) => v17.getFullYear() + "-" + pad(v17.getMonth() + 1) + "-" + pad(v17.getDate()),
  todayISO = () => isoOf(new Date());
function parseISO(v18) {
  if (!v18) return null;
  const v19 = String(v18).split("-").map(Number);
  return new Date(v19[0], v19[1] - 1, v19[2]);
}
function fmtShort(v20) {
  const v21 = parseISO(v20);
  return v21 ? v21.getDate() + "/" + (v21.getMonth() + 1) : "";
}
function addDays(v22, v23) {
  const v24 = new Date(v22);
  return (v24.setDate(v24.getDate() + v23), v24);
}
function daysBetween(v25, v26) {
  return Math.round((parseISO(v26) - parseISO(v25)) / 86400000);
}
const MESES = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ],
  DOW = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  member = (v27) => TEAM.find((v28) => v28.id === v27),
  sectorName = (v29) => (SECTORES[v29] ? SECTORES[v29].nombre : null);
function isCurso(v30) {
  return v30.tipo === "curso";
}
const INV_KIND = {
  curso: "cursos",
  "edu-point": "edu-points",
  "app-web": "apps",
  "base-sistema": "bases",
};
function inventoryKind(v31) {
  return INV_KIND[v31.tipo] || null;
}
function inInventory(v32) {
  return !!v32.publicado && !!inventoryKind(v32);
}
function isInventory(v33) {
  return inInventory(v33) && !v33.enActualizacion;
}
function isOverdue(v34) {
  const v35 = v34.fin || v34.inicio;
  if (!v35 || isInventory(v34)) return false;
  return v35 < todayISO();
}
function progress(v36) {
  const v37 = v36.checklist || [],
    v38 = v37.filter((v39) => v39.done).length;
  return {
    done: v38,
    total: v37.length,
    pct: v37.length ? Math.round((v38 / v37.length) * 100) : 0,
  };
}
function avatarHTML(v40, v41) {
  const v42 = member(v40);
  if (!v42) return "";
  const v43 = v42.nombre.slice(0, 1).toUpperCase();
  return (
    '<span class="avatar ' +
    (v41 ? "sm" : "") +
    '" style="background:' +
    v42.color +
    '" title="' +
    esc(v42.nombre) +
    '">' +
    v43 +
    "</span>"
  );
}
function stackHTML(v44) {
  const v45 = [v44.responsable, ...(v44.asignados || [])]
    .filter((v46, v47, v48) => v46 && v48.indexOf(v46) === v47)
    .slice(0, 4);
  return '<div class="stack">' + v45.map((v49) => avatarHTML(v49, true)).join("") + "</div>";
}
function sectoresBadges(v50) {
  if (!v50 || !v50.length) return '<span class="badge badge-tbd" data-action="noop">TBD</span>';
  return v50
    .map((v51) =>
      SECTORES[v51]
        ? '<span class="badge badge-cat" data-cat="' + v51 + '">' + esc(SECTORES[v51].nombre) + "</span>"
        : '<span class="badge badge-tbd">' + esc(v51) + "</span>",
    )
    .join("");
}
function primaryCat(v52) {
  return v52.sectores && v52.sectores[0] && SECTORES[v52.sectores[0]] ? v52.sectores[0] : "tbd";
}
const BACKEND = {
    supabaseUrl: "https://cxttmjudynfegkjyanhs.supabase.co",
    supabaseKey: "sb_publishable_bKHAyRQKo2RtHCWfylTRew_PCH1MJaX",
    tabla: "planner",
    fila: "coto",
    pollMs: 5000,
  },
  useSupabase = () => !!(BACKEND.supabaseUrl && BACKEND.supabaseKey),
  KEY = "coto.superplanner.v1",
  Store = (function () {
    const v53 = {};
    let v54 = "storage";
    function v55() {
      return typeof window !== "undefined" ? window.storage : null;
    }
    async function v56(v57) {
      const v58 = v55();
      if (!v58) throw 0;
      if (typeof v58.get === "function")
        return await v58.get(v57, {
          shared: true,
        });
      if (typeof v58.getItem === "function")
        return await v58.getItem(v57, {
          shared: true,
        });
      throw 0;
    }
    async function v59(v60, v61) {
      const v62 = v55();
      if (!v62) throw 0;
      if (typeof v62.set === "function")
        return await v62.set(v60, v61, {
          shared: true,
        });
      if (typeof v62.setItem === "function")
        return await v62.setItem(v60, v61, {
          shared: true,
        });
      throw 0;
    }
    function v63(v64) {
      const v65 = Object.assign(
        {
          apikey: BACKEND.supabaseKey,
        },
        v64 || {},
      );
      if (/^eyJ/.test(BACKEND.supabaseKey)) v65.Authorization = "Bearer " + BACKEND.supabaseKey;
      return v65;
    }
    async function v66() {
      const v67 =
          BACKEND.supabaseUrl +
          "/rest/v1/" +
          BACKEND.tabla +
          "?id=eq." +
          encodeURIComponent(BACKEND.fila) +
          "&select=data",
        v68 = await fetch(v67, {
          headers: v63(),
        });
      if (!v68.ok) throw new Error("Supabase " + v68.status);
      const v69 = await v68.json();
      return v69 && v69[0] ? v69[0].data : null;
    }
    async function v70(v71) {
      const v72 = BACKEND.supabaseUrl + "/rest/v1/" + BACKEND.tabla,
        v73 = await fetch(v72, {
          method: "POST",
          headers: v63({
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates,return=minimal",
          }),
          body: JSON.stringify({
            id: BACKEND.fila,
            data: v71,
          }),
        });
      if (!v73.ok) throw new Error("Supabase " + v73.status);
    }
    return {
      mode: () => v54,
      async load() {
        if (useSupabase()) {
          const v74 = await v66();
          return ((v54 = "supabase"), v74);
        }
        try {
          const v75 = await v56(KEY);
          return ((v54 = "storage"), v75 ? JSON.parse(v75) : null);
        } catch (v76) {
          return ((v54 = "memoria"), v53[KEY] ? JSON.parse(v53[KEY]) : null);
        }
      },
      async save(v77) {
        const v78 = JSON.stringify(v77);
        if (useSupabase()) {
          try {
            (await v70(v77), (v54 = "supabase"));
          } catch (v79) {
            ((v54 = "error"), (v53[KEY] = v78));
          }
          return;
        }
        try {
          (await v59(KEY, v78), (v54 = "storage"));
        } catch (v80) {
          ((v54 = "memoria"), (v53[KEY] = v78));
        }
      },
      async remote() {
        return useSupabase() ? await v66() : null;
      },
    };
  })();
let saveTimer = null;
function persist() {
  if (useSupabase() && state.connOk === false) return;
  (clearTimeout(saveTimer),
    (saveTimer = setTimeout(async () => {
      await Store.save({
        cards: state.cards,
        templates: state.customTpl,
        sectores: SECTORES,
        team: TEAM,
        appPassHash: state.appPassHash,
        agenda: state.agenda,
      });
      if (useSupabase())
        state._remoteHash =
          JSON.stringify(state.cards) +
          JSON.stringify(SECTORES) +
          JSON.stringify(TEAM) +
          JSON.stringify(state.agenda);
      showBanner();
    }, 250)));
}
const state = {
  ready: false,
  user: null,
  userId: null,
  mis: false,
  view: "inicio",
  calMode: "mes",
  calCursor: new Date(),
  tlScale: "mes",
  tlGroup: "",
  tlRange: "todo",
  sort: "prioridad",
  mapaSec: "todos",
  filters: {
    persona: "",
    tipo: "",
    sector: "",
    estado: "",
    texto: "",
    cursoEstado: "",
  },
  quick: "",
  cards: [],
  customTpl: {},
  selectedId: null,
  draftTipo: "curso",
  recent: [],
  dragCal: null,
  dragTl: null,
  sel: [],
  savedViews: [],
  connOk: true,
  _remoteHash: "",
  eduSector: null,
  eduEst: "",
  eduQ: "",
  appPassHash: "1waoja",
  agendaRefY: new Date().getFullYear(),
  agendaRefM: new Date().getMonth(),
  agendaMode: "mi",
  agendaTool: "home",
  agendaEdit: "",
  agendaWho: "",
  agenda: {},
};
function hashStr(v81) {
  v81 = String(v81);
  let v82 = 5381;
  for (let v83 = 0; v83 < v81.length; v83++) {
    v82 = ((v82 << 5) + v82 + v81.charCodeAt(v83)) >>> 0;
  }
  return v82.toString(36);
}
const allTipos = () => Object.assign({}, TIPOS, mapCustom());
function mapCustom() {
  const v84 = {};
  for (const v85 in state.customTpl)
    v84[v85] = {
      nombre: state.customTpl[v85].nombre,
      icon: "🧩",
      custom: true,
    };
  return v84;
}
function tplFor(v86) {
  if (state.customTpl[v86]) return state.customTpl[v86];
  return (
    TEMPLATES[v86] || {
      fases: [],
      checklist: [],
    }
  );
}
const current = () => state.cards.find((v87) => v87.id === state.selectedId);
function newCard(v88, v89, v90) {
  const v91 = tplFor(v88);
  return Object.assign(
    {
      id: uid(),
      titulo: v89 || "Sin título",
      tipo: v88,
      estado: "pendiente",
      sectores: [],
      responsable: null,
      asignados: [],
      inicio: null,
      fin: null,
      prioridad: "normal",
      checklist: (v91.checklist || []).map((v92) => ({
        id: uid(),
        text: v92,
        done: false,
      })),
      fases: (v91.fases || []).map((v93) => ({
        id: uid(),
        nombre: v93,
        inicio: null,
        fin: null,
      })),
      publicado: false,
      enActualizacion: false,
      linkMoodle: "",
      catalogo: {
        categoria: "",
        bajada: "",
        anio: "",
        duracion: "",
        imagen: "",
        personas: "",
        descripcion: "",
      },
      notas: "",
      recurrencia: "none",
      ficha: {
        url: "",
        owner: "",
        estadoOp: "operativo",
      },
      comentarios: [],
      actividad: [],
      links: [],
    },
    v90 || {},
  );
}
function withChecklist(v94) {
  return v94.map((v95) =>
    typeof v95 === "string"
      ? {
          id: uid(),
          text: v95,
          done: false,
        }
      : {
          id: uid(),
          text: v95.t,
          done: !!v95.d,
        },
  );
}
function seedCards() {
  const v96 = [],
    v97 = (v98, v99, v100) => {
      const v101 = newCard(v98, v99);
      Object.assign(v101, v100);
      if (v100 && v100.checklist) v101.checklist = withChecklist(v100.checklist);
      if (v100 && v100.fasesD)
        v101.fases = v100.fasesD.map((v102) => ({
          id: uid(),
          nombre: v102.n,
          inicio: v102.i || null,
          fin: v102.f || null,
          tareas: (v102.t || []).map((v103) => ({
            id: uid(),
            text: v103.text,
            done: !!v103.done,
            fecha: v103.fecha || null,
          })),
        }));
      return (v96.push(v101), v101);
    },
    v104 = (v105) => isoOf(addDays(new Date(), v105));
  return (
    typeof window !== "undefined" &&
      window.__CF_SEED__ &&
      (v97("curso", "Curso de ejemplo", {
        sectores: ["control-de-calidad"],
        estado: "en-desarrollo",
        responsable: "dami",
        asignados: ["dami", "flor"],
        inicio: v104(-3),
        fin: v104(18),
        checklist: ["Brief aprobado", "Guion validado", "Maqueta visual", "Montaje", "QA", "Alta en Moodle"],
        fasesD: [
          {
            n: "Guion",
            i: v104(-3),
            f: v104(4),
          },
          {
            n: "Diseño",
            i: v104(5),
            f: v104(11),
          },
          {
            n: "Producción",
            i: v104(12),
            f: v104(18),
          },
        ],
      }),
      v97("video", "Video de ejemplo", {
        sectores: ["coto-digital"],
        estado: "en-revision",
        responsable: "eve",
        asignados: ["eve"],
        inicio: v104(-6),
        fin: v104(5),
        checklist: [
          {
            t: "Guion",
            d: true,
          },
          {
            t: "Rodaje",
            d: true,
          },
          {
            t: "Edición",
            d: false,
          },
          {
            t: "Entrega",
            d: false,
          },
        ],
      }),
      v97("presencial", "Capacitación de ejemplo", {
        sectores: ["mantenimiento"],
        estado: "pendiente",
        responsable: "flor",
        asignados: ["flor"],
        inicio: v104(3),
        fin: v104(3),
        checklist: ["Temario", "Material de soporte", "Convocatoria", "Dictado"],
      }),
      v97("libre", "Tarea de ejemplo", {
        sectores: [],
        estado: "pendiente",
        responsable: "gasti",
        asignados: ["gasti"],
        inicio: v104(1),
        fin: v104(4),
      }),
      v97("edu-point", "Edu Point de ejemplo", {
        sectores: ["salon"],
        publicado: true,
        estado: "en-revision",
        responsable: "vane",
        asignados: ["vane"],
        catalogo: {
          bajada: "Pieza Edu Point de ejemplo con QR.",
          anio: 2026,
          duracion: "",
          imagen: "",
          personas: "",
          descripcion: "",
          categoria: "salon",
        },
      }),
      v97("app-web", "Aplicativo de ejemplo", {
        publicado: true,
        estado: "en-revision",
        sectores: ["sistemas"],
        responsable: "dami",
        asignados: ["dami"],
        ficha: {
          url: "",
          owner: "Equipo",
          estadoOp: "operativo",
        },
        catalogo: {
          bajada: "Aplicativo web de ejemplo.",
        },
      }),
      v97("curso", "Curso activo de ejemplo", {
        publicado: true,
        estado: "en-revision",
        sectores: ["control-de-calidad"],
        responsable: "dami",
        asignados: ["dami"],
        catalogo: {
          bajada: "Curso publicado de muestra en el inventario.",
          anio: 2026,
          duracion: "30 min",
          imagen: "",
          personas: 120,
          descripcion: "Ejemplo de ficha de curso activo.",
          categoria: "control-de-calidad",
        },
      })),
    v96
  );
}
function ingestCatalogo(v106, { replace: replace = false } = {}) {
  let v107 = 0;
  return (
    v106.forEach((v108) => {
      const v109 = toSector(v108.categoria),
        v110 = state.cards.find(
          (v111) =>
            isCurso(v111) &&
            v111.titulo.trim().toLowerCase() ===
              String(v108.titulo || "")
                .trim()
                .toLowerCase(),
        );
      if (v110 && !replace) return;
      const v112 = newCard("curso", v108.titulo || "Curso sin título", {
        publicado: true,
        estado: "en-revision",
        sectores: v109 ? [v109] : [],
        linkMoodle: v108.linkMoodle || "",
        catalogo: {
          categoria: v108.categoria || "",
          bajada: v108.bajada || "",
          anio: v108.anio || "",
          duracion: v108.duracion || "",
          imagen: v108.imagen || "",
          personas: v108.personas || "",
          descripcion: v108.descripcion || "",
        },
      });
      v112.checklist = [];
      if (v110 && replace)
        Object.assign(v110, v112, {
          id: v110.id,
        });
      else state.cards.push(v112);
      v107++;
    }),
    v107
  );
}
function boardCards() {
  return state.cards.filter((v113) => !isInventory(v113));
}
function mine(v114) {
  return state.userId && (v114.responsable === state.userId || (v114.asignados || []).includes(state.userId));
}
function quickPass(v115, v116) {
  if (v116 === "venc") return isOverdue(v115);
  if (v116 === "alta") return v115.prioridad === "alta";
  if (v116 === "sinresp") return !v115.responsable;
  if (v116 === "sem") {
    const v117 = v115.inicio || v115.fin,
      v118 = v115.fin || v115.inicio;
    if (!v117) return false;
    const v119 = isoOf(weekStart(new Date())),
      v120 = isoOf(addDays(weekStart(new Date()), 6));
    return v117 <= v120 && v118 >= v119;
  }
  return true;
}
function passBoard(v121) {
  const v122 = state.filters;
  if (state.mis && state.userId && !mine(v121)) return false;
  if (state.quick && !quickPass(v121, state.quick)) return false;
  if (v122.persona && v121.responsable !== v122.persona && !(v121.asignados || []).includes(v122.persona))
    return false;
  if (v122.tipo && v121.tipo !== v122.tipo) return false;
  if (v122.sector && !(v121.sectores || []).includes(v122.sector)) return false;
  if (v122.estado && v121.estado !== v122.estado) return false;
  if (v122.texto && !v121.titulo.toLowerCase().includes(v122.texto.toLowerCase())) return false;
  return true;
}
function filteredBoard() {
  return boardCards().filter(passBoard);
}
function renderFilters() {
  const v123 = $("#misFlag");
  if (v123) v123.textContent = state.mis ? "ON" : "";
  if (state.view === "resumen" || state.view === "inicio") {
    $("#filters").innerHTML = "";
    return;
  }
  if (state.view === "mapa" && state.mapaSec === "edu-archivos") {
    $("#filters").innerHTML = "";
    return;
  }
  const v124 = state.filters,
    v125 = state.view === "mapa",
    v126 = (v127, v128, v129) =>
      '<option value="' + v127 + '" ' + (v129 === v127 ? "selected" : "") + ">" + esc(v128) + "</option>",
    v130 =
      '<div class="filt">👤<select data-filter="persona"><option value="">Todos</option>' +
      TEAM.map((v131) => v126(v131.id, v131.nombre, v124.persona)).join("") +
      "</select></div>",
    v132 =
      '<div class="filt">🎨<select data-filter="sector"><option value="">Sector</option>' +
      Object.keys(SECTORES)
        .map((v133) => v126(v133, SECTORES[v133].nombre, v124.sector))
        .join("") +
      "</select></div>",
    v134 =
      '<div class="filt">🏷️<select data-filter="tipo"><option value="">Tipo</option>' +
      Object.keys(allTipos())
        .map((v135) => v126(v135, allTipos()[v135].nombre, v124.tipo))
        .join("") +
      "</select></div>",
    v136 =
      '<div class="filt">◷<select data-filter="estado"><option value="">Estado</option>' +
      ESTADOS.map((v137) => v126(v137.id, v137.nombre, v124.estado)).join("") +
      "</select></div>",
    v138 =
      '<div class="filt">◷<select data-filter="cursoEstado"><option value="">Estado</option>' +
      v126("activo", "Activo", v124.cursoEstado) +
      v126("actualizando", "En actualización", v124.cursoEstado) +
      "</select></div>",
    v139 =
      '<div class="filt">🔎<input data-filter="texto" value="' +
      esc(v124.texto) +
      '" placeholder="Buscar título..." /></div>',
    v140 = [
      {
        k: "venc",
        l: "⚑ Vencidas",
      },
      {
        k: "sem",
        l: "📅 Esta semana",
      },
      {
        k: "sinresp",
        l: "👤 Sin responsable",
      },
      {
        k: "alta",
        l: "★ Alta",
      },
    ],
    v141 = v125
      ? ""
      : '<div class="qchips">' +
        v140
          .map(
            (v142) =>
              '<button class="qchip' +
              (state.quick === v142.k ? " on" : "") +
              '" data-action="quick:set" data-q="' +
              v142.k +
              '">' +
              v142.l +
              "</button>",
          )
          .join("") +
        "</div>",
    v143 = v125
      ? ""
      : '<div class="vchips">' +
        (state.savedViews || [])
          .map(
            (v144) =>
              '<button class="vchip" data-action="view:apply" data-id="' +
              v144.id +
              '" title="Aplicar vista guardada">⭐ ' +
              esc(v144.name) +
              '<span class="vx" data-action="view:del" data-id="' +
              v144.id +
              '" title="Borrar vista">✕</span></button>',
          )
          .join("") +
        '<button class="btn btn-ghost btn-sm" data-action="view:save" title="Guardar los filtros actuales como vista">💾 Guardar vista</button></div>',
    v145 = '<button class="btn btn-ghost btn-sm filt-clear" data-action="filt:clear">Limpiar</button>';
  $("#filters").innerHTML =
    (v125 ? [v132, v138, v139] : [v130, v134, v132, v136, v139]).join("") + v141 + v143 + v145;
}
const VIEW_TITLES = {
  kanban: ["Planner", "Tareas y proyectos por estado"],
  calendario: ["Calendario del planner", "Qué pasa y cuándo"],
  timeline: ["Timeline", "El panorama macro del área"],
  mapa: ["Mapa del área", "Lo que tenemos: cursos, Edu Points, apps y bases"],
};
function viewHeader() {
  const v146 = VIEW_TITLES[state.view];
  return v146 ? '<div class="view-head"><h2>' + v146[0] + "</h2><p>" + v146[1] + "</p></div>" : "";
}
function render() {
  (renderFilters(), renderView(), updateBell());
}
function renderView() {
  document
    .querySelectorAll(".tab")
    .forEach((v147) => v147.classList.toggle("active", v147.dataset.view === state.view));
  let v148 = "";
  if (state.view === "inicio") v148 = renderInicio();
  else {
    if (state.view === "resumen") v148 = renderResumen();
    else {
      if (state.view === "kanban") v148 = renderKanban();
      else {
        if (state.view === "calendario") v148 = renderCalendario();
        else {
          if (state.view === "timeline") v148 = renderTimeline();
          else {
            if (state.view === "agenda") v148 = renderAgenda();
            else {
              if (state.view === "mapa") v148 = renderMapa();
            }
          }
        }
      }
    }
  }
  $("#view").innerHTML = '<div class="view-in">' + viewHeader() + v148 + "</div>";
}
function cardKanban(v149) {
  const v150 = progress(v149),
    v151 = allTipos()[v149.tipo] || {
      nombre: v149.tipo,
      icon: "•",
    },
    v152 = isOverdue(v149),
    v153 = state.sel.includes(v149.id);
  return (
    '<article class="kcard' +
    (v153 ? " sel" : "") +
    '" draggable="true" data-id="' +
    v149.id +
    '" data-cat="' +
    primaryCat(v149) +
    '" data-action="card:open">\n    <span class="kcard-sel' +
    (v153 ? " on" : "") +
    '" data-action="card:sel" data-id="' +
    v149.id +
    '" title="Seleccionar">' +
    (v153 ? "✓" : "") +
    "</span>\n    " +
    (inInventory(v149) ? '<span class="tag-flag">◎ activo</span>' : "") +
    '\n    <div class="kcard-top">\n      <span class="tipo-pill">' +
    v151.icon +
    " " +
    esc(v151.nombre) +
    "</span>\n      " +
    (v149.prioridad === "alta" ? '<span class="badge prio">★ Alta</span>' : "") +
    '\n    </div>\n    <div class="kcard-title">' +
    esc(v149.titulo) +
    '</div>\n    <div class="badges">' +
    sectoresBadges(v149.sectores) +
    '</div>\n    <div class="kcard-meta">\n      <span class="date ' +
    (v152 ? "overdue" : "") +
    '">📅 ' +
    dateLabel(v149) +
    (v152 ? " · vencida" : "") +
    "</span>\n    </div>\n    " +
    (v150.total
      ? '<div class="prog-row"><div class="progress"><div class="progress-bar" style="width:' +
        v150.pct +
        '%"></div></div><span class="prog-num">' +
        v150.done +
        "/" +
        v150.total +
        "</span></div>"
      : "") +
    '\n    <div class="kcard-foot">' +
    stackHTML(v149) +
    "</div>\n  </article>"
  );
}
function dateLabel(v154) {
  if (v154.inicio && v154.fin && v154.fin !== v154.inicio)
    return fmtShort(v154.inicio) + " – " + fmtShort(v154.fin);
  const v155 = v154.fin || v154.inicio;
  return v155 ? fmtShort(v155) : "sin fecha";
}
function sortCards(v156) {
  const v157 = state.sort,
    v158 = (v159) => (v159.prioridad === "alta" ? 0 : 1),
    v160 = (v161) => v161.fin || v161.inicio || "9999-12-31";
  return v156.slice().sort((v162, v163) => {
    if (v157 === "prioridad") {
      if (v158(v162) !== v158(v163)) return v158(v162) - v158(v163);
      return v160(v162).localeCompare(v160(v163));
    }
    if (v157 === "fecha") return v160(v162).localeCompare(v160(v163));
    if (v157 === "titulo") return v162.titulo.localeCompare(v163.titulo);
    return 0;
  });
}
function renderKanban() {
  const v164 = filteredBoard(),
    v165 =
      '<div class="kbar">\n    <span class="pill">' +
      v164.length +
      " tarjeta" +
      (v164.length !== 1 ? "s" : "") +
      (state.mis && state.userId ? " · mías" : "") +
      '</span>\n    <span class="grow"></span>\n    <div class="filt">↕<select data-control="sort">\n      <option value="prioridad" ' +
      (state.sort === "prioridad" ? "selected" : "") +
      '>Prioridad</option>\n      <option value="fecha" ' +
      (state.sort === "fecha" ? "selected" : "") +
      '>Fecha</option>\n      <option value="titulo" ' +
      (state.sort === "titulo" ? "selected" : "") +
      ">Título</option>\n    </select></div></div>",
    v166 = state.sel.length,
    v167 = v166
      ? '<div class="bulkbar">\n    <span class="bulk-n">✓ ' +
        v166 +
        " seleccionada" +
        (v166 !== 1 ? "s" : "") +
        '</span>\n    <select data-bulk="estado"><option value="">Mover a estado…</option>' +
        ESTADOS.map((v168) => '<option value="' + v168.id + '">' + v168.nombre + "</option>").join("") +
        '</select>\n    <select data-bulk="resp"><option value="">Asignar responsable…</option>' +
        TEAM.map((v169) => '<option value="' + v169.id + '">' + esc(v169.nombre) + "</option>").join("") +
        '</select>\n    <button class="btn btn-sm" data-action="bulk:del" style="color:var(--bad)">🗑 Eliminar</button>\n    <span class="grow"></span>\n    <button class="btn btn-ghost btn-sm" data-action="bulk:clear">Cancelar</button>\n  </div>'
      : "",
    v170 = ESTADOS.map((v171) => {
      const v172 = sortCards(v164.filter((v173) => v173.estado === v171.id)),
        v174 = v172.filter(isOverdue).length;
      return (
        '<section class="kcol">\n      <div class="kcol-head"><span class="kcol-dot" style="background:' +
        v171.dot +
        '"></span><h3>' +
        v171.nombre +
        "</h3>\n        " +
        (v174 ? '<span class="kcol-over" title="vencidas">⚑ ' + v174 + "</span>" : "") +
        '\n        <span class="kcol-count">' +
        v172.length +
        '</span></div>\n      <div class="kcol-body" data-estado="' +
        v171.id +
        '">' +
        (v172.map(cardKanban).join("") ||
          '<div style="font-size:12px;color:var(--ink-soft);padding:10px;text-align:center">— vacío —</div>') +
        '</div>\n      <div class="quick-add"><input data-quickadd="' +
        v171.id +
        '" placeholder="+ Agregar… (Enter)"></div>\n    </section>'
      );
    }).join("");
  return v165 + v167 + ('<div class="kanban">' + v170 + "</div>");
}
function applyBulk(v175, v176) {
  if (!v176 || !state.sel.length) return;
  const v177 = new Set(state.sel);
  if (v175 === "estado")
    (state.cards.forEach((v178) => {
      v177.has(v178.id) &&
        v178.estado !== v176 &&
        (logAct(v178, "pasó a " + ((ESTADOS.find((v179) => v179.id === v176) || {}).nombre || v176)),
        (v178.estado = v176));
    }),
      flash("✓ " + state.sel.length + " movida(s)"));
  else
    v175 === "resp" &&
      (state.cards.forEach((v180) => {
        v177.has(v180.id) && (v180.responsable = v176);
      }),
      flash("✓ Responsable asignado a " + state.sel.length));
  ((state.sel = []), touch(), render());
}
function cardsOnDay(v181, v182) {
  return v181.filter((v183) => {
    const v184 = v183.inicio || v183.fin,
      v185 = v183.fin || v183.inicio;
    if (!v184) return false;
    return v182 >= v184 && v182 <= v185;
  });
}
function renderCalendario() {
  const v186 = filteredBoard(),
    v187 = state.calCursor,
    v188 =
      state.calMode === "mes"
        ? MESES[v187.getMonth()] + " " + v187.getFullYear()
        : "Semana del " + fmtShort(isoOf(weekStart(v187))),
    v189 =
      '<div class="cal-head">\n    <button class="btn btn-sm" data-action="cal:hoy">Hoy</button>\n    <button class="btn btn-icon btn-ghost" data-action="cal:prev">‹</button>\n    <button class="btn btn-icon btn-ghost" data-action="cal:next">›</button>\n    <div class="cal-title">' +
      v188 +
      '</div>\n    <div style="margin-left:auto" class="tabs">\n      <button class="tab ' +
      (state.calMode === "mes" ? "active" : "") +
      '" data-action="cal:mes">Mes</button>\n      <button class="tab ' +
      (state.calMode === "semana" ? "active" : "") +
      '" data-action="cal:semana">Semana</button>\n    </div></div>',
    v190 = DOW.map((v191) => '<div class="cal-dow">' + v191 + "</div>").join(""),
    v192 =
      state.calMode === "mes"
        ? monthGrid(v186, v187, v190)
        : '<div class="cal-grid cal-week">' + v190 + weekCells(v186, v187) + "</div>";
  return (
    '<div class="cal-layout">\n    <aside class="cal-mini">' +
    miniCal(v187) +
    '</aside>\n    <div class="cal-main">' +
    v189 +
    v192 +
    "</div>\n  </div>"
  );
}
function cardsInRange(v193, v194, v195) {
  return v193.filter((v196) => {
    const v197 = v196.inicio || v196.fin,
      v198 = v196.fin || v196.inicio;
    if (!v197) return false;
    return v197 <= v195 && v198 >= v194;
  });
}
function assignLanes(v199) {
  const v200 = v199
    .filter((v201) => v201.inicio || v201.fin)
    .map((v202) => ({
      c: v202,
      a: v202.inicio || v202.fin,
      b: v202.fin || v202.inicio,
    }));
  v200.sort(
    (v203, v204) =>
      v203.a.localeCompare(v204.a) ||
      v204.b.localeCompare(v203.b) ||
      String(v203.c.titulo).localeCompare(String(v204.c.titulo)),
  );
  const v205 = [];
  return (
    v200.forEach((v206) => {
      let v207 = 0;
      while (v207 < v205.length && v205[v207] >= v206.a) v207++;
      ((v205[v207] = v206.b), (v206.lane = v207));
    }),
    v200
  );
}
function monthGrid(v208, v209, v210) {
  const v211 = new Date(v209.getFullYear(), v209.getMonth(), 1),
    v212 = (v211.getDay() + 6) % 7,
    v213 = new Date(v209.getFullYear(), v209.getMonth() + 1, 0).getDate(),
    v214 = Math.ceil((v212 + v213) / 7),
    v215 = weekStart(v211),
    v216 = assignLanes(cardsInRange(v208, isoOf(v215), isoOf(addDays(v215, v214 * 7 - 1))));
  let v217 = "";
  for (let v218 = 0; v218 < v214; v218++) v217 += weekRow(addDays(v215, v218 * 7), v216, v209);
  return '<div class="cal-month"><div class="cal-dows">' + v210 + "</div>" + v217 + "</div>";
}
function weekRow(v219, v220, v221) {
  const v222 = 4,
    v223 = isoOf(v219),
    v224 = isoOf(addDays(v219, 6));
  let v225 = "";
  for (let v226 = 0; v226 < 7; v226++) {
    const v227 = addDays(v219, v226),
      v228 = isoOf(v227),
      v229 = v227.getMonth() !== v221.getMonth(),
      v230 = v228 === todayISO();
    v225 +=
      '<div class="cwd ' +
      (v229 ? "out" : "") +
      " " +
      (v230 ? "today" : "") +
      '" data-action="cal:goto" data-iso="' +
      v228 +
      '"><span class="cwd-n">' +
      v227.getDate() +
      "</span></div>";
  }
  const v231 = v220.filter((v232) => v232.a <= v224 && v232.b >= v223),
    v233 = Math.min(
      v222,
      v231.reduce((v234, v235) => Math.max(v234, v235.lane + 1), 0),
    );
  let v236 = "";
  v231
    .filter((v237) => v237.lane < v222)
    .forEach((v238) => {
      const v239 = v238.a < v223 ? 0 : daysBetween(v223, v238.a),
        v240 = v238.b > v224 ? 6 : daysBetween(v223, v238.b),
        v241 = v238.a < v223,
        v242 = v238.b > v224,
        v243 = isOverdue(v238.c);
      v236 +=
        '<button class="cal-bar' +
        (v241 ? " cl" : "") +
        (v242 ? " cr" : "") +
        (v243 ? " overdue" : "") +
        '" draggable="true" data-drag="cal" data-cat="' +
        primaryCat(v238.c) +
        '" data-id="' +
        v238.c.id +
        '" data-action="card:open" title="' +
        esc(v238.c.titulo) +
        ' — arrastrá para reprogramar" style="grid-column:' +
        (v239 + 1) +
        "/" +
        (v240 + 2) +
        ";grid-row:" +
        (v238.lane + 1) +
        '"><span>' +
        esc(v238.c.titulo) +
        "</span></button>";
    });
  const v244 = v231.filter((v245) => v245.lane >= v222);
  let v246 = "";
  if (v244.length)
    for (let v247 = 0; v247 < 7; v247++) {
      const v248 = isoOf(addDays(v219, v247)),
        v249 = v244.filter((v250) => v250.a <= v248 && v250.b >= v248).length;
      if (v249)
        v246 +=
          '<button class="cal-bar-more" data-action="cal:goto" data-iso="' +
          v248 +
          '" style="grid-column:' +
          (v247 + 1) +
          ";grid-row:" +
          (v222 + 1) +
          '">+' +
          v249 +
          "</button>";
    }
  const v251 = Math.max(1, v233) + (v244.length ? 1 : 0);
  return (
    '<div class="cal-wk">\n    <div class="cal-wk-days">' +
    v225 +
    '</div>\n    <div class="cal-wk-bars" style="grid-template-rows:repeat(' +
    v251 +
    ',var(--bar-h))">' +
    v236 +
    v246 +
    "</div>\n  </div>"
  );
}
function miniCal(v252) {
  const v253 = new Date(v252.getFullYear(), v252.getMonth(), 1),
    v254 = weekStart(v253);
  let v255 = "";
  for (let v256 = 0; v256 < 42; v256++) {
    const v257 = addDays(v254, v256),
      v258 = isoOf(v257),
      v259 = v257.getMonth() !== v252.getMonth(),
      v260 = v258 === todayISO();
    v255 +=
      '<button class="mc-day ' +
      (v259 ? "out" : "") +
      " " +
      (v260 ? "today" : "") +
      '" data-action="cal:goto" data-iso="' +
      v258 +
      '">' +
      v257.getDate() +
      "</button>";
  }
  return (
    '<div class="mc-head">\n      <button class="btn btn-icon btn-ghost btn-sm" data-action="cal:prev">‹</button>\n      <div class="mc-title">' +
    MESES[v252.getMonth()] +
    " " +
    v252.getFullYear() +
    '</div>\n      <button class="btn btn-icon btn-ghost btn-sm" data-action="cal:next">›</button>\n    </div>\n    <div class="mc-grid">' +
    ["L", "M", "X", "J", "V", "S", "D"].map((v261) => '<div class="mc-dow">' + v261 + "</div>").join("") +
    v255 +
    "</div>"
  );
}
function weekStart(v262) {
  const v263 = new Date(v262),
    v264 = (v263.getDay() + 6) % 7;
  return addDays(v263, -v264);
}
function dayChip(v265) {
  const v266 = isOverdue(v265);
  return (
    '<div class="cal-chip ' +
    (v266 ? "overdue" : "") +
    '" data-cat="' +
    primaryCat(v265) +
    '" data-id="' +
    v265.id +
    '" data-action="card:open" title="' +
    esc(v265.titulo) +
    '">' +
    esc(v265.titulo) +
    "</div>"
  );
}
function cellHTML(v267, v268, v269) {
  const v270 = v268 === todayISO(),
    v271 = cardsOnDay(v267, v268),
    v272 = state.calMode === "mes" ? 3 : 20,
    v273 =
      v271.slice(0, v272).map(dayChip).join("") +
      (v271.length > v272 ? '<span class="cal-more">+' + (v271.length - v272) + " más</span>" : ""),
    v274 = parseISO(v268);
  return (
    '<div class="cal-cell ' +
    (v269 ? "out" : "") +
    " " +
    (v270 ? "today" : "") +
    '"><div class="cal-day">' +
    v274.getDate() +
    "</div>" +
    v273 +
    "</div>"
  );
}
function monthCells(v275, v276) {
  const v277 = new Date(v276.getFullYear(), v276.getMonth(), 1),
    v278 = weekStart(v277);
  let v279 = "";
  for (let v280 = 0; v280 < 42; v280++) {
    const v281 = addDays(v278, v280);
    v279 += cellHTML(v275, isoOf(v281), v281.getMonth() !== v276.getMonth());
  }
  return v279;
}
function weekCells(v282, v283) {
  const v284 = weekStart(v283);
  let v285 = "";
  for (let v286 = 0; v286 < 7; v286++) {
    const v287 = addDays(v284, v286);
    v285 += cellHTML(v282, isoOf(v287), false);
  }
  return v285;
}
function groupCards(v288) {
  const v289 = (v290, v291) => (v290.inicio || v290.fin).localeCompare(v291.inicio || v291.fin);
  if (!state.tlGroup)
    return [
      {
        label: null,
        cards: v288.slice().sort(v289),
      },
    ];
  const v292 = new Map();
  v288.forEach((v293) => {
    let v294,
      v295,
      v296 = "";
    if (state.tlGroup === "persona") {
      v294 = v293.responsable || "zz";
      const v297 = member(v293.responsable);
      ((v295 = v297 ? v297.nombre : "Sin responsable"), (v296 = "👤"));
    } else
      state.tlGroup === "sector"
        ? ((v294 = primaryCat(v293)), (v295 = sectorName(v294) || "TBD"), (v296 = "🎨"))
        : ((v294 = v293.tipo),
          (v295 = (allTipos()[v293.tipo] || {}).nombre || v293.tipo),
          (v296 = (allTipos()[v293.tipo] || {}).icon || ""));
    if (!v292.has(v294))
      v292.set(v294, {
        label: v295,
        icon: v296,
        cards: [],
      });
    v292.get(v294).cards.push(v293);
  });
  const v298 = [...v292.values()];
  return (
    v298.forEach((v299) => v299.cards.sort(v289)),
    v298.sort((v300, v301) => v300.label.localeCompare(v301.label))
  );
}
function tlWindow() {
  const v302 = new Date(),
    v303 = v302.getFullYear(),
    v304 = v302.getMonth();
  if (state.tlRange === "sem") {
    const v305 = weekStart(v302);
    return [isoOf(v305), isoOf(addDays(v305, 6))];
  }
  if (state.tlRange === "mes") return [isoOf(new Date(v303, v304, 1)), isoOf(new Date(v303, v304 + 1, 0))];
  if (state.tlRange === "tri") {
    const v306 = Math.floor(v304 / 3) * 3;
    return [isoOf(new Date(v303, v306, 1)), isoOf(new Date(v303, v306 + 3, 0))];
  }
  if (state.tlRange === "anio") return [isoOf(new Date(v303, 0, 1)), isoOf(new Date(v303, 11, 31))];
  return null;
}
function renderTimeline() {
  let v307 = filteredBoard().filter((v308) => v308.inicio || v308.fin);
  const v309 = tlWindow();
  if (v309)
    v307 = v307.filter((v310) => {
      const v311 = v310.inicio || v310.fin,
        v312 = v310.fin || v310.inicio;
      return v311 <= v309[1] && v312 >= v309[0];
    });
  const v313 =
    '<div class="tl-toolbar">\n    <div class="filt">🕒<select data-control="tlRange">\n      <option value="todo" ' +
    (state.tlRange === "todo" ? "selected" : "") +
    '>Todo</option>\n      <option value="sem" ' +
    (state.tlRange === "sem" ? "selected" : "") +
    '>Esta semana</option>\n      <option value="mes" ' +
    (state.tlRange === "mes" ? "selected" : "") +
    '>Este mes</option>\n      <option value="tri" ' +
    (state.tlRange === "tri" ? "selected" : "") +
    '>Este trimestre</option>\n      <option value="anio" ' +
    (state.tlRange === "anio" ? "selected" : "") +
    '>Este año</option></select></div>\n    <div class="filt">🔍<select data-control="tlScale">\n      <option value="mes" ' +
    (state.tlScale === "mes" ? "selected" : "") +
    '>Compacto</option>\n      <option value="semana" ' +
    (state.tlScale === "semana" ? "selected" : "") +
    '>Detalle</option></select></div>\n    <div class="filt">▣<select data-control="tlGroup">\n      <option value="" ' +
    (state.tlGroup === "" ? "selected" : "") +
    '>Sin agrupar</option>\n      <option value="persona" ' +
    (state.tlGroup === "persona" ? "selected" : "") +
    '>Por persona</option>\n      <option value="sector" ' +
    (state.tlGroup === "sector" ? "selected" : "") +
    '>Por sector</option>\n      <option value="tipo" ' +
    (state.tlGroup === "tipo" ? "selected" : "") +
    '>Por tipo</option></select></div>\n    <span class="pill">' +
    v307.length +
    " proyecto" +
    (v307.length !== 1 ? "s" : "") +
    "</span></div>";
  if (!v307.length)
    return (
      '<div class="tl-full">' +
      v313 +
      emptyState(
        "▬",
        "Sin proyectos en este período",
        "Cambiá el filtro de tiempo o asigná fechas a las tarjetas.",
      ) +
      "</div>"
    );
  let v314 = null,
    v315 = null;
  const v316 = (v317) => {
    if (!v317) return;
    if (!v314 || v317 < v314) v314 = v317;
    if (!v315 || v317 > v315) v315 = v317;
  };
  v307.forEach((v318) => {
    (v316(v318.inicio),
      v316(v318.fin),
      (v318.fases || []).forEach((v319) => {
        (v316(v319.inicio), v316(v319.fin), (v319.tareas || []).forEach((v320) => v316(v320.fecha)));
      }));
  });
  if (v309) ((v314 = v309[0]), (v315 = v309[1]));
  else v316(todayISO());
  const v321 = isoOf(addDays(parseISO(v314), -3)),
    v322 = isoOf(addDays(parseISO(v315), 4)),
    v323 = daysBetween(v321, v322) + 1,
    v324 = state.tlScale === "semana" ? 26 : 11,
    v325 = "max(100%, " + v323 * v324 + "px)",
    v326 = 100 / v323,
    v327 = (v328) => daysBetween(v321, v328) * v326,
    v329 = (v330, v331) => {
      return (
        (v330 = v330 || v331),
        (v331 = v331 || v330),
        {
          left: v327(v330),
          w: Math.max(v326, (daysBetween(v330, v331) + 1) * v326),
        }
      );
    };
  let v332 = "",
    v333 = parseISO(v321);
  while (isoOf(v333) <= v322) {
    const v334 = isoOf(new Date(v333.getFullYear(), v333.getMonth(), 1));
    ((v332 +=
      '<div class="tl-month" style="left:' +
      v327(v334 < v321 ? v321 : v334) +
      '%">' +
      MESES[v333.getMonth()].slice(0, 3) +
      " " +
      String(v333.getFullYear()).slice(2) +
      "</div>"),
      (v333 = new Date(v333.getFullYear(), v333.getMonth() + 1, 1)));
  }
  let v335 = "";
  for (let v336 = 0; v336 < v323; v336++) {
    const v337 = addDays(parseISO(v321), v336).getDay();
    if (v337 === 0 || v337 === 6)
      v335 += '<div class="tl-weekend" style="left:' + v336 * v326 + "%;width:" + v326 + '%"></div>';
  }
  const v338 = v327(todayISO()),
    v339 = (v340) => 38 + (v340.fases && v340.fases.length ? 16 : 0);
  let v341 = "",
    v342 = "";
  return (
    groupCards(v307).forEach((v343) => {
      (v343.label !== null &&
        ((v341 +=
          '<div class="tl-group-l" style="height:33px">' +
          v343.icon +
          " " +
          esc(v343.label) +
          '<span style="margin-left:auto">' +
          v343.cards.length +
          "</span></div>"),
        (v342 += '<div class="tl-group-r" style="height:33px"></div>')),
        v343.cards.forEach((v344) => {
          const v345 = member(v344.responsable);
          v341 +=
            '<div class="tl-rl" style="height:' +
            v339(v344) +
            'px" data-id="' +
            v344.id +
            '" data-action="card:open">\n        ' +
            (v345
              ? avatarHTML(v345.id, true)
              : '<span class="avatar sm" style="background:var(--line)">·</span>') +
            '\n        <div style="overflow:hidden"><div class="tl-rl-title">' +
            esc(v344.titulo) +
            '</div>\n        <div class="tl-rl-sub">' +
            ((allTipos()[v344.tipo] || {}).nombre || v344.tipo) +
            "</div></div></div>";
          const v346 = v329(v344.inicio, v344.fin),
            v347 = isOverdue(v344),
            v348 = (v344.fases || [])
              .filter((v349) => v349.inicio || v349.fin)
              .map((v350) => {
                const v351 = v329(v350.inicio, v350.fin),
                  v352 = (v350.tareas || [])
                    .filter((v353) => v353.fecha)
                    .map(
                      (v354) =>
                        '<div class="tl-tick" data-cat="' +
                        primaryCat(v344) +
                        '" style="left:' +
                        v327(v354.fecha) +
                        '%;margin-left:-4px" title="' +
                        esc(v354.text) +
                        " · " +
                        fmtShort(v354.fecha) +
                        '"></div>',
                    )
                    .join("");
                return (
                  '<div class="tl-fase" data-cat="' +
                  primaryCat(v344) +
                  '" style="left:' +
                  v351.left +
                  "%;width:" +
                  v351.w +
                  '%;top:30px" title="' +
                  esc(v350.nombre) +
                  '"></div>' +
                  v352
                );
              })
              .join("");
          v342 +=
            '<div class="tl-track" style="height:' +
            v339(v344) +
            'px">\n        <div class="tl-bar ' +
            (v347 ? "overdue" : "") +
            '" draggable="true" data-drag="tl" data-cat="' +
            primaryCat(v344) +
            '" data-id="' +
            v344.id +
            '" data-action="card:open" title="' +
            esc(v344.titulo) +
            ' — arrastrá para reprogramar" style="left:' +
            v346.left +
            "%;width:" +
            v346.w +
            '%;top:6px"><span>' +
            esc(v344.titulo) +
            "</span></div>\n        " +
            v348 +
            "</div>";
        }));
    }),
    '<div class="tl-full">' +
      v313 +
      '<div class="tl-wrap"><div class="tl-grid">\n    <div class="tl-left"><div class="tl-corner">Proyecto</div><div class="tl-rows-left">' +
      v341 +
      '</div></div>\n    <div class="tl-right"><div style="width:' +
      v325 +
      '">\n      <div class="tl-months" style="width:100%">' +
      v332 +
      '</div>\n      <div class="tl-canvas" data-tlstart="' +
      v321 +
      '" data-tldays="' +
      v323 +
      '" style="position:relative;width:100%">' +
      v335 +
      v342 +
      '<div class="tl-today" style="left:' +
      v338 +
      '%"></div></div>\n    </div></div>\n  </div></div></div>'
  );
}
function mapaFilter(v355) {
  const v356 = state.filters;
  return v355.filter((v357) => {
    if (v356.sector && !(v357.sectores || []).includes(v356.sector)) return false;
    if (v356.cursoEstado === "activo" && v357.enActualizacion) return false;
    if (v356.cursoEstado === "actualizando" && !v357.enActualizacion) return false;
    if (v356.texto && !v357.titulo.toLowerCase().includes(v356.texto.toLowerCase())) return false;
    return true;
  });
}
function invCount(v358) {
  return state.cards.filter((v359) => v359.tipo === v358 && inInventory(v359)).length;
}
function invCard(v360) {
  return v360.tipo === "curso"
    ? cursoCard(v360)
    : v360.tipo === "edu-point"
      ? eduCard(v360)
      : recursoCard(v360);
}
function renderMapa() {
  const v361 = state.cards.filter(inInventory).length,
    v362 = [
      {
        id: "todos",
        label: "✦ Todos",
        n: v361,
      },
      {
        id: "cursos",
        label: "◎ Cursos e-learning",
        n: invCount("curso"),
      },
      {
        id: "edu-points",
        label: "📍 QR / Edu Point",
        n: invCount("edu-point"),
      },
      {
        id: "edu-archivos",
        label: "📂 Archivos Edu Point",
        n: EDU_DB.length,
      },
      {
        id: "apps",
        label: "🖥️ Aplicativos web",
        n: invCount("app-web"),
      },
      {
        id: "bases",
        label: "🗄️ Bases del sistema",
        n: invCount("base-sistema"),
      },
    ],
    v363 =
      '<div class="mapa-secciones">' +
      v362
        .map(
          (v364) =>
            '<div class="mapa-sec ' +
            (state.mapaSec === v364.id ? "active" : "") +
            '" data-action="mapa:sec" data-sec="' +
            v364.id +
            '">' +
            v364.label +
            " <b>(" +
            v364.n +
            ")</b></div>",
        )
        .join("") +
      "</div>";
  let v365 = "";
  if (state.mapaSec === "todos") v365 = sectionTodos();
  else {
    if (state.mapaSec === "cursos") v365 = sectionCursos();
    else {
      if (state.mapaSec === "edu-points") v365 = sectionEduPoints();
      else {
        if (state.mapaSec === "edu-archivos") v365 = renderEduArchivos();
        else {
          if (state.mapaSec === "apps")
            v365 = sectionInv(
              "app-web",
              "🖥️",
              "Sin aplicativos activos",
              "Publicá un aplicativo web del tablero (botón en su ficha) para verlo acá.",
            );
          else {
            if (state.mapaSec === "bases")
              v365 = sectionInv(
                "base-sistema",
                "🗄️",
                "Sin bases activas",
                "Publicá una base del sistema del tablero para verla acá.",
              );
          }
        }
      }
    }
  }
  return v363 + v365;
}
function sectionTodos() {
  const v366 = mapaFilter(state.cards.filter(inInventory));
  if (!v366.length)
    return emptyState(
      "✦",
      "Sin elementos activos",
      "Publicá cursos, Edu Points, apps o bases para verlos todos juntos acá.",
    );
  const v367 = state.filters.sector
    ? " de <b>" + esc(sectorName(state.filters.sector) || state.filters.sector) + "</b>"
    : "";
  return (
    '<div style="font-size:12.5px;color:var(--ink-soft);margin:-6px 0 12px">' +
    v366.length +
    " elemento" +
    (v366.length !== 1 ? "s" : "") +
    " activo" +
    (v366.length !== 1 ? "s" : "") +
    v367 +
    ' — todo el inventario junto, filtrable por sector.</div><div class="cursos-grid">' +
    v366.map(invCard).join("") +
    "</div>"
  );
}
function eduRowsFor() {
  let v368 = EDU_DB.filter((v369) => v369.sec === state.eduSector);
  if (state.eduEst) v368 = v368.filter((v370) => v370.est === state.eduEst);
  if (state.eduQ) {
    const v371 = state.eduQ.toLowerCase();
    v368 = v368.filter(
      (v372) =>
        v372.nom.toLowerCase().includes(v371) ||
        (v372.nota || "").toLowerCase().includes(v371) ||
        (v372.sub || "").toLowerCase().includes(v371) ||
        (v372.secNom || "").toLowerCase().includes(v371),
    );
  }
  return v368;
}
function eduFileRow(v373) {
  const v374 = EST_META[v373.est] || EST_META.pendiente,
    v375 = EDU_TIPO_IC[v373.tipo] || "📎";
  return (
    '<div class="edu-file ' +
    (v373.est === "eliminado" ? "elim" : "") +
    '"><span class="edu-ic">' +
    v375 +
    '</span>\n    <span class="edu-f-nom">' +
    esc(v373.nom) +
    (v373.tipo ? ' <span class="edu-f-tipo">' + v373.tipo + "</span>" : "") +
    '</span>\n    <span class="edu-est" style="--c:' +
    v374.c +
    '">' +
    v374.l +
    "</span>\n    " +
    (v373.nota
      ? '<span class="edu-f-nota" title="' + esc(v373.nota) + '">' + esc(v373.nota) + "</span>"
      : "") +
    "</div>"
  );
}
function eduListHTML() {
  const v376 = eduRowsFor();
  if (!v376.length)
    return (
      '<div class="edu-none">' +
      (state.eduEst || state.eduQ
        ? "Sin archivos con ese filtro."
        : "Todavía no cargamos archivos de este sector.") +
      "</div>"
    );
  const v377 = {};
  v376.forEach((v378) => {
    (v377[v378.secNom] = v377[v378.secNom] || []).push(v378);
  });
  const v379 = Object.keys(v377).length > 1;
  return Object.keys(v377)
    .map((v380) => {
      const v381 = {};
      v377[v380].forEach((v382) => {
        (v381[v382.sub] = v381[v382.sub] || []).push(v382);
      });
      const v383 = Object.keys(v381)
        .map(
          (v384) =>
            (v384 ? '<div class="edu-sub">' + esc(v384) + "</div>" : "") +
            '<div class="edu-files">' +
            v381[v384].map(eduFileRow).join("") +
            "</div>",
        )
        .join("");
      return "" + (v379 ? '<div class="edu-secgroup">' + esc(v380) + "</div>" : "") + v383;
    })
    .join("");
}
function renderEduList() {
  const v385 = $("#eduList");
  if (v385) v385.innerHTML = eduListHTML();
}
function eduKpi(v386, v387, v388) {
  return (
    '<div class="edu-kpi"><div class="edu-kpi-n" style="color:' +
    v388 +
    '">' +
    v386 +
    '</div><div class="edu-kpi-l">' +
    v387 +
    "</div></div>"
  );
}
function renderEduArchivos() {
  if (!state.eduSector) {
    const v389 = {};
    EDU_DB.forEach((v390) => {
      (v389[v390.sec] = v389[v390.sec] || []).push(v390);
    });
    const v391 = EDU_DB.length,
      v392 = EDU_DB.filter((v393) => v393.est === "listo").length,
      v394 = Object.keys(v389).filter((v395) => SECTORES[v395]).length,
      v396 = Object.keys(SECTORES)
        .slice()
        .sort(
          (v397, v398) =>
            (v389[v398] || []).length - (v389[v397] || []).length ||
            SECTORES[v397].nombre.localeCompare(SECTORES[v398].nombre),
        ),
      v399 = v396
        .map((v400) => {
          const v401 = v389[v400] || [],
            v402 = v401.length,
            v403 = v401.filter((v404) => v404.est === "listo").length,
            v405 = v402 ? Math.round((v403 / v402) * 100) : 0;
          return (
            '<button class="edu-sec ' +
            (v402 ? "" : "empty") +
            '" data-cat="' +
            v400 +
            '" data-action="edu:sec" data-sec="' +
            v400 +
            '">\n        <div class="edu-sec-top"><span class="edu-sec-nom">' +
            esc(SECTORES[v400].nombre) +
            "</span>" +
            (v402 ? '<span class="edu-sec-pct">' + v405 + "%</span>" : "") +
            '</div>\n        <div class="edu-bar"><div class="edu-bar-fill" style="width:' +
            v405 +
            '%"></div></div>\n        <div class="edu-sec-foot">' +
            (v402
              ? "<b>" + v402 + "</b> archivos · " + v403 + " listos · " + (v402 - v403) + " por hacer"
              : "Sin material aún") +
            "</div></button>"
          );
        })
        .join("");
    return (
      '<div class="edu-overview-head">\n        <div class="edu-kpis">' +
      eduKpi(v391, "archivos", "var(--coto-blue)") +
      eduKpi(v392, "listos", "#2E9E8F") +
      eduKpi(v391 - v392, "por hacer", "#E2A03F") +
      eduKpi(v394 + "/" + Object.keys(SECTORES).length, "sectores", "#5A1ED2") +
      '</div>\n        <div style="font-size:12.5px;color:var(--ink-soft);margin-top:8px">Base de archivos de Edu Point por sector — en qué instancia está cada uno. Tocá un sector para ver sus archivos y qué falta terminar, corregir o mejorar.</div>\n      </div>\n      <div class="edu-sec-grid">' +
      v399 +
      "</div>"
    );
  }
  const v406 = state.eduSector,
    v407 = SECTORES[v406] ? SECTORES[v406].nombre : v406,
    v408 = EDU_DB.filter((v409) => v409.sec === v406),
    v410 = ["", "listo", "revisar", "rehacer", "pendiente", "nuevo", "eliminado"]
      .filter((v411) => !v411 || v408.some((v412) => v412.est === v411))
      .map(
        (v413) =>
          '<button class="edu-fchip ' +
          (state.eduEst === v413 ? "on" : "") +
          '" data-action="edu:est" data-est="' +
          v413 +
          '" style="' +
          (v413 ? "--c:" + EST_META[v413].c : "") +
          '">' +
          (v413 ? EST_META[v413].l : "Todos") +
          (v413 ? " <b>" + v408.filter((v414) => v414.est === v413).length + "</b>" : "") +
          "</button>",
      )
      .join("");
  return (
    '<nav class="crumbs"><button class="crumb" data-action="mapa:sec" data-sec="todos">Mapa</button><span>›</span><button class="crumb" data-action="edu:back">Archivos Edu Point</button><span>›</span><span class="crumb cur" data-cat="' +
    v406 +
    '">' +
    esc(v407) +
    '</span></nav>\n    <div class="edu-detail-head" data-cat="' +
    v406 +
    '">\n      <span class="badge badge-cat" data-cat="' +
    v406 +
    '">' +
    esc(v407) +
    '</span>\n      <span class="pill">' +
    v408.length +
    " archivo" +
    (v408.length !== 1 ? "s" : "") +
    "</span>\n      " +
    (v408.length
      ? '<input class="edu-search" id="eduSearch" placeholder="Buscar archivo…" value="' +
        esc(state.eduQ) +
        '" autocomplete="off">'
      : "") +
    "\n    </div>\n    " +
    (v408.length ? '<div class="edu-fchips">' + v410 + "</div>" : "") +
    '\n    <div id="eduList">' +
    eduListHTML() +
    "</div>"
  );
}
function sectionInv(v415, v416, v417, v418) {
  const v419 = mapaFilter(state.cards.filter((v420) => v420.tipo === v415 && inInventory(v420)));
  if (!v419.length) return emptyState(v416, v417, v418);
  return '<div class="cursos-grid">' + v419.map(recursoCard).join("") + "</div>";
}
function recursoCard(v421) {
  const v422 = primaryCat(v421),
    v423 = v421.catalogo || {},
    v424 = v421.ficha || {},
    v425 = member(v421.responsable),
    v426 =
      {
        operativo: "● Operativo",
        mantenimiento: "◐ Mantenimiento",
        baja: "○ Baja",
      }[v424.estadoOp] || "● Operativo";
  return (
    '<article class="curso" data-cat="' +
    v422 +
    '" data-id="' +
    v421.id +
    '" data-action="card:open">\n    <div class="curso-img" style="height:78px"><span class="curso-estado ' +
    (v424.estadoOp === "mantenimiento" ? "upd" : "") +
    '">' +
    ((TIPOS[v421.tipo] || {}).icon || "") +
    " " +
    v426 +
    '</span></div>\n    <div class="curso-body">\n      <h4>' +
    esc(v421.titulo) +
    '</h4>\n      <div class="badges">' +
    sectoresBadges(v421.sectores) +
    '</div>\n      <div class="curso-bajada">' +
    esc(v423.bajada || "") +
    '</div>\n      <div class="curso-foot"><span>👤 ' +
    (v425 ? esc(v425.nombre) : v424.owner ? esc(v424.owner) : "—") +
    "</span>" +
    (v424.url
      ? '<a class="moodle" href="' +
        esc(v424.url) +
        '" target="_blank" rel="noopener" onclick="event.stopPropagation()">Abrir ↗</a>'
      : "") +
    "</div>\n    </div>\n  </article>"
  );
}
function sectionCursos() {
  const v427 = mapaFilter(state.cards.filter((v428) => v428.tipo === "curso" && inInventory(v428)));
  if (!v427.length)
    return emptyState(
      "◎",
      "Sin cursos activos",
      "Publicá un curso del tablero o ingestá el catálogo con “⤓ Catálogo”.",
    );
  return '<div class="cursos-grid">' + v427.map(cursoCard).join("") + "</div>";
}
function cursoCard(v429) {
  const v430 = primaryCat(v429),
    v431 = v429.catalogo || {};
  return (
    '<article class="curso" data-cat="' +
    v430 +
    '" data-id="' +
    v429.id +
    '" data-action="card:open">\n    <div class="curso-img">' +
    (v431.imagen ? '<img src="' + esc(v431.imagen) + '" alt="" onerror="this.remove()">' : "") +
    '\n      <span class="curso-estado ' +
    (v429.enActualizacion ? "upd" : "") +
    '">' +
    (v429.enActualizacion ? "🔄 En actualización" : "● Activo") +
    '</span></div>\n    <div class="curso-body">\n      <h4>' +
    esc(v429.titulo) +
    '</h4>\n      <div class="badges">' +
    sectoresBadges(v429.sectores) +
    '</div>\n      <div class="curso-bajada">' +
    esc(v431.bajada || v431.descripcion || "") +
    '</div>\n      <div class="curso-foot">\n        ' +
    (v431.anio ? "<span>📅 " + esc(v431.anio) + "</span>" : "") +
    (v431.duracion ? "<span>⏱ " + esc(v431.duracion) + "</span>" : "") +
    (v431.personas ? "<span>👥 " + esc(v431.personas) + "</span>" : "") +
    "\n        " +
    (v429.linkMoodle
      ? '<a class="moodle" href="' +
        esc(v429.linkMoodle) +
        '" target="_blank" rel="noopener" onclick="event.stopPropagation()">Moodle ↗</a>'
      : '<span class="moodle" style="color:var(--ink-soft)">sin link</span>') +
    "\n      </div>\n    </div>\n  </article>"
  );
}
function sectionEduPoints() {
  const v432 = mapaFilter(state.cards.filter((v433) => v433.tipo === "edu-point" && inInventory(v433)));
  if (!v432.length)
    return emptyState(
      "📍",
      "Sin Edu Points colocados",
      "Marcá un Edu Point del tablero como colocado (botón en su ficha) para verlo en el inventario.",
    );
  return '<div class="cursos-grid">' + v432.map(eduCard).join("") + "</div>";
}
function eduCard(v434) {
  const v435 = primaryCat(v434),
    v436 = v434.catalogo || {},
    v437 = member(v434.responsable);
  return (
    '<article class="curso" data-cat="' +
    v435 +
    '" data-id="' +
    v434.id +
    '" data-action="card:open">\n    <div class="curso-img" style="height:92px"><span class="curso-estado ' +
    (v434.enActualizacion ? "upd" : "") +
    '">' +
    (v434.enActualizacion ? "🔄 Actualizando" : "📍 Colocado") +
    '</span>\n      <div style="position:absolute;top:8px;right:8px;width:34px;height:34px;border-radius:9px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:var(--shadow)">▦</div></div>\n    <div class="curso-body">\n      <h4>' +
    esc(v434.titulo) +
    '</h4>\n      <div class="badges">' +
    sectoresBadges(v434.sectores) +
    '</div>\n      <div class="curso-bajada">' +
    esc(v436.bajada || "Pieza Edu Point con QR colocada en sala.") +
    '</div>\n      <div class="curso-foot"><span>👤 ' +
    (v437 ? esc(v437.nombre) : "—") +
    "</span>" +
    (v434.linkMoodle
      ? '<a class="moodle" href="' +
        esc(v434.linkMoodle) +
        '" target="_blank" rel="noopener" onclick="event.stopPropagation()">Enlace ↗</a>'
      : "") +
    "</div>\n    </div>\n  </article>"
  );
}
function renderInicio() {
  const v438 = boardCards(),
    v439 = v438.filter(isOverdue).length,
    v440 = computeAlerts().length,
    v441 = [
      {
        go: "kanban",
        cat: "control-de-calidad",
        ic: "▦",
        t: "Planner",
        d: "Lo que estamos haciendo, por estado.",
      },
      {
        go: "calendario",
        cat: "coto-digital",
        ic: "▣",
        t: "Calendario",
        d: "Qué pasa y cuándo, mes a mes.",
      },
      {
        go: "timeline",
        cat: "mantenimiento",
        ic: "▬",
        t: "Timeline",
        d: "El panorama macro del área.",
      },
      {
        go: "agenda",
        cat: "recursos-humanos",
        ic: "⛱",
        t: "Agenda del equipo",
        d: "Home y vacaciones, todo el año.",
      },
      {
        go: "mapa",
        cat: "servicio-medico",
        ic: "◎",
        t: "Mapa del área",
        d: "Cursos, Edu Points, apps y bases.",
      },
      {
        go: "resumen",
        cat: "flota-propia",
        ic: "◆",
        t: "Resumen",
        d: "Indicadores y carga del equipo.",
      },
    ],
    v442 = (v443, v444) =>
      '<button class="hub-card" data-cat="' +
      v443.cat +
      '" data-action="hub:go" data-go="' +
      v443.go +
      '" style="animation-delay:' +
      v444 * 55 +
      'ms">\n    <span class="hub-ic">' +
      v443.ic +
      '</span>\n    <span class="hub-tx"><span class="hub-t">' +
      v443.t +
      '</span><span class="hub-d">' +
      esc(v443.d) +
      '</span></span>\n    <span class="hub-arrow">→</span></button>',
    v445 =
      '<button class="hub-card hub-cta" data-cat="salon" data-action="nuevo:open" style="animation-delay:' +
      v441.length * 55 +
      'ms">\n    <span class="hub-ic">＋</span><span class="hub-tx"><span class="hub-t">Nueva tarjeta</span><span class="hub-d">Sumá trabajo al tablero.</span></span>\n    <span class="hub-arrow">→</span></button>';
  return (
    '<div class="hub">\n    <div class="hub-hero">\n      ' +
    logoLockup() +
    '\n      <h1 class="hub-title" style="margin-top:18px">Hola, ' +
    esc(state.user || "equipo") +
    '</h1>\n      <p class="hub-sub">¿Qué querés ver hoy?' +
    (v439 ? ' · <b style="color:var(--bad)">' + v439 + " vencida" + (v439 !== 1 ? "s" : "") + "</b>" : "") +
    (v440 ? " · <b>" + v440 + "</b> alerta" + (v440 !== 1 ? "s" : "") : "") +
    '</p>\n    </div>\n    <div class="hub-grid">' +
    v441.map(v442).join("") +
    v445 +
    "</div>\n  </div>"
  );
}
function agendaWindow() {
  const v446 = new Date(state.agendaRefY, state.agendaRefM, 1),
    v447 = isoOf(new Date(v446.getFullYear(), v446.getMonth() - 1, 1)),
    v448 = isoOf(new Date(v446.getFullYear(), v446.getMonth() + 2, 0));
  return [v447, v448];
}
function agendaTotals(v449, v450, v451) {
  const v452 = state.agenda[v449] || {};
  let v453 = 0,
    v454 = 0;
  for (const v455 in v452) {
    if (v455 >= v450 && v455 <= v451) {
      if (v452[v455] === "home") v453++;
      else {
        if (v452[v455] === "vac") v454++;
      }
    }
  }
  return {
    h: v453,
    v: v454,
  };
}
function agendaChips(v456) {
  v456 = v456 || agendaWindow();
  const v457 = state.agendaMode === "equipo",
    v458 = state.agendaWho;
  return TEAM.map((v459) => {
    const { h: v460, v: v461 } = agendaTotals(v459.id, v456[0], v456[1]),
      v462 = v457 && v458 === v459.id,
      v463 = v457 && v458 && !v462;
    return (
      '<button class="aperson' +
      (v462 ? " on" : "") +
      (v463 ? " dim" : "") +
      '" data-action="agenda:who" data-who="' +
      v459.id +
      '" style="--pc:' +
      v459.color +
      '" title="' +
      esc(v459.nombre) +
      " — " +
      (v457 ? "tocá para ver sólo a esta persona" : "Home " + v460 + " · Vacaciones " + v461) +
      '">' +
      avatarHTML(v459.id, true) +
      '<span class="ap-n">' +
      esc(v459.nombre) +
      '</span><span class="ap-c">🏠 ' +
      v460 +
      '</span><span class="ap-c">🌴 ' +
      v461 +
      "</span></button>"
    );
  }).join("");
}
function agendaMonth(v464, v465, v466, v467) {
  const v468 = (new Date(v464, v465, 1).getDay() + 6) % 7,
    v469 = new Date(v464, v465 + 1, 0).getDate();
  let v470 = "";
  for (let v471 = 0; v471 < v468; v471++) v470 += '<span class="aday out"></span>';
  for (let v472 = 1; v472 <= v469; v472++) {
    const v473 = v464 + "-" + pad(v465 + 1) + "-" + pad(v472),
      v474 = v473 === v467;
    if (v466 === "mi") {
      const v475 = (state.agenda[state.agendaEdit] || {})[v473];
      v470 +=
        '<button class="aday' +
        (v475 ? " " + v475 : "") +
        (v474 ? " today" : "") +
        '" data-action="agenda:day" data-iso="' +
        v473 +
        '">' +
        v472 +
        "</button>";
    } else {
      const v476 = state.agendaWho,
        v477 = TEAM.filter((v478) => !v476 || v478.id === v476)
          .map((v479) => {
            const v480 = (state.agenda[v479.id] || {})[v473];
            return v480
              ? {
                  c: v479.color,
                  mk: v480,
                  n: v479.nombre,
                }
              : null;
          })
          .filter(Boolean);
      if (!v477.length)
        v470 +=
          '<span class="aday eq' + (v474 ? " today" : "") + '"><span class="anum">' + v472 + "</span></span>";
      else {
        if (v477.length === 1) {
          const v481 = v477[0];
          v470 +=
            '<span class="aday eq ' +
            v481.mk +
            " on" +
            (v474 ? " today" : "") +
            '" style="--u-color:' +
            v481.c +
            '" title="' +
            esc(v481.n) +
            ": " +
            (v481.mk === "vac" ? "Vacaciones" : "Home") +
            '"><span class="anum">' +
            v472 +
            "</span></span>";
        } else {
          const v482 = v477
            .slice(0, 6)
            .map(
              (v483) =>
                '<i class="aseg ' +
                v483.mk +
                '" style="--sc:' +
                v483.c +
                '" title="' +
                esc(v483.n) +
                ": " +
                (v483.mk === "vac" ? "Vacaciones" : "Home") +
                '"></i>',
            )
            .join("");
          v470 +=
            '<span class="aday eq multi' +
            (v474 ? " today" : "") +
            '"><span class="anum">' +
            v472 +
            '</span><span class="asegs">' +
            v482 +
            "</span></span>";
        }
      }
    }
  }
  return (
    '<section class="amonth"><header class="amonth-h">' +
    MESES[v465] +
    ' <span class="amonth-y">' +
    v464 +
    '</span></header><div class="adow">' +
    DOW.map((v484) => "<span>" + v484[0] + "</span>").join("") +
    '</div><div class="adays">' +
    v470 +
    "</div></section>"
  );
}
function renderAgenda() {
  const v485 = state.agendaMode,
    v486 = todayISO();
  if (!member(state.agendaEdit))
    state.agendaEdit = (member(state.userId) ? state.userId : TEAM[0] && TEAM[0].id) || "";
  const v487 = member(state.agendaEdit) ||
      TEAM[0] || {
        color: "#006EA0",
        nombre: "",
      },
    v488 = new Date(state.agendaRefY, state.agendaRefM, 1),
    v489 = [-1, 0, 1].map((v490) => new Date(v488.getFullYear(), v488.getMonth() + v490, 1)),
    v491 = agendaWindow(),
    v492 = MESES[v488.getMonth()] + " " + v488.getFullYear(),
    v493 =
      '<div class="ag-year"><button class="btn btn-icon btn-ghost" data-action="agenda:month" data-dir="-1" title="Mes anterior">‹</button><b>' +
      v492 +
      '</b><button class="btn btn-icon btn-ghost" data-action="agenda:month" data-dir="1" title="Mes siguiente">›</button><button class="btn btn-sm btn-ghost" data-action="agenda:hoy" title="Volver al mes actual" style="margin-left:2px">Hoy</button></div>',
    v494 =
      '<div class="ag-modes"><button class="ag-mode' +
      (v485 === "mi" ? " on" : "") +
      '" data-action="agenda:mode" data-mode="mi">🙂 Mi agenda</button><button class="ag-mode' +
      (v485 === "equipo" ? " on" : "") +
      '" data-action="agenda:mode" data-mode="equipo">👥 Equipo</button></div>';
  let v495 = "";
  if (v485 === "mi") {
    const v496 = state.agendaTool,
      v497 = TEAM.map(
        (v498) =>
          '<button class="ew' +
          (v498.id === state.agendaEdit ? " on" : "") +
          '" data-action="agenda:edit" data-who="' +
          v498.id +
          '" style="--pc:' +
          v498.color +
          '" title="' +
          esc(v498.nombre) +
          '">' +
          avatarHTML(v498.id, true) +
          "</button>",
      ).join("");
    v495 =
      '<div class="ag-tools">\n      <span class="ag-editwho">✎ Editás:' +
      v497 +
      '</span>\n      <div class="ag-paint">\n        <button class="ag-pt home' +
      (v496 === "home" ? " on" : "") +
      '" data-action="agenda:tool" data-tool="home" title="Enmarcar días de Home (oficina en casa)">🏠 Home</button>\n        <button class="ag-pt vac' +
      (v496 === "vac" ? " on" : "") +
      '" data-action="agenda:tool" data-tool="vac" title="Pintar días de Vacaciones">🌴 Vacaciones</button>\n        <button class="ag-pt clear' +
      (v496 === "clear" ? " on" : "") +
      '" data-action="agenda:tool" data-tool="clear" title="Borrar marcas">🧽 Borrar</button>\n      </div></div>';
  } else
    v495 =
      '<div class="ag-legend"><span class="lg"><i class="lgbox vac"></i> Vacaciones (día pintado)</span><span class="lg"><i class="lgbox home"></i> Home (día enmarcado)</span><span class="ag-hint">Tocá una persona abajo para verla sola.</span></div>';
  const v499 =
    '<div class="agenda-grid m3">' +
    v489.map((v500) => agendaMonth(v500.getFullYear(), v500.getMonth(), v485, v486)).join("") +
    "</div>";
  return (
    '<div class="agenda" style="--u-color:' +
    v487.color +
    '">\n    <div class="view-head"><h2>Agenda del equipo</h2><p>Home y vacaciones — mes anterior, actual y siguiente, cada uno con su color. ' +
    (v485 === "mi"
      ? "Elegí la herramienta y tocá los días."
      : "Vista del equipo: quién está fuera y cuándo.") +
    '</p></div>\n    <div class="agenda-bar">' +
    v493 +
    v494 +
    v495 +
    '</div>\n    <div class="agenda-people" id="agendaPeople">' +
    agendaChips(v491) +
    "</div>\n    " +
    v499 +
    "\n  </div>"
  );
}
function renderResumen() {
  const v501 = boardCards(),
    v502 = state.cards.filter((v503) => v503.tipo === "curso" && inInventory(v503)).length,
    v504 = state.cards.filter((v505) => v505.tipo === "edu-point" && inInventory(v505)).length,
    v506 = v501.filter((v507) => v507.estado === "en-revision").length,
    v508 = v501.filter(isOverdue).length,
    v509 = (v510, v511, v512, v513, v514, v515) =>
      '<div class="kpi" style="--kpi:' +
      v513 +
      '" ' +
      (v514 ? 'data-action="kpi:go" data-go="' + v514 + '" ' + (v515 ? 'data-sec="' + v515 + '"' : "") : "") +
      '>\n    <div class="kpi-num">' +
      v510 +
      '</div><div class="kpi-lbl">' +
      v511 +
      "</div>" +
      (v512 ? '<div class="kpi-sub">' + v512 + "</div>" : "") +
      "</div>",
    v516 = v501.length || 1,
    v517 = ESTADOS.map((v518) => {
      const v519 = v501.filter((v520) => v520.estado === v518.id).length;
      return (
        '<div class="bar-line"><span class="bl-lbl">' +
        v518.nombre +
        '</span><div class="bl-track"><div class="bl-fill" style="width:' +
        Math.round((v519 / v516) * 100) +
        "%;background:" +
        v518.dot +
        '"></div></div><span class="bl-num">' +
        v519 +
        "</span></div>"
      );
    }).join(""),
    v521 = todayISO(),
    v522 = isoOf(addDays(new Date(), 45)),
    v523 = v501
      .filter((v524) => {
        const v525 = v524.fin || v524.inicio;
        return v525 && v525 <= v522;
      })
      .sort((v526, v527) => (v526.fin || v526.inicio).localeCompare(v527.fin || v527.inicio))
      .slice(0, 8),
    v528 = v523.length
      ? v523
          .map((v529) => {
            const v530 = v529.fin || v529.inicio,
              v531 = v530 < v521,
              v532 = daysBetween(v521, v530),
              v533 = v531 ? "−" + Math.abs(v532) + "d" : v532 === 0 ? "hoy" : v532 + "d";
            return (
              '<div class="venc" data-id="' +
              v529.id +
              '" data-action="card:open"><span class="venc-d ' +
              (v531 ? "over" : "") +
              '">' +
              v533 +
              '</span><span class="venc-t">' +
              esc(v529.titulo) +
              "</span>" +
              stackHTML(v529) +
              "</div>"
            );
          })
          .join("")
      : '<div style="color:var(--ink-soft);font-size:13px;padding:6px 0">Nada en los próximos 45 días 🎉</div>',
    v534 = {};
  (TEAM.forEach((v535) => (v534[v535.id] = 0)),
    v501.forEach((v536) => {
      [v536.responsable, ...(v536.asignados || [])]
        .filter((v537, v538, v539) => v537 && v539.indexOf(v537) === v538)
        .forEach((v540) => {
          if (v534[v540] != null) v534[v540]++;
        });
    }));
  const v541 = Math.max(1, ...Object.values(v534)),
    v542 = TEAM.map(
      (v543) =>
        '<div class="bar-line"><span class="bl-lbl">' +
        avatarHTML(v543.id, true) +
        " " +
        v543.nombre +
        '</span><div class="bl-track"><div class="bl-fill" style="width:' +
        Math.round((v534[v543.id] / v541) * 100) +
        "%;background:" +
        v543.color +
        '"></div></div><span class="bl-num">' +
        v534[v543.id] +
        "</span></div>",
    ).join(""),
    v544 = {};
  v501.forEach((v545) => (v544[v545.tipo] = (v544[v545.tipo] || 0) + 1));
  const v546 = Object.keys(v544)
    .sort((v547, v548) => v544[v548] - v544[v547])
    .map(
      (v549) =>
        '<span class="chipcount">' +
        ((allTipos()[v549] || {}).icon || "•") +
        " " +
        ((allTipos()[v549] || {}).nombre || v549) +
        " · " +
        v544[v549] +
        "</span>",
    )
    .join("");
  return (
    '<div style="margin-bottom:6px"><h2 style="font-size:21px">Resumen del área</h2>\n    <div style="color:var(--ink-soft);font-size:13px;margin:2px 0 14px">Hola ' +
    esc(state.user || "") +
    ' 👋 — panorama de “lo que hacemos” y “lo que tenemos”.</div></div>\n    <div class="res-grid">\n      ' +
    v509(v501.length, "Proyectos en el tablero", "en movimiento", "#006EA0", "kanban") +
    "\n      " +
    v509(v506, "En revisión", "por publicar", "#E2A03F", "kanban") +
    "\n      " +
    v509(v508, "Vencidas", "requieren atención", v508 ? "#D8553F" : "#2E9E8F", "kanban") +
    "\n      " +
    v509(v502, "Cursos activos", "en el mapa", "#2E9E8F", "mapa", "cursos") +
    "\n      " +
    v509(v504, "Edu Points", "colocados", "#546E7A", "mapa", "edu-points") +
    '\n    </div>\n    <div class="res-cols">\n      <div>\n        <div class="res-card"><h3>⚑ Próximos vencimientos <span class="mini">' +
    v523.length +
    "</span></h3>" +
    v528 +
    '</div>\n        <div class="res-card"><h3>🧩 Mezcla por tipo</h3><div>' +
    (v546 || '<span style="color:var(--ink-soft)">—</span>') +
    '</div></div>\n      </div>\n      <div>\n        <div class="res-card"><h3>◷ Por estado <span class="mini">' +
    v501.length +
    " total</span></h3>" +
    v517 +
    '</div>\n        <div class="res-card"><h3>👥 Carga del equipo <span class="mini">tablero</span></h3>' +
    v542 +
    "</div>\n      </div>\n    </div>"
  );
}
function emptyState(v550, v551, v552) {
  return (
    '<div class="empty"><div class="big">' +
    v550 +
    '</div><div style="font-weight:700;font-size:16px;color:var(--ink)">' +
    esc(v551) +
    '</div><div style="margin-top:4px">' +
    esc(v552) +
    "</div></div>"
  );
}
function openDetail(v553) {
  (closeModal(),
    (state.selectedId = v553),
    pushRecent(v553),
    renderPanel(),
    $("#panel").classList.add("open"),
    $("#overlay").classList.remove("hidden"));
}
function closePanel() {
  ($("#panel").classList.remove("open"),
    $("#overlay").classList.add("hidden"),
    (state.selectedId = null),
    render());
}
function sectorPicker(v554) {
  const v555 = v554.sectores || [],
    v556 = v555.length
      ? v555
          .map((v557) => {
            const v558 = SECTORES[v557];
            return (
              '<span class="sec-chip" data-cat="' +
              v557 +
              '">' +
              (v558 ? esc(v558.nombre) : esc(v557)) +
              '<span class="sec-x" data-action="sector:toggle" data-sector="' +
              v557 +
              '" title="Quitar">×</span></span>'
            );
          })
          .join("")
      : '<span style="font-size:12px;color:var(--ink-soft)">Sin sector (TBD)</span>';
  return (
    '<div class="fld"><label>Sectores</label>\n    <div class="sec-selected">' +
    v556 +
    '</div>\n    <div class="sec-search"><input id="sectorSearch" placeholder="Buscar y agregar sector…" autocomplete="off"><div id="sectorResults" class="sec-results"></div></div>\n  </div>'
  );
}
function renderSectorResults(v559) {
  const v560 = $("#sectorResults");
  if (!v560) return;
  v559 = (v559 || "").trim().toLowerCase();
  const v561 = current(),
    v562 = new Set((v561 && v561.sectores) || []),
    v563 = Object.keys(SECTORES)
      .filter(
        (v564) =>
          !v562.has(v564) &&
          (!v559 || SECTORES[v564].nombre.toLowerCase().includes(v559) || v564.includes(v559)),
      )
      .slice(0, 8);
  v560.innerHTML = v563.length
    ? v563
        .map(
          (v565) =>
            '<button class="sec-opt" data-cat="' +
            v565 +
            '" data-action="sector:add" data-sector="' +
            v565 +
            '"><span class="sec-dot"></span>' +
            esc(SECTORES[v565].nombre) +
            "</button>",
        )
        .join("")
    : v559
      ? '<div class="sec-none">Sin coincidencias</div>'
      : "";
}
function renderPanel() {
  const v566 = current();
  if (!v566) {
    $("#panel").innerHTML = "";
    return;
  }
  const v567 = progress(v566),
    v568 = isOverdue(v566),
    v569 = Object.keys(allTipos())
      .map(
        (v570) =>
          '<option value="' +
          v570 +
          '" ' +
          (v566.tipo === v570 ? "selected" : "") +
          ">" +
          allTipos()[v570].icon +
          " " +
          esc(allTipos()[v570].nombre) +
          "</option>",
      )
      .join(""),
    v571 = ESTADOS.map(
      (v572) =>
        '<option value="' +
        v572.id +
        '" ' +
        (v566.estado === v572.id ? "selected" : "") +
        ">" +
        v572.nombre +
        "</option>",
    ).join(""),
    v573 = TEAM.map(
      (v574) =>
        '<span class="chip-toggle ' +
        ((v566.asignados || []).includes(v574.id) ? "on" : "") +
        '" data-action="asig:toggle" data-person="' +
        v574.id +
        '" style="--cat:' +
        v574.color +
        '">' +
        v574.nombre +
        "</span>",
    ).join(""),
    v575 = (v566.checklist || [])
      .map(
        (v576) =>
          '<div class="chk"><input type="checkbox" ' +
          (v576.done ? "checked" : "") +
          ' data-action="cl:toggle" data-cl="' +
          v576.id +
          '"><input class="chk-text ' +
          (v576.done ? "done" : "") +
          '" value="' +
          esc(v576.text) +
          '" data-field="cl:' +
          v576.id +
          '"><span class="chk-del" data-action="cl:del" data-cl="' +
          v576.id +
          '">✕</span></div>',
      )
      .join(""),
    v577 = (v566.fases || [])
      .map((v578) => {
        const v579 = (v578.tareas || [])
          .map(
            (v580) =>
              '<div class="ftask"><input type="checkbox" ' +
              (v580.done ? "checked" : "") +
              ' data-action="ft:toggle" data-fase="' +
              v578.id +
              '" data-task="' +
              v580.id +
              '"><input class="ft-text ' +
              (v580.done ? "done" : "") +
              '" value="' +
              esc(v580.text) +
              '" data-field="ft:' +
              v578.id +
              ":" +
              v580.id +
              ':text"><input type="date" value="' +
              (v580.fecha || "") +
              '" data-field="ft:' +
              v578.id +
              ":" +
              v580.id +
              ':fecha"><span class="chk-del" data-action="ft:del" data-fase="' +
              v578.id +
              '" data-task="' +
              v580.id +
              '">✕</span></div>',
          )
          .join("");
        return (
          '<div class="fase-box"><div style="display:flex;gap:8px;align-items:center"><input class="chk-text" style="font-weight:600" value="' +
          esc(v578.nombre) +
          '" data-field="fz:' +
          v578.id +
          ':nombre"><span class="chk-del" data-action="fase:del" data-fase="' +
          v578.id +
          '">✕</span></div>\n    <div class="fld-row"><input type="date" value="' +
          (v578.inicio || "") +
          '" data-field="fz:' +
          v578.id +
          ':inicio"><input type="date" value="' +
          (v578.fin || "") +
          '" data-field="fz:' +
          v578.id +
          ':fin"></div>\n    ' +
          v579 +
          '<button class="btn btn-ghost btn-sm" data-action="ft:add" data-fase="' +
          v578.id +
          '" style="align-self:flex-start;margin-top:2px">+ Tarea</button></div>'
        );
      })
      .join("");
  let v581 = "";
  const v582 = inventoryKind(v566);
  if (v582) {
    const v583 = v566.tipo === "curso",
      v584 = v583 ? "curso" : "Edu Point";
    if (!v566.publicado)
      v581 =
        '<div class="bridge"><div class="bridge-t">📝 En producción (tablero)</div>\n        <div class="bridge-d">Este ' +
        v584 +
        ' se está armando. Cuando esté listo, <b>publicalo</b> y aparece en el <b>Mapa</b> para todo el equipo.</div>\n        <button class="btn btn-primary btn-sm" data-action="curso:publicar">' +
        (v583 ? "Publicar curso" : "Marcar como colocado") +
        "</button></div>";
    else
      v566.enActualizacion
        ? (v581 =
            '<div class="bridge"><div class="bridge-t">🔄 ' +
            (v583 ? "Activo · en actualización" : "Colocado · en revisión") +
            '</div>\n        <div class="bridge-d">Sigue visible en el Mapa y volvió al tablero para editarlo. Cuando termines, <b>republicalo</b>.</div>\n        <button class="btn btn-primary btn-sm" data-action="curso:republicar">Republicar</button></div>')
        : (v581 =
            '<div class="bridge"><div class="bridge-t">✅ ' +
            (v583 ? "Activo en el Mapa" : "Colocado en el Mapa") +
            '</div>\n        <div class="bridge-d">Publicado y visible para el equipo. ¿Necesita cambios? Generá una <b>actualización</b>: vuelve al tablero sin perder la ficha.</div>\n        <button class="btn btn-sm" data-action="curso:actualizar">Generar actualización</button></div>');
  }
  const v585 = isCurso(v566)
      ? '<details class="acc sec-acc"><summary class="sub">Ficha de catálogo<span class="ring"></span></summary><div class="acc-body">\n    <div class="fld"><label>Link Moodle</label><input value="' +
        esc(v566.linkMoodle) +
        '" data-field="linkMoodle" placeholder="https://..."></div>\n    <div class="fld"><label>Bajada</label><input value="' +
        esc(v566.catalogo.bajada) +
        '" data-field="cat:bajada"></div>\n    <div class="fld-row"><div class="fld"><label>Año</label><input value="' +
        esc(v566.catalogo.anio) +
        '" data-field="cat:anio"></div>\n      <div class="fld"><label>Duración</label><input value="' +
        esc(v566.catalogo.duracion) +
        '" data-field="cat:duracion"></div></div>\n    <div class="fld-row"><div class="fld"><label>Personas</label><input value="' +
        esc(v566.catalogo.personas) +
        '" data-field="cat:personas"></div>\n      <div class="fld"><label>Slug categoría</label><input value="' +
        esc(v566.catalogo.categoria) +
        '" data-field="cat:categoria"></div></div>\n    <div class="fld"><label>Descripción</label><textarea data-field="cat:descripcion">' +
        esc(v566.catalogo.descripcion) +
        "</textarea></div></div></details>"
      : "",
    v586 = {
      none: "Sin recurrencia",
      semanal: "Semanal",
      mensual: "Mensual",
      trimestral: "Trimestral",
    },
    v587 =
      '<div class="fld"><label>Recurrencia</label><select data-field="recurrencia">' +
      Object.keys(v586)
        .map(
          (v588) =>
            '<option value="' +
            v588 +
            '" ' +
            (v566.recurrencia === v588 ? "selected" : "") +
            ">" +
            v586[v588] +
            "</option>",
        )
        .join("") +
      "</select>" +
      (v566.recurrencia && v566.recurrencia !== "none"
        ? '<button class="btn btn-sm" data-action="card:recurrar" style="margin-top:8px;align-self:flex-start">↻ Generar próxima instancia</button>'
        : "") +
      "</div>",
    v589 =
      v566.tipo === "app-web" || v566.tipo === "base-sistema"
        ? '<details class="acc sec-acc"><summary class="sub">Ficha técnica<span class="ring"></span></summary><div class="acc-body">\n    <div class="fld"><label>URL / acceso</label><input value="' +
          esc(v566.ficha.url) +
          '" data-field="fi:url" placeholder="https://..."></div>\n    <div class="fld-row"><div class="fld"><label>Responsable técnico</label><input value="' +
          esc(v566.ficha.owner) +
          '" data-field="fi:owner"></div>\n    <div class="fld"><label>Estado operativo</label><select data-field="fi:estadoOp">' +
          ["operativo", "mantenimiento", "baja"]
            .map(
              (v590) =>
                "<option " + (v566.ficha.estadoOp === v590 ? "selected" : "") + ">" + v590 + "</option>",
            )
            .join("") +
          "</select></div></div></div></details>"
        : "",
    v591 =
      '<details class="acc sec-acc" ' +
      (v566.links && v566.links.length ? "open" : "") +
      '><summary class="sub">Enlaces · ' +
      (v566.links || []).length +
      '<span class="ring"></span></summary><div class="acc-body">\n    ' +
      ((v566.links || [])
        .map(
          (v592, v593) =>
            '<div class="lnk"><a href="' +
            esc(v592.url) +
            '" target="_blank" rel="noopener" class="lnk-a">🔗 ' +
            esc(v592.label || v592.url) +
            '</a><span class="chk-del" data-action="link:del" data-i="' +
            v593 +
            '" title="Quitar">✕</span></div>',
        )
        .join("") ||
        '<div style="font-size:12px;color:var(--ink-soft)">Sin enlaces. Sumá Drive, Moodle, docs…</div>') +
      '\n    <div class="lnk-add"><input id="linkLabel" placeholder="Etiqueta (ej: Carpeta Drive)"><input id="linkUrl" placeholder="https://…"><button class="btn btn-sm" data-action="link:add">+ Agregar</button></div></div></details>',
    v594 =
      '<details class="acc" ' +
      ((v566.comentarios || []).length ? "open" : "") +
      '><summary class="sub" style="margin-top:0">Comentarios · ' +
      (v566.comentarios || []).length +
      '</summary><div style="margin-top:8px">\n    ' +
      ((v566.comentarios || [])
        .slice()
        .reverse()
        .map(
          (v595) =>
            '<div class="cmt"><div class="cmt-h"><b>' +
            esc(v595.autor) +
            "</b><span>" +
            relTime(v595.ts) +
            '</span></div><div class="cmt-b">' +
            mentionize(v595.texto) +
            "</div></div>",
        )
        .join("") ||
        '<div style="font-size:12px;color:var(--ink-soft);padding:4px 0">Sin comentarios todavía.</div>') +
      '\n    <div class="cmt-add"><textarea id="cmtInput" placeholder="Comentá… usá @nombre para mencionar a alguien"></textarea><button class="btn btn-sm btn-primary" data-action="cmt:add" style="align-self:flex-start">Comentar</button></div></div></details>',
    v596 =
      v566.actividad && v566.actividad.length
        ? '<details class="acc"><summary class="sub" style="margin-top:0">Actividad · ' +
          v566.actividad.length +
          '</summary><div style="margin-top:8px">' +
          v566.actividad
            .slice(-12)
            .reverse()
            .map(
              (v597) =>
                '<div class="act"><span class="act-d">' +
                relTime(v597.ts) +
                "</span> <b>" +
                esc(v597.autor) +
                "</b> " +
                esc(v597.texto) +
                "</div>",
            )
            .join("") +
          "</div></details>"
        : "";
  $("#panel").innerHTML =
    '\n    <div class="panel-head" data-cat="' +
    primaryCat(v566) +
    '">\n      <div style="flex:1">\n        <div class="tipo-pill">' +
    ((allTipos()[v566.tipo] || {}).icon || "•") +
    " " +
    ((allTipos()[v566.tipo] || {}).nombre || v566.tipo) +
    (inInventory(v566) ? " · ◎ activo" : "") +
    '</div>\n        <input class="chk-text" style="font-size:18px;font-weight:700;font-family:var(--titulo);width:100%;margin-top:4px" value="' +
    esc(v566.titulo) +
    '" data-field="titulo">\n      </div>\n      <button class="btn btn-icon btn-ghost" data-action="panel:close">✕</button>\n    </div>\n    <div class="panel-body">\n      ' +
    v581 +
    '\n      <div class="fld-row">\n        <div class="fld"><label>Tipo</label><select data-field="tipo">' +
    v569 +
    '</select></div>\n        <div class="fld"><label>Estado</label><select data-field="estado">' +
    v571 +
    '</select></div>\n      </div>\n      <div class="fld-row">\n        <div class="fld"><label>Inicio</label><input type="date" value="' +
    (v566.inicio || "") +
    '" data-field="inicio"></div>\n        <div class="fld"><label>Fin ' +
    (v568 ? '· <span style="color:var(--bad)">vencida</span>' : "") +
    '</label><input type="date" value="' +
    (v566.fin || "") +
    '" data-field="fin"></div>\n      </div>\n      <div class="fld-row"><div class="fld"><label>Prioridad</label><select data-field="prioridad"><option value="normal" ' +
    (v566.prioridad === "normal" ? "selected" : "") +
    '>Normal</option><option value="alta" ' +
    (v566.prioridad === "alta" ? "selected" : "") +
    ">Alta</option></select></div>" +
    v587 +
    '</div>\n      <div class="fld"><label>Responsable</label><select data-field="responsable"><option value="">— sin asignar —</option>' +
    TEAM.map(
      (v598) =>
        '<option value="' +
        v598.id +
        '" ' +
        (v566.responsable === v598.id ? "selected" : "") +
        ">" +
        v598.nombre +
        "</option>",
    ).join("") +
    '</select><span class="fld-hint">Quién rinde cuentas por la tarjeta (uno solo).</span></div>\n      <div class="fld"><label>Asignados</label><div class="chiplist">' +
    v573 +
    '</div><span class="fld-hint">Todos los que trabajan en ella (los que quieras).</span></div>\n      ' +
    sectorPicker(v566) +
    '\n\n      <details class="acc sec-acc" open><summary class="sub">Checklist · ' +
    v567.done +
    "/" +
    v567.total +
    '<span class="ring"></span></summary>\n        <div class="acc-body">\n          <div class="prog-row"><div class="progress"><div class="progress-bar" style="width:' +
    v567.pct +
    '%"></div></div><span class="prog-num">' +
    v567.pct +
    "%</span></div>\n          " +
    v575 +
    '\n          <button class="btn btn-ghost btn-sm" data-action="cl:add" style="align-self:flex-start">+ Ítem</button>\n        </div></details>\n\n      <details class="acc sec-acc"><summary class="sub">Fases (opcional · multi-etapa)<span class="ring"></span></summary>\n        <div class="acc-body">\n          ' +
    v577 +
    '\n          <button class="btn btn-ghost btn-sm" data-action="fase:add" style="align-self:flex-start">+ Fase</button>\n        </div></details>\n\n      ' +
    v585 +
    "\n      " +
    v589 +
    '\n\n      <details class="acc sec-acc" ' +
    (v566.notas ? "open" : "") +
    '><summary class="sub">Notas<span class="ring"></span></summary>\n        <div class="acc-body"><textarea data-field="notas" placeholder="Notas del equipo...">' +
    esc(v566.notas) +
    "</textarea></div></details>\n      " +
    v591 +
    "\n      " +
    v594 +
    "\n      " +
    v596 +
    '\n\n      <div style="display:flex;gap:8px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:14px">\n        <button class="btn btn-sm" data-action="card:link" title="Copiar un enlace directo a esta tarjeta">🔗 Copiar enlace</button>\n        <button class="btn btn-sm" data-action="tpl:save">💾 Plantilla</button>\n        <button class="btn btn-sm" data-action="card:dup">⧉ Duplicar</button>\n        <button class="btn btn-ghost btn-sm" style="color:var(--bad);margin-left:auto" data-action="card:del">🗑 Eliminar</button>\n      </div>\n    </div>';
}
function openCarga() {
  const v599 = {};
  (TEAM.forEach(
    (v600) =>
      (v599[v600.id] = {
        n: 0,
        alta: 0,
      }),
  ),
    boardCards().forEach((v601) => {
      const v602 = [v601.responsable, ...(v601.asignados || [])].filter(
        (v603, v604, v605) => v603 && v605.indexOf(v603) === v604,
      );
      v602.forEach((v606) => {
        if (v599[v606]) {
          v599[v606].n++;
          if (v601.prioridad === "alta") v599[v606].alta++;
        }
      });
    }));
  const v607 = Math.max(1, ...TEAM.map((v608) => v599[v608.id].n)),
    v609 = TEAM.map((v610) => {
      const v611 = v599[v610.id],
        v612 = Math.round((v611.n / v607) * 100),
        v613 = v611.n === v607 && v607 > 1;
      return (
        '<div class="carga-row">' +
        avatarHTML(v610.id) +
        '<div class="carga-info">\n      <div class="carga-name">' +
        v610.nombre +
        " " +
        (v613 ? '<span class="badge prio" style="margin-left:4px">al palo</span>' : "") +
        '</div>\n      <div class="carga-rol">' +
        v610.rol +
        '</div>\n      <div class="carga-bar"><div class="carga-fill" style="width:' +
        v612 +
        "%;background:" +
        v610.color +
        '"></div></div></div>\n      <div class="carga-num">' +
        v611.n +
        " tarea" +
        (v611.n !== 1 ? "s" : "") +
        (v611.alta ? " · " + v611.alta + "★" : "") +
        "</div></div>"
      );
    }).join("");
  ((state.selectedId = null),
    ($("#panel").innerHTML =
      '<div class="panel-head"><div style="flex:1"><div class="tipo-pill">👥 Equipo</div>\n    <div style="font-family:var(--titulo);font-size:18px;font-weight:700;margin-top:4px">Carga del equipo</div></div>\n    <button class="btn btn-icon btn-ghost" data-action="panel:close">✕</button></div>\n    <div class="panel-body"><div class="carga-list">' +
      v609 +
      '</div>\n    <div class="note">Cuenta tarjetas del tablero (responsable + asignados). Ayuda al reparto: el “al palo” es quien más acumula.</div></div>'),
    $("#panel").classList.add("open"),
    $("#overlay").classList.remove("hidden"));
}
function openMiSemana() {
  state.selectedId = null;
  const v614 = '<button class="btn btn-icon btn-ghost" data-action="panel:close">✕</button>';
  if (!state.userId) {
    (($("#panel").innerHTML =
      '<div class="panel-head"><div style="flex:1"><div class="tipo-pill">📅 Mi semana</div><div style="font-family:var(--titulo);font-size:18px;font-weight:700;margin-top:4px">Identificate primero</div></div>' +
      v614 +
      '</div><div class="panel-body"><div class="note warn">Entrá con tu nombre del equipo para ver “Mi semana”.</div></div>'),
      $("#panel").classList.add("open"),
      $("#overlay").classList.remove("hidden"));
    return;
  }
  const v615 = todayISO(),
    v616 = isoOf(addDays(weekStart(new Date()), 6)),
    v617 = isoOf(addDays(new Date(), 30)),
    v618 = (v619) => v619.fin || v619.inicio,
    v620 = boardCards()
      .filter(mine)
      .filter((v621) => v621.fin || v621.inicio),
    v622 = v620
      .filter((v623) => v618(v623) < v615)
      .sort((v624, v625) => v618(v624).localeCompare(v618(v625))),
    v626 = v620
      .filter((v627) => {
        const v628 = v618(v627);
        return v628 >= v615 && v628 <= v616;
      })
      .sort((v629, v630) => v618(v629).localeCompare(v618(v630))),
    v631 = v620
      .filter((v632) => {
        const v633 = v618(v632);
        return v633 > v616 && v633 <= v617;
      })
      .sort((v634, v635) => v618(v634).localeCompare(v618(v635))),
    v636 = (v637) => {
      const v638 = v618(v637),
        v639 = v638 < v615,
        v640 = daysBetween(v615, v638),
        v641 = v639 ? "−" + Math.abs(v640) + "d" : v640 === 0 ? "hoy" : v640 + "d";
      return (
        '<div class="venc" data-id="' +
        v637.id +
        '" data-action="card:open"><span class="venc-d ' +
        (v639 ? "over" : "") +
        '">' +
        v641 +
        '</span><span class="venc-t">' +
        esc(v637.titulo) +
        "</span>" +
        stackHTML(v637) +
        "</div>"
      );
    },
    v642 = (v643, v644, v645) =>
      v644.length
        ? '<div class="res-card"><h3>' +
          v645 +
          " " +
          v643 +
          ' <span class="mini">' +
          v644.length +
          "</span></h3>" +
          v644.map(v636).join("") +
          "</div>"
        : "",
    v646 = v622.length + v626.length + v631.length,
    v647 = v646
      ? v642("Vencidas", v622, "⚑") + v642("Esta semana", v626, "📅") + v642("Próximas (30 días)", v631, "⏳")
      : '<div class="empty"><div class="big">🎉</div><div style="font-weight:700;color:var(--ink)">Semana despejada</div><div style="margin-top:4px">No tenés tareas con fecha próxima.</div></div>';
  (($("#panel").innerHTML =
    '<div class="panel-head"><div style="flex:1"><div class="tipo-pill">📅 Mi semana</div><div style="font-family:var(--titulo);font-size:18px;font-weight:700;margin-top:4px">Hola ' +
    esc(state.user || "") +
    " — tu foco</div></div>" +
    v614 +
    '</div><div class="panel-body">' +
    v647 +
    "</div>"),
    $("#panel").classList.add("open"),
    $("#overlay").classList.remove("hidden"));
}
function loadViews() {
  try {
    return JSON.parse(localStorage.getItem("cf.views") || "[]");
  } catch (v648) {
    return [];
  }
}
function saveViews() {
  try {
    localStorage.setItem("cf.views", JSON.stringify(state.savedViews || []));
  } catch (v649) {}
}
function closeModal() {
  ($("#modal").classList.add("hidden"), ($("#modal").innerHTML = ""));
}
function openModal(v650) {
  (($("#modal").innerHTML =
    '<div class="modal-bg" data-action="modal:close"></div><div class="modal">' + v650 + "</div>"),
    $("#modal").classList.remove("hidden"));
}
function openNuevo() {
  state.draftTipo = "curso";
  const v651 = Object.keys(allTipos())
    .map(
      (v652) =>
        '<div class="tipo-opt ' +
        (v652 === "curso" ? "on" : "") +
        '" data-action="nuevo:tipo" data-tipo="' +
        v652 +
        '"><span class="ic">' +
        allTipos()[v652].icon +
        '</span><span class="nm">' +
        esc(allTipos()[v652].nombre) +
        "</span></div>",
    )
    .join("");
  (openModal(
    '<h2>Nueva tarjeta</h2><div class="sub-t">Elegí el <b>tipo</b> (trae su plantilla) y ponele título. Todo es editable después.</div>\n    <div class="fld"><label>Tipo</label><div class="tipo-grid" id="tipoGrid">' +
      v651 +
      '</div></div>\n    <div class="fld"><label>Título</label><input id="nuevoTitulo" placeholder="Ej: Curso de inducción..." autofocus></div>\n    <div class="modal-foot"><button class="btn" data-action="modal:close">Cancelar</button><button class="btn btn-primary" data-action="nuevo:create">Crear tarjeta</button></div>',
  ),
    setTimeout(() => $("#nuevoTitulo") && $("#nuevoTitulo").focus(), 50));
}
function openIngest() {
  openModal(
    '<h2>Ingestar catálogo</h2><div class="sub-t">Pegá el JSON <code>const CURSOS=[…]</code> (campos: categoria, titulo, bajada, anio, duracion, imagen, personas, descripcion). Entran como cursos <b>activos</b>; el slug de categoría resuelve el sector por el diccionario.</div>\n    <div class="fld"><label>JSON del catálogo</label><textarea id="ingestText" style="min-height:180px;font-family:monospace;font-size:12px" placeholder=\'[{"categoria":"calidad","titulo":"Seguridad Alimentaria","bajada":"...","anio":2024,"duracion":"45 min","personas":1280,"descripcion":"..."}]\'></textarea></div>\n    <label style="display:flex;gap:8px;align-items:center;font-size:13px;margin-top:8px"><input type="checkbox" id="ingestReplace"> Reemplazar si el título ya existe</label>\n    <div class="modal-foot"><button class="btn" data-action="ingest:demo">Cargar ejemplo</button><button class="btn" data-action="modal:close">Cancelar</button><button class="btn btn-primary" data-action="ingest:run">Ingestar</button></div>',
  );
}
function openSaveTpl() {
  const v653 = current();
  if (!v653) return;
  openModal(
    '<h2>Guardar como plantilla</h2><div class="sub-t">Crea un <b>tipo nuevo</b> reutilizable con las fases y el checklist actuales de “' +
      esc(v653.titulo) +
      '”.</div>\n    <div class="fld"><label>Nombre del tipo</label><input id="tplName" placeholder="Ej: Microlearning, Onboarding..." autofocus></div>\n    <div class="modal-foot"><button class="btn" data-action="modal:close">Cancelar</button><button class="btn btn-primary" data-action="tpl:create">Guardar plantilla</button></div>',
  );
}
function touch() {
  persist();
}
function patch(v654, v655) {
  (Object.assign(v654, v655), touch());
}
function applyField(v656, v657, v658) {
  const v659 = v658.type === "checkbox" ? v658.checked : v658.value;
  if (v657.startsWith("cat:")) v656.catalogo[v657.slice(4)] = v659;
  else {
    if (v657.startsWith("fi:")) ((v656.ficha = v656.ficha || {}), (v656.ficha[v657.slice(3)] = v659));
    else {
      if (v657.startsWith("cl:")) {
        const v660 = (v656.checklist || []).find((v661) => v661.id === v657.slice(3));
        if (v660) v660.text = v659;
      } else {
        if (v657.startsWith("ft:")) {
          const v662 = v657.split(":"),
            v663 = (v656.fases || []).find((v664) => v664.id === v662[1]);
          if (v663) {
            const v665 = (v663.tareas || []).find((v666) => v666.id === v662[2]);
            if (v665) v665[v662[3]] = v659;
          }
        } else {
          if (v657.startsWith("fz:")) {
            const [, v667, v668] = v657.split(":"),
              v669 = (v656.fases || []).find((v670) => v670.id === v667);
            if (v669) v669[v668] = v659;
          } else v656[v657] = v659;
        }
      }
    }
  }
  touch();
}
const STRUCTURAL = ["tipo", "estado", "responsable", "inicio", "fin", "prioridad"];
document.addEventListener("click", (v671) => {
  const v672 = v671.target.closest(".tab[data-view]");
  if (v672) {
    state.view !== v672.dataset.view && ((state.view = v672.dataset.view), pushNav(), render());
    return;
  }
  const v673 = v671.target.closest("[data-action]");
  if (!v673) return;
  const v674 = v673.dataset.action,
    v675 = v673.dataset.id;
  switch (v674) {
    case "gate:enter":
      gateTry($("#gateInput").value);
      break;
    case "gate:person": {
      const v676 = v673.dataset.nombre;
      if (state.appPassHash) {
        const v677 = $("#gateInput");
        if (v677) v677.value = v676;
        const v678 = $("#gatePassInput");
        if (v678) v678.focus();
      } else gateTry(v676);
      break;
    }
    case "gate:open":
      $("#gate").classList.remove("hidden");
      break;
    case "theme:toggle":
      toggleTheme();
      break;
    case "menu:toggle": {
      const v679 = $("#userMenu");
      if (v679) v679.classList.toggle("hidden");
      break;
    }
    case "user:logout": {
      ((state.user = null), (state.userId = null), (state.mis = false));
      const v680 = $("#userMenu");
      if (v680) v680.classList.add("hidden");
      $("#gate").classList.remove("hidden");
      const v681 = $("#gateInput");
      if (v681) v681.value = "";
      break;
    }
    case "mis:toggle":
      if (!state.userId) {
        flash("Entrá con tu nombre del equipo para usar “Mis tareas”", true);
        break;
      }
      ((state.mis = !state.mis), render());
      break;
    case "mapa:sec":
      ((state.mapaSec = v673.dataset.sec),
        (state.eduSector = null),
        (state.eduEst = ""),
        (state.eduQ = ""),
        pushNav(),
        render());
      break;
    case "edu:sec":
      ((state.eduSector = v673.dataset.sec), (state.eduEst = ""), (state.eduQ = ""), pushNav(), render());
      break;
    case "edu:back":
      ((state.eduSector = null), (state.eduEst = ""), (state.eduQ = ""), pushNav(), render());
      break;
    case "edu:est":
      ((state.eduEst = state.eduEst === v673.dataset.est ? "" : v673.dataset.est), renderView());
      break;
    case "kpi:go":
      state.view = v673.dataset.go;
      if (v673.dataset.sec) state.mapaSec = v673.dataset.sec;
      (pushNav(), render());
      break;
    case "hub:go":
      ((state.view = v673.dataset.go), pushNav(), render());
      break;
    case "agenda:month": {
      let v682 = state.agendaRefM + (parseInt(v673.dataset.dir, 10) || 0),
        v683 = state.agendaRefY;
      while (v682 < 0) {
        ((v682 += 12), v683--);
      }
      while (v682 > 11) {
        ((v682 -= 12), v683++);
      }
      ((state.agendaRefY = v683), (state.agendaRefM = v682), render());
      break;
    }
    case "agenda:hoy":
      ((state.agendaRefY = new Date().getFullYear()), (state.agendaRefM = new Date().getMonth()), render());
      break;
    case "agenda:mode":
      ((state.agendaMode = v673.dataset.mode), render());
      break;
    case "agenda:tool":
      ((state.agendaTool = v673.dataset.tool), render());
      break;
    case "agenda:edit":
      ((state.agendaEdit = v673.dataset.who), render());
      break;
    case "agenda:who":
      state.agendaMode === "equipo" &&
        ((state.agendaWho = state.agendaWho === v673.dataset.who ? "" : v673.dataset.who), render());
      break;
    case "agenda:day": {
      if (state.agendaMode !== "mi") break;
      const v684 = v673.dataset.iso;
      if (!member(state.agendaEdit)) {
        flash("Elegí quién sos para marcar 🙂", true);
        break;
      }
      const v685 = state.agenda[state.agendaEdit] || (state.agenda[state.agendaEdit] = {}),
        v686 = v685[v684],
        v687 = state.agendaTool;
      if (v687 === "clear" || v686 === v687) delete v685[v684];
      else v685[v684] = v687;
      v673.className = "aday" + (v685[v684] ? " " + v685[v684] : "") + (v684 === todayISO() ? " today" : "");
      const v688 = $("#agendaPeople");
      if (v688) v688.innerHTML = agendaChips();
      persist();
      break;
    }
    case "search:open":
      openPalette();
      break;
    case "sr:open":
      (closeModal(), openDetail(v673.dataset.id));
      break;
    case "notif:open":
      openNotif();
      break;
    case "settings:open":
      openSettings();
      break;
    case "cmt:add":
      addComment();
      break;
    case "card:recurrar": {
      const v689 = current();
      if (v689) {
        const v690 = recurrar(v689);
        (openDetail(v690.id), render(), flash("↻ Próxima instancia generada"));
      }
      break;
    }
    case "data:export":
      exportJSON();
      break;
    case "data:csv":
      exportCSV();
      break;
    case "data:import":
      doImport();
      break;
    case "data:import-run":
      runImport();
      break;
    case "data:reset":
      resetSeed();
      break;
    case "set:add-sector":
      addSector();
      break;
    case "set:pass": {
      const v691 = ($("#setPass").value || "").trim();
      if (!v691) {
        flash("Escribí una clave", true);
        break;
      }
      ((state.appPassHash = hashStr(v691)),
        persist(),
        updateGatePass(),
        openSettings(),
        flash("🔐 Clave grupal guardada"));
      break;
    }
    case "set:pass-clear": {
      ((state.appPassHash = ""), persist(), updateGatePass(), openSettings(), flash("Clave quitada"));
      break;
    }
    case "set:add-member":
      addMember();
      break;
    case "tpl:del":
      delTpl(v673.dataset.tpl);
      break;
    case "view":
      break;
    case "card:open":
      v675 && openDetail(v675);
      break;
    case "panel:close":
      closePanel();
      break;
    case "card:sel": {
      const v692 = v673.dataset.id;
      ((state.sel = state.sel.includes(v692)
        ? state.sel.filter((v693) => v693 !== v692)
        : [...state.sel, v692]),
        render());
      break;
    }
    case "bulk:clear":
      ((state.sel = []), render());
      break;
    case "bulk:del": {
      if (!state.sel.length) break;
      if (!confirm("¿Eliminar " + state.sel.length + " tarjeta(s)?")) break;
      const v694 = new Set(state.sel);
      ((state.cards = state.cards.filter((v695) => !v694.has(v695.id))),
        (state.sel = []),
        touch(),
        render(),
        flash("🗑 Eliminadas"));
      break;
    }
    case "misemana:open":
      openMiSemana();
      break;
    case "view:save": {
      const v696 = (prompt("Nombre de la vista (ej: Mías vencidas)") || "").trim();
      if (!v696) break;
      ((state.savedViews = [
        ...state.savedViews,
        {
          id: uid(),
          name: v696,
          filters: Object.assign({}, state.filters),
          quick: state.quick,
          mis: state.mis,
        },
      ]),
        saveViews(),
        render(),
        flash("💾 Vista “" + v696 + "” guardada"));
      break;
    }
    case "view:apply": {
      const v697 = state.savedViews.find((v698) => v698.id === v673.dataset.id);
      v697 &&
        ((state.filters = Object.assign(
          {
            persona: "",
            tipo: "",
            sector: "",
            estado: "",
            texto: "",
            cursoEstado: "",
          },
          v697.filters || {},
        )),
        (state.quick = v697.quick || ""),
        (state.mis = !!v697.mis),
        render());
      break;
    }
    case "view:del": {
      ((state.savedViews = state.savedViews.filter((v699) => v699.id !== v673.dataset.id)),
        saveViews(),
        render());
      break;
    }
    case "app:print":
      window.print();
      break;
    case "carga:open":
      openCarga();
      break;
    case "nuevo:open":
      openNuevo();
      break;
    case "ingest:open":
      openIngest();
      break;
    case "modal:close":
      closeModal();
      break;
    case "filt:clear":
      ((state.filters = {
        persona: "",
        tipo: "",
        sector: "",
        estado: "",
        texto: "",
        cursoEstado: "",
      }),
        (state.quick = ""),
        render());
      break;
    case "quick:set":
      ((state.quick = state.quick === v673.dataset.q ? "" : v673.dataset.q), render());
      break;
    case "card:link":
      copyCardLink(current());
      break;
    case "cal:prev":
      calShift(-1);
      break;
    case "cal:next":
      calShift(1);
      break;
    case "cal:hoy":
      ((state.calCursor = new Date()), render());
      break;
    case "cal:goto":
      ((state.calCursor = parseISO(v673.dataset.iso)), render());
      break;
    case "cal:mes":
      ((state.calMode = "mes"), render());
      break;
    case "cal:semana":
      ((state.calMode = "semana"), render());
      break;
    case "nuevo:tipo":
      ((state.draftTipo = v673.dataset.tipo),
        document
          .querySelectorAll(".tipo-opt")
          .forEach((v700) => v700.classList.toggle("on", v700.dataset.tipo === v673.dataset.tipo)));
      break;
    case "nuevo:create":
      doCreate();
      break;
    case "ingest:run":
      doIngest(false);
      break;
    case "ingest:demo":
      $("#ingestText").value = JSON.stringify(CURSOS, null, 2);
      break;
    case "tpl:save":
      openSaveTpl();
      break;
    case "tpl:create":
      doSaveTpl();
      break;
    case "sector:toggle":
      (toggleArr(current(), "sectores", v673.dataset.sector), renderPanel());
      break;
    case "sector:add": {
      (toggleArr(current(), "sectores", v673.dataset.sector), renderPanel());
      const v701 = $("#sectorSearch");
      if (v701) v701.focus();
      break;
    }
    case "asig:toggle":
      (toggleArr(current(), "asignados", v673.dataset.person), renderPanel());
      break;
    case "cl:toggle": {
      const v702 = current(),
        v703 = v702.checklist.find((v704) => v704.id === v673.dataset.cl);
      if (v703) {
        const v705 = progress(v702).pct;
        ((v703.done = !v703.done), touch());
        const v706 = progress(v702).pct;
        renderPanel();
        if (v706 === 100 && v705 < 100 && (v702.checklist || []).length) {
          const v707 = v673.getBoundingClientRect ? v673.getBoundingClientRect() : null;
          (confettiBurst(v707 ? v707.left + 8 : innerWidth / 2, v707 ? v707.top + 8 : innerHeight / 2),
            flash("🎉 ¡Checklist completo!"));
        }
      }
      break;
    }
    case "palette:run": {
      const v708 = v673.dataset.prun,
        v709 = v673.dataset.arg;
      closeModal();
      if (v708 === "view") (state.view !== v709 && ((state.view = v709), pushNav()), render());
      else {
        if (v708 === "card") openDetail(v673.dataset.id);
        else {
          if (v708 === "do") {
            if (v709 === "nuevo:open") openNuevo();
            else {
              if (v709 === "mis:toggle")
                !state.userId
                  ? flash("Entrá con tu nombre del equipo para usar “Mis tareas”", true)
                  : ((state.mis = !state.mis), render());
              else {
                if (v709 === "misemana:open") openMiSemana();
                else {
                  if (v709 === "app:print") window.print();
                  else {
                    if (v709 === "carga:open") openCarga();
                    else {
                      if (v709 === "notif:open") openNotif();
                      else {
                        if (v709 === "settings:open") openSettings();
                        else {
                          if (v709 === "theme:toggle") toggleTheme();
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      break;
    }
    case "cl:add": {
      const v710 = current();
      (v710.checklist.push({
        id: uid(),
        text: "Nuevo ítem",
        done: false,
      }),
        touch(),
        renderPanel());
      break;
    }
    case "cl:del": {
      const v711 = current();
      ((v711.checklist = v711.checklist.filter((v712) => v712.id !== v673.dataset.cl)),
        touch(),
        renderPanel());
      break;
    }
    case "link:add": {
      const v713 = current();
      if (!v713) break;
      const v714 = $("#linkLabel"),
        v715 = $("#linkUrl");
      let v716 = ((v715 && v715.value) || "").trim();
      if (!v716) {
        flash("Poné el link (URL)", true);
        break;
      }
      if (!/^https?:\/\//i.test(v716)) v716 = "https://" + v716;
      ((v713.links || (v713.links = [])).push({
        label: ((v714 && v714.value) || "").trim() || v716,
        url: v716,
      }),
        touch(),
        renderPanel());
      break;
    }
    case "link:del": {
      const v717 = current();
      if (!v717 || !v717.links) break;
      (v717.links.splice(+v673.dataset.i, 1), touch(), renderPanel());
      break;
    }
    case "fase:add": {
      const v718 = current();
      (v718.fases.push({
        id: uid(),
        nombre: "Nueva fase",
        inicio: null,
        fin: null,
        tareas: [],
      }),
        touch(),
        renderPanel());
      break;
    }
    case "fase:del": {
      const v719 = current();
      ((v719.fases = v719.fases.filter((v720) => v720.id !== v673.dataset.fase)), touch(), renderPanel());
      break;
    }
    case "ft:add": {
      const v721 = current(),
        v722 = v721.fases.find((v723) => v723.id === v673.dataset.fase);
      v722 &&
        ((v722.tareas = v722.tareas || []),
        v722.tareas.push({
          id: uid(),
          text: "Nueva tarea",
          done: false,
          fecha: null,
        }),
        touch(),
        renderPanel());
      break;
    }
    case "ft:del": {
      const v724 = current(),
        v725 = v724.fases.find((v726) => v726.id === v673.dataset.fase);
      v725 &&
        ((v725.tareas = (v725.tareas || []).filter((v727) => v727.id !== v673.dataset.task)),
        touch(),
        renderPanel());
      break;
    }
    case "ft:toggle": {
      const v728 = current(),
        v729 = v728.fases.find((v730) => v730.id === v673.dataset.fase);
      if (v729) {
        const v731 = (v729.tareas || []).find((v732) => v732.id === v673.dataset.task);
        v731 && ((v731.done = !v731.done), touch(), renderPanel());
      }
      break;
    }
    case "curso:publicar": {
      const v733 = current();
      (logAct(v733, "publicó al inventario"),
        patch(v733, {
          publicado: true,
          enActualizacion: false,
        }),
        renderPanel(),
        render(),
        flash("◎ Publicado al inventario del Mapa"));
      break;
    }
    case "curso:actualizar": {
      const v734 = current();
      (logAct(v734, "generó actualización"),
        patch(v734, {
          enActualizacion: true,
          estado: "pendiente",
        }),
        (state.view = "kanban"),
        renderPanel(),
        render(),
        flash("♻️ Actualización generada en el tablero"));
      break;
    }
    case "curso:republicar": {
      const v735 = current();
      (logAct(v735, "republicó al mapa"),
        patch(v735, {
          enActualizacion: false,
          estado: "en-revision",
        }),
        renderPanel(),
        render(),
        flash("✓ Republicado al Mapa"));
      break;
    }
    case "card:dup":
      doDup();
      break;
    case "card:del":
      doDelete();
      break;
  }
});
function navState() {
  return {
    v: state.view,
    ms: state.mapaSec,
    es: state.eduSector,
  };
}
function pushNav() {
  try {
    history.pushState(navState(), "");
  } catch (v736) {}
}
window.addEventListener("popstate", (v737) => {
  if (!$("#modal").classList.contains("hidden")) {
    closeModal();
    try {
      history.pushState(navState(), "");
    } catch (v738) {}
    return;
  }
  if ($("#panel").classList.contains("open")) {
    closePanel();
    try {
      history.pushState(navState(), "");
    } catch (v739) {}
    return;
  }
  const v740 = v737.state;
  v740 &&
    ((state.view = v740.v),
    (state.mapaSec = v740.ms || state.mapaSec),
    (state.eduSector = v740.es || null),
    (state.eduEst = ""),
    (state.eduQ = ""),
    render());
});
function toggleArr(v741, v742, v743) {
  if (!v741) return;
  v741[v742] = v741[v742] || [];
  const v744 = v741[v742].indexOf(v743);
  if (v744 >= 0) v741[v742].splice(v744, 1);
  else v741[v742].push(v743);
  touch();
}
(document.addEventListener("input", (v745) => {
  if (v745.target.id === "searchInput") {
    renderSearchResults(v745.target.value);
    return;
  }
  if (v745.target.id === "cmdkInput") {
    renderPalette(v745.target.value);
    return;
  }
  if (v745.target.id === "sectorSearch") {
    renderSectorResults(v745.target.value);
    return;
  }
  if (v745.target.id === "eduSearch") {
    ((state.eduQ = v745.target.value), renderEduList());
    return;
  }
  const v746 = v745.target.dataset.filter;
  if (v746) {
    state.filters[v746] = v745.target.value;
    v746 === "texto" && renderView();
    return;
  }
  const v747 = v745.target.dataset.field;
  if (v747) {
    const v748 = current();
    if (v748) {
      applyField(v748, v747, v745.target);
      if (v747 === "titulo" && state.view !== "cursos") {
      }
    }
  }
}),
  document.addEventListener("change", (v749) => {
    const v750 = v749.target.dataset.bulk;
    if (v750) {
      applyBulk(v750, v749.target.value);
      return;
    }
    const v751 = v749.target.dataset.filter;
    if (v751) {
      ((state.filters[v751] = v749.target.value), render());
      return;
    }
    const v752 = v749.target.dataset.control;
    if (v752) {
      ((state[v752] = v749.target.value), render());
      return;
    }
    const v753 = v749.target.dataset.set;
    if (v753) {
      applySetting(v753, v749.target.value);
      return;
    }
    const v754 = v749.target.dataset.field;
    if (v754) {
      const v755 = current();
      if (v755) {
        v754 === "estado" &&
          logAct(
            v755,
            "pasó a " +
              ((ESTADOS.find((v756) => v756.id === v749.target.value) || {}).nombre || v749.target.value),
          );
        applyField(v755, v754, v749.target);
        if (STRUCTURAL.includes(v754)) (renderPanel(), render());
        else render();
      }
    }
  }),
  document.addEventListener("dragstart", (v757) => {
    const v758 = v757.target.closest(".kcard");
    if (v758) {
      ((state.dragId = v758.dataset.id), v758.classList.add("drag"));
      return;
    }
    const v759 = v757.target.closest(".cal-bar");
    if (v759) {
      ((state.dragCal = v759.dataset.id), v759.classList.add("drag"));
      try {
        v757.dataTransfer.effectAllowed = "move";
      } catch (v760) {}
      return;
    }
    const v761 = v757.target.closest(".tl-bar");
    if (v761) {
      ((state.dragTl = v761.dataset.id), v761.classList.add("drag"));
      try {
        v757.dataTransfer.effectAllowed = "move";
      } catch (v762) {}
    }
  }),
  document.addEventListener("dragend", (v763) => {
    const v764 = v763.target.closest(".kcard");
    if (v764) v764.classList.remove("drag");
    const v765 = v763.target.closest(".cal-bar");
    if (v765) v765.classList.remove("drag");
    const v766 = v763.target.closest(".tl-bar");
    if (v766) v766.classList.remove("drag");
    (document.querySelectorAll(".kcol-body.drop").forEach((v767) => v767.classList.remove("drop")),
      document.querySelectorAll(".cwd.cwd-drop").forEach((v768) => v768.classList.remove("cwd-drop")),
      document.querySelectorAll(".tl-canvas.drop").forEach((v769) => v769.classList.remove("drop")),
      (state.dragCal = null),
      (state.dragTl = null));
  }),
  document.addEventListener("dragover", (v770) => {
    const v771 = v770.target.closest(".kcol-body");
    if (v771) {
      (v770.preventDefault(), v771.classList.add("drop"));
      return;
    }
    if (state.dragCal) {
      const v772 = v770.target.closest(".cwd");
      if (v772) {
        (v770.preventDefault(), v772.classList.add("cwd-drop"));
        return;
      }
    }
    if (state.dragTl) {
      const v773 = v770.target.closest(".tl-canvas");
      v773 && (v770.preventDefault(), v773.classList.add("drop"));
    }
  }),
  document.addEventListener("dragleave", (v774) => {
    const v775 = v774.target.closest(".kcol-body");
    if (v775) v775.classList.remove("drop");
    const v776 = v774.target.closest(".cwd");
    if (v776) v776.classList.remove("cwd-drop");
    const v777 = v774.target.closest(".tl-canvas");
    if (v777) v777.classList.remove("drop");
  }),
  document.addEventListener("drop", (v778) => {
    const v779 = v778.target.closest(".kcol-body");
    if (v779 && state.dragId) {
      v778.preventDefault();
      const v780 = state.cards.find((v781) => v781.id === state.dragId);
      v780 &&
        v780.estado !== v779.dataset.estado &&
        (logAct(
          v780,
          "pasó a " + ((ESTADOS.find((v782) => v782.id === v779.dataset.estado) || {}).nombre || ""),
        ),
        (v780.estado = v779.dataset.estado),
        touch());
      ((state.dragId = null), render());
      return;
    }
    const v783 = v778.target.closest(".cwd");
    if (v783 && state.dragCal) {
      (v778.preventDefault(), rescheduleCard(state.dragCal, v783.dataset.iso), (state.dragCal = null));
      return;
    }
    const v784 = v778.target.closest(".tl-canvas");
    if (v784 && state.dragTl) {
      v778.preventDefault();
      const v785 = v784.getBoundingClientRect(),
        v786 = parseInt(v784.dataset.tldays, 10) || 1,
        v787 = Math.max(0, Math.min(v785.width, (v778.clientX || 0) - v785.left)),
        v788 = v785.width ? Math.round((v787 / v785.width) * (v786 - 1)) : 0,
        v789 = isoOf(addDays(parseISO(v784.dataset.tlstart), v788));
      (rescheduleCard(state.dragTl, v789), (state.dragTl = null));
    }
  }));
function rescheduleCard(v790, v791) {
  const v792 = state.cards.find((v793) => v793.id === v790);
  if (!v792 || !v791) return;
  const v794 = v792.inicio || v792.fin,
    v795 = v792.fin || v792.inicio,
    v796 = v794 && v795 ? Math.max(0, daysBetween(v794, v795)) : 0;
  ((v792.inicio = v791),
    (v792.fin = isoOf(addDays(parseISO(v791), v796))),
    logAct(v792, "reprogramada a " + fmtShort(v791)),
    touch(),
    render(),
    flash("📅 “" + v792.titulo + "” → " + fmtShort(v792.inicio) + (v796 ? " – " + fmtShort(v792.fin) : "")));
}
function copyCardLink(v797) {
  if (!v797) return;
  const v798 = location.origin + location.pathname + "#card=" + encodeURIComponent(v797.id),
    v799 = () => flash("🔗 Enlace copiado"),
    v800 = (v801) => {
      try {
        const v802 = document.createElement("textarea");
        ((v802.value = v801),
          (v802.style.cssText = "position:fixed;opacity:0"),
          document.body.appendChild(v802),
          v802.select(),
          document.execCommand("copy"),
          v802.remove(),
          v799());
      } catch (v803) {
        flash("No pude copiar — copialo de la barra del navegador", true);
      }
    };
  if (navigator.clipboard && navigator.clipboard.writeText)
    navigator.clipboard
      .writeText(v798)
      .then(v799)
      ["catch"](() => v800(v798));
  else v800(v798);
}
function pushRecent(v804) {
  if (!v804) return;
  state.recent = [v804, ...(state.recent || []).filter((v805) => v805 !== v804)].slice(0, 8);
}
(document.addEventListener("click", (v806) => {
  const v807 = $("#userMenu");
  if (!v807 || v807.classList.contains("hidden")) return;
  if (
    !v806.target.closest('[data-action="menu:toggle"]') &&
    (!v806.target.closest("#userMenu") || v806.target.closest(".menu-item"))
  )
    v807.classList.add("hidden");
}),
  document.addEventListener("keydown", (v808) => {
    if ((v808.metaKey || v808.ctrlKey) && (v808.key === "k" || v808.key === "K")) {
      (v808.preventDefault(), openPalette());
      return;
    }
    if ($("#cmdkInput")) {
      if (v808.key === "ArrowDown") {
        (v808.preventDefault(), paletteMove(1));
        return;
      }
      if (v808.key === "ArrowUp") {
        (v808.preventDefault(), paletteMove(-1));
        return;
      }
      if (v808.key === "Enter") {
        const v809 = document.querySelector(".cmdk-item.sel") || document.querySelector(".cmdk-item");
        v809 && (v808.preventDefault(), v809.click());
        return;
      }
    }
    if (v808.key === "Escape") {
      const v810 = $("#userMenu");
      if (v810 && !v810.classList.contains("hidden")) {
        v810.classList.add("hidden");
        return;
      }
      if (!$("#modal").classList.contains("hidden")) closeModal();
      else {
        if ($("#panel").classList.contains("open")) closePanel();
      }
    }
    if (v808.key === "Enter" && (v808.target.id === "gateInput" || v808.target.id === "gatePassInput")) {
      (v808.preventDefault(), gateTry($("#gateInput").value));
      return;
    }
    if (v808.key === "Enter" && v808.target.dataset && v808.target.dataset.quickadd) {
      v808.preventDefault();
      const v811 = v808.target.dataset.quickadd,
        v812 = (v808.target.value || "").trim();
      if (v812) {
        const v813 = newCard("libre", v812);
        ((v813.estado = v811), logAct(v813, "creada"), state.cards.push(v813), touch(), render());
        const v814 = document.querySelector('[data-quickadd="' + v811 + '"]');
        if (v814) v814.focus();
      }
    }
  }));
function calShift(v815) {
  const v816 = state.calCursor;
  ((state.calCursor =
    state.calMode === "mes"
      ? new Date(v816.getFullYear(), v816.getMonth() + v815, 1)
      : addDays(v816, 7 * v815)),
    render());
}
function doCreate() {
  const v817 = ($("#nuevoTitulo").value || "").trim() || "Sin título",
    v818 = newCard(state.draftTipo, v817);
  (logAct(v818, "creada"), state.cards.push(v818), touch(), closeModal());
  if (state.view === "resumen" || state.view === "mapa") state.view = "kanban";
  (render(), openDetail(v818.id));
}
function doIngest() {
  const v819 = $("#ingestReplace") && $("#ingestReplace").checked;
  let v820;
  try {
    let v821 = $("#ingestText")
      .value.trim()
      .replace(/^const\s+CURSOS\s*=\s*/, "")
      .replace(/;?\s*$/, "");
    v820 = JSON.parse(v821);
  } catch (v822) {
    flash("⚠ JSON inválido: " + v822.message, true);
    return;
  }
  if (!Array.isArray(v820)) {
    flash("⚠ Esperaba un array", true);
    return;
  }
  const v823 = ingestCatalogo(v820, {
    replace: v819,
  });
  (touch(),
    closeModal(),
    (state.view = "cursos"),
    render(),
    flash("◎ " + v823 + " curso(s) ingresados como activos"));
}
function doSaveTpl() {
  const v824 = current(),
    v825 = ($("#tplName").value || "").trim();
  if (!v825) {
    flash("Poné un nombre", true);
    return;
  }
  const v826 = "tpl-" + v825.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  ((state.customTpl[v826] = {
    nombre: v825,
    fases: (v824.fases || []).map((v827) => v827.nombre),
    checklist: (v824.checklist || []).map((v828) => v828.text),
  }),
    touch(),
    closeModal(),
    flash("🧩 Plantilla “" + v825 + "” guardada"));
}
function doDup() {
  const v829 = current();
  if (!v829) return;
  const v830 = JSON.parse(JSON.stringify(v829));
  ((v830.id = uid()),
    (v830.titulo = v829.titulo + " (copia)"),
    (v830.publicado = false),
    v830.checklist.forEach((v831) => (v831.id = uid())),
    (v830.fases || []).forEach((v832) => (v832.id = uid())),
    state.cards.push(v830),
    touch(),
    openDetail(v830.id),
    render());
}
function doDelete() {
  const v833 = current();
  if (!v833) return;
  if (!confirm("¿Eliminar “" + v833.titulo + "”?")) return;
  ((state.cards = state.cards.filter((v834) => v834.id !== v833.id)), touch(), closePanel());
}
const ICON_SUN =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  ICON_MOON =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
function toggleTheme() {
  const v835 = document.documentElement;
  v835.dataset.theme = v835.dataset.theme === "dark" ? "light" : "dark";
  const v836 = $("#themeBtn");
  if (v836) v836.innerHTML = v835.dataset.theme === "dark" ? ICON_SUN : ICON_MOON;
}
function showBanner() {
  const v837 = Store.mode();
  let v838;
  if (v837 === "supabase")
    v838 =
      '<div class="note" style="background:#E7F6EF;border-color:#A8D8C0;color:#1c6b4a">🟢 <b>Equipo conectado (Supabase)</b> — lo que carga cada uno lo ven todos en vivo.</div>';
  else {
    if (v837 === "error")
      v838 =
        '<div class="note warn">🔴 <b>Sin conexión al backend.</b> Revisá las claves en <code>BACKEND</code> y recargá. No se guardan cambios para no pisar datos del equipo.</div>';
    else {
      if (v837 === "memoria")
        v838 =
          '<div class="note warn">⚠ <b>Modo demo (memoria):</b> no hay backend compartido acá; los cambios no se comparten ni persisten al recargar.</div>';
      else
        v838 = '<div class="note">🔗 Persistencia compartida activa — lo que cargás lo ve el equipo.</div>';
    }
  }
  $("#banner").innerHTML = v838;
}
let flashT = null;
function flash(v839, v840) {
  clearTimeout(flashT);
  let v841 = $("#flash");
  (!v841 &&
    ((v841 = document.createElement("div")),
    (v841.id = "flash"),
    (v841.style.cssText =
      "position:fixed;bottom:22px;left:50%;transform:translateX(-50%);z-index:90;padding:11px 20px;border-radius:999px;font-size:13px;font-weight:600;box-shadow:var(--shadow-lg)"),
    document.body.appendChild(v841)),
    (v841.style.background = v840 ? "var(--bad)" : "var(--coto-navy)"),
    (v841.style.color = "#fff"),
    (v841.textContent = v839),
    (v841.style.opacity = "1"),
    (flashT = setTimeout(() => (v841.style.opacity = "0"), 2600)));
}
function renderGateTeam() {
  $("#gateTeam").innerHTML = TEAM.map(
    (v842) =>
      '<div class="gate-person" data-action="gate:person" data-nombre="' +
      esc(v842.nombre) +
      '">' +
      avatarHTML(v842.id) +
      '<div><div class="nm">' +
      esc(v842.nombre) +
      "</div></div></div>",
  ).join("");
}
function enterAs(v843) {
  if (!v843) {
    flash("Decinos quién sos 🙂", true);
    return;
  }
  ((state.user = v843), $("#gate").classList.add("hidden"));
  const v844 = TEAM.find((v845) => v845.nombre.toLowerCase() === v843.toLowerCase());
  ((state.userId = v844 ? v844.id : null),
    (state.agendaEdit = state.userId || ""),
    ($("#userChip").innerHTML =
      (v844
        ? avatarHTML(v844.id)
        : '<span class="avatar" style="background:var(--coto-blue)">' +
          v843.slice(0, 1).toUpperCase() +
          "</span>") +
      "<span>" +
      esc(v843) +
      '</span><span style="opacity:.45;font-size:11px">▾</span>'));
  try {
    const v846 = (location.hash || "").match(/card=([^&]+)/);
    if (v846) {
      const v847 = decodeURIComponent(v846[1]);
      if (state.cards.some((v848) => v848.id === v847)) setTimeout(() => openDetail(v847), 60);
    }
  } catch (v849) {}
}
function updateGatePass() {
  const v850 = $("#gatePassInput");
  if (v850) v850.classList.toggle("hidden", !state.appPassHash);
}
function gateTry(v851) {
  v851 = (v851 || "").trim();
  if (!v851) {
    flash("Decinos quién sos 🙂", true);
    return;
  }
  if (state.appPassHash) {
    const v852 = $("#gatePassInput"),
      v853 = v852 ? v852.value : "";
    if (hashStr(v853) !== state.appPassHash) {
      flash("Clave incorrecta 🔒", true);
      v852 && ((v852.value = ""), v852.focus());
      return;
    }
    if (v852) v852.value = "";
  }
  enterAs(v851);
}
function relTime(v854) {
  if (!v854) return "";
  const v855 = Math.floor((Date.now() - v854) / 1000);
  if (v855 < 60) return "recién";
  if (v855 < 3600) return "hace " + Math.floor(v855 / 60) + " min";
  if (v855 < 86400) return "hace " + Math.floor(v855 / 3600) + " h";
  const v856 = Math.floor(v855 / 86400);
  if (v856 === 1) return "ayer";
  if (v856 < 7) return "hace " + v856 + " días";
  return new Date(v854).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}
function logAct(v857, v858) {
  if (!v857) return;
  ((v857.actividad = v857.actividad || []),
    v857.actividad.push({
      ts: Date.now(),
      autor: state.user || "sistema",
      texto: v858,
    }));
  if (v857.actividad.length > 60) v857.actividad = v857.actividad.slice(-60);
}
function addComment() {
  const v859 = current();
  if (!v859) return;
  const v860 = $("#cmtInput"),
    v861 = ((v860 && v860.value) || "").trim();
  if (!v861) return;
  ((v859.comentarios = v859.comentarios || []),
    v859.comentarios.push({
      id: uid(),
      autor: state.user || "—",
      texto: v861,
      ts: Date.now(),
    }),
    logAct(v859, "comentó"),
    touch(),
    renderPanel());
}
function shiftISO(v862, v863) {
  if (!v862) return v862;
  const v864 = parseISO(v862);
  if (v863 === "semanal") v864.setDate(v864.getDate() + 7);
  else {
    if (v863 === "mensual") v864.setMonth(v864.getMonth() + 1);
    else {
      if (v863 === "trimestral") v864.setMonth(v864.getMonth() + 3);
    }
  }
  return isoOf(v864);
}
function recurrar(v865) {
  const v866 = JSON.parse(JSON.stringify(v865));
  return (
    (v866.id = uid()),
    (v866.estado = "pendiente"),
    (v866.publicado = false),
    (v866.enActualizacion = false),
    (v866.comentarios = []),
    (v866.actividad = []),
    (v866.inicio = shiftISO(v865.inicio, v865.recurrencia)),
    (v866.fin = shiftISO(v865.fin, v865.recurrencia)),
    (v866.checklist || []).forEach((v867) => {
      ((v867.id = uid()), (v867.done = false));
    }),
    (v866.fases || []).forEach((v868) => {
      ((v868.id = uid()),
        (v868.inicio = shiftISO(v868.inicio, v865.recurrencia)),
        (v868.fin = shiftISO(v868.fin, v865.recurrencia)),
        (v868.tareas || []).forEach((v869) => {
          ((v869.id = uid()), (v869.done = false), (v869.fecha = shiftISO(v869.fecha, v865.recurrencia)));
        }));
    }),
    logAct(v866, "instancia recurrente generada"),
    logAct(v865, "generó próxima instancia"),
    state.cards.push(v866),
    touch(),
    v866
  );
}
function openSearch() {
  (openModal(
    '<div class="search-modal"><div class="search-top">🔎<input id="searchInput" placeholder="Buscar tarjetas, cursos, apps, sectores..." autocomplete="off"><span class="kbd">esc</span></div><div class="search-results" id="searchResults"></div></div>',
  ),
    setTimeout(() => {
      const v870 = $("#searchInput");
      v870 && (v870.focus(), renderSearchResults(""));
    }, 40));
}
function renderSearchResults(v871) {
  const v872 = $("#searchResults");
  if (!v872) return;
  v871 = (v871 || "").trim().toLowerCase();
  let v873 = state.cards.slice();
  if (v871)
    v873 = v873.filter(
      (v874) =>
        v874.titulo.toLowerCase().includes(v871) ||
        (v874.sectores || []).some((v875) => (sectorName(v875) || v875).toLowerCase().includes(v871)) ||
        ((allTipos()[v874.tipo] || {}).nombre || "").toLowerCase().includes(v871) ||
        (v874.catalogo && (v874.catalogo.bajada || "").toLowerCase().includes(v871)),
    );
  v873 = v873.slice(0, 14);
  if (!v873.length) {
    v872.innerHTML = '<div style="padding:18px;text-align:center;color:var(--ink-soft)">Sin resultados</div>';
    return;
  }
  v872.innerHTML = v873
    .map((v876, v877) => {
      const v878 = inInventory(v876) ? "Mapa" : "Tablero",
        v879 = allTipos()[v876.tipo] || {};
      return (
        '<div class="sr-item ' +
        (v877 === 0 ? "sel" : "") +
        '" data-cat="' +
        primaryCat(v876) +
        '" data-action="sr:open" data-id="' +
        v876.id +
        '">\n      <span>' +
        (v879.icon || "•") +
        '</span><div style="flex:1;overflow:hidden"><div class="sr-t">' +
        esc(v876.titulo) +
        '</div>\n      <div class="sr-m">' +
        esc(v879.nombre || v876.tipo) +
        " · " +
        ((v876.sectores || []).map((v880) => sectorName(v880) || v880).join(", ") || "TBD") +
        '</div></div>\n      <span class="sr-where">' +
        v878 +
        "</span></div>"
      );
    })
    .join("");
}
function paletteCommands() {
  const v881 = (v882, v883, v884) => ({
    t: v882,
    d: "Saltar a la sección",
    ic: "→",
    act: "view",
    arg: v883,
    kw: v884,
  });
  return [
    v881("Inicio", "inicio", "home panel principal"),
    v881("Resumen", "resumen", "dashboard kpi indicadores carga"),
    v881("Planner", "kanban", "planner tablero kanban tareas estados"),
    v881("Calendario", "calendario", "fechas mes semana"),
    v881("Timeline", "timeline", "gantt cronograma"),
    v881("Agenda del equipo", "agenda", "home vacaciones equipo"),
    v881("Mapa del área", "mapa", "cursos edu points apps bases inventario"),
    {
      t: "Nueva tarjeta",
      d: "Crear una tarjeta",
      ic: "＋",
      act: "do",
      arg: "nuevo:open",
      kw: "nueva crear add tarjeta",
    },
    {
      t: "Mi semana",
      d: "Tu foco: lo tuyo por vencer",
      ic: "📅",
      act: "do",
      arg: "misemana:open",
      kw: "mi semana foco personal vencimientos",
    },
    {
      t: "Imprimir / PDF",
      d: "Imprimir la vista actual",
      ic: "🖨️",
      act: "do",
      arg: "app:print",
      kw: "imprimir pdf reporte exportar",
    },
    {
      t: "Mis tareas",
      d: "Filtrar lo asignado a mí",
      ic: "★",
      act: "do",
      arg: "mis:toggle",
      kw: "mis filtro asignado",
    },
    {
      t: "Carga del equipo",
      d: "Quién está al palo",
      ic: "👥",
      act: "do",
      arg: "carga:open",
      kw: "carga equipo reparto",
    },
    {
      t: "Alertas",
      d: "Vencimientos y avisos",
      ic: "🔔",
      act: "do",
      arg: "notif:open",
      kw: "alertas vencidas avisos",
    },
    {
      t: "Ajustes y datos",
      d: "Sectores, equipo, backup",
      ic: "⚙",
      act: "do",
      arg: "settings:open",
      kw: "ajustes config sectores backup",
    },
    {
      t: "Cambiar tema",
      d: "Claro / oscuro",
      ic: "◐",
      act: "do",
      arg: "theme:toggle",
      kw: "tema oscuro claro dark light",
    },
  ];
}
function openPalette() {
  if (!$("#app") || $("#app").classList.contains("hidden")) return;
  (openModal(
    '<div class="cmdk">\n    <div class="cmdk-top"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.1-4.1"/></svg><input id="cmdkInput" placeholder="Buscar tarjetas o saltar a una sección…" autocomplete="off"><span class="kbd">esc</span></div>\n    <div class="cmdk-list" id="cmdkList"></div>\n    <div class="cmdk-foot"><span><span class="kbd">↑</span><span class="kbd">↓</span> moverse</span><span><span class="kbd">↵</span> abrir</span><span><span class="kbd">⌘K</span> abrir comando</span></div>\n  </div>',
  ),
    renderPalette(""),
    setTimeout(() => {
      const v885 = $("#cmdkInput");
      if (v885) v885.focus();
    }, 40));
}
function paletteCardItem(v886) {
  return (
    '<button class="cmdk-item" data-action="palette:run" data-prun="card" data-id="' +
    v886.id +
    '" data-cat="' +
    primaryCat(v886) +
    '"><span class="cmdk-ic ic-cat">' +
    ((allTipos()[v886.tipo] || {}).icon || "•") +
    '</span><span class="cmdk-tx"><b>' +
    esc(v886.titulo) +
    "</b><i>" +
    esc((allTipos()[v886.tipo] || {}).nombre || v886.tipo) +
    '</i></span><span class="cmdk-go">↵</span></button>'
  );
}
function renderPalette(v887) {
  const v888 = $("#cmdkList");
  if (!v888) return;
  v887 = (v887 || "").trim().toLowerCase();
  const v889 = paletteCommands().filter(
      (v890) => !v887 || (v890.t + " " + v890.kw).toLowerCase().includes(v887),
    ),
    v891 = v887
      ? state.cards
          .filter(
            (v892) =>
              v892.titulo.toLowerCase().includes(v887) ||
              (v892.sectores || []).some((v893) => (sectorName(v893) || v893).toLowerCase().includes(v887)),
          )
          .slice(0, 6)
      : [],
    v894 = v887
      ? []
      : (state.recent || [])
          .map((v895) => state.cards.find((v896) => v896.id === v895))
          .filter(Boolean)
          .slice(0, 5);
  let v897 = "";
  v894.length && (v897 += '<div class="cmdk-group">Recientes</div>' + v894.map(paletteCardItem).join(""));
  v889.length &&
    (v897 +=
      '<div class="cmdk-group">Ir a · Acciones</div>' +
      v889
        .map(
          (v898) =>
            '<button class="cmdk-item" data-action="palette:run" data-prun="' +
            v898.act +
            '" data-arg="' +
            esc(v898.arg) +
            '"><span class="cmdk-ic">' +
            v898.ic +
            '</span><span class="cmdk-tx"><b>' +
            esc(v898.t) +
            "</b><i>" +
            esc(v898.d) +
            '</i></span><span class="cmdk-go">↵</span></button>',
        )
        .join(""));
  v891.length && (v897 += '<div class="cmdk-group">Tarjetas</div>' + v891.map(paletteCardItem).join(""));
  if (!v897) v897 = '<div class="cmdk-empty">Sin resultados para “' + esc(v887) + "”</div>";
  v888.innerHTML = v897;
  const v899 = v888.querySelector(".cmdk-item");
  if (v899) v899.classList.add("sel");
}
function paletteMove(v900) {
  const v901 = [...document.querySelectorAll(".cmdk-item")];
  if (!v901.length) return;
  let v902 = v901.findIndex((v903) => v903.classList.contains("sel"));
  (v901.forEach((v904) => v904.classList.remove("sel")),
    (v902 = v900 > 0 ? (v902 + 1) % v901.length : (v902 - 1 + v901.length) % v901.length),
    v901[v902].classList.add("sel"),
    v901[v902].scrollIntoView({
      block: "nearest",
    }));
}
function confettiBurst(v905, v906) {
  try {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    if (!document.body) return;
    const v907 = ["#006EA0", "#26B3E8", "#2E9E8F", "#E2A03F", "#8232C8", "#D8553F", "#1EAADC"];
    for (let v908 = 0; v908 < 20; v908++) {
      const v909 = document.createElement("i");
      v909.className = "confetti";
      const v910 = Math.random() * Math.PI * 2,
        v911 = 46 + Math.random() * 78;
      ((v909.style.cssText =
        "left:" +
        v905 +
        "px;top:" +
        v906 +
        "px;background:" +
        v907[v908 % v907.length] +
        ";--dx:" +
        ((Math.cos(v910) * v911) | 0) +
        "px;--dy:" +
        ((Math.sin(v910) * v911 + 70) | 0) +
        "px;--r:" +
        ((Math.random() * 420) | 0) +
        "deg;animation-delay:" +
        ((Math.random() * 80) | 0) +
        "ms"),
        document.body.appendChild(v909),
        setTimeout(() => v909.remove(), 1000));
    }
  } catch (v912) {}
}
function computeAlerts() {
  const v913 = todayISO(),
    v914 = isoOf(addDays(new Date(), 3)),
    v915 = [];
  (boardCards().forEach((v916) => {
    const v917 = v916.fin || v916.inicio;
    if (!v917) return;
    if (v917 < v913)
      v915.push({
        c: v916,
        kind: "bad",
        ic: "⚑",
        label: "Vencida",
        sub: "venció " + fmtShort(v917),
      });
    else {
      if (v917 <= v914)
        v915.push({
          c: v916,
          kind: "warn",
          ic: "⏳",
          label: "Vence pronto",
          sub: "para " + fmtShort(v917),
        });
    }
  }),
    state.cards.forEach((v918) => {
      if (v918.recurrencia && v918.recurrencia !== "none" && !isInventory(v918)) {
        const v919 = v918.fin || v918.inicio;
        if (v919 && v919 <= v913)
          v915.push({
            c: v918,
            kind: "rec",
            ic: "↻",
            label: "Recurrente",
            sub: "corresponde nueva instancia",
          });
      }
    }));
  const v920 = {};
  return v915.filter((v921) => {
    if (v920[v921.c.id]) return false;
    return ((v920[v921.c.id] = 1), true);
  });
}
function updateBell() {
  const v922 = $("#notifBadge");
  if (!v922 || !v922.classList) return;
  const v923 = computeAlerts().length;
  if (v923) ((v922.textContent = v923), v922.classList.remove("hidden"));
  else v922.classList.add("hidden");
}
function openNotif() {
  const v924 = computeAlerts();
  state.selectedId = null;
  const v925 = v924.length
    ? v924
        .map(
          (v926) =>
            '<div class="notif-item" data-action="card:open" data-id="' +
            v926.c.id +
            '"><div class="notif-ic ' +
            v926.kind +
            '">' +
            v926.ic +
            '</div><div style="flex:1"><div class="notif-t">' +
            esc(v926.c.titulo) +
            '</div><div class="notif-s">' +
            v926.label +
            " · " +
            v926.sub +
            "</div></div></div>",
        )
        .join("")
    : '<div class="empty"><div class="big">✅</div><div style="font-weight:700;color:var(--ink)">Todo al día</div><div style="margin-top:4px">Sin vencidas ni alertas.</div></div>';
  (($("#panel").innerHTML =
    '<div class="panel-head"><div style="flex:1"><div class="tipo-pill">🔔 Alertas</div><div style="font-family:var(--titulo);font-size:18px;font-weight:700;margin-top:4px">' +
    v924.length +
    " pendiente" +
    (v924.length !== 1 ? "s" : "") +
    '</div></div><button class="btn btn-icon btn-ghost" data-action="panel:close">✕</button></div><div class="panel-body">' +
    v925 +
    "</div>"),
    $("#panel").classList.add("open"),
    $("#overlay").classList.remove("hidden"));
}
function openSettings() {
  const v927 = Object.keys(SECTORES)
      .map(
        (v928) =>
          '<div class="set-row"><input type="color" data-set="sec:' +
          v928 +
          ':cat" value="' +
          SECTORES[v928].cat +
          '"><input type="text" data-set="sec:' +
          v928 +
          ':nombre" value="' +
          esc(SECTORES[v928].nombre) +
          '"><span style="font-size:11px;color:var(--ink-soft);min-width:118px">' +
          esc(v928) +
          "</span></div>",
      )
      .join(""),
    v929 = TEAM.map(
      (v930) =>
        '<div class="set-row" style="flex-wrap:wrap">' +
        avatarHTML(v930.id, true) +
        '<input type="text" data-set="team:' +
        v930.id +
        ':nombre" value="' +
        esc(v930.nombre) +
        '" placeholder="Nombre"><input type="color" data-set="team:' +
        v930.id +
        ':color" value="' +
        v930.color +
        '"><input type="email" data-set="team:' +
        v930.id +
        ':email" value="' +
        esc(v930.email || "") +
        '" placeholder="📧 email para alertas" style="flex:1 1 100%;min-width:0"></div>',
    ).join(""),
    v931 = Object.keys(state.customTpl).length
      ? Object.keys(state.customTpl)
          .map(
            (v932) =>
              '<div class="tpl-row">🧩 ' +
              esc(state.customTpl[v932].nombre) +
              ' <span class="chk-del" data-action="tpl:del" data-tpl="' +
              v932 +
              '">✕</span></div>',
          )
          .join("")
      : '<div style="font-size:12.5px;color:var(--ink-soft)">Sin plantillas propias todavía.</div>';
  openModal(
    '<h2>Ajustes</h2><div class="sub-t">Configurá el área. Los cambios se comparten con el equipo.</div>\n    <div class="set-sec"><h3>🎨 Sectores (data-cat) <span style="margin-left:auto;font-size:12px;color:var(--ink-soft)">' +
      Object.keys(SECTORES).length +
      '</span></h3>\n      <div class="set-grid">' +
      v927 +
      '</div>\n      <div class="set-row" style="margin-top:10px"><input type="color" id="newSecCat" value="#3FA7D6"><input type="text" id="newSecNombre" placeholder="Nuevo sector (nombre)"><button class="btn btn-sm" data-action="set:add-sector">+ Agregar</button></div></div>\n    <div class="set-sec"><h3>👥 Equipo</h3>' +
      v929 +
      '\n      <div class="set-row" style="margin-top:10px"><input type="text" id="newMemNombre" placeholder="Nombre"><input type="text" id="newMemRol" placeholder="Rol"><input type="color" id="newMemColor" value="#006EA0"><button class="btn btn-sm" data-action="set:add-member">+ Agregar</button></div></div>\n    <div class="set-sec"><h3>🔐 Ingreso del equipo</h3>\n      <div style="font-size:12.5px;color:var(--ink-soft);margin-bottom:8px">Clave grupal para entrar. ' +
      (state.appPassHash ? '<b style="color:var(--ok)">Clave activa ✓</b>' : "Sin clave — ingreso abierto.") +
      '</div>\n      <div class="set-row"><input type="password" id="setPass" placeholder="' +
      (state.appPassHash ? "Nueva clave…" : "Definir clave grupal…") +
      '"><button class="btn btn-sm" data-action="set:pass">Guardar</button>' +
      (state.appPassHash
        ? '<button class="btn btn-sm" data-action="set:pass-clear" style="color:var(--bad)">Quitar</button>'
        : "") +
      '</div>\n      <div style="font-size:11px;color:var(--ink-soft);margin-top:5px">Barrera para que no entre cualquiera con el link. No es seguridad fuerte (para eso haría falta login real).</div></div>\n    <div class="set-sec"><h3>🧩 Plantillas propias</h3>' +
      v931 +
      '</div>\n    <div class="set-sec"><h3>💾 Datos</h3><div class="set-data">\n      <button class="btn" data-action="ingest:open">⤓ Ingestar catálogo</button>\n      <button class="btn" data-action="data:export">⬇ Exportar JSON</button>\n      <button class="btn" data-action="data:import">⬆ Importar JSON</button>\n      <button class="btn" data-action="data:csv">📄 Exportar CSV</button>\n      <button class="btn" data-action="data:reset" style="color:var(--bad);border-color:color-mix(in srgb,var(--bad) 40%,var(--line))">🧹 Reiniciar (Planner vacío + catálogo)</button>\n    </div></div>\n    <div class="modal-foot"><button class="btn btn-primary" data-action="modal:close">Listo</button></div>',
  );
}
function applySetting(v933, v934) {
  const v935 = v933.split(":");
  if (v935[0] === "sec") {
    const v936 = v935[1];
    SECTORES[v936] && ((SECTORES[v936][v935[2]] = v934), injectSectorStyles(), persist(), render());
  } else {
    if (v935[0] === "team") {
      const v937 = member(v935[1]);
      v937 && ((v937[v935[2]] = v934), persist(), render());
    }
  }
}
function addSector() {
  const v938 = ($("#newSecNombre").value || "").trim(),
    v939 = $("#newSecCat").value || "#3FA7D6";
  if (!v938) {
    flash("Poné un nombre de sector", true);
    return;
  }
  let v940 = v938
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!v940 || SECTORES[v940]) v940 = "sector-" + Date.now();
  ((SECTORES[v940] = {
    nombre: v938,
    cat: v939,
  }),
    injectSectorStyles(),
    persist(),
    openSettings(),
    render(),
    flash("🎨 Sector agregado"));
}
function addMember() {
  const v941 = ($("#newMemNombre").value || "").trim();
  if (!v941) {
    flash("Poné un nombre", true);
    return;
  }
  const v942 = ($("#newMemRol").value || "").trim() || "Equipo",
    v943 = $("#newMemColor").value || "#006EA0",
    v944 =
      "m-" + v941.toLowerCase().replace(/[^a-z0-9]+/g, "") + "-" + Math.random().toString(36).slice(2, 5);
  (TEAM.push({
    id: v944,
    nombre: v941,
    rol: v942,
    color: v943,
  }),
    persist(),
    openSettings(),
    render(),
    flash("👤 Miembro agregado"));
}
function delTpl(v945) {
  (delete state.customTpl[v945], persist(), openSettings());
}
function download(v946, v947, v948) {
  try {
    const v949 = new Blob([v947], {
        type: v948 || "application/json",
      }),
      v950 = URL.createObjectURL(v949),
      v951 = document.createElement("a");
    ((v951.href = v950),
      (v951.download = v946),
      document.body.appendChild(v951),
      v951.click(),
      setTimeout(() => {
        (document.body.removeChild(v951), URL.revokeObjectURL(v950));
      }, 100));
  } catch (v952) {
    flash("No se pudo descargar en este entorno", true);
  }
}
function exportJSON() {
  (download(
    "cotonetes-forever-coto.json",
    JSON.stringify(
      {
        version: 1,
        exportado: new Date().toISOString(),
        cards: state.cards,
        templates: state.customTpl,
        sectores: SECTORES,
        team: TEAM,
      },
      null,
      2,
    ),
  ),
    flash("⬇ Backup exportado"));
}
function exportCSV() {
  const v953 = [
    ["Titulo", "Tipo", "Estado", "Sectores", "Responsable", "Inicio", "Fin", "Prioridad", "Progreso"],
  ];
  (boardCards().forEach((v954) => {
    const v955 = progress(v954);
    v953.push([
      v954.titulo,
      (allTipos()[v954.tipo] || {}).nombre || v954.tipo,
      v954.estado,
      (v954.sectores || []).map((v956) => sectorName(v956) || v956).join(" / "),
      (member(v954.responsable) || {}).nombre || "",
      v954.inicio || "",
      v954.fin || "",
      v954.prioridad,
      v955.total ? v955.done + "/" + v955.total : "",
    ]);
  }),
    download(
      "tablero-coto.csv",
      "﻿" +
        v953
          .map((v957) => v957.map((v958) => '"' + String(v958).replace(/"/g, '""') + '"').join(","))
          .join("\n"),
      "text/csv",
    ),
    flash("📄 CSV exportado"));
}
function doImport() {
  openModal(
    '<h2>Importar JSON</h2><div class="sub-t">Pegá un backup exportado. <b>Reemplaza</b> los datos actuales.</div>\n  <div class="fld"><label>Backup JSON</label><textarea id="importText" style="min-height:160px;font-family:monospace;font-size:12px"></textarea></div>\n  <div class="modal-foot"><button class="btn" data-action="modal:close">Cancelar</button><button class="btn btn-primary" data-action="data:import-run">Importar y reemplazar</button></div>',
  );
}
function runImport() {
  let v959;
  try {
    v959 = JSON.parse($("#importText").value);
  } catch (v960) {
    flash("JSON inválido", true);
    return;
  }
  if (!v959 || !Array.isArray(v959.cards)) {
    flash('Backup sin "cards"', true);
    return;
  }
  if (!confirm("Esto reemplaza todos los datos actuales. ¿Seguir?")) return;
  ((state.cards = v959.cards), (state.customTpl = v959.templates || {}));
  if (v959.sectores) Object.assign(SECTORES, v959.sectores);
  (Array.isArray(v959.team) &&
    v959.team.length &&
    ((TEAM.length = 0), v959.team.forEach((v961) => TEAM.push(v961))),
    injectSectorStyles(),
    touch(),
    closeModal(),
    render(),
    flash("⬆ Datos importados"));
}
function resetSeed() {
  if (
    !confirm(
      "Esto VACÍA el Planner (tablero/calendario/timeline) y (re)carga el catálogo de cursos en el Mapa — también en el backend compartido. La agenda y los Edu Points se conservan. Conviene exportar un backup antes. ¿Seguir?",
    )
  )
    return;
  ((state.cards = seedCards()),
    ingestCatalogo(CURSOS, {}),
    (state.selectedId = null),
    (state.sel = []),
    touch(),
    closeModal(),
    (state.view = "mapa"),
    (state.mapaSec = "cursos"),
    render(),
    flash("🧹 Planner vacío · catálogo cargado en el Mapa"));
}
document.addEventListener("keydown", (v962) => {
  const v963 = (v962.target.tagName || "").toLowerCase();
  if (v963 === "input" || v963 === "textarea" || v963 === "select" || v962.target.isContentEditable) return;
  if (v962.metaKey || v962.ctrlKey || v962.altKey) return;
  if (v962.key === "/") (v962.preventDefault(), openPalette());
  else {
    if (v962.key.toLowerCase() === "n") openNuevo();
    else {
      if (v962.key >= "1" && v962.key <= "7") {
        const v964 = ["inicio", "resumen", "kanban", "calendario", "timeline", "agenda", "mapa"][
          +v962.key - 1
        ];
        v964 && ((state.view = v964), render());
      }
    }
  }
});
function injectSectorStyles() {
  let v965 = "";
  for (const v966 in SECTORES) {
    if (OFFICIAL_CATS.has(v966)) continue;
    const v967 = SECTORES[v966].cat;
    v965 +=
      '[data-cat="' +
      v966 +
      '"]{--cat:' +
      v967 +
      ";--cat-strong:color-mix(in srgb," +
      v967 +
      " 70%,#1E2D46);--cat-soft:color-mix(in srgb," +
      v967 +
      " 55%,#fff);--cat-grad:linear-gradient(135deg," +
      v967 +
      ",color-mix(in srgb," +
      v967 +
      " 68%,#000));--on-cat:#fff;}";
  }
  let v968 = document.getElementById("sectorStyles");
  (!v968 &&
    ((v968 = document.createElement("style")), (v968.id = "sectorStyles"), document.head.appendChild(v968)),
    (v968.textContent = v965));
}
async function boot() {
  ((state.savedViews = loadViews()),
    injectSectorStyles(),
    renderGateTeam(),
    document.querySelectorAll(".logo-slot").forEach((v969) => (v969.innerHTML = logoLockup())));
  {
    const v970 = $("#footYear");
    if (v970) v970.textContent = new Date().getFullYear();
  }
  $("#app").classList.remove("hidden");
  try {
    const v971 = await Store.load();
    if (v971 && Array.isArray(v971.cards)) {
      ((state.cards = v971.cards), (state.customTpl = v971.templates || {}));
      if (v971.sectores) Object.assign(SECTORES, v971.sectores);
      Array.isArray(v971.team) &&
        v971.team.length &&
        ((TEAM.length = 0), v971.team.forEach((v972) => TEAM.push(v972)));
      if (typeof v971.appPassHash === "string") state.appPassHash = v971.appPassHash;
      if (v971.agenda && typeof v971.agenda === "object") state.agenda = v971.agenda;
      (ensureTeam(), injectSectorStyles(), renderGateTeam());
      if (invCount("curso") === 0 && CURSOS.length) {
        const v973 = ingestCatalogo(CURSOS, {});
        if (v973 > 0)
          try {
            await Store.save({
              cards: state.cards,
              templates: state.customTpl,
              sectores: SECTORES,
              team: TEAM,
              appPassHash: state.appPassHash,
              agenda: state.agenda,
            });
          } catch (v974) {}
      }
    } else
      ((state.cards = seedCards()),
        ingestCatalogo(CURSOS, {}),
        await Store.save({
          cards: state.cards,
          templates: state.customTpl,
          sectores: SECTORES,
          team: TEAM,
        }));
  } catch (v975) {
    console.error(v975);
    if (useSupabase()) state.connOk = false;
    ((state.cards = seedCards()),
      ingestCatalogo(CURSOS, {}),
      flash(
        useSupabase() ? "No se pudo conectar a Supabase — revisá las claves" : "Usando datos semilla",
        true,
      ));
  }
  (state.cards.forEach((v976) => {
    ((v976.ficha = v976.ficha || {
      url: "",
      owner: "",
      estadoOp: "operativo",
    }),
      (v976.comentarios = v976.comentarios || []),
      (v976.actividad = v976.actividad || []));
    if (!v976.recurrencia) v976.recurrencia = "none";
    if (!v976.catalogo)
      v976.catalogo = {
        categoria: "",
        bajada: "",
        anio: "",
        duracion: "",
        imagen: "",
        personas: "",
        descripcion: "",
      };
    v976.sectores = (v976.sectores || []).map((v977) => (SECTORES[v977] ? v977 : SLUG_MAP[v977] || v977));
  }),
    (state.ready = true),
    updateGatePass(),
    showBanner(),
    render());
  try {
    history.replaceState(navState(), "");
  } catch (v978) {}
  startPolling();
}
function startPolling() {
  if (!useSupabase()) return;
  setInterval(async () => {
    if (state.connOk === false) return;
    if ($("#panel").classList.contains("open")) return;
    if (!$("#modal").classList.contains("hidden")) return;
    try {
      const v979 = await Store.remote();
      if (!v979 || !Array.isArray(v979.cards)) return;
      const v980 =
        JSON.stringify(v979.cards) +
        JSON.stringify(v979.sectores || {}) +
        JSON.stringify(v979.team || []) +
        JSON.stringify(v979.agenda || {});
      if (v980 === state._remoteHash) return;
      ((state._remoteHash = v980), (state.cards = v979.cards));
      if (v979.templates) state.customTpl = v979.templates;
      if (v979.sectores) Object.assign(SECTORES, v979.sectores);
      Array.isArray(v979.team) &&
        v979.team.length &&
        ((TEAM.length = 0), v979.team.forEach((v981) => TEAM.push(v981)));
      if (v979.agenda && typeof v979.agenda === "object") state.agenda = v979.agenda;
      (injectSectorStyles(), render());
    } catch (v982) {}
  }, BACKEND.pollMs);
}
boot();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  let _swReloaded = false;
  (navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (_swReloaded) return;
    ((_swReloaded = true), location.reload());
  }),
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js")["catch"](() => {});
    }));
}
