"use strict";
const LOGO_COTO = "@@ASSET:assets/logo-coto.png@@",
  LOGO_APR = "@@ASSET:assets/logo-aprendizaje.png@@";
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
  const miembro = TEAM.find((miembro2) => miembro2.id === "dami");
  miembro && miembro.nombre === "Damián" && ((miembro.nombre = "Dami"), (miembro.rol = "Líder e-Learning"));
  if (!TEAM.find((miembro2) => miembro2.id === "vivi"))
    TEAM.unshift({
      id: "vivi",
      nombre: "Vivi",
      rol: "Jefa de Aprendizaje",
      color: "#00466E",
    });
  TEAM.forEach((miembro2) => {
    if (miembro2.email == null) miembro2.email = "";
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
    {
      id: "finalizado",
      nombre: "Finalizados",
      dot: "#2E9E8F",
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
    aprendizaje: {
      nombre: "Aprendizaje",
      cat: "#006EA0",
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
function toSector(categoria) {
  if (!categoria) return null;
  const txt = String(categoria).toLowerCase().trim();
  if (SECTORES[txt]) return txt;
  if (SLUG_MAP[txt]) return SLUG_MAP[txt];
  return txt;
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
        "Alta en Moodle",
      ],
    },
    "actualizacion-curso": {
      fases: ["Relevamiento de cambios", "Reescritura", "Rearmado", "Revisión", "Republicación"],
      checklist: ["Detectar desactualizaciones", "Actualizar guion", "Actualizar piezas", "Republicar en Moodle"],
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
      imagen: "@@ASSET:assets/cursos/0.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/1.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/2.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/3.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/4.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/5.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/6.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/7.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/8.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/9.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/10.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/11.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/12.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/13.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/14.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/15.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/16.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/17.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/18.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/19.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/20.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/21.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/22.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/23.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/24.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/25.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/26.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/27.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/28.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/29.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/30.jpg@@",
      personas: "Choferes de Flota Propia de Coto Digital.",
      descripcion:
        "Este curso recorre la jornada del chofer de Flota Propia, desde la asignación del móvil y los controles previos hasta la entrega de pedidos y el cierre del día. Se abordan las responsabilidades del rol, la documentación requerida, el checklist del vehículo, los controles de seguridad y los procedimientos ante imprevistos durante el recorrido.",
    },
    {
      categoria: "frescos-1",
      titulo: "Cortes de media res - Cuarto delantero",
      bajada: "Técnicas de desposte y presentación de cortes del cuarto delantero.",
      anio: 2024,
      duracion: "Curso largo",
      imagen: "@@ASSET:assets/cursos/31.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/32.jpg@@",
      personas: "Personal del sector Frescos.",
      descripcion:
        "Este curso desarrolla técnicas de corte, limpieza y presentación del cuarto trasero de la media res, trabajando piezas internas y externas. Se estudian cortes como cuadril, peceto, nalga, tortuguita, bola de lomo y osobuco, además de emprolijado, milanesas y uso correcto de cuchilla y sierra, cumpliendo normas de calidad y seguridad.",
    },
    {
      categoria: "frescos-1",
      titulo: "Frutas y verduras – Conceptos básicos",
      bajada: "Criterios esenciales para el cuidado, control de calidad y exhibición de frutas y verduras.",
      anio: 2017,
      duracion: "Curso largo",
      imagen: "@@ASSET:assets/cursos/33.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/34.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/35.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/36.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/37.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/38.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/39.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/40.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/41.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/42.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/43.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/44.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/45.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/46.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/47.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/48.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/49.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/50.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/51.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/52.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/53.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/54.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/55.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/56.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/57.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/58.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/59.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/60.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/61.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/62.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/63.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/64.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/65.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/66.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/67.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/68.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/69.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/70.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/71.jpg@@",
      personas: "Gerentes, Jefes de Operaciones, Jefes de Recepción, Fiscalizadores y Recepcionistas.",
      descripcion:
        "Este curso presenta los distintos puestos del sector Seguridad en la sucursal y sus responsabilidades operativas. Aborda funciones de control en recepción, salón, cajas, electro, bodega, playa y CCTV, incluyendo manejo de productos críticos, control de frío, alarmado, rondines y coordinación con otras áreas para prevenir incidentes y desvíos.",
    },
    {
      categoria: "seguridad",
      titulo: "Controles para modalidades de hurto",
      bajada: "Prevención, detección y control de hurtos en sucursal.",
      anio: 2024,
      duracion: "Curso largo",
      imagen: "@@ASSET:assets/cursos/72.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/73.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/74.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/75.jpg@@",
      personas: "Todo el personal de la compañía.",
      descripcion:
        "Este curso introduce los conceptos básicos de Seguridad e Higiene laboral en COTO. Aborda actos y condiciones inseguras, el uso correcto de los elementos de protección personal, señalizaciones, tipos de matafuegos y el rol de la ART, con el objetivo de concientizar sobre la prevención de riesgos y el cumplimiento de normas.",
    },
    {
      categoria: "servicio-medico",
      titulo: "Prevención cardiovascular",
      bajada: "Cómo reducir los riesgos de enfermedades cardiovasculares desde el cuidado diario",
      anio: 2023,
      duracion: "Curso medio",
      imagen: "@@ASSET:assets/cursos/76.jpg@@",
      personas: "Todo el personal.",
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
      imagen: "@@ASSET:assets/cursos/77.jpg@@",
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
      imagen: "@@ASSET:assets/cursos/78.jpg@@",
      personas: "Camareros de Zona Gourmet.",
      descripcion:
        "Este curso introduce a los camareros en la experiencia Zona Gourmet y los objetivos del rol. Aborda los preparativos de inicio y cierre de jornada y desarrolla los 16 pasos de la atención al cliente, desde la bienvenida y toma del pedido hasta el cobro, la despedida y la limpieza final de la mesa.",
    },
    {
      categoria: "frescos-1",
      titulo: "Armados de frutas y verduras",
      bajada: "Criterios esenciales para el cuidado, control de calidad y exhibición de frutas y verduras.",
      anio: 2017,
      duracion: "Curso largo",
      imagen: "@@ASSET:assets/cursos/79.jpg@@",
      personas: "Personal del sector Verdulería.",
      descripcion:
        "Este curso aborda los conceptos fundamentales del sector de frutas y verduras, como la clasificación de productos, la estacionalidad y los controles de calidad. Se trabajan criterios de almacenamiento, control de temperaturas y buenas prácticas de exhibición e higiene para prevenir mermas y asegurar productos frescos y seguros para el consumo.",
    },
    {
      categoria: "seguridad",
      titulo: "Seguridad - Recepción de proveedores",
      bajada: "Procedimiento estandarizado para una recepción de mercadería precisa y controlada.",
      anio: 2016,
      duracion: "Curso medio",
      imagen: "@@ASSET:assets/cursos/80.jpg@@",
      personas: "Gerentes, Jefes de Operaciones, Jefes de Recepción, Fiscalizadores y Recepcionistas.",
      descripcion:
        "Este curso explica el procedimiento completo para la recepción de mercadería de proveedores directos. Aborda las etapas de carga de orden de compra, descarga y control de mercadería, registro de embalajes, confirmación del pedido, gestión de devoluciones y salida del proveedor, asegurando una recepción ordenada, precisa y sin desvíos.",
    },
    {
      categoria: "sistemas",
      titulo: "Seguridad de la Información - Conceptos básicos",
      bajada: "Lineamientos esenciales para proteger la información y los sistemas de la compañía.",
      anio: 2024,
      duracion: "Curso largo",
      imagen: "@@ASSET:assets/cursos/81.jpg@@",
      personas: "Todo el personal de la compañía.",
      descripcion:
        "Este curso presenta los fundamentos de la Seguridad de la Información en COTO y el uso responsable de la información como activo estratégico. Aborda el Convenio de Confidencialidad, la clasificación de la información, la gestión de accesos y las responsabilidades de Sistemas y de los empleados para prevenir usos indebidos.",
    },
    {
      categoria: "zona-e",
      titulo: "Cumpleaños de Zona E!",
      bajada: "¡Todo lo que necesitás para ser un gran anfitrión en los Cumples de Zona E!",
      anio: 2024,
      duracion: "Curso medio",
      imagen: "@@ASSET:assets/cursos/82.jpg@@",
      personas: "Anfitriones de Zona E.",
      descripcion:
        "En este curso conocerás las propuestas de Zona Cumples y cómo comunicarlas de forma clara a los clientes. Se desarrollan las 5 etapas del cumple —venta, contratación, preparación, día del evento y post cumple— y las tareas clave en cada una, reforzando la importancia de una atención al cliente de calidad en todo el proceso.",
    },
  ],
  $ = (txt) => document.querySelector(txt),
  uid = () => "id-" + Math.random().toString(36).slice(2, 9),
  esc = (nombre) =>
    String(nombre == null ? "" : nombre).replace(
      /[&<>"]/g,
      (arg) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
        })[arg],
    );
function mentionize(texto) {
  let txt = esc(texto || "");
  const lista = TEAM.map((miembro) => miembro.nombre).filter(Boolean);
  if (!lista.length) return txt;
  const regex = new RegExp(
    "@(" + lista.map((arg) => arg.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")).join("|") + ")\\b",
    "gi",
  );
  return txt.replace(regex, '<span class="mention">@$1</span>');
}
const pad = (txt) => String(txt).padStart(2, "0"),
  isoOf = (fecha) => fecha.getFullYear() + "-" + pad(fecha.getMonth() + 1) + "-" + pad(fecha.getDate()),
  todayISO = () => isoOf(new Date());
function parseISO(iso) {
  if (!iso) return null;
  const lista = String(iso).split("-").map(Number);
  return new Date(lista[0], lista[1] - 1, lista[2]);
}
function fmtShort(val) {
  const fecha = parseISO(val);
  return fecha ? fecha.getDate() + "/" + (fecha.getMonth() + 1) : "";
}
function addDays(fecha2, n) {
  const fecha = new Date(fecha2);
  return (fecha.setDate(fecha.getDate() + n), fecha);
}
function daysBetween(iso, val) {
  return Math.round((parseISO(val) - parseISO(iso)) / 86400000);
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
  member = (responsable) => TEAM.find((miembro) => miembro.id === responsable),
  sectorName = (arg) => (SECTORES[arg] ? SECTORES[arg].nombre : null);
function isCurso(tarjeta) {
  return tarjeta.tipo === "curso";
}
const INV_KIND = {
  curso: "cursos",
  "edu-point": "edu-points",
  "app-web": "apps",
  "base-sistema": "bases",
  video: "contenido",
  presencial: "contenido",
  poes: "contenido",
  guia: "contenido",
};
// Tipos que eventualmente pueden terminar publicados en el Mapa — sirve para
// mostrar, dentro del Mapa, lo que todavía está en el Planner camino a serlo.
const INV_TIPOS = new Set(Object.keys(INV_KIND));
function invCountKind(kind) {
  return state.cards.filter((tarjeta) => INV_KIND[tarjeta.tipo] === kind && inInventory(tarjeta)).length;
}
function inventoryKind(tarjeta) {
  return INV_KIND[tarjeta.tipo] || null;
}
function inInventory(tarjeta) {
  return !!tarjeta.publicado && !!inventoryKind(tarjeta);
}
function isInventory(tarjeta) {
  return inInventory(tarjeta) && !tarjeta.enActualizacion;
}
function isOverdue(tarjeta) {
  const val = tarjeta.fin || tarjeta.inicio;
  if (!val || isInventory(tarjeta) || tarjeta.estado === "finalizado") return false;
  return val < todayISO();
}
function progress(tarjeta) {
  const lista = tarjeta.checklist || [],
    cantidad = lista.filter((arg) => arg.done).length;
  return {
    done: cantidad,
    total: lista.length,
    pct: lista.length ? Math.round((cantidad / lista.length) * 100) : 0,
  };
}
// Elige texto blanco o navy según qué tan clara sea la tela de fondo, para
// que la inicial se lea igual de bien sin importar qué color le haya
// tocado a cada persona.
function contrasteSobre(hex) {
  const val = hex.replace("#", ""),
    r = parseInt(val.slice(0, 2), 16) / 255,
    g = parseInt(val.slice(2, 4), 16) / 255,
    b = parseInt(val.slice(4, 6), 16) / 255,
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.6 ? "#1e2d46" : "#fff";
}
function avatarHTML(id2, flag) {
  const miembro = member(id2);
  if (!miembro) return "";
  const txt = miembro.nombre.slice(0, 1).toUpperCase();
  return (
    '<span class="avatar ' +
    (flag ? "sm" : "") +
    '" style="background:' +
    miembro.color +
    ";color:" +
    contrasteSobre(miembro.color) +
    '" title="' +
    esc(miembro.nombre) +
    '">' +
    txt +
    "</span>"
  );
}
function stackHTML(tarjeta) {
  const lista = [tarjeta.responsable, ...(tarjeta.asignados || [])]
    .filter((arg2, arg3, arg) => arg2 && arg.indexOf(arg2) === arg3)
    .slice(0, 4);
  if (!lista.length)
    return '<button class="stack-empty" data-action="roulette:open" title="Nadie asignado — probá girar la ruleta">🎡</button>';
  return '<div class="stack">' + lista.map((arg) => avatarHTML(arg, true)).join("") + "</div>";
}
function sectoresBadges(lista) {
  if (!lista || !lista.length) return '<span class="badge badge-tbd" data-action="noop">Sin sector</span>';
  return lista
    .map((arg) =>
      SECTORES[arg]
        ? '<span class="badge badge-cat" data-cat="' + arg + '">' + esc(SECTORES[arg].nombre) + "</span>"
        : '<span class="badge badge-tbd">' + esc(arg) + "</span>",
    )
    .join("");
}
function primaryCat(tarjeta) {
  return tarjeta.sectores && tarjeta.sectores[0] && SECTORES[tarjeta.sectores[0]]
    ? tarjeta.sectores[0]
    : "tbd";
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
    const memoria = {};
    let modo = "storage";
    function storageAPI() {
      return typeof window !== "undefined" ? window.storage : null;
    }
    async function leerDeStorage(arg) {
      const val = storageAPI();
      if (!val) throw 0;
      if (typeof val.get === "function")
        return await val.get(arg, {
          shared: true,
        });
      if (typeof val.getItem === "function")
        return await val.getItem(arg, {
          shared: true,
        });
      throw 0;
    }
    async function escribirEnStorage(arg, json) {
      const val = storageAPI();
      if (!val) throw 0;
      if (typeof val.set === "function")
        return await val.set(arg, json, {
          shared: true,
        });
      if (typeof val.setItem === "function")
        return await val.setItem(arg, json, {
          shared: true,
        });
      throw 0;
    }
    function cabeceras(obj) {
      // Supabase espera la clave en apikey y además en Authorization. Con las
      // claves viejas (JWT, empiezan con eyJ) alcanzaba con apikey; con las
      // nuevas (sb_publishable_...) hay que mandar las dos o PostgREST no
      // resuelve el rol y contesta 401.
      return Object.assign(
        {
          apikey: BACKEND.supabaseKey,
          Authorization: "Bearer " + BACKEND.supabaseKey,
        },
        obj || {},
      );
    }
    async function leerDeSupabase() {
      const txt =
          BACKEND.supabaseUrl +
          "/rest/v1/" +
          BACKEND.tabla +
          "?id=eq." +
          encodeURIComponent(BACKEND.fila) +
          "&select=data",
        resp = await fetch(txt, {
          headers: cabeceras(),
          cache: "no-store",
        });
      if (!resp.ok) throw new Error("Supabase " + resp.status);
      const datos = await resp.json();
      return datos && datos[0] ? datos[0].data : null;
    }
    async function escribirEnSupabase(obj, urgente) {
      const txt = BACKEND.supabaseUrl + "/rest/v1/" + BACKEND.tabla,
        resp = await fetch(txt, {
          method: "POST",
          // keepalive: el pedido sobrevive aunque la pestaña se cierre o
          // navegue a otro lado justo después de mandarlo. Sin esto, cerrar
          // la pestaña a los pocos milisegundos de editar cancela el POST a
          // mitad de camino y la edición se pierde sin ningún aviso.
          keepalive: !!urgente,
          headers: cabeceras({
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates,return=minimal",
          }),
          body: JSON.stringify({
            id: BACKEND.fila,
            data: obj,
          }),
        });
      if (!resp.ok) throw new Error("Supabase " + resp.status);
    }
    return {
      mode: () => modo,
      async load() {
        if (useSupabase()) {
          let val2;
          try {
            val2 = await leerDeSupabase();
          } catch (e) {
            throw ((modo = "error"), e);
          }
          return ((modo = "supabase"), val2);
        }
        try {
          const val = await leerDeStorage(KEY);
          return ((modo = "storage"), val ? JSON.parse(val) : null);
        } catch (err) {
          return ((modo = "memoria"), memoria[KEY] ? JSON.parse(memoria[KEY]) : null);
        }
      },
      async save(obj, urgente) {
        const json = JSON.stringify(obj);
        if (useSupabase()) {
          // Guardado urgente (la pestaña se está por cerrar): un solo intento
          // con keepalive, sin esperar reintentos que ya no van a llegar a
          // tiempo. El resto de los casos sí reintenta, porque la mayoría de
          // las fallas son un pico de red que se resuelve solo.
          if (urgente) {
            try {
              await escribirEnSupabase(obj, true);
              modo = "supabase";
            } catch (err) {
              ((modo = "error"), (memoria[KEY] = json));
              throw err;
            }
            return;
          }
          let ultimoError = null;
          for (let intento = 0; intento < 3; intento++) {
            try {
              return ((await escribirEnSupabase(obj)), (modo = "supabase"), undefined);
            } catch (err) {
              ultimoError = err;
              if (intento < 2) await new Promise((r) => setTimeout(r, 400 * (intento + 1)));
            }
          }
          ((modo = "error"), (memoria[KEY] = json));
          throw ultimoError;
        }
        try {
          (await escribirEnStorage(KEY, json), (modo = "storage"));
        } catch (err2) {
          ((modo = "memoria"), (memoria[KEY] = json));
        }
      },
      async remote() {
        return useSupabase() ? await leerDeSupabase() : null;
      },
    };
  })();
const TOMBSTONE_TTL = 30 * 24 * 60 * 60 * 1000;
function cardFingerprint(card) {
  const { updatedAt, ...rest } = card;
  return JSON.stringify(rest);
}
let savedFingerprints = new Map();
function stampEditedCards() {
  const now = Date.now();
  for (const card of state.cards) {
    const fp = cardFingerprint(card);
    if (savedFingerprints.get(card.id) !== fp) {
      ((card.updatedAt = now), savedFingerprints.set(card.id, fp));
    }
  }
}
function rememberFingerprints(cards) {
  savedFingerprints = new Map(cards.map((c) => [c.id, cardFingerprint(c)]));
}
function dropCards(ids) {
  const gone = new Set(ids),
    now = Date.now();
  ((state.cards = state.cards.filter((c) => !gone.has(c.id))),
    gone.forEach((id) => {
      ((state.deleted[id] = now), savedFingerprints.delete(id));
    }));
}
function pruneTombstones(deleted) {
  const cutoff = Date.now() - TOMBSTONE_TTL,
    out = {};
  for (const id in deleted) if (deleted[id] > cutoff) out[id] = deleted[id];
  return out;
}
function mergeCards(localCards, remoteCards, localDeleted, remoteDeleted) {
  const byId = new Map(remoteCards.map((c) => [c.id, c]));
  for (const local of localCards) {
    const remote = byId.get(local.id);
    if (!remote || (local.updatedAt || 0) >= (remote.updatedAt || 0)) byId.set(local.id, local);
  }
  const deleted = Object.assign({}, remoteDeleted);
  for (const id in localDeleted) deleted[id] = Math.max(deleted[id] || 0, localDeleted[id]);
  for (const id in deleted) {
    const card = byId.get(id);
    if (card && (card.updatedAt || 0) <= deleted[id]) byId.delete(id);
  }
  return {
    cards: [...byId.values()],
    deleted: pruneTombstones(deleted),
  };
}
function docSnapshot() {
  return {
    cards: state.cards,
    templates: state.customTpl,
    sectores: SECTORES,
    team: TEAM,
    appPassHash: state.appPassHash,
    agenda: state.agenda,
    cotofrase: state.cotofrase,
    deleted: state.deleted,
  };
}
const BACKUP_KEY = "coto.superplanner.backups",
  BACKUP_MAX = 8,
  BACKUP_MIN_GAP = 15 * 60 * 1000;
function readBackups() {
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function writeBackups(list) {
  for (let intento = list.length; intento > 0; intento--) {
    try {
      return (localStorage.setItem(BACKUP_KEY, JSON.stringify(list.slice(0, intento))), true);
    } catch (e) {}
  }
  try {
    localStorage.removeItem(BACKUP_KEY);
  } catch (e) {}
  return false;
}
// forzar salta el intervalo mínimo: se usa cuando el backend rechazó la
// escritura, que es justo cuando la copia local es la única que queda.
function saveBackup(doc, forzar) {
  const list = readBackups(),
    now = Date.now();
  if (!forzar && list.length && now - list[0].ts < BACKUP_MIN_GAP) return;
  (list.unshift({
    ts: now,
    autor: state.user || "",
    tarjetas: doc.cards.length,
    doc: JSON.stringify(doc),
  }),
    writeBackups(list.slice(0, BACKUP_MAX)));
}
async function mergeRemoteIntoState() {
  stampEditedCards();
  const remote = await Store.remote();
  if (!remote || !Array.isArray(remote.cards)) return [];
  const before = new Map(state.cards.map((c) => [c.id, cardFingerprint(c)])),
    merged = mergeCards(state.cards, remote.cards, state.deleted, remote.deleted || {});
  ((state.cards = merged.cards), (state.deleted = merged.deleted));
  if (remote.templates) state.customTpl = Object.assign({}, remote.templates, state.customTpl);
  if (remote.sectores) Object.assign(SECTORES, remote.sectores);
  Array.isArray(remote.team) &&
    remote.team.length &&
    ((TEAM.length = 0), remote.team.forEach((m) => TEAM.push(m)));
  if (remote.agenda && typeof remote.agenda === "object")
    state.agenda = Object.assign({}, remote.agenda, state.agenda);
  ensureFraseDay();
  if (remote.cotofrase && remote.cotofrase.day === isoOf(new Date()))
    state.cotofrase.porUsuario = Object.assign({}, remote.cotofrase.porUsuario, state.cotofrase.porUsuario);
  return state.cards.filter((c) => before.get(c.id) !== cardFingerprint(c));
}
let saveTimer = null;
// Hay una edición que todavía no confirmó el backend. Es lo que revisan el
// aviso al cerrar la pestaña y el guardado urgente al ocultarla.
let guardadoPendiente = false;
// pagehide y visibilitychange('hidden') disparan juntos en el mismo cierre;
// sin este candado los dos piden el guardado urgente a la vez y se manda el
// mismo documento dos veces.
let guardadoUrgenteEnCurso = false;
function persist() {
  ((guardadoPendiente = true), (state.saveError = false), updateSavestate());
  (clearTimeout(saveTimer), (saveTimer = setTimeout(() => guardarAhora(false), 250)));
}
async function guardarAhora(urgente) {
  if (urgente) {
    if (guardadoUrgenteEnCurso) return;
    guardadoUrgenteEnCurso = true;
  }
  clearTimeout(saveTimer);
  stampEditedCards();
  // El guardado urgente no espera al merge: es un solo POST con keepalive
  // disparado porque la pestaña se está yendo, y ya no hay tiempo para un ida
  // y vuelta extra.
  if (useSupabase() && !urgente) {
    try {
      await mergeRemoteIntoState();
    } catch (e) {}
  }
  const doc = docSnapshot();
  // La copia local va primero: si el backend falla, el trabajo igual quedó
  // en algún lado y se puede restaurar.
  saveBackup(doc, urgente);
  try {
    (await Store.save(doc, urgente), rememberFingerprints(state.cards));
    ((state.saveError = false), (state.connOk = true), (guardadoPendiente = false), (state.lastSyncTs = Date.now()));
  } catch (err) {
    (console.error("No se pudo guardar:", err), (state.saveError = true), saveBackup(doc, true));
  }
  if (urgente) guardadoUrgenteEnCurso = false;
  else (showBanner(), avisarSinGuardar());
  updateSavestate();
}
// Entre que se dispara persist() y que el POST llega a destino pasan el
// debounce de 250ms más una o dos idas y vueltas de red: si alguien cierra la
// pestaña, cambia de app o el celular la manda a segundo plano en ese lapso,
// el guardado normal se corta a mitad de camino y la edición se pierde sin
// ningún aviso. Estos tres enganches cubren esa ventana.
//
// Ojo con el límite: keepalive rechaza de entrada cualquier pedido de más de
// 64 KB, sin ni siquiera salir a la red. El tablero de esta app arranca en
// ~114 KB solo con el catálogo semilla de cursos, así que en la práctica el
// POST urgente casi nunca entra. Por eso el aviso de beforeunload importa más
// que el POST en sí: es lo que le da a la persona la chance de no irse y
// dejar que el guardado normal (que no tiene ese tope) termine solo. Y la
// copia local, que se graba antes de intentar la red sin importar el tamaño,
// es la que de verdad no se pierde nunca.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && guardadoPendiente) guardarAhora(true);
});
window.addEventListener("pagehide", () => {
  if (guardadoPendiente) guardarAhora(true);
});
window.addEventListener("beforeunload", (ev) => {
  if (guardadoPendiente) {
    (ev.preventDefault(), (ev.returnValue = ""));
  }
});

// Cuando el backend no acepta los cambios hay que decirlo fuerte: el equipo
// puede pasarse la tarde trabajando sobre algo que no se está guardando.
function avisarSinGuardar() {
  let aviso = $("#saveWarn");
  if (!state.saveError) {
    (aviso && aviso.remove(), (document.body.style.paddingTop = ""));
    return;
  }
  if (!aviso) {
    ((aviso = document.createElement("div")),
      (aviso.id = "saveWarn"),
      (aviso.setAttribute("role", "alert")),
      (aviso.style.cssText =
        "position:fixed;top:0;left:0;right:0;z-index:120;background:var(--bad);color:#fff;" +
        "padding:10px 16px;font-size:13px;font-weight:600;text-align:center;box-shadow:var(--shadow-lg)"),
      document.body.appendChild(aviso));
  }
  aviso.innerHTML =
    "⚠ No se están guardando los cambios — el backend no responde. " +
    "Tenés una copia local en Ajustes → Copias de resguardo. " +
    '<button data-action="reintentar:guardar" style="margin-left:8px;padding:3px 10px;border-radius:999px;' +
    'border:1px solid #fff;background:transparent;color:#fff;font:inherit;cursor:pointer">Reintentar</button>';
}

// El panel no tiene botón "Guardar" — todo autoguarda — así que este pill es
// lo único que le dice a la persona si lo que tipeó ya quedó a salvo.
function savestateEstado() {
  if (state.saveError) return { clase: "error", texto: "Sin guardar" };
  if (guardadoPendiente) return { clase: "saving", texto: "Guardando…" };
  return { clase: "saved", texto: "Guardado" };
}
function savestateHTML() {
  const { clase, texto } = savestateEstado();
  return '<span class="savestate ' + clase + '" id="panelSaveState">' + texto + "</span>";
}
// Actualiza el pill sin re-renderizar el panel entero: un re-render en medio
// de tipear le tira el foco del campo a la persona.
function updateSavestate() {
  const el = $("#panelSaveState");
  if (!el) return;
  const { clase, texto } = savestateEstado();
  ((el.className = "savestate " + clase), (el.textContent = texto));
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
  savedViews: [],
  connOk: true,
  saveError: false,
  lastSyncTs: null,
  eduSector: null,
  eduEst: "",
  eduQ: "",
  appPassHash: "1waoja",
  agenda: {},
  cotofrase: { day: "", porUsuario: {} },
  deleted: {},
};
// Si cambió el día desde la última visita, la ronda de frases arranca de
// cero: nadie "ya tiró hoy" con una frase de ayer.
function ensureFraseDay() {
  const hoy = isoOf(new Date());
  if (state.cotofrase.day !== hoy) state.cotofrase = { day: hoy, porUsuario: {} };
}
function hashStr(lista) {
  lista = String(lista);
  let n = 5381;
  for (let i = 0; i < lista.length; i++) {
    n = ((n << 5) + n + lista.charCodeAt(i)) >>> 0;
  }
  return n.toString(36);
}
const allTipos = () => Object.assign({}, TIPOS, mapCustom());
function mapCustom() {
  const obj = {};
  for (const val in state.customTpl)
    obj[val] = {
      nombre: state.customTpl[val].nombre,
      icon: "🧩",
      custom: true,
    };
  return obj;
}
function tplFor(txt) {
  if (state.customTpl[txt]) return state.customTpl[txt];
  return (
    TEMPLATES[txt] || {
      fases: [],
      checklist: [],
    }
  );
}
const current = () => state.cards.find((tarjeta) => tarjeta.id === state.selectedId);
function newCard(txt, txt2, obj) {
  const tarjeta = tplFor(txt);
  return Object.assign(
    {
      id: uid(),
      titulo: txt2 || "Sin título",
      tipo: txt,
      estado: "pendiente",
      sectores: [],
      responsable: null,
      asignados: [],
      inicio: null,
      fin: null,
      prioridad: "normal",
      checklist: (tarjeta.checklist || []).map((arg) => ({
        id: uid(),
        text: arg,
        done: false,
      })),
      fases: (tarjeta.fases || []).map((arg) => ({
        id: uid(),
        nombre: arg,
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
    obj || {},
  );
}
function withChecklist(lista) {
  return lista.map((arg) =>
    typeof arg === "string"
      ? {
          id: uid(),
          text: arg,
          done: false,
        }
      : {
          id: uid(),
          text: arg.t,
          done: !!arg.d,
        },
  );
}
function seedCards() {
  const lista = [],
    fn = (txt, txt2, tarjeta) => {
      const tarjeta2 = newCard(txt, txt2);
      Object.assign(tarjeta2, tarjeta);
      if (tarjeta && tarjeta.checklist) tarjeta2.checklist = withChecklist(tarjeta.checklist);
      if (tarjeta && tarjeta.fasesD)
        tarjeta2.fases = tarjeta.fasesD.map((arg) => ({
          id: uid(),
          nombre: arg.n,
          inicio: arg.i || null,
          fin: arg.f || null,
          tareas: (arg.t || []).map((item) => ({
            id: uid(),
            text: item.text,
            done: !!item.done,
            fecha: item.fecha || null,
          })),
        }));
      return (lista.push(tarjeta2), tarjeta2);
    },
    fn2 = (n) => isoOf(addDays(new Date(), n));
  return (
    typeof window !== "undefined" &&
      window.__CF_SEED__ &&
      (fn("curso", "Curso de ejemplo", {
        sectores: ["control-de-calidad"],
        estado: "en-desarrollo",
        responsable: "dami",
        asignados: ["dami", "flor"],
        inicio: fn2(-3),
        fin: fn2(18),
        checklist: ["Brief aprobado", "Guion validado", "Maqueta visual", "Montaje", "Alta en Moodle"],
        fasesD: [
          {
            n: "Guion",
            i: fn2(-3),
            f: fn2(4),
          },
          {
            n: "Diseño",
            i: fn2(5),
            f: fn2(11),
          },
          {
            n: "Producción",
            i: fn2(12),
            f: fn2(18),
          },
        ],
      }),
      fn("video", "Video de ejemplo", {
        sectores: ["coto-digital"],
        estado: "en-revision",
        responsable: "eve",
        asignados: ["eve"],
        inicio: fn2(-6),
        fin: fn2(5),
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
      fn("presencial", "Capacitación de ejemplo", {
        sectores: ["mantenimiento"],
        estado: "pendiente",
        responsable: "flor",
        asignados: ["flor"],
        inicio: fn2(3),
        fin: fn2(3),
        checklist: ["Temario", "Material de soporte", "Convocatoria", "Dictado"],
      }),
      fn("libre", "Tarea de ejemplo", {
        sectores: [],
        estado: "pendiente",
        responsable: "gasti",
        asignados: ["gasti"],
        inicio: fn2(1),
        fin: fn2(4),
      }),
      fn("edu-point", "Edu Point de ejemplo", {
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
      fn("app-web", "Aplicativo de ejemplo", {
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
      fn("curso", "Curso activo de ejemplo", {
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
    lista
  );
}
function ingestCatalogo(lista, { replace: replace = false } = {}) {
  let n = 0;
  return (
    lista.forEach((tarjeta) => {
      const sector = toSector(tarjeta.categoria),
        hallado = state.cards.find(
          (tarjeta2) =>
            isCurso(tarjeta2) &&
            tarjeta2.titulo.trim().toLowerCase() ===
              String(tarjeta.titulo || "")
                .trim()
                .toLowerCase(),
        );
      if (hallado && !replace) return;
      const tarjeta3 = newCard("curso", tarjeta.titulo || "Curso sin título", {
        publicado: true,
        estado: "en-revision",
        sectores: sector ? [sector] : [],
        linkMoodle: tarjeta.linkMoodle || "",
        catalogo: {
          categoria: tarjeta.categoria || "",
          bajada: tarjeta.bajada || "",
          anio: tarjeta.anio || "",
          duracion: tarjeta.duracion || "",
          imagen: tarjeta.imagen || "",
          personas: tarjeta.personas || "",
          descripcion: tarjeta.descripcion || "",
        },
      });
      tarjeta3.checklist = [];
      if (hallado && replace)
        Object.assign(hallado, tarjeta3, {
          id: hallado.id,
        });
      else state.cards.push(tarjeta3);
      n++;
    }),
    n
  );
}
// Los cursos que ya estaban cargados (de una ingesta anterior, antes de que
// CURSOS tuviera fotos) nunca los reciben: ingestCatalogo() con
// replace:false los salta por completo porque el título ya existe. Esta
// pasada es la contraparte no-destructiva: solo completa catalogo.imagen
// cuando está vacío, sin tocar estado, sectores, checklist ni nada más que
// el equipo ya haya cargado a mano.
function backfillCatalogoImages() {
  let n = 0;
  const imagenPorTitulo = new Map();
  CURSOS.forEach((c) => {
    if (c.imagen) imagenPorTitulo.set(String(c.titulo || "").trim().toLowerCase(), c.imagen);
  });
  state.cards.forEach((tarjeta) => {
    if (!isCurso(tarjeta) || !tarjeta.catalogo || tarjeta.catalogo.imagen) return;
    const imagen = imagenPorTitulo.get(String(tarjeta.titulo || "").trim().toLowerCase());
    if (imagen) ((tarjeta.catalogo.imagen = imagen), n++);
  });
  return n;
}
function boardCards() {
  return state.cards.filter((tarjeta) => !isInventory(tarjeta));
}
function mine(tarjeta) {
  return (
    state.userId && (tarjeta.responsable === state.userId || (tarjeta.asignados || []).includes(state.userId))
  );
}
function quickPass(tarjeta, arg) {
  if (arg === "venc") return isOverdue(tarjeta);
  if (arg === "alta") return tarjeta.prioridad === "alta";
  if (arg === "sinresp") return !tarjeta.responsable;
  if (arg === "sem") {
    const val = tarjeta.inicio || tarjeta.fin,
      val2 = tarjeta.fin || tarjeta.inicio;
    if (!val) return false;
    const iso = isoOf(weekStart(new Date())),
      iso2 = isoOf(addDays(weekStart(new Date()), 6));
    return val <= iso2 && val2 >= iso;
  }
  return true;
}
function passBoard(tarjeta) {
  const tarjeta2 = state.filters;
  if (state.mis && state.userId && !mine(tarjeta)) return false;
  if (state.quick && !quickPass(tarjeta, state.quick)) return false;
  if (
    tarjeta2.persona &&
    tarjeta.responsable !== tarjeta2.persona &&
    !(tarjeta.asignados || []).includes(tarjeta2.persona)
  )
    return false;
  if (tarjeta2.tipo && tarjeta.tipo !== tarjeta2.tipo) return false;
  if (tarjeta2.sector && !(tarjeta.sectores || []).includes(tarjeta2.sector)) return false;
  if (tarjeta2.estado && tarjeta.estado !== tarjeta2.estado) return false;
  if (tarjeta2.texto && !tarjeta.titulo.toLowerCase().includes(tarjeta2.texto.toLowerCase())) return false;
  return true;
}
function filteredBoard() {
  return boardCards().filter(passBoard);
}
function renderFilters() {
  // Elegir un filtro reconstruye toda la barra (así se actualiza el contador
  // del botón), lo que cerraría el popover después de cada click si no se
  // preserva a mano: nadie quiere reabrirlo para poner un segundo filtro.
  const popAbierto = $("#filtrosPop") && !$("#filtrosPop").classList.contains("hidden");
  const misFlag = $("#misFlag");
  if (misFlag) misFlag.textContent = state.mis ? "ON" : "";
  if (state.view === "inicio") {
    $("#filters").innerHTML = "";
    return;
  }
  if (state.view === "mapa" && state.mapaSec === "edu-archivos") {
    $("#filters").innerHTML = "";
    return;
  }
  const tarjeta = state.filters,
    flag = state.view === "mapa",
    fn = (id2, nombre, sector) =>
      '<option value="' + id2 + '" ' + (sector === id2 ? "selected" : "") + ">" + esc(nombre) + "</option>",
    html =
      '<div class="filt">👤<select data-filter="persona"><option value="">Todos</option>' +
      TEAM.map((miembro) => fn(miembro.id, miembro.nombre, tarjeta.persona)).join("") +
      "</select></div>",
    html2 =
      '<div class="filt">🎨<select data-filter="sector"><option value="">Sector</option>' +
      Object.keys(SECTORES)
        .map((arg) => fn(arg, SECTORES[arg].nombre, tarjeta.sector))
        .join("") +
      "</select></div>",
    html3 =
      '<div class="filt">🏷️<select data-filter="tipo"><option value="">Tipo</option>' +
      Object.keys(allTipos())
        .map((arg) => fn(arg, allTipos()[arg].nombre, tarjeta.tipo))
        .join("") +
      "</select></div>",
    html4 =
      '<div class="filt">◷<select data-filter="estado"><option value="">Estado</option>' +
      ESTADOS.map((estado) => fn(estado.id, estado.nombre, tarjeta.estado)).join("") +
      "</select></div>",
    html5 =
      '<div class="filt">◷<select data-filter="cursoEstado"><option value="">Estado</option>' +
      fn("activo", "Activo", tarjeta.cursoEstado) +
      fn("actualizando", "En actualización", tarjeta.cursoEstado) +
      "</select></div>",
    html6 =
      '<div class="filt">🔎<input data-filter="texto" value="' +
      esc(tarjeta.texto) +
      '" placeholder="Buscar título..." /></div>',
    // Los selects que antes iban sueltos en la barra se agrupan en un solo
    // popover: cuatro (o tres, en el Mapa) selects siempre a la vista era
    // ruido para algo que se usa de vez en cuando. El buscador y los chips de
    // acceso rápido sí quedan afuera, porque esos se usan todo el tiempo.
    activos = [
      tarjeta.persona,
      tarjeta.sector,
      !flag && tarjeta.tipo,
      tarjeta.estado,
      flag && tarjeta.cursoEstado,
      !flag && state.quick,
    ].filter(Boolean).length,
    popoverFlds = (flag ? [html2, html5] : [html, html3, html2, html4])
      .map((h) => h.replace('<div class="filt">', '<div class="filt filt-pop-item">'))
      .join(""),
    lista = [
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
    // Los chips rápidos y las vistas guardadas vivían sueltos en la barra;
    // ahora quedan adentro del mismo popover de "☰ Filtros" para no saturar
    // la barra con botones — todo lo que filtra, en un solo lugar.
    quickHTML = flag
      ? ""
      : '<div class="filt-pop-sep"></div><div class="filt-pop-label">Accesos rápidos</div><div class="qchips qchips-pop">' +
        lista
          .map(
            (arg) =>
              '<button class="qchip' +
              (state.quick === arg.k ? " on" : "") +
              '" data-action="quick:set" data-q="' +
              arg.k +
              '">' +
              arg.l +
              "</button>",
          )
          .join("") +
        "</div>",
    savedHTML = flag
      ? ""
      : '<div class="filt-pop-sep"></div><div class="filt-pop-label">Vistas guardadas</div><div class="vchips">' +
        (state.savedViews || [])
          .map(
            (arg) =>
              '<button class="vchip" data-action="view:apply" data-id="' +
              arg.id +
              '" title="Aplicar vista guardada">⭐ ' +
              esc(arg.name) +
              '<span class="vx" data-action="view:del" data-id="' +
              arg.id +
              '" title="Borrar vista">✕</span></button>',
          )
          .join("") +
        '<button class="btn btn-ghost btn-sm" data-action="view:save" title="Guardar los filtros actuales como vista">💾 Guardar vista</button></div>',
    htmlFiltrosBtn =
      '<div class="filt-pop-wrap"><button class="btn btn-ghost btn-sm" data-action="filtros:toggle" id="filtrosBtn">☰ Filtros' +
      (activos ? '<span class="filt-badge">' + activos + "</span>" : "") +
      '</button><div class="filt-pop hidden" id="filtrosPop">' +
      popoverFlds +
      '<button class="btn btn-ghost btn-sm" data-action="filt:clear" style="align-self:flex-start;margin-top:2px">Limpiar filtros</button>' +
      quickHTML +
      savedHTML +
      "</div></div>";
  $("#filters").innerHTML = html6 + htmlFiltrosBtn;
  if (popAbierto) {
    const p = $("#filtrosPop");
    if (p) p.classList.remove("hidden");
  }
}
const VIEW_TITLES = {
  kanban: ["Planner", "Tareas y proyectos por estado"],
  calendario: ["Calendario del planner", "Qué pasa y cuándo"],
  timeline: ["Timeline", "El panorama macro del área"],
  mapa: ["Mapa del área", "Todo lo publicado y lo que viene: cursos, Edu Points, contenido suelto y lo que está en desarrollo"],
};
function viewHeader() {
  const val = VIEW_TITLES[state.view];
  return val ? '<div class="view-head"><h2>' + val[0] + "</h2><p>" + val[1] + "</p></div>" : "";
}
function render() {
  // Sin backend no hay tablero que dibujar: la pantalla de corte manda.
  if (useSupabase() && state.connOk === false) {
    mostrarPantallaSinConexion(errorConexion);
    return;
  }
  (renderFilters(), renderView(), updateBell());
}
// Si el re-render es de la MISMA vista (por ej. editar una tarjeta del
// Planner sin cambiar de pestaña), el documento entero se vuelve a armar
// desde cero y el scroll se pierde. Cambiar de pestaña sí debe arrancar
// arriba de todo; quedarse en la misma vista no debería moverte del lugar.
let ultimaVistaRenderizada = null;
function renderView() {
  document
    .querySelectorAll(".tab")
    .forEach((el) => el.classList.toggle("active", el.dataset.view === state.view));
  let txt = "";
  if (state.view === "inicio") txt = renderInicio();
  else {
    if (state.view === "kanban") txt = renderKanban();
    else {
      if (state.view === "calendario") txt = renderCalendario();
      else {
        if (state.view === "timeline") txt = renderTimeline();
        else {
          if (state.view === "mapa") txt = renderMapa();
        }
      }
    }
  }
  const mismaVista = ultimaVistaRenderizada === state.view,
    scrollY = window.scrollY;
  ($("#view").innerHTML = '<div class="view-in">' + viewHeader() + txt + "</div>"),
    (ultimaVistaRenderizada = state.view);
  window.scrollTo(0, mismaVista ? scrollY : 0);
}
function cardKanban(tarjeta) {
  const avance = progress(tarjeta),
    tipo = allTipos()[tarjeta.tipo] || {
      nombre: tarjeta.tipo,
      icon: "•",
    },
    vencida = isOverdue(tarjeta);
  return (
    '<article class="kcard" draggable="true" data-id="' +
    tarjeta.id +
    '" data-cat="' +
    primaryCat(tarjeta) +
    '" data-action="card:open">\n    <div class="kcard-quick">' +
    '<button class="kq-btn" data-action="qedit:open" data-id="' +
    tarjeta.id +
    '" title="Edición rápida">✎</button><button class="kq-btn" data-action="kcard:dup" data-id="' +
    tarjeta.id +
    '" title="Duplicar">⧉</button><button class="kq-btn kq-del" data-action="kcard:del" data-id="' +
    tarjeta.id +
    '" title="Eliminar">🗑</button></div>\n    ' +
    (inInventory(tarjeta) ? '<span class="tag-flag">◎ activo</span>' : "") +
    '\n    <div class="kcard-top">\n      <span class="tipo-pill">' +
    tipo.icon +
    " " +
    esc(tipo.nombre) +
    "</span>\n      " +
    (tarjeta.prioridad === "alta" ? '<span class="badge prio">★ Alta</span>' : "") +
    '\n    </div>\n    <div class="kcard-title">' +
    esc(tarjeta.titulo) +
    '</div>\n    <div class="badges">' +
    sectoresBadges(tarjeta.sectores) +
    '</div>\n    <div class="kcard-meta">\n      <span class="date ' +
    (vencida ? "overdue" : "") +
    '">📅 ' +
    dateLabel(tarjeta) +
    (vencida ? " · vencida" : "") +
    "</span>" +
    (tarjeta.estado === "en-revision" && tarjeta.revisionDesde
      ? '<span class="date rev-age" title="Esperando revisión de otros sectores">🕓 ' +
        Math.max(0, daysBetween(tarjeta.revisionDesde, isoOf(new Date()))) +
        "d en revisión</span>"
      : "") +
    "\n    </div>\n    " +
    (avance.total
      ? '<div class="prog-row"><div class="progress"><div class="progress-bar" style="width:' +
        avance.pct +
        '%"></div></div><span class="prog-num">' +
        avance.done +
        "/" +
        avance.total +
        "</span></div>"
      : "") +
    '\n    <div class="kcard-foot">' +
    stackHTML(tarjeta) +
    "</div>\n  </article>"
  );
}
function dateLabel(tarjeta) {
  if (tarjeta.inicio && tarjeta.fin && tarjeta.fin !== tarjeta.inicio)
    return fmtShort(tarjeta.inicio) + " – " + fmtShort(tarjeta.fin);
  const val = tarjeta.fin || tarjeta.inicio;
  return val ? fmtShort(val) : "sin fecha";
}
function sortCards(lista) {
  const val = state.sort,
    fn = (tarjeta) => (tarjeta.prioridad === "alta" ? 0 : 1),
    fn2 = (tarjeta) => tarjeta.fin || tarjeta.inicio || "9999-12-31";
  return lista.slice().sort((tarjeta, tarjeta2) => {
    if (val === "prioridad") {
      if (fn(tarjeta) !== fn(tarjeta2)) return fn(tarjeta) - fn(tarjeta2);
      return fn2(tarjeta).localeCompare(fn2(tarjeta2));
    }
    if (val === "fecha") return fn2(tarjeta).localeCompare(fn2(tarjeta2));
    if (val === "titulo") return tarjeta.titulo.localeCompare(tarjeta2.titulo);
    return 0;
  });
}
function renderKanban() {
  const lista2 = filteredBoard(),
    html =
      '<div class="kbar">\n    <span class="pill">' +
      lista2.length +
      " tarjeta" +
      (lista2.length !== 1 ? "s" : "") +
      (state.mis && state.userId ? " · mías" : "") +
      '</span>\n    <button class="roulette-btn" data-action="roulette:open">🎡 ¿Qué curso me toca?</button>\n    <span class="grow"></span>\n    <button class="btn btn-ghost btn-sm" data-action="data:csv" title="Exportar a CSV lo que estás viendo (respeta los filtros activos)">⬇ CSV</button>\n    <button class="btn btn-ghost btn-sm" data-action="app:print" title="Imprimir o guardar como PDF">🖨 PDF</button>\n    <div class="filt">↕<select data-control="sort">\n      <option value="prioridad" ' +
      (state.sort === "prioridad" ? "selected" : "") +
      '>Prioridad</option>\n      <option value="fecha" ' +
      (state.sort === "fecha" ? "selected" : "") +
      '>Fecha</option>\n      <option value="titulo" ' +
      (state.sort === "titulo" ? "selected" : "") +
      ">Título</option>\n    </select></div></div>",
    kcolMax = Math.max(1, ...ESTADOS.map((estado) => lista2.filter((arg) => arg.estado === estado.id).length)),
    txt = ESTADOS.map((estado) => {
      const lista = sortCards(lista2.filter((arg) => arg.estado === estado.id)),
        cantidad2 = lista.filter(isOverdue).length;
      return (
        '<section class="kcol">\n      <div class="kcol-head"><span class="kcol-dot" style="background:' +
        estado.dot +
        '"></span><h3>' +
        estado.nombre +
        "</h3>\n        " +
        (cantidad2 ? '<span class="kcol-over" title="vencidas">⚑ ' + cantidad2 + "</span>" : "") +
        '\n        <span class="kcol-count">' +
        lista.length +
        '</span></div>\n      <div class="kcol-load"><div class="kcol-load-bar" style="width:' +
        Math.round((lista.length / kcolMax) * 100) +
        "%;background:" +
        estado.dot +
        '"></div></div>\n      <div class="kcol-body" data-estado="' +
        estado.id +
        '">' +
        (lista.map(cardKanban).join("") ||
          '<div style="font-size:12px;color:var(--ink-soft);padding:10px;text-align:center">— vacío —</div>') +
        '</div>\n      <div class="quick-add"><input data-quickadd="' +
        estado.id +
        '" placeholder="+ Agregar… (Enter)"></div>\n    </section>'
      );
    }).join("");
  return (
    html +
    '<div class="kanban">' +
    txt +
    "</div>"
  );
}
function cardsOnDay(lista, iso) {
  return lista.filter((arg) => {
    const val = arg.inicio || arg.fin,
      val2 = arg.fin || arg.inicio;
    if (!val) return false;
    return iso >= val && iso <= val2;
  });
}
function renderCalendario() {
  const tarjetas = filteredBoard(),
    fecha = state.calCursor,
    txt =
      state.calMode === "mes"
        ? MESES[fecha.getMonth()] + " " + fecha.getFullYear()
        : "Semana del " + fmtShort(isoOf(weekStart(fecha))),
    html =
      '<div class="cal-head">\n    <button class="btn btn-sm" data-action="cal:hoy">Hoy</button>\n    <button class="btn btn-icon btn-ghost" data-action="cal:prev">‹</button>\n    <button class="btn btn-icon btn-ghost" data-action="cal:next">›</button>\n    <div class="cal-title">' +
      txt +
      '</div>\n    <div style="margin-left:auto" class="tabs">\n      <button class="tab ' +
      (state.calMode === "mes" ? "active" : "") +
      '" data-action="cal:mes">Mes</button>\n      <button class="tab ' +
      (state.calMode === "semana" ? "active" : "") +
      '" data-action="cal:semana">Semana</button>\n    </div></div>',
    txt2 = DOW.map((dia) => '<div class="cal-dow">' + dia + "</div>").join(""),
    html2 =
      state.calMode === "mes"
        ? monthGrid(tarjetas, fecha, txt2)
        : '<div class="cal-grid cal-week">' + txt2 + weekCells(tarjetas, fecha) + "</div>";
  return (
    '<div class="cal-layout">\n    <aside class="cal-mini">' +
    miniCal(fecha) +
    '</aside>\n    <div class="cal-main">' +
    html +
    html2 +
    "</div>\n  </div>"
  );
}
function cardsInRange(lista, iso, iso2) {
  return lista.filter((arg) => {
    const val = arg.inicio || arg.fin,
      val2 = arg.fin || arg.inicio;
    if (!val) return false;
    return val <= iso2 && val2 >= iso;
  });
}
function assignLanes(lista2) {
  const lista = lista2
    .filter((arg) => arg.inicio || arg.fin)
    .map((arg) => ({
      c: arg,
      a: arg.inicio || arg.fin,
      b: arg.fin || arg.inicio,
    }));
  lista.sort(
    (arg, arg2) =>
      arg.a.localeCompare(arg2.a) ||
      arg2.b.localeCompare(arg.b) ||
      String(arg.c.titulo).localeCompare(String(arg2.c.titulo)),
  );
  const lista3 = [];
  return (
    lista.forEach((arg) => {
      let n = 0;
      while (n < lista3.length && lista3[n] >= arg.a) n++;
      ((lista3[n] = arg.b), (arg.lane = n));
    }),
    lista
  );
}
function monthGrid(tarjetas, fecha, txt) {
  const fecha2 = new Date(fecha.getFullYear(), fecha.getMonth(), 1),
    n = (fecha2.getDay() + 6) % 7,
    n2 = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate(),
    val = Math.ceil((n + n2) / 7),
    fecha3 = weekStart(fecha2),
    val2 = assignLanes(cardsInRange(tarjetas, isoOf(fecha3), isoOf(addDays(fecha3, val * 7 - 1))));
  let txt2 = "";
  for (let i = 0; i < val; i++) txt2 += weekRow(addDays(fecha3, i * 7), val2, fecha);
  return '<div class="cal-month"><div class="cal-dows">' + txt + "</div>" + txt2 + "</div>";
}
function weekRow(fecha3, lista3, fecha2) {
  const n = 4,
    iso = isoOf(fecha3),
    iso2 = isoOf(addDays(fecha3, 6));
  let txt = "";
  for (let i = 0; i < 7; i++) {
    const fecha = addDays(fecha3, i),
      iso3 = isoOf(fecha),
      flag = fecha.getMonth() !== fecha2.getMonth(),
      flag2 = iso3 === todayISO();
    txt +=
      '<div class="cwd ' +
      (flag ? "out" : "") +
      " " +
      (flag2 ? "today" : "") +
      '" data-action="cal:goto" data-iso="' +
      iso3 +
      '"><span class="cwd-n">' +
      fecha.getDate() +
      "</span></div>";
  }
  const lista = lista3.filter((arg) => arg.a <= iso2 && arg.b >= iso),
    val = Math.min(
      n,
      lista.reduce((arg2, arg) => Math.max(arg2, arg.lane + 1), 0),
    );
  let txt2 = "";
  lista
    .filter((arg) => arg.lane < n)
    .forEach((arg) => {
      const n2 = arg.a < iso ? 0 : daysBetween(iso, arg.a),
        n3 = arg.b > iso2 ? 6 : daysBetween(iso, arg.b),
        flag3 = arg.a < iso,
        flag4 = arg.b > iso2,
        vencida = isOverdue(arg.c);
      txt2 +=
        '<button class="cal-bar' +
        (flag3 ? " cl" : "") +
        (flag4 ? " cr" : "") +
        (vencida ? " overdue" : "") +
        '" draggable="true" data-drag="cal" data-cat="' +
        primaryCat(arg.c) +
        '" data-id="' +
        arg.c.id +
        '" data-action="card:open" title="' +
        esc(arg.c.titulo) +
        ' — arrastrá para reprogramar" style="grid-column:' +
        (n2 + 1) +
        "/" +
        (n3 + 2) +
        ";grid-row:" +
        (arg.lane + 1) +
        '"><span>' +
        esc(arg.c.titulo) +
        "</span></button>";
    });
  const lista2 = lista.filter((arg) => arg.lane >= n);
  let txt3 = "";
  if (lista2.length)
    for (let i2 = 0; i2 < 7; i2++) {
      const iso4 = isoOf(addDays(fecha3, i2)),
        cantidad = lista2.filter((arg) => arg.a <= iso4 && arg.b >= iso4).length;
      if (cantidad)
        txt3 +=
          '<button class="cal-bar-more" data-action="cal:goto" data-iso="' +
          iso4 +
          '" style="grid-column:' +
          (i2 + 1) +
          ";grid-row:" +
          (n + 1) +
          '">+' +
          cantidad +
          "</button>";
    }
  const txt4 = Math.max(1, val) + (lista2.length ? 1 : 0);
  return (
    '<div class="cal-wk">\n    <div class="cal-wk-days">' +
    txt +
    '</div>\n    <div class="cal-wk-bars" style="grid-template-rows:repeat(' +
    txt4 +
    ',var(--bar-h))">' +
    txt2 +
    txt3 +
    "</div>\n  </div>"
  );
}
function miniCal(fecha) {
  const fecha3 = new Date(fecha.getFullYear(), fecha.getMonth(), 1),
    fecha4 = weekStart(fecha3);
  let txt = "";
  for (let i = 0; i < 42; i++) {
    const fecha2 = addDays(fecha4, i),
      iso = isoOf(fecha2),
      flag = fecha2.getMonth() !== fecha.getMonth(),
      flag2 = iso === todayISO();
    txt +=
      '<button class="mc-day ' +
      (flag ? "out" : "") +
      " " +
      (flag2 ? "today" : "") +
      '" data-action="cal:goto" data-iso="' +
      iso +
      '">' +
      fecha2.getDate() +
      "</button>";
  }
  return (
    '<div class="mc-head">\n      <button class="btn btn-icon btn-ghost btn-sm" data-action="cal:prev">‹</button>\n      <div class="mc-title">' +
    MESES[fecha.getMonth()] +
    " " +
    fecha.getFullYear() +
    '</div>\n      <button class="btn btn-icon btn-ghost btn-sm" data-action="cal:next">›</button>\n    </div>\n    <div class="mc-grid">' +
    ["L", "M", "X", "J", "V", "S", "D"].map((arg) => '<div class="mc-dow">' + arg + "</div>").join("") +
    txt +
    "</div>"
  );
}
function weekStart(fecha2) {
  const fecha = new Date(fecha2),
    n = (fecha.getDay() + 6) % 7;
  return addDays(fecha, -n);
}
function dayChip(tarjeta) {
  const vencida = isOverdue(tarjeta);
  return (
    '<div class="cal-chip ' +
    (vencida ? "overdue" : "") +
    '" data-cat="' +
    primaryCat(tarjeta) +
    '" data-id="' +
    tarjeta.id +
    '" data-action="card:open" title="' +
    esc(tarjeta.titulo) +
    '">' +
    esc(tarjeta.titulo) +
    "</div>"
  );
}
function cellHTML(arg, iso, flag) {
  const flag2 = iso === todayISO(),
    lista = cardsOnDay(arg, iso),
    n = state.calMode === "mes" ? 3 : 20,
    txt =
      lista.slice(0, n).map(dayChip).join("") +
      (lista.length > n ? '<span class="cal-more">+' + (lista.length - n) + " más</span>" : ""),
    fecha = parseISO(iso);
  return (
    '<div class="cal-cell ' +
    (flag ? "out" : "") +
    " " +
    (flag2 ? "today" : "") +
    '"><div class="cal-day">' +
    fecha.getDate() +
    "</div>" +
    txt +
    "</div>"
  );
}
function monthCells(arg, fecha) {
  const fecha3 = new Date(fecha.getFullYear(), fecha.getMonth(), 1),
    fecha4 = weekStart(fecha3);
  let txt = "";
  for (let i = 0; i < 42; i++) {
    const fecha2 = addDays(fecha4, i);
    txt += cellHTML(arg, isoOf(fecha2), fecha2.getMonth() !== fecha.getMonth());
  }
  return txt;
}
function weekCells(tarjetas, fecha) {
  const fecha2 = weekStart(fecha);
  let txt = "";
  for (let i = 0; i < 7; i++) {
    const fecha3 = addDays(fecha2, i);
    txt += cellHTML(tarjetas, isoOf(fecha3), false);
  }
  return txt;
}
function groupCards(lista) {
  const fn = (arg, arg2) => (arg.inicio || arg.fin).localeCompare(arg2.inicio || arg2.fin);
  if (!state.tlGroup)
    return [
      {
        label: null,
        cards: lista.slice().sort(fn),
      },
    ];
  const mapa = new Map();
  lista.forEach((arg) => {
    let val,
      val2,
      txt = "";
    if (state.tlGroup === "persona") {
      val = arg.responsable || "zz";
      const def = member(arg.responsable);
      ((val2 = def ? def.nombre : "Sin responsable"), (txt = "👤"));
    } else
      state.tlGroup === "sector"
        ? ((val = primaryCat(arg)), (val2 = sectorName(val) || "Sin sector"), (txt = "🎨"))
        : ((val = arg.tipo),
          (val2 = (allTipos()[arg.tipo] || {}).nombre || arg.tipo),
          (txt = (allTipos()[arg.tipo] || {}).icon || ""));
    if (!mapa.has(val))
      mapa.set(val, {
        label: val2,
        icon: txt,
        cards: [],
      });
    mapa.get(val).cards.push(arg);
  });
  const lista2 = [...mapa.values()];
  return (
    lista2.forEach((doc2) => doc2.cards.sort(fn)),
    lista2.sort((arg, arg2) => arg.label.localeCompare(arg2.label))
  );
}
function tlWindow() {
  const fecha = new Date(),
    n = fecha.getFullYear(),
    n2 = fecha.getMonth();
  if (state.tlRange === "sem") {
    const fecha2 = weekStart(fecha);
    return [isoOf(fecha2), isoOf(addDays(fecha2, 6))];
  }
  if (state.tlRange === "mes") return [isoOf(new Date(n, n2, 1)), isoOf(new Date(n, n2 + 1, 0))];
  if (state.tlRange === "tri") {
    const n3 = Math.floor(n2 / 3) * 3;
    return [isoOf(new Date(n, n3, 1)), isoOf(new Date(n, n3 + 3, 0))];
  }
  if (state.tlRange === "anio") return [isoOf(new Date(n, 0, 1)), isoOf(new Date(n, 11, 31))];
  return null;
}
function renderTimeline() {
  let lista = filteredBoard().filter((arg) => arg.inicio || arg.fin);
  const val3 = tlWindow();
  if (val3)
    lista = lista.filter((arg) => {
      const val = arg.inicio || arg.fin,
        val2 = arg.fin || arg.inicio;
      return val <= val3[1] && val2 >= val3[0];
    });
  const html =
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
    lista.length +
    " proyecto" +
    (lista.length !== 1 ? "s" : "") +
    "</span></div>";
  if (!lista.length)
    return (
      '<div class="tl-full">' +
      html +
      emptyState(
        "🗓",
        "Sin proyectos en este período",
        "Cambiá el filtro de tiempo o asigná fechas a las tarjetas.",
      ) +
      "</div>"
    );
  let val4 = null,
    val5 = null;
  const fn = (inicio) => {
    if (!inicio) return;
    if (!val4 || inicio < val4) val4 = inicio;
    if (!val5 || inicio > val5) val5 = inicio;
  };
  lista.forEach((arg) => {
    (fn(arg.inicio),
      fn(arg.fin),
      (arg.fases || []).forEach((arg2) => {
        (fn(arg2.inicio), fn(arg2.fin), (arg2.tareas || []).forEach((arg3) => fn(arg3.fecha)));
      }));
  });
  if (val3) ((val4 = val3[0]), (val5 = val3[1]));
  else fn(todayISO());
  const iso = isoOf(addDays(parseISO(val4), -3)),
    iso2 = isoOf(addDays(parseISO(val5), 4)),
    txt = daysBetween(iso, iso2) + 1,
    n = state.tlScale === "semana" ? 26 : 11,
    txt2 = "max(100%, " + txt * n + "px)",
    n2 = 100 / txt,
    fn2 = (inicio) => daysBetween(iso, inicio) * n2,
    fn3 = (inicio, fin) => {
      return (
        (inicio = inicio || fin),
        (fin = fin || inicio),
        {
          left: fn2(inicio),
          w: Math.max(n2, (daysBetween(inicio, fin) + 1) * n2),
        }
      );
    };
  let txt3 = "",
    fecha = parseISO(iso);
  while (isoOf(fecha) <= iso2) {
    const iso3 = isoOf(new Date(fecha.getFullYear(), fecha.getMonth(), 1));
    ((txt3 +=
      '<div class="tl-month" style="left:' +
      fn2(iso3 < iso ? iso : iso3) +
      '%">' +
      MESES[fecha.getMonth()].slice(0, 3) +
      " " +
      String(fecha.getFullYear()).slice(2) +
      "</div>"),
      (fecha = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 1)));
  }
  let txt4 = "";
  for (let i = 0; i < txt; i++) {
    const n3 = addDays(parseISO(iso), i).getDay();
    if (n3 === 0 || n3 === 6)
      txt4 += '<div class="tl-weekend" style="left:' + i * n2 + "%;width:" + n2 + '%"></div>';
  }
  const val6 = fn2(todayISO()),
    fn4 = (tarjeta) => 38 + (tarjeta.fases && tarjeta.fases.length ? 16 : 0);
  let txt5 = "",
    txt6 = "";
  return (
    groupCards(lista).forEach((doc2) => {
      (doc2.label !== null &&
        ((txt5 +=
          '<div class="tl-group-l" style="height:33px">' +
          doc2.icon +
          " " +
          esc(doc2.label) +
          '<span style="margin-left:auto">' +
          doc2.cards.length +
          "</span></div>"),
        (txt6 += '<div class="tl-group-r" style="height:33px"></div>')),
        doc2.cards.forEach((tarjeta) => {
          const miembro = member(tarjeta.responsable);
          txt5 +=
            '<div class="tl-rl" style="height:' +
            fn4(tarjeta) +
            'px" data-id="' +
            tarjeta.id +
            '" data-action="card:open">\n        ' +
            (miembro
              ? avatarHTML(miembro.id, true)
              : '<span class="avatar sm" style="background:var(--line)">·</span>') +
            '\n        <div style="overflow:hidden"><div class="tl-rl-title">' +
            esc(tarjeta.titulo) +
            '</div>\n        <div class="tl-rl-sub">' +
            ((allTipos()[tarjeta.tipo] || {}).nombre || tarjeta.tipo) +
            "</div></div></div>";
          const val = fn3(tarjeta.inicio, tarjeta.fin),
            vencida = isOverdue(tarjeta),
            txt7 = (tarjeta.fases || [])
              .filter((arg) => arg.inicio || arg.fin)
              .map((fase) => {
                const val2 = fn3(fase.inicio, fase.fin),
                  txt8 = (fase.tareas || [])
                    .filter((arg) => arg.fecha)
                    .map(
                      (arg) =>
                        '<div class="tl-tick" data-cat="' +
                        primaryCat(tarjeta) +
                        '" style="left:' +
                        fn2(arg.fecha) +
                        '%;margin-left:-4px" title="' +
                        esc(arg.text) +
                        " · " +
                        fmtShort(arg.fecha) +
                        '"></div>',
                    )
                    .join("");
                return (
                  '<div class="tl-fase" data-cat="' +
                  primaryCat(tarjeta) +
                  '" style="left:' +
                  val2.left +
                  "%;width:" +
                  val2.w +
                  '%;top:30px" title="' +
                  esc(fase.nombre) +
                  '"></div>' +
                  txt8
                );
              })
              .join("");
          txt6 +=
            '<div class="tl-track" style="height:' +
            fn4(tarjeta) +
            'px">\n        <div class="tl-bar ' +
            (vencida ? "overdue" : "") +
            '" draggable="true" data-drag="tl" data-cat="' +
            primaryCat(tarjeta) +
            '" data-id="' +
            tarjeta.id +
            '" data-action="card:open" title="' +
            esc(tarjeta.titulo) +
            ' — arrastrá para reprogramar" style="left:' +
            val.left +
            "%;width:" +
            val.w +
            '%;top:6px"><span>' +
            esc(tarjeta.titulo) +
            "</span></div>\n        " +
            txt7 +
            "</div>";
        }));
    }),
    '<div class="tl-full">' +
      html +
      '<div class="tl-wrap"><div class="tl-grid">\n    <div class="tl-left"><div class="tl-corner">Proyecto</div><div class="tl-rows-left">' +
      txt5 +
      '</div></div>\n    <div class="tl-right"><div style="width:' +
      txt2 +
      '">\n      <div class="tl-months" style="width:100%">' +
      txt3 +
      '</div>\n      <div class="tl-canvas" data-tlstart="' +
      iso +
      '" data-tldays="' +
      txt +
      '" style="position:relative;width:100%">' +
      txt4 +
      txt6 +
      '<div class="tl-today" style="left:' +
      val6 +
      '%"></div></div>\n    </div></div>\n  </div></div></div>'
  );
}
function mapaFilter(lista) {
  const val = state.filters;
  return lista.filter((tarjeta) => {
    if (val.sector === "__sin_sector__") {
      if ((tarjeta.sectores || []).length) return false;
    } else if (val.sector && !(tarjeta.sectores || []).includes(val.sector)) return false;
    if (val.cursoEstado === "activo" && tarjeta.enActualizacion) return false;
    if (val.cursoEstado === "actualizando" && !tarjeta.enActualizacion) return false;
    if (val.texto && !tarjeta.titulo.toLowerCase().includes(val.texto.toLowerCase())) return false;
    return true;
  });
}
function invCount(txt) {
  return state.cards.filter((tarjeta) => tarjeta.tipo === txt && inInventory(tarjeta)).length;
}
function invCard(arg) {
  return arg.tipo === "curso" ? cursoCard(arg) : arg.tipo === "edu-point" ? eduCard(arg) : recursoCard(arg);
}
function sectionDesarrolloAll() {
  return boardCards().filter((tarjeta) => INV_TIPOS.has(tarjeta.tipo));
}
function mapaStats() {
  const publicados = state.cards.filter(inInventory).length,
    enDesarrollo = sectionDesarrolloAll().length;
  return (
    '<div class="mapa-stats">' +
    [
      ["✦", publicados, "Publicado", "todos"],
      ["🚧", enDesarrollo, "En desarrollo", "desarrollo"],
      ["🎓", invCount("curso"), "Cursos", "cursos"],
      ["📍", invCount("edu-point"), "Edu Points", "edu-points"],
      ["🎬", invCountKind("contenido"), "Contenido suelto", "contenido"],
    ]
      .map(
        (arg) =>
          '<button class="mapa-stat' +
          (state.mapaSec === arg[3] ? " active" : "") +
          '" data-action="mapa:sec" data-sec="' +
          arg[3] +
          '"><span class="mapa-stat-ic">' +
          arg[0] +
          '</span><span class="mapa-stat-n">' +
          arg[1] +
          '</span><span class="mapa-stat-l">' +
          esc(arg[2]) +
          "</span></button>",
      )
      .join("") +
    "</div>"
  );
}
// Barra de composición por sector (mismo lenguaje que el desglose de
// almacenamiento o de lenguajes de un repo): un vistazo rápido de dónde
// está concentrado el contenido y dónde hay poco, más una fila de chips
// para elegir sector con nombre y número visibles. Clickear cualquiera de
// los dos filtra el resto del Mapa por ese sector.
function mapaSectorMap() {
  const conteo = {};
  let sinSector = 0;
  state.cards
    .filter((tarjeta) => INV_TIPOS.has(tarjeta.tipo))
    .forEach((tarjeta) => {
      if (!(tarjeta.sectores || []).length) {
        sinSector++;
        return;
      }
      tarjeta.sectores.forEach((sec) => {
        conteo[sec] = (conteo[sec] || 0) + 1;
      });
    });
  const entradas = Object.keys(conteo)
    .map((sec) => [sec, conteo[sec]])
    .sort((a, b) => b[1] - a[1]);
  if (sinSector) entradas.push(["", sinSector]);
  if (!entradas.length) return "";
  const total = entradas.reduce((acc, arg) => acc + arg[1], 0);
  const segmento = (arg) => {
    const sec = arg[0],
      n = arg[1],
      nombre = sec ? sectorName(sec) || sec : "Sin sector",
      activo = state.filters.sector === (sec || "__sin_sector__");
    return {
      sec,
      n,
      nombre,
      activo,
      attrs:
        'data-action="mapa:bubble" data-sector="' +
        (sec || "__sin_sector__") +
        '"' +
        (sec ? ' data-cat="' + sec + '"' : "") +
        ' title="' +
        esc(nombre) +
        " · " +
        n +
        " (" +
        Math.round((n / total) * 100) +
        '%)"',
    };
  };
  return (
    '<div class="mapa-sectormap">\n      <div class="mapa-sectormap-t">Distribución por sector</div>\n      <div class="mapa-distbar">' +
    entradas
      .map((arg) => {
        const s = segmento(arg);
        return (
          "<button class=\"mapa-distseg" +
          (s.activo ? " active" : "") +
          '" style="flex-grow:' +
          s.n +
          (s.sec ? "" : ";background:var(--ink-soft)") +
          '" ' +
          s.attrs +
          "></button>"
        );
      })
      .join("") +
    '</div>\n      <div class="mapa-chips">' +
    entradas
      .map((arg) => {
        const s = segmento(arg);
        return (
          '<button class="mapa-chip' +
          (s.activo ? " active" : "") +
          '"' +
          (s.sec ? ' data-cat="' + s.sec + '"' : "") +
          " " +
          s.attrs +
          '><span class="mapa-chip-dot"' +
          (s.sec ? "" : ' style="background:var(--ink-soft)"') +
          '></span>' +
          esc(s.nombre) +
          ' <b>' +
          s.n +
          "</b></button>"
        );
      })
      .join("") +
    "</div>\n    </div>"
  );
}
function renderMapa() {
  const cantidad = state.cards.filter(inInventory).length,
    lista = [
      {
        id: "todos",
        label: "✦ Todos",
        n: cantidad,
      },
      {
        id: "desarrollo",
        label: "🚧 En desarrollo",
        n: sectionDesarrolloAll().length,
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
        id: "contenido",
        label: "🎬 Contenido suelto",
        n: invCountKind("contenido"),
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
    html =
      mapaStats() +
      mapaSectorMap() +
      '<div class="mapa-secciones">' +
      lista
        .map(
          (arg) =>
            '<div class="mapa-sec ' +
            (state.mapaSec === arg.id ? "active" : "") +
            '" data-action="mapa:sec" data-sec="' +
            arg.id +
            '">' +
            arg.label +
            " <b>(" +
            arg.n +
            ")</b></div>",
        )
        .join("") +
      "</div>";
  let txt = "";
  if (state.mapaSec === "todos") txt = sectionTodos();
  else {
    if (state.mapaSec === "desarrollo") txt = sectionDesarrollo();
    else {
      if (state.mapaSec === "cursos") txt = sectionCursos();
      else {
        if (state.mapaSec === "edu-points") txt = sectionEduPoints();
        else {
          if (state.mapaSec === "edu-archivos") txt = renderEduArchivos();
          else {
            if (state.mapaSec === "contenido") txt = sectionContenido();
            else {
              if (state.mapaSec === "apps")
                txt = sectionInv(
                  "app-web",
                  "🖥️",
                  "Sin aplicativos activos",
                  "Publicá un aplicativo web del tablero (botón en su ficha) para verlo acá.",
                );
              else {
                if (state.mapaSec === "bases")
                  txt = sectionInv(
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
    }
  }
  return html + txt;
}
function sectionContenido() {
  const lista = mapaFilter(
    state.cards.filter((tarjeta) => INV_KIND[tarjeta.tipo] === "contenido" && inInventory(tarjeta)),
  );
  if (!lista.length)
    return emptyState(
      "🎬",
      "Sin contenido suelto activo",
      "Publicá un video, guía, capacitación presencial o POES del tablero (botón en su ficha) para verlo acá.",
    );
  return '<div class="cursos-grid">' + lista.map(recursoCard).join("") + "</div>";
}
function sectionDesarrollo() {
  const lista = mapaFilter(sectionDesarrolloAll());
  if (!lista.length)
    return emptyState(
      "🚧",
      "Nada en desarrollo ahora mismo",
      "Todo lo que crees en el Planner con un tipo publicable (curso, Edu Point, video, guía, app, base…) va a aparecer acá hasta que lo publiques.",
    );
  return '<div class="cursos-grid">' + lista.map(desarrolloCard).join("") + "</div>";
}
function desarrolloCard(tarjeta) {
  const val = primaryCat(tarjeta),
    avance = progress(tarjeta),
    estado = ESTADOS.find((e) => e.id === tarjeta.estado) || { nombre: tarjeta.estado, dot: "#999" };
  return (
    '<article class="curso" data-cat="' +
    val +
    '" data-id="' +
    tarjeta.id +
    '" data-action="card:open">\n    <div class="curso-img" style="height:78px"><span class="curso-estado upd">' +
    ((TIPOS[tarjeta.tipo] || {}).icon || "") +
    " " +
    esc(estado.nombre) +
    '</span></div>\n    <div class="curso-body">\n      <h4>' +
    esc(tarjeta.titulo) +
    '</h4>\n      <div class="badges">' +
    sectoresBadges(tarjeta.sectores) +
    "</div>\n      " +
    (avance.total
      ? '<div class="prog-row"><div class="progress"><div class="progress-bar" style="width:' +
        avance.pct +
        '%"></div></div><span class="prog-num">' +
        avance.done +
        "/" +
        avance.total +
        "</span></div>"
      : '<div class="curso-bajada">Todavía sin checklist cargado.</div>') +
    '\n      <div class="curso-foot">' +
    stackHTML(tarjeta) +
    "</div>\n    </div>\n  </article>"
  );
}
function sectionTodos() {
  const lista = mapaFilter(state.cards.filter(inInventory));
  if (!lista.length)
    return emptyState(
      "✦",
      "Sin elementos activos",
      "Publicá cursos, Edu Points, apps o bases para verlos todos juntos acá.",
    );
  const txt = state.filters.sector
    ? " de <b>" +
      esc(state.filters.sector === "__sin_sector__" ? "Sin sector" : sectorName(state.filters.sector) || state.filters.sector) +
      "</b>"
    : "";
  return (
    '<div style="font-size:12.5px;color:var(--ink-soft);margin:-6px 0 12px">' +
    lista.length +
    " elemento" +
    (lista.length !== 1 ? "s" : "") +
    " activo" +
    (lista.length !== 1 ? "s" : "") +
    txt +
    ' — todo el inventario junto, filtrable por sector.</div><div class="cursos-grid">' +
    lista.map(invCard).join("") +
    "</div>"
  );
}
function eduRowsFor() {
  let lista = EDU_DB.filter((recurso) => recurso.sec === state.eduSector);
  if (state.eduEst) lista = lista.filter((recurso) => recurso.est === state.eduEst);
  if (state.eduQ) {
    const txt = state.eduQ.toLowerCase();
    lista = lista.filter(
      (recurso) =>
        recurso.nom.toLowerCase().includes(txt) ||
        (recurso.nota || "").toLowerCase().includes(txt) ||
        (recurso.sub || "").toLowerCase().includes(txt) ||
        (recurso.secNom || "").toLowerCase().includes(txt),
    );
  }
  return lista;
}
function eduFileRow(recurso) {
  const val = EST_META[recurso.est] || EST_META.pendiente,
    txt = EDU_TIPO_IC[recurso.tipo] || "📎";
  return (
    '<div class="edu-file ' +
    (recurso.est === "eliminado" ? "elim" : "") +
    '"><span class="edu-ic">' +
    txt +
    '</span>\n    <span class="edu-f-nom">' +
    esc(recurso.nom) +
    (recurso.tipo ? ' <span class="edu-f-tipo">' + recurso.tipo + "</span>" : "") +
    '</span>\n    <span class="edu-est" style="--c:' +
    val.c +
    '">' +
    val.l +
    "</span>\n    " +
    (recurso.nota
      ? '<span class="edu-f-nota" title="' + esc(recurso.nota) + '">' + esc(recurso.nota) + "</span>"
      : "") +
    "</div>"
  );
}
function eduListHTML() {
  const lista = eduRowsFor();
  if (!lista.length)
    return (
      '<div class="edu-none">' +
      (state.eduEst || state.eduQ
        ? "Sin archivos con ese filtro."
        : "Todavía no cargamos archivos de este sector.") +
      "</div>"
    );
  const obj = {};
  lista.forEach((recurso) => {
    (obj[recurso.secNom] = obj[recurso.secNom] || []).push(recurso);
  });
  const flag = Object.keys(obj).length > 1;
  return Object.keys(obj)
    .map((arg) => {
      const obj2 = {};
      obj[arg].forEach((recurso) => {
        (obj2[recurso.sub] = obj2[recurso.sub] || []).push(recurso);
      });
      const txt = Object.keys(obj2)
        .map(
          (arg2) =>
            (arg2 ? '<div class="edu-sub">' + esc(arg2) + "</div>" : "") +
            '<div class="edu-files">' +
            obj2[arg2].map(eduFileRow).join("") +
            "</div>",
        )
        .join("");
      return "" + (flag ? '<div class="edu-secgroup">' + esc(arg) + "</div>" : "") + txt;
    })
    .join("");
}
function renderEduList() {
  const el = $("#eduList");
  if (el) el.innerHTML = eduListHTML();
}
function eduKpi(cantidad, txt, txt2) {
  return (
    '<div class="edu-kpi"><div class="edu-kpi-n" style="color:' +
    txt2 +
    '">' +
    cantidad +
    '</div><div class="edu-kpi-l">' +
    txt +
    "</div></div>"
  );
}
function renderEduArchivos() {
  if (!state.eduSector) {
    const obj = {};
    EDU_DB.forEach((recurso) => {
      (obj[recurso.sec] = obj[recurso.sec] || []).push(recurso);
    });
    const cantidad = EDU_DB.length,
      cantidad2 = EDU_DB.filter((recurso) => recurso.est === "listo").length,
      cantidad3 = Object.keys(obj).filter((arg) => SECTORES[arg]).length,
      lista3 = Object.keys(SECTORES)
        .slice()
        .sort(
          (arg, arg2) =>
            (obj[arg2] || []).length - (obj[arg] || []).length ||
            SECTORES[arg].nombre.localeCompare(SECTORES[arg2].nombre),
        ),
      txt = lista3
        .map((arg) => {
          const lista2 = obj[arg] || [],
            cantidad4 = lista2.length,
            cantidad5 = lista2.filter((recurso) => recurso.est === "listo").length,
            n = cantidad4 ? Math.round((cantidad5 / cantidad4) * 100) : 0;
          return (
            '<button class="edu-sec ' +
            (cantidad4 ? "" : "empty") +
            '" data-cat="' +
            arg +
            '" data-action="edu:sec" data-sec="' +
            arg +
            '">\n        <div class="edu-sec-top"><span class="edu-sec-nom">' +
            esc(SECTORES[arg].nombre) +
            "</span>" +
            (cantidad4 ? '<span class="edu-sec-pct">' + n + "%</span>" : "") +
            '</div>\n        <div class="edu-bar"><div class="edu-bar-fill" style="width:' +
            n +
            '%"></div></div>\n        <div class="edu-sec-foot">' +
            (cantidad4
              ? "<b>" +
                cantidad4 +
                "</b> archivos · " +
                cantidad5 +
                " listos · " +
                (cantidad4 - cantidad5) +
                " por hacer"
              : "Sin material aún") +
            "</div></button>"
          );
        })
        .join("");
    return (
      '<div class="edu-overview-head">\n        <div class="edu-kpis">' +
      eduKpi(cantidad, "archivos", "var(--coto-blue)") +
      eduKpi(cantidad2, "listos", "var(--ok)") +
      eduKpi(cantidad - cantidad2, "por hacer", "var(--warn)") +
      eduKpi(cantidad3 + "/" + Object.keys(SECTORES).length, "sectores", "#5A1ED2") +
      '</div>\n        <div style="font-size:12.5px;color:var(--ink-soft);margin-top:8px">Base de archivos de Edu Point por sector — en qué instancia está cada uno. Tocá un sector para ver sus archivos y qué falta terminar, corregir o mejorar.</div>\n      </div>\n      <div class="edu-sec-grid">' +
      txt +
      "</div>"
    );
  }
  const val = state.eduSector,
    nombre = SECTORES[val] ? SECTORES[val].nombre : val,
    lista = EDU_DB.filter((recurso) => recurso.sec === val),
    txt2 = ["", "listo", "revisar", "rehacer", "pendiente", "nuevo", "eliminado"]
      .filter((arg) => !arg || lista.some((recurso) => recurso.est === arg))
      .map(
        (arg) =>
          '<button class="edu-fchip ' +
          (state.eduEst === arg ? "on" : "") +
          '" data-action="edu:est" data-est="' +
          arg +
          '" style="' +
          (arg ? "--c:" + EST_META[arg].c : "") +
          '">' +
          (arg ? EST_META[arg].l : "Todos") +
          (arg ? " <b>" + lista.filter((recurso) => recurso.est === arg).length + "</b>" : "") +
          "</button>",
      )
      .join("");
  return (
    '<nav class="crumbs"><button class="crumb" data-action="mapa:sec" data-sec="todos">Mapa</button><span>›</span><button class="crumb" data-action="edu:back">Archivos Edu Point</button><span>›</span><span class="crumb cur" data-cat="' +
    val +
    '">' +
    esc(nombre) +
    '</span></nav>\n    <div class="edu-detail-head" data-cat="' +
    val +
    '">\n      <span class="badge badge-cat" data-cat="' +
    val +
    '">' +
    esc(nombre) +
    '</span>\n      <span class="pill">' +
    lista.length +
    " archivo" +
    (lista.length !== 1 ? "s" : "") +
    "</span>\n      " +
    (lista.length
      ? '<input class="edu-search" id="eduSearch" placeholder="Buscar archivo…" value="' +
        esc(state.eduQ) +
        '" autocomplete="off">'
      : "") +
    "\n    </div>\n    " +
    (lista.length ? '<div class="edu-fchips">' + txt2 + "</div>" : "") +
    '\n    <div id="eduList">' +
    eduListHTML() +
    "</div>"
  );
}
function sectionInv(txt, txt2, txt3, txt4) {
  const lista = mapaFilter(state.cards.filter((tarjeta) => tarjeta.tipo === txt && inInventory(tarjeta)));
  if (!lista.length) return emptyState(txt2, txt3, txt4);
  return '<div class="cursos-grid">' + lista.map(recursoCard).join("") + "</div>";
}
function recursoCard(tarjeta) {
  const val = primaryCat(tarjeta),
    obj2 = tarjeta.catalogo || {},
    obj = tarjeta.ficha || {},
    def = member(tarjeta.responsable),
    txt =
      {
        operativo: "● Operativo",
        mantenimiento: "◐ Mantenimiento",
        baja: "○ Baja",
      }[obj.estadoOp] || "● Operativo";
  return (
    '<article class="curso" data-cat="' +
    val +
    '" data-id="' +
    tarjeta.id +
    '" data-action="card:open">\n    <div class="curso-img" style="height:78px"><span class="curso-estado ' +
    (obj.estadoOp === "mantenimiento" ? "upd" : "") +
    '">' +
    ((TIPOS[tarjeta.tipo] || {}).icon || "") +
    " " +
    txt +
    '</span></div>\n    <div class="curso-body">\n      <h4>' +
    esc(tarjeta.titulo) +
    '</h4>\n      <div class="badges">' +
    sectoresBadges(tarjeta.sectores) +
    '</div>\n      <div class="curso-bajada">' +
    esc(obj2.bajada || "") +
    '</div>\n      <div class="curso-foot"><span>👤 ' +
    (def ? esc(def.nombre) : obj.owner ? esc(obj.owner) : "—") +
    "</span>" +
    (obj.url
      ? '<a class="moodle" href="' +
        esc(obj.url) +
        '" target="_blank" rel="noopener" onclick="event.stopPropagation()">Abrir ↗</a>'
      : "") +
    "</div>\n    </div>\n  </article>"
  );
}
function sectionCursos() {
  const lista = mapaFilter(state.cards.filter((tarjeta) => tarjeta.tipo === "curso" && inInventory(tarjeta)));
  if (!lista.length)
    return emptyState(
      "◎",
      "Sin cursos activos",
      "Publicá un curso del tablero o ingestá el catálogo con “⤓ Catálogo”.",
    );
  return '<div class="cursos-grid">' + lista.map(cursoCard).join("") + "</div>";
}
function cursoCard(tarjeta) {
  const val = primaryCat(tarjeta),
    obj = tarjeta.catalogo || {};
  return (
    '<article class="curso" data-cat="' +
    val +
    '" data-id="' +
    tarjeta.id +
    '" data-action="card:open">\n    <div class="curso-img">' +
    (obj.imagen ? '<img src="' + esc(obj.imagen) + '" alt="" onerror="this.remove()">' : "") +
    '\n      <span class="curso-estado ' +
    (tarjeta.enActualizacion ? "upd" : "") +
    '">' +
    (tarjeta.enActualizacion ? "🔄 En actualización" : "● Activo") +
    '</span></div>\n    <div class="curso-body">\n      <h4>' +
    esc(tarjeta.titulo) +
    '</h4>\n      <div class="badges">' +
    sectoresBadges(tarjeta.sectores) +
    '</div>\n      <div class="curso-bajada">' +
    esc(obj.bajada || obj.descripcion || "") +
    '</div>\n      <div class="curso-foot">\n        ' +
    (obj.anio ? "<span>📅 " + esc(obj.anio) + "</span>" : "") +
    (obj.duracion ? "<span>⏱ " + esc(obj.duracion) + "</span>" : "") +
    (obj.personas ? "<span>👥 " + esc(obj.personas) + "</span>" : "") +
    "\n        " +
    (tarjeta.linkMoodle
      ? '<a class="moodle" href="' +
        esc(tarjeta.linkMoodle) +
        '" target="_blank" rel="noopener" onclick="event.stopPropagation()">Moodle ↗</a>'
      : '<span class="moodle" style="color:var(--ink-soft)">sin link</span>') +
    "\n      </div>\n      " +
    (val && val !== "tbd"
      ? '<button class="btn btn-ghost btn-sm rel-btn" data-action="mapa:relacionadas" data-sector="' +
        val +
        '" title="Ver tareas del Planner de este sector">📋 Ver tareas relacionadas</button>'
      : "") +
    "\n    </div>\n  </article>"
  );
}
function sectionEduPoints() {
  const lista = mapaFilter(
    state.cards.filter((tarjeta) => tarjeta.tipo === "edu-point" && inInventory(tarjeta)),
  );
  if (!lista.length)
    return emptyState(
      "📍",
      "Sin Edu Points colocados",
      "Marcá un Edu Point del tablero como colocado (botón en su ficha) para verlo en el inventario.",
    );
  return '<div class="cursos-grid">' + lista.map(eduCard).join("") + "</div>";
}
function eduCard(tarjeta) {
  const val = primaryCat(tarjeta),
    obj = tarjeta.catalogo || {},
    def = member(tarjeta.responsable);
  return (
    '<article class="curso" data-cat="' +
    val +
    '" data-id="' +
    tarjeta.id +
    '" data-action="card:open">\n    <div class="curso-img" style="height:92px"><span class="curso-estado ' +
    (tarjeta.enActualizacion ? "upd" : "") +
    '">' +
    (tarjeta.enActualizacion ? "🔄 Actualizando" : "📍 Colocado") +
    '</span>\n      <div style="position:absolute;top:8px;right:8px;width:34px;height:34px;border-radius:9px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:var(--shadow)">▦</div></div>\n    <div class="curso-body">\n      <h4>' +
    esc(tarjeta.titulo) +
    '</h4>\n      <div class="badges">' +
    sectoresBadges(tarjeta.sectores) +
    '</div>\n      <div class="curso-bajada">' +
    esc(obj.bajada || "Pieza Edu Point con QR colocada en sala.") +
    '</div>\n      <div class="curso-foot"><span>👤 ' +
    (def ? esc(def.nombre) : "—") +
    "</span>" +
    (tarjeta.linkMoodle
      ? '<a class="moodle" href="' +
        esc(tarjeta.linkMoodle) +
        '" target="_blank" rel="noopener" onclick="event.stopPropagation()">Enlace ↗</a>'
      : "") +
    "</div>\n    </div>\n  </article>"
  );
}
function renderInicio() {
  const lista2 = boardCards(),
    cantidad = lista2.filter(isOverdue).length,
    cantidad2 = alertasSinLeer().length,
    lista = [
      {
        go: "kanban",
        cat: "coto-digital",
        ic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4v16M12 4v11M19 4v13"/></svg>',
        t: "Planner",
        d: "Lo que estamos haciendo, por estado.",
      },
      {
        go: "calendario",
        cat: "salon",
        ic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>',
        t: "Calendario",
        d: "Qué pasa y cuándo, mes a mes.",
      },
      {
        go: "timeline",
        cat: "mantenimiento",
        ic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h10M8 12h11M4 17h7"/></svg>',
        t: "Timeline",
        d: "El panorama macro del área.",
      },
      {
        go: "mapa",
        cat: "servicio-medico",
        ic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z"/><path d="M9 4v14M15 6v14"/></svg>',
        t: "Mapa del área",
        d: "Cursos, Edu Points, apps y bases.",
      },
    ],
    fn = (arg, arg2) =>
      '<button class="hub-card" data-cat="' +
      arg.cat +
      '" data-action="hub:go" data-go="' +
      arg.go +
      '" style="animation-delay:' +
      arg2 * 55 +
      'ms">\n    <span class="hub-ic">' +
      arg.ic +
      '</span>\n    <span class="hub-tx"><span class="hub-t">' +
      arg.t +
      '</span><span class="hub-d">' +
      esc(arg.d) +
      '</span></span>\n    <span class="hub-arrow">→</span></button>';
  return (
    '<div class="hub">\n    <div class="hub-main">\n    <div class="hub-hero">\n      <h1 class="hub-title">Hola, ' +
    esc(state.user || "equipo") +
    '</h1>\n      <p class="hub-sub">¿Qué querés ver hoy?' +
    (cantidad
      ? ' · <b style="color:var(--bad)">' + cantidad + " vencida" + (cantidad !== 1 ? "s" : "") + "</b>"
      : "") +
    (cantidad2 ? " · <b>" + cantidad2 + "</b> alerta" + (cantidad2 !== 1 ? "s" : "") : "") +
    '</p>\n    </div>\n    <div class="hub-grid">' +
    lista.map(fn).join("") +
    "</div>\n    " +
    renderResumen() +
    '\n    </div>\n    <div class="hub-side">' +
    slotWidgetHTML() +
    fraseWidgetHTML() +
    "</div>\n  </div>"
  );
}
const SLOT_SIMBOLOS = ["🍒", "🍋", "⭐", "🍀", "💎", "🔔", "7️⃣", "🍇"],
  SLOT_FRASES = [
  "Ponete a laburar 😤",
  "Vas bien, dale que va 💪",
  "Te merecés un cafecito ☕",
  "Hora del mate 🧉",
  "Tomate 5 minutos y volvés",
  "Hoy es buen día para tildar una tarea",
  "Menos scroll, más checklist 👀",
  "Sos un crack, seguí así 🌟",
  "La productividad no se mide en pestañas abiertas",
  "Andá a estirar las piernas un toque",
  "Tomate el laburo con soda 🥤",
  "El Planner no se llena solo, dale una mano",
  "Respirá hondo y arrancá de nuevo",
  "Una cosa a la vez, tranqui",
  "Los grandes proyectos se arman de a poquito",
  "Che, ¿ya hidrataste? 💧",
  "Metele con toda, el equipo cuenta con vos",
  "Una tarjeta completada es una victoria",
  "Descanso corto, foco largo",
  "Sonreí, hoy también suma",
  "Guardá lo que hiciste y date una vuelta",
  "El café se enfría, andá a tomarlo",
  "Vos podés con esto y más",
  "Un aplauso interno para vos 👏",
  "Todo bien por acá, seguí no más",
];
// La máquina vive fija en la barra lateral de Inicio (no en un modal): se
// juega ahí mismo, y el historial de abajo se actualiza al toque.
function slotWidgetHTML() {
  ensureFraseDay();
  const mia = state.cotofrase.porUsuario[state.user];
  if (mia)
    return (
      '<div class="slot-widget locked">\n      <div class="slot-modal-t">🎰 CotoFrase del día</div>\n      <div class="slot-modal-d">Ya tiraste de la palanca hoy — volvé mañana por otra.</div>\n      <div class="slot-result show">' +
      esc(mia) +
      "</div>\n    </div>"
    );
  return (
    '<div class="slot-widget">\n      <div class="slot-modal-t">🎰 CotoFrase del día</div>\n      <div class="slot-modal-d">Tirá de la palanca y a ver qué te toca. Una vez por día.</div>\n      <div class="slot-reels">' +
    [1, 2, 3].map((n) => '<div class="slot-reel" id="slotReel' + n + '">' + SLOT_SIMBOLOS[0] + "</div>").join("") +
    '</div>\n      <div class="slot-result" id="slotResult"></div>\n      <button class="slot-lever" id="slotLever" data-action="slot:pull">🎲 Tirar de la palanca</button>\n    </div>'
  );
}
// Los 3 rodillos frenan en cascada (500 / 800 / 1150ms) para que se sienta
// como una tragamonedas de verdad y no un simple sorteo instantáneo.
function tirarSlot() {
  const reels = [1, 2, 3].map((n) => $("#slotReel" + n)),
    resultado = $("#slotResult"),
    boton = $("#slotLever");
  if (!reels[0] || reels[0].dataset.spinning) return;
  (reels.forEach((r) => (r.dataset.spinning = "1")),
    boton && (boton.disabled = true),
    resultado && (resultado.classList.remove("show"), (resultado.textContent = "")));
  const paradas = [500, 800, 1150];
  reels.forEach((reel, i) => {
    const timer = setInterval(() => {
      reel.textContent = SLOT_SIMBOLOS[Math.floor(Math.random() * SLOT_SIMBOLOS.length)];
    }, 60);
    setTimeout(() => {
      (clearInterval(timer),
        (reel.textContent = SLOT_SIMBOLOS[Math.floor(Math.random() * SLOT_SIMBOLOS.length)]),
        delete reel.dataset.spinning,
        reel.classList.add("stop"),
        setTimeout(() => reel.classList.remove("stop"), 300));
      if (i === reels.length - 1) {
        ensureFraseDay();
        const frase = SLOT_FRASES[Math.floor(Math.random() * SLOT_FRASES.length)],
          desc = $("#slotLever") && $("#slotLever").closest(".slot-widget").querySelector(".slot-modal-d");
        ((state.cotofrase.porUsuario[state.user] = frase), touch());
        (resultado && ((resultado.textContent = frase), resultado.classList.add("show")),
          desc && (desc.textContent = "Ya tiraste de la palanca hoy — volvé mañana por otra."),
          boton && (boton.remove()));
        renderFraseWidget();
      }
    }, paradas[i]);
  });
}
// El "cartelito" fijo con la frase del día: solo aparece una vez que alguien
// del equipo tiró de la palanca, y muestra la propia arriba de todo más un
// mini ranking de quién sacó qué.
const FRASE_PALETA = ["#006EA0", "#00C88C", "#8232C8", "#F0A032", "#D71E50", "#1EAADC", "#6E328C", "#CD1E1E", "#2E9E8F", "#E2A03F"];
function colorForName(nombre) {
  const miembro = TEAM.find((m) => m.nombre.toLowerCase() === (nombre || "").toLowerCase());
  if (miembro) return miembro.color;
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash = (hash * 31 + nombre.charCodeAt(i)) >>> 0;
  return FRASE_PALETA[hash % FRASE_PALETA.length];
}
// El historial del día, centrado abajo del todo en Inicio: la propia frase
// arriba y destacada, el resto del equipo debajo a modo de mini ranking.
function fraseWidgetHTML() {
  ensureFraseDay();
  const porUsuario = state.cotofrase.porUsuario,
    nombres = Object.keys(porUsuario);
  if (!nombres.length) return '<div class="frase-widget" id="fraseWidget" hidden></div>';
  const ordenados = nombres.slice().sort((a, b) => {
    if (a === state.user) return -1;
    if (b === state.user) return 1;
    return a.localeCompare(b, "es");
  });
  return (
    '<div class="frase-widget" id="fraseWidget">\n      <div class="frase-card">\n        <div class="frase-card-t">🎰 CotoFrases de hoy</div>\n        <div class="frase-list">' +
    ordenados
      .map((nombre) => {
        const mia = nombre === state.user;
        return (
          '<div class="frase-row' +
          (mia ? " mine" : "") +
          '"><span class="frase-avatar" style="background:' +
          colorForName(nombre) +
          '">' +
          esc(nombre.slice(0, 1).toUpperCase()) +
          '</span><span class="frase-row-n">' +
          (mia ? "Vos" : esc(nombre)) +
          '</span><span class="frase-row-f">' +
          esc(porUsuario[nombre]) +
          "</span></div>"
        );
      })
      .join("") +
    "</div>\n      </div>\n    </div>"
  );
}
function renderFraseWidget() {
  const el = $("#fraseWidget");
  if (el) el.outerHTML = fraseWidgetHTML();
}
const ROULETTE_COLORS = ["#006EA0", "#1EAADC", "#00C88C", "#F0A032", "#D71E50", "#8232C8", "#2E9E8F", "#CD1E1E"];
// "No iniciado" = una tarjeta de curso que ya está en el Planner pero
// sigue en Pendiente: nadie la movió todavía a En desarrollo.
function cursosPendientes() {
  return boardCards().filter((tarjeta) => tarjeta.tipo === "curso" && tarjeta.estado === "pendiente");
}
function rouletteModalHTML() {
  const pendientes = cursosPendientes();
  if (!pendientes.length)
    return (
      '<div class="roulette-modal">\n      <div class="roulette-modal-t">🎡 ¿Qué curso me toca?</div>\n      <div class="roulette-modal-d">🎉 No hay cursos pendientes por arrancar.</div>\n    </div>'
    );
  const n = pendientes.length,
    segAngle = 360 / n,
    tam = Math.max(220, Math.min(300, 190 + n * 5)),
    fuente = n > 16 ? 8 : n > 10 ? 9 : 10,
    corte = n > 16 ? 12 : n > 10 ? 16 : 22,
    gradient = pendientes
      .map((c, i) => ROULETTE_COLORS[i % ROULETTE_COLORS.length] + " " + i * segAngle + "deg " + (i + 1) * segAngle + "deg")
      .join(", "),
    labels = pendientes
      .map((c, i) => {
        const mid = i * segAngle + segAngle / 2,
          txt = c.titulo.length > corte ? c.titulo.slice(0, corte - 1) + "…" : c.titulo;
        return (
          '<span class="roulette-label" style="font-size:' +
          fuente +
          "px;transform:rotate(" +
          mid +
          "deg) translateY(" +
          (tam / 2 - 34) +
          'px)">' +
          esc(txt) +
          "</span>"
        );
      })
      .join("");
  return (
    '<div class="roulette-modal">\n      <div class="roulette-modal-t">🎡 ¿Qué curso me toca?</div>\n      <div class="roulette-modal-d">Giramos entre los cursos pendientes sin arrancar.</div>\n      <div class="roulette-wrap" style="width:' +
    tam +
    "px;height:" +
    tam +
    'px">\n        <div class="roulette-pointer">▼</div>\n        <div class="roulette-wheel" id="rouletteWheel" style="background:conic-gradient(' +
    gradient +
    ')">' +
    labels +
    '<div class="roulette-hub"></div></div>\n      </div>\n      <div class="roulette-result" id="rouletteResult"></div>\n      <button class="roulette-spin" id="rouletteSpin" data-action="roulette:spin">🎡 Girar la ruleta</button>\n    </div>'
  );
}
function abrirRuleta() {
  openModal(rouletteModalHTML());
}
function tirarRuleta() {
  const wheel = $("#rouletteWheel"),
    resultado = $("#rouletteResult"),
    boton = $("#rouletteSpin"),
    pendientes = cursosPendientes();
  if (!wheel || wheel.dataset.spinning || !pendientes.length) return;
  const n = pendientes.length,
    segAngle = 360 / n,
    idx = Math.floor(Math.random() * n),
    elegido = pendientes[idx],
    centerAngle = idx * segAngle + segAngle / 2,
    prevRot = parseFloat(wheel.dataset.rot || "0"),
    vueltas = 5 + Math.floor(Math.random() * 3),
    finalMod = (360 - centerAngle) % 360,
    delta = (finalMod - (prevRot % 360) + 360) % 360,
    nuevoRot = prevRot + vueltas * 360 + delta;
  ((wheel.dataset.spinning = "1"),
    (wheel.dataset.rot = String(nuevoRot)),
    boton && (boton.disabled = true),
    resultado && (resultado.classList.remove("show"), (resultado.innerHTML = "")),
    (wheel.style.transform = "rotate(" + nuevoRot + "deg)"));
  setTimeout(() => {
    (delete wheel.dataset.spinning,
      resultado &&
        (resultado.classList.add("show"),
        (resultado.innerHTML =
          "Te toca: <b>" +
          esc(elegido.titulo) +
          '</b><br><button class="btn btn-sm btn-primary" style="margin-top:8px" data-action="card:open" data-id="' +
          elegido.id +
          '">Abrir tarjeta</button>')),
      boton && (boton.disabled = false));
  }, 3200);
}
function renderResumen() {
  const lista = boardCards(),
    cantidad = state.cards.filter((tarjeta) => tarjeta.tipo === "curso" && inInventory(tarjeta)).length,
    cantidad2 = state.cards.filter((tarjeta) => tarjeta.tipo === "edu-point" && inInventory(tarjeta)).length,
    cantidad3 = lista.filter((arg) => arg.estado === "en-revision").length,
    cantidad4 = lista.filter(isOverdue).length,
    fn = (cantidad5, txt, txt2, txt3, txt4, txt5, filtEstado, quick) =>
      '<div class="kpi' +
      (txt4 ? " kpi-go" : "") +
      '" style="--kpi:' +
      txt3 +
      '" ' +
      (txt4
        ? 'data-action="kpi:go" data-go="' +
          txt4 +
          '" ' +
          (txt5 ? 'data-sec="' + txt5 + '" ' : "") +
          (filtEstado ? 'data-filt-estado="' + filtEstado + '" ' : "") +
          (quick ? 'data-quick="' + quick + '" ' : "")
        : "") +
      '>\n    <div class="kpi-num">' +
      cantidad5 +
      '</div><div class="kpi-lbl">' +
      txt +
      "</div>" +
      (txt2 ? '<div class="kpi-sub">' + txt2 + "</div>" : "") +
      "</div>",
    cantidad6 = lista.length || 1,
    txt6 = ESTADOS.map((estado) => {
      const cantidad5 = lista.filter((arg) => arg.estado === estado.id).length;
      return (
        '<div class="bar-line"><span class="bl-lbl">' +
        estado.nombre +
        '</span><div class="bl-track"><div class="bl-fill" style="width:' +
        Math.round((cantidad5 / cantidad6) * 100) +
        "%;background:" +
        estado.dot +
        '"></div></div><span class="bl-num">' +
        cantidad5 +
        "</span></div>"
      );
    }).join(""),
    iso = todayISO(),
    iso2 = isoOf(addDays(new Date(), 45)),
    lista2 = lista
      .filter((arg) => {
        const val = arg.fin || arg.inicio;
        return val && val <= iso2;
      })
      .sort((arg, arg2) => (arg.fin || arg.inicio).localeCompare(arg2.fin || arg2.inicio))
      .slice(0, 8),
    txt7 = lista2.length
      ? lista2
          .map((tarjeta) => {
            const val = tarjeta.fin || tarjeta.inicio,
              flag = val < iso,
              val2 = daysBetween(iso, val),
              txt = flag ? "−" + Math.abs(val2) + "d" : val2 === 0 ? "hoy" : val2 + "d";
            return (
              '<div class="venc" data-id="' +
              tarjeta.id +
              '" data-action="card:open"><span class="venc-d ' +
              (flag ? "over" : "") +
              '">' +
              txt +
              '</span><span class="venc-t">' +
              esc(tarjeta.titulo) +
              "</span>" +
              stackHTML(tarjeta) +
              "</div>"
            );
          })
          .join("")
      : '<div style="color:var(--ink-soft);font-size:13px;padding:6px 0">Nada en los próximos 45 días 🎉</div>',
    obj = {};
  (TEAM.forEach((miembro) => (obj[miembro.id] = 0)),
    lista.forEach((tarjeta) => {
      [tarjeta.responsable, ...(tarjeta.asignados || [])]
        .filter((arg2, arg3, arg) => arg2 && arg.indexOf(arg2) === arg3)
        .forEach((arg) => {
          if (obj[arg] != null) obj[arg]++;
        });
    }));
  const val3 = Math.max(1, ...Object.values(obj)),
    txt8 = TEAM.map((miembro) => {
      const overload = obj[miembro.id] === val3 && val3 > 1;
      return (
        '<div class="bar-line' +
        (overload ? " overload" : "") +
        '"><span class="bl-lbl">' +
        avatarHTML(miembro.id, true) +
        " " +
        miembro.nombre +
        (overload ? ' <span class="badge prio" style="margin-left:4px;font-size:10px">⚠ sobrecargado</span>' : "") +
        '</span><div class="bl-track"><div class="bl-fill" style="width:' +
        Math.round((obj[miembro.id] / val3) * 100) +
        "%;background:" +
        miembro.color +
        '"></div></div><span class="bl-num">' +
        obj[miembro.id] +
        "</span></div>"
      );
    }).join(""),
    objSec = {};
  lista.forEach((tarjeta) => {
    (tarjeta.sectores || []).forEach((s) => {
      objSec[s] = (objSec[s] || 0) + 1;
    });
  });
  const secMax = Math.max(1, ...Object.values(objSec)),
    txt10 = Object.keys(objSec)
      .sort((a, b) => objSec[b] - objSec[a])
      .slice(0, 8)
      .map(
        (s) =>
          '<button class="bar-line bar-line-btn" data-action="sec:go" data-sector="' +
          s +
          '" data-cat="' +
          s +
          '"><span class="bl-lbl">' +
          esc(sectorName(s) || s) +
          '</span><div class="bl-track"><div class="bl-fill" style="width:' +
          Math.round((objSec[s] / secMax) * 100) +
          '%;background:var(--cat)"></div></div><span class="bl-num">' +
          objSec[s] +
          "</span></button>",
      )
      .join("");
  const obj2 = {};
  lista.forEach((arg) => (obj2[arg.tipo] = (obj2[arg.tipo] || 0) + 1));
  const txt9 = Object.keys(obj2)
    .sort((arg, arg2) => obj2[arg2] - obj2[arg])
    .map(
      (arg) =>
        '<span class="chipcount">' +
        ((allTipos()[arg] || {}).icon || "•") +
        " " +
        ((allTipos()[arg] || {}).nombre || arg) +
        " · " +
        obj2[arg] +
        "</span>",
    )
    .join("");
  const desc = (txt) => '<div class="res-desc">' + txt + "</div>";
  return (
    '<div style="margin:40px 0 6px;padding-top:32px;border-top:1px solid var(--line)"><h2 style="font-size:21px">Resumen del área</h2>\n    <div style="color:var(--ink-soft);font-size:13px;margin:2px 0 14px">Este panel mira dos cosas separadas: el <b>Planner</b> (las tareas que el equipo tiene en curso ahora) y el <b>Mapa</b> (el inventario ya publicado: cursos, Edu Points). Los 3 primeros números son del Planner; los últimos 2, del Mapa.</div></div>\n    <div class="res-grid">\n      ' +
    fn(lista.length, "Proyectos en el tablero", "tareas activas ahora en el Planner", "var(--coto-blue)", "kanban") +
    "\n      " +
    fn(
      cantidad3,
      "En revisión",
      "en el Planner, esperando aprobación para publicarse",
      "var(--warn)",
      "kanban",
      null,
      "en-revision",
    ) +
    "\n      " +
    fn(
      cantidad4,
      "Vencidas",
      "pasaron su fecha límite sin cerrarse",
      cantidad4 ? "var(--bad)" : "var(--ok)",
      "kanban",
      null,
      null,
      "venc",
    ) +
    "\n      " +
    fn(cantidad, "Cursos activos", "cursos e-learning ya publicados en el Mapa", "var(--ok)", "mapa", "cursos") +
    "\n      " +
    fn(cantidad2, "Edu Points", "piezas con QR ya colocadas en sucursal", "#546E7A", "mapa", "edu-points") +
    '\n    </div>\n    <div class="res-cols">\n      <div>\n        <div class="res-card"><h3>⚑ Próximos vencimientos <span class="mini">' +
    lista2.length +
    "</span></h3>" +
    desc("Tareas del Planner con fecha en los próximos 45 días.") +
    txt7 +
    '</div>\n        <div class="res-card"><h3>🧩 Mezcla por tipo</h3>' +
    desc("Cómo se reparten las tareas activas del Planner según su tipo.") +
    "<div>" +
    (txt9 || '<span style="color:var(--ink-soft)">—</span>') +
    '</div></div>\n        <div class="res-card"><h3>🎨 Mezcla por sector</h3>' +
    desc("En qué sector hay más tareas cargadas ahora mismo (Planner).") +
    (txt10 || '<span style="color:var(--ink-soft)">—</span>') +
    '</div>\n      </div>\n      <div>\n        <div class="res-card"><h3>◷ Por estado <span class="mini">' +
    lista.length +
    " total</span></h3>" +
    desc("Tareas activas del Planner agrupadas por su estado actual.") +
    txt6 +
    '</div>\n        <div class="res-card"><h3>👥 Carga del equipo <span class="mini">tablero</span></h3>' +
    desc("Cuántas tareas del tablero (Planner) tiene asignadas cada persona.") +
    txt8 +
    "</div>\n      </div>\n    </div>"
  );
}
function emptyState(txt, txt2, txt3) {
  return (
    '<div class="empty"><div class="big">' +
    txt +
    '</div><div style="font-weight:700;font-size:16px;color:var(--ink)">' +
    esc(txt2) +
    '</div><div style="margin-top:4px">' +
    esc(txt3) +
    "</div></div>"
  );
}
function openDetail(id2) {
  (closeModal(),
    (state.selectedId = id2),
    pushRecent(id2),
    renderPanel(),
    $("#panel").classList.add("open"),
    $("#overlay").classList.remove("hidden"));
}
function closePanel() {
  if (state.selectedId) {
    if (guardadoPendiente) flash("💾 Guardando… se termina solo, no hace falta esperar");
    else if (!state.saveError) flash("✓ Todo guardado");
  }
  ($("#panel").classList.remove("open"),
    $("#overlay").classList.add("hidden"),
    (state.selectedId = null),
    render());
}
function sectorPicker(tarjeta) {
  const lista = tarjeta.sectores || [],
    txt = lista.length
      ? lista
          .map((arg) => {
            const def = SECTORES[arg];
            return (
              '<span class="sec-chip" data-cat="' +
              arg +
              '">' +
              (def ? esc(def.nombre) : esc(arg)) +
              '<span class="sec-x" data-action="sector:toggle" data-sector="' +
              arg +
              '" title="Quitar">×</span></span>'
            );
          })
          .join("")
      : '<span style="font-size:12px;color:var(--ink-soft)">Sin sector</span>';
  return (
    '<div class="fld"><label>Sectores</label>\n    <div class="sec-selected">' +
    txt +
    '</div>\n    <div class="sec-search"><input id="sectorSearch" placeholder="Buscar y agregar sector…" autocomplete="off"><div id="sectorResults" class="sec-results"></div></div>\n  </div>'
  );
}
function renderSectorResults(value) {
  const el = $("#sectorResults");
  if (!el) return;
  const raw = (value || "").trim();
  value = raw.toLowerCase();
  const tarjeta = current(),
    conjunto = new Set((tarjeta && tarjeta.sectores) || []),
    lista = Object.keys(SECTORES)
      .filter(
        (arg) =>
          !conjunto.has(arg) &&
          (!value || SECTORES[arg].nombre.toLowerCase().includes(value) || arg.includes(value)),
      )
      .slice(0, 8),
    hayExacto = raw && Object.values(SECTORES).some((arg) => arg.nombre.toLowerCase() === value);
  el.innerHTML =
    (lista.length
      ? lista
          .map(
            (arg) =>
              '<button class="sec-opt" data-cat="' +
              arg +
              '" data-action="sector:add" data-sector="' +
              arg +
              '"><span class="sec-dot"></span>' +
              esc(SECTORES[arg].nombre) +
              "</button>",
          )
          .join("")
      : value
        ? '<div class="sec-none">Sin coincidencias</div>'
        : "") +
    (raw && !hayExacto
      ? '<button class="sec-opt sec-create" data-action="sector:create" data-sector-name="' +
        esc(raw) +
        '">➕ Crear sector "' +
        esc(raw) +
        '"</button>'
      : "");
}
function datePresetsHTML(campo) {
  return (
    '<div class="datepresets"><button type="button" class="dp-btn" data-action="date:preset" data-field="' +
    campo +
    '" data-preset="hoy">Hoy</button><button type="button" class="dp-btn" data-action="date:preset" data-field="' +
    campo +
    '" data-preset="manana">Mañana</button><button type="button" class="dp-btn" data-action="date:preset" data-field="' +
    campo +
    '" data-preset="semana">+1 semana</button></div>'
  );
}
function vinculosHTML(tarjeta) {
  const lista = (tarjeta.vinculos || [])
      .map((id) => state.cards.find((c) => c.id === id))
      .filter(Boolean),
    disponibles = state.cards.filter(
      (c) => c.id !== tarjeta.id && inInventory(c) && !(tarjeta.vinculos || []).includes(c.id),
    );
  return (
    '<details class="acc sec-acc" ' +
    (lista.length ? "open" : "") +
    '><summary class="sub">Vínculos con el Mapa · ' +
    lista.length +
    '<span class="ring"></span></summary>\n        <div class="acc-body">\n    ' +
    (lista
      .map(
        (c) =>
          '<div class="lnk"><span class="lnk-a" data-action="card:open" data-id="' +
          c.id +
          '" style="cursor:pointer">' +
          ((allTipos()[c.tipo] || {}).icon || "•") +
          " " +
          esc(c.titulo) +
          '</span><span class="chk-del" data-action="vinc:del" data-id="' +
          c.id +
          '" title="Quitar">✕</span></div>',
      )
      .join("") ||
      '<div style="font-size:12px;color:var(--ink-soft)">Sin vínculos. Sumá un curso o Edu Point del Mapa relacionado.</div>') +
    (disponibles.length
      ? '\n    <select data-action-select="vinc:add" id="vincAdd" style="margin-top:6px"><option value="">+ Vincular curso / Edu Point…</option>' +
        disponibles
          .slice(0, 60)
          .map((c) => '<option value="' + c.id + '">' + esc(c.titulo) + "</option>")
          .join("") +
        "</select>"
      : "") +
    "\n  </div></details>"
  );
}
// Aproximación honesta a "quién está mirando esto": esta app sincroniza
// por polling cada pocos segundos (no hay websockets), así que un
// indicador de presencia en vivo sería poco confiable y, peor, escribir
// una marca de "viendo" en cada tarjeta interferiría con el sistema de
// huellas que resuelve conflictos de edición simultánea. En su lugar se
// muestra quién la tocó por última vez y cuándo, usando el log de
// actividad que ya existe — sin agregar campos nuevos al documento
// sincronizado.
function ultimoTocadoHTML(tarjeta) {
  const lista = tarjeta.actividad || [];
  if (!lista.length) return "";
  const ultima = lista[lista.length - 1];
  if (!ultima || ultima.autor === state.user) return "";
  return (
    ' <span class="ultimo-toco" title="Última actividad de ' +
    esc(ultima.autor) +
    '">👀 ' +
    esc(ultima.autor) +
    " · " +
    relTime(ultima.ts) +
    "</span>"
  );
}
function renderPanel() {
  const tarjeta = current();
  if (!tarjeta) {
    $("#panel").innerHTML = "";
    return;
  }
  const avance = progress(tarjeta),
    vencida = isOverdue(tarjeta),
    txt = Object.keys(allTipos())
      .map(
        (arg) =>
          '<option value="' +
          arg +
          '" ' +
          (tarjeta.tipo === arg ? "selected" : "") +
          ">" +
          allTipos()[arg].icon +
          " " +
          esc(allTipos()[arg].nombre) +
          "</option>",
      )
      .join(""),
    txt2 = ESTADOS.map(
      (estado) =>
        '<option value="' +
        estado.id +
        '" ' +
        (tarjeta.estado === estado.id ? "selected" : "") +
        ">" +
        estado.nombre +
        "</option>",
    ).join(""),
    txt3 = TEAM.map(
      (miembro) =>
        '<span class="chip-toggle ' +
        ((tarjeta.asignados || []).includes(miembro.id) ? "on" : "") +
        '" data-action="asig:toggle" data-person="' +
        miembro.id +
        '" style="--cat:' +
        miembro.color +
        '">' +
        miembro.nombre +
        "</span>",
    ).join(""),
    txt4 = (tarjeta.checklist || [])
      .map(
        (item) =>
          '<div class="chk"><input type="checkbox" ' +
          (item.done ? "checked" : "") +
          ' data-action="cl:toggle" data-cl="' +
          item.id +
          '"><input class="chk-text ' +
          (item.done ? "done" : "") +
          '" value="' +
          esc(item.text) +
          '" data-field="cl:' +
          item.id +
          '"><span class="chk-del" data-action="cl:del" data-cl="' +
          item.id +
          '">✕</span></div>',
      )
      .join(""),
    txt5 = (tarjeta.fases || [])
      .map((fase) => {
        const txt6 = (fase.tareas || [])
          .map(
            (item) =>
              '<div class="ftask"><input type="checkbox" ' +
              (item.done ? "checked" : "") +
              ' data-action="ft:toggle" data-fase="' +
              fase.id +
              '" data-task="' +
              item.id +
              '"><input class="ft-text ' +
              (item.done ? "done" : "") +
              '" value="' +
              esc(item.text) +
              '" data-field="ft:' +
              fase.id +
              ":" +
              item.id +
              ':text"><input type="date" value="' +
              (item.fecha || "") +
              '" data-field="ft:' +
              fase.id +
              ":" +
              item.id +
              ':fecha"><span class="chk-del" data-action="ft:del" data-fase="' +
              fase.id +
              '" data-task="' +
              item.id +
              '">✕</span></div>',
          )
          .join("");
        return (
          '<div class="fase-box"><div style="display:flex;gap:8px;align-items:center"><input class="chk-text" style="font-weight:600" value="' +
          esc(fase.nombre) +
          '" data-field="fz:' +
          fase.id +
          ':nombre"><span class="chk-del" data-action="fase:del" data-fase="' +
          fase.id +
          '">✕</span></div>\n    <div class="fld-row"><input type="date" value="' +
          (fase.inicio || "") +
          '" data-field="fz:' +
          fase.id +
          ':inicio"><input type="date" value="' +
          (fase.fin || "") +
          '" data-field="fz:' +
          fase.id +
          ':fin"></div>\n    ' +
          txt6 +
          '<button class="btn btn-ghost btn-sm" data-action="ft:add" data-fase="' +
          fase.id +
          '" style="align-self:flex-start;margin-top:2px">+ Tarea</button></div>'
        );
      })
      .join("");
  let txt7 = "";
  const val = inventoryKind(tarjeta);
  if (val) {
    const flag = tarjeta.tipo === "curso",
      esEdu = tarjeta.tipo === "edu-point",
      txt8 =
        {
          curso: "Este curso",
          "edu-point": "Este Edu Point",
          "app-web": "Este aplicativo",
          "base-sistema": "Esta base",
          video: "Este video",
          presencial: "Esta capacitación",
          poes: "Este POES",
          guia: "Esta guía",
        }[tarjeta.tipo] || "Este elemento";
    if (!tarjeta.publicado)
      txt7 =
        '<div class="bridge"><div class="bridge-t">📝 En producción (tablero)</div>\n        <div class="bridge-d">' +
        txt8 +
        ' se está armando. Cuando esté listo, <b>publicalo</b> y aparece en el <b>Mapa</b> para todo el equipo.</div>\n        <button class="btn btn-primary btn-sm" data-action="curso:publicar">' +
        (flag ? "Publicar curso" : esEdu ? "Marcar como colocado" : "Publicar") +
        "</button></div>";
    else
      tarjeta.enActualizacion
        ? (txt7 =
            '<div class="bridge"><div class="bridge-t">🔄 ' +
            (esEdu ? "Colocado · en revisión" : "Activo · en actualización") +
            '</div>\n        <div class="bridge-d">Sigue visible en el Mapa y volvió al tablero para editarlo. Cuando termines, <b>republicalo</b>.</div>\n        <button class="btn btn-primary btn-sm" data-action="curso:republicar">Republicar</button></div>')
        : (txt7 =
            '<div class="bridge"><div class="bridge-t">✅ ' +
            (esEdu ? "Colocado en el Mapa" : "Activo en el Mapa") +
            '</div>\n        <div class="bridge-d">Publicado y visible para el equipo. ¿Necesita cambios? Generá una <b>actualización</b>: vuelve al tablero sin perder la ficha.</div>\n        <button class="btn btn-sm" data-action="curso:actualizar">Generar actualización</button></div>');
  }
  const html = isCurso(tarjeta)
      ? '<details class="acc sec-acc"><summary class="sub">Ficha de catálogo<span class="ring"></span></summary><div class="acc-body">\n    <div class="fld"><label>Link Moodle</label><input value="' +
        esc(tarjeta.linkMoodle) +
        '" data-field="linkMoodle" placeholder="https://..."></div>\n    <div class="fld"><label>Bajada</label><input value="' +
        esc(tarjeta.catalogo.bajada) +
        '" data-field="cat:bajada"></div>\n    <div class="fld-row"><div class="fld"><label>Año</label><input value="' +
        esc(tarjeta.catalogo.anio) +
        '" data-field="cat:anio"></div>\n      <div class="fld"><label>Duración</label><input value="' +
        esc(tarjeta.catalogo.duracion) +
        '" data-field="cat:duracion"></div></div>\n    <div class="fld-row"><div class="fld"><label>Personas</label><input value="' +
        esc(tarjeta.catalogo.personas) +
        '" data-field="cat:personas"></div>\n      <div class="fld"><label>Slug categoría</label><input value="' +
        esc(tarjeta.catalogo.categoria) +
        '" data-field="cat:categoria"></div></div>\n    <div class="fld"><label>Descripción</label><textarea data-field="cat:descripcion">' +
        esc(tarjeta.catalogo.descripcion) +
        "</textarea></div></div></details>"
      : "",
    obj = {
      none: "Sin recurrencia",
      semanal: "Semanal",
      mensual: "Mensual",
      trimestral: "Trimestral",
    },
    html2 =
      '<div class="fld"><label>Recurrencia</label><select data-field="recurrencia">' +
      Object.keys(obj)
        .map(
          (arg) =>
            '<option value="' +
            arg +
            '" ' +
            (tarjeta.recurrencia === arg ? "selected" : "") +
            ">" +
            obj[arg] +
            "</option>",
        )
        .join("") +
      "</select>" +
      (tarjeta.recurrencia && tarjeta.recurrencia !== "none"
        ? '<button class="btn btn-sm" data-action="card:recurrar" style="margin-top:8px;align-self:flex-start">↻ Generar próxima instancia</button>'
        : "") +
      "</div>",
    html3 =
      tarjeta.tipo === "app-web" || tarjeta.tipo === "base-sistema"
        ? '<details class="acc sec-acc"><summary class="sub">Ficha técnica<span class="ring"></span></summary><div class="acc-body">\n    <div class="fld"><label>URL / acceso</label><input value="' +
          esc(tarjeta.ficha.url) +
          '" data-field="fi:url" placeholder="https://..."></div>\n    <div class="fld-row"><div class="fld"><label>Responsable técnico</label><input value="' +
          esc(tarjeta.ficha.owner) +
          '" data-field="fi:owner"></div>\n    <div class="fld"><label>Estado operativo</label><select data-field="fi:estadoOp">' +
          ["operativo", "mantenimiento", "baja"]
            .map(
              (arg) =>
                "<option " + (tarjeta.ficha.estadoOp === arg ? "selected" : "") + ">" + arg + "</option>",
            )
            .join("") +
          "</select></div></div></div></details>"
        : "",
    html4 =
      '<details class="acc sec-acc" ' +
      (tarjeta.links && tarjeta.links.length ? "open" : "") +
      '><summary class="sub">Enlaces · ' +
      (tarjeta.links || []).length +
      '<span class="ring"></span></summary><div class="acc-body">\n    ' +
      ((tarjeta.links || [])
        .map(
          (arg, arg2) =>
            '<div class="lnk"><a href="' +
            esc(arg.url) +
            '" target="_blank" rel="noopener" class="lnk-a">🔗 ' +
            esc(arg.label || arg.url) +
            '</a><span class="chk-del" data-action="link:del" data-i="' +
            arg2 +
            '" title="Quitar">✕</span></div>',
        )
        .join("") ||
        '<div style="font-size:12px;color:var(--ink-soft)">Sin enlaces. Sumá Drive, Moodle, docs…</div>') +
      '\n    <div class="lnk-add"><input id="linkLabel" placeholder="Etiqueta (ej: Carpeta Drive)"><input id="linkUrl" placeholder="https://…"><button class="btn btn-sm" data-action="link:add">+ Agregar</button></div></div></details>',
    html5 =
      '<details class="acc" ' +
      ((tarjeta.comentarios || []).length ? "open" : "") +
      '><summary class="sub" style="margin-top:0">Comentarios · ' +
      (tarjeta.comentarios || []).length +
      '</summary><div style="margin-top:8px">\n    ' +
      ((tarjeta.comentarios || [])
        .slice()
        .reverse()
        .map(
          (entrada) =>
            '<div class="cmt"><div class="cmt-h"><b>' +
            esc(entrada.autor) +
            "</b><span>" +
            relTime(entrada.ts) +
            '</span></div><div class="cmt-b">' +
            mentionize(entrada.texto) +
            "</div></div>",
        )
        .join("") ||
        '<div style="font-size:12px;color:var(--ink-soft);padding:4px 0">Sin comentarios todavía.</div>') +
      '\n    <div class="cmt-add"><textarea id="cmtInput" placeholder="Comentá… usá @nombre para mencionar a alguien"></textarea><button class="btn btn-sm btn-primary" data-action="cmt:add" style="align-self:flex-start">Comentar</button></div></div></details>',
    html6 =
      tarjeta.actividad && tarjeta.actividad.length
        ? '<details class="acc"><summary class="sub" style="margin-top:0">Actividad · ' +
          tarjeta.actividad.length +
          '</summary><div style="margin-top:8px">' +
          tarjeta.actividad
            .slice(-12)
            .reverse()
            .map(
              (entrada) =>
                '<div class="act"><span class="act-d">' +
                relTime(entrada.ts) +
                "</span> <b>" +
                esc(entrada.autor) +
                "</b> " +
                esc(entrada.texto) +
                "</div>",
            )
            .join("") +
          "</div></details>"
        : "";
  $("#panel").innerHTML =
    '\n    <div class="panel-head" data-cat="' +
    primaryCat(tarjeta) +
    '">\n      <div style="flex:1">\n        <div class="tipo-pill">' +
    ((allTipos()[tarjeta.tipo] || {}).icon || "•") +
    " " +
    ((allTipos()[tarjeta.tipo] || {}).nombre || tarjeta.tipo) +
    (inInventory(tarjeta) ? " · ◎ activo" : "") +
    ultimoTocadoHTML(tarjeta) +
    '</div>\n        <input class="chk-text" style="font-size:18px;font-weight:700;font-family:var(--titulo);width:100%;margin-top:4px" placeholder="Ej: Cajas – Apertura del sector" value="' +
    esc(tarjeta.titulo) +
    '" data-field="titulo">\n      </div>\n      <div class="panel-headtop">' +
    savestateHTML() +
    (state.view !== "kanban" && !inInventory(tarjeta)
      ? '<button class="btn btn-icon btn-ghost" data-action="panel:goplanner" title="Ver en Planner">↗</button>'
      : "") +
    '<button class="btn btn-icon btn-ghost" data-action="panel:close">✕</button></div>\n    </div>\n    <div class="panel-body">\n      ' +
    txt7 +
    '\n      <div class="fld-row">\n        <div class="fld"><label>Tipo</label><select data-field="tipo">' +
    txt +
    '</select></div>\n        <div class="fld"><label>Estado</label><select data-field="estado">' +
    txt2 +
    '</select></div>\n      </div>\n\n      ' +
    // "Más detalles" arranca colapsado en una tarjeta nueva: fechas, prioridad,
    // recurrencia, asignados y sectores no hacen falta para crear algo rápido.
    // Si la tarjeta ya trae alguno cargado, arranca abierto — lo que ya está
    // puesto no se esconde.
    '<details class="acc sec-acc" ' +
    (tarjeta.inicio ||
    tarjeta.fin ||
    tarjeta.revisionDesde ||
    tarjeta.prioridad === "alta" ||
    (tarjeta.asignados || []).length ||
    (tarjeta.sectores || []).length
      ? "open"
      : "") +
    '><summary class="sub">Más detalles<span class="ring"></span></summary>\n        <div class="acc-body">\n      <div class="fld-row">\n        <div class="fld"><label>Inicio</label><input type="date" value="' +
    (tarjeta.inicio || "") +
    '" data-field="inicio">' +
    datePresetsHTML("inicio") +
    '</div>\n        <div class="fld"><label>Fin (nuestro equipo) ' +
    (vencida ? '· <span style="color:var(--bad)">vencida</span>' : "") +
    '</label><input type="date" value="' +
    (tarjeta.fin || "") +
    '" data-field="fin">' +
    datePresetsHTML("fin") +
    "</div>\n      </div>\n      " +
    (tarjeta.revisionDesde
      ? '<div class="fld-hint" style="margin:-4px 0 10px">🕓 En revisión desde ' +
        fmtShort(tarjeta.revisionDesde) +
        (tarjeta.estado === "en-revision"
          ? " · lleva <b>" +
            Math.max(0, daysBetween(tarjeta.revisionDesde, isoOf(new Date()))) +
            "</b> días esperando a otros sectores"
          : " (última vez que pasó por revisión)") +
        "</div>"
      : "") +
    '\n      <div class="fld-row"><div class="fld"><label>Prioridad</label><select data-field="prioridad"><option value="normal" ' +
    (tarjeta.prioridad === "normal" ? "selected" : "") +
    '>Normal</option><option value="alta" ' +
    (tarjeta.prioridad === "alta" ? "selected" : "") +
    ">Alta</option></select></div>" +
    html2 +
    '</div>\n      <div class="fld"><label>Asignados</label><div class="chiplist">' +
    txt3 +
    '</div><span class="fld-hint">Todos los que trabajan en ella (los que quieras).</span></div>\n      ' +
    sectorPicker(tarjeta) +
    "\n        </div></details>\n\n      " +
    // El checklist arranca colapsado si está vacío, igual que Enlaces y
    // Comentarios: en cuanto tiene el primer ítem, se abre solo.
    '<details class="acc sec-acc" ' +
    (avance.total ? "open" : "") +
    '><summary class="sub">Checklist · ' +
    avance.done +
    "/" +
    avance.total +
    '<span class="ring"></span></summary>\n        <div class="acc-body">\n          <div class="prog-row"><div class="progress"><div class="progress-bar" style="width:' +
    avance.pct +
    '%"></div></div><span class="prog-num">' +
    avance.pct +
    "%</span></div>\n          " +
    txt4 +
    '\n          <button class="btn btn-ghost btn-sm" data-action="cl:add" style="align-self:flex-start">+ Ítem</button>\n        </div></details>\n\n      <details class="acc sec-acc"><summary class="sub">Fases (opcional · multi-etapa)<span class="ring"></span></summary>\n        <div class="acc-body">\n          ' +
    txt5 +
    '\n          <button class="btn btn-ghost btn-sm" data-action="fase:add" style="align-self:flex-start">+ Fase</button>\n        </div></details>\n\n      ' +
    html +
    "\n      " +
    html3 +
    '\n\n      <details class="acc sec-acc" ' +
    (tarjeta.notas ? "open" : "") +
    '><summary class="sub">Notas<span class="ring"></span></summary>\n        <div class="acc-body"><textarea data-field="notas" placeholder="Notas del equipo...">' +
    esc(tarjeta.notas) +
    "</textarea></div></details>\n      " +
    html4 +
    "\n      " +
    vinculosHTML(tarjeta) +
    "\n      " +
    html5 +
    "\n      " +
    html6 +
    '\n\n      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;border-top:1px solid var(--line);padding-top:14px">\n        <button class="btn btn-primary btn-sm" data-action="card:save" title="Guardar ahora">💾 Guardar</button>\n        <button class="btn btn-sm" data-action="card:link" title="Copiar un enlace directo a esta tarjeta">🔗 Copiar enlace</button>\n        <div class="panel-menu-wrap" style="margin-left:auto;position:relative">\n          <button class="btn btn-ghost btn-sm" data-action="panel:menu" title="Más acciones">⋯ Más</button>\n          <div class="panel-menu">\n            <button class="menu-item" data-action="tpl:save">💾 Guardar como plantilla</button>\n            <button class="menu-item" data-action="card:dup">⧉ Duplicar</button>\n            <div class="menu-sep"></div>\n            <button class="menu-item" style="color:var(--bad)" data-action="card:del">🗑 Eliminar</button>\n          </div>\n        </div>\n      </div>\n    </div>';
}
function openCarga() {
  const obj = {};
  (TEAM.forEach(
    (miembro) =>
      (obj[miembro.id] = {
        n: 0,
        alta: 0,
      }),
  ),
    boardCards().forEach((tarjeta) => {
      const lista = [tarjeta.responsable, ...(tarjeta.asignados || [])].filter(
        (arg2, arg3, arg) => arg2 && arg.indexOf(arg2) === arg3,
      );
      lista.forEach((arg) => {
        if (obj[arg]) {
          obj[arg].n++;
          if (tarjeta.prioridad === "alta") obj[arg].alta++;
        }
      });
    }));
  const val2 = Math.max(1, ...TEAM.map((miembro) => obj[miembro.id].n)),
    txt = TEAM.map((miembro) => {
      const val = obj[miembro.id],
        val3 = Math.round((val.n / val2) * 100),
        flag = val.n === val2 && val2 > 1;
      return (
        '<div class="carga-row">' +
        avatarHTML(miembro.id) +
        '<div class="carga-info">\n      <div class="carga-name">' +
        miembro.nombre +
        " " +
        (flag ? '<span class="badge prio" style="margin-left:4px">sobrecargado</span>' : "") +
        '</div>\n      <div class="carga-rol">' +
        miembro.rol +
        '</div>\n      <div class="carga-bar"><div class="carga-fill" style="width:' +
        val3 +
        "%;background:" +
        miembro.color +
        '"></div></div></div>\n      <div class="carga-num">' +
        val.n +
        " tarea" +
        (val.n !== 1 ? "s" : "") +
        (val.alta ? " · " + val.alta + "★" : "") +
        "</div></div>"
      );
    }).join("");
  ((state.selectedId = null),
    ($("#panel").innerHTML =
      '<div class="panel-head"><div style="flex:1"><div class="tipo-pill">👥 Equipo</div>\n    <div style="font-family:var(--titulo);font-size:18px;font-weight:700;margin-top:4px">Carga del equipo</div></div>\n    <button class="btn btn-icon btn-ghost" data-action="panel:close">✕</button></div>\n    <div class="panel-body"><div class="carga-list">' +
      txt +
      '</div>\n    <div class="note">Cuenta tarjetas del tablero (responsable + asignados). Ayuda a ver el reparto de carga entre el equipo.</div></div>'),
    $("#panel").classList.add("open"),
    $("#overlay").classList.remove("hidden"));
}
function openMiSemana() {
  state.selectedId = null;
  const html = '<button class="btn btn-icon btn-ghost" data-action="panel:close">✕</button>';
  if (!state.userId) {
    (($("#panel").innerHTML =
      '<div class="panel-head"><div style="flex:1"><div class="tipo-pill">📅 Mi semana</div><div style="font-family:var(--titulo);font-size:18px;font-weight:700;margin-top:4px">Identificate primero</div></div>' +
      html +
      '</div><div class="panel-body"><div class="note warn">Entrá con tu nombre del equipo para ver “Mi semana”.</div></div>'),
      $("#panel").classList.add("open"),
      $("#overlay").classList.remove("hidden"));
    return;
  }
  const iso = todayISO(),
    iso2 = isoOf(addDays(weekStart(new Date()), 6)),
    iso3 = isoOf(addDays(new Date(), 30)),
    fn = (arg) => arg.fin || arg.inicio,
    lista2 = boardCards()
      .filter(mine)
      .filter((arg) => arg.fin || arg.inicio),
    lista3 = lista2.filter((arg) => fn(arg) < iso).sort((arg, arg2) => fn(arg).localeCompare(fn(arg2))),
    lista4 = lista2
      .filter((arg) => {
        const val = fn(arg);
        return val >= iso && val <= iso2;
      })
      .sort((arg, arg2) => fn(arg).localeCompare(fn(arg2))),
    lista5 = lista2
      .filter((arg) => {
        const val = fn(arg);
        return val > iso2 && val <= iso3;
      })
      .sort((arg, arg2) => fn(arg).localeCompare(fn(arg2))),
    fn2 = (tarjeta) => {
      const val = fn(tarjeta),
        flag = val < iso,
        val2 = daysBetween(iso, val),
        txt = flag ? "−" + Math.abs(val2) + "d" : val2 === 0 ? "hoy" : val2 + "d";
      return (
        '<div class="venc" data-id="' +
        tarjeta.id +
        '" data-action="card:open"><span class="venc-d ' +
        (flag ? "over" : "") +
        '">' +
        txt +
        '</span><span class="venc-t">' +
        esc(tarjeta.titulo) +
        "</span>" +
        stackHTML(tarjeta) +
        "</div>"
      );
    },
    fn3 = (txt, lista, txt2) =>
      lista.length
        ? '<div class="res-card"><h3>' +
          txt2 +
          " " +
          txt +
          ' <span class="mini">' +
          lista.length +
          "</span></h3>" +
          lista.map(fn2).join("") +
          "</div>"
        : "",
    txt3 = lista3.length + lista4.length + lista5.length,
    txt4 = txt3
      ? fn3("Vencidas", lista3, "⚑") +
        fn3("Esta semana", lista4, "📅") +
        fn3("Próximas (30 días)", lista5, "⏳")
      : '<div class="empty"><div class="big">🎉</div><div style="font-weight:700;color:var(--ink)">Semana despejada</div><div style="margin-top:4px">No tenés tareas con fecha próxima.</div></div>';
  (($("#panel").innerHTML =
    '<div class="panel-head"><div style="flex:1"><div class="tipo-pill">📅 Mi semana</div><div style="font-family:var(--titulo);font-size:18px;font-weight:700;margin-top:4px">Hola ' +
    esc(state.user || "") +
    " — tu foco</div></div>" +
    html +
    '</div><div class="panel-body">' +
    txt4 +
    "</div>"),
    $("#panel").classList.add("open"),
    $("#overlay").classList.remove("hidden"));
}
function loadViews() {
  try {
    return JSON.parse(localStorage.getItem("cf.views") || "[]");
  } catch (err) {
    return [];
  }
}
function saveViews() {
  try {
    localStorage.setItem("cf.views", JSON.stringify(state.savedViews || []));
  } catch (err) {}
}
function closeModal() {
  ($("#modal").classList.add("hidden"), ($("#modal").innerHTML = ""));
}
function openModal(html) {
  (($("#modal").innerHTML =
    '<div class="modal-bg" data-action="modal:close"></div><div class="modal">' + html + "</div>"),
    $("#modal").classList.remove("hidden"));
}
// Reemplaza al confirm() nativo del navegador (que corta el flujo con un
// cuadro gris fuera de estilo) por un modal propio. onYes se guarda en una
// variable de módulo porque el modal es HTML plano: no hay closure posible
// una vez que el botón vive en el DOM.
let _confirmCb = null;
function confirmar(mensaje, onYes) {
  ((_confirmCb = onYes),
    openModal(
      '<h2>¿Confirmás?</h2><div class="sub-t">' +
        esc(mensaje) +
        '</div><div class="modal-foot"><button class="btn" data-action="confirm:no">Cancelar</button><button class="btn btn-primary" style="background:var(--bad);border-color:var(--bad)" data-action="confirm:yes">Sí, confirmar</button></div>',
    ));
}
function openNuevo() {
  state.draftTipo = "curso";
  const txt = Object.keys(allTipos())
    .map(
      (arg) =>
        '<div class="tipo-opt ' +
        (arg === "curso" ? "on" : "") +
        '" data-action="nuevo:tipo" data-tipo="' +
        arg +
        '"><span class="ic">' +
        allTipos()[arg].icon +
        '</span><span class="nm">' +
        esc(allTipos()[arg].nombre) +
        "</span></div>",
    )
    .join("");
  (openModal(
    '<h2>Nueva tarjeta</h2><div class="sub-t">Elegí el <b>tipo</b> (trae su plantilla) y ponele título. Todo es editable después.</div>\n    <div class="fld"><label>Tipo</label><div class="tipo-grid" id="tipoGrid">' +
      txt +
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
  const tarjeta = current();
  if (!tarjeta) return;
  openModal(
    '<h2>Guardar como plantilla</h2><div class="sub-t">Crea un <b>tipo nuevo</b> reutilizable con las fases y el checklist actuales de “' +
      esc(tarjeta.titulo) +
      '”.</div>\n    <div class="fld"><label>Nombre del tipo</label><input id="tplName" placeholder="Ej: Microlearning, Onboarding..." autofocus></div>\n    <div class="modal-foot"><button class="btn" data-action="modal:close">Cancelar</button><button class="btn btn-primary" data-action="tpl:create">Guardar plantilla</button></div>',
  );
}
function touch() {
  (stampEditedCards(), persist());
}
function patch(val, obj) {
  (Object.assign(val, obj), touch());
}
function applyField(tarjeta, val, el) {
  const value = el.type === "checkbox" ? el.checked : el.value;
  if (val.startsWith("cat:")) tarjeta.catalogo[val.slice(4)] = value;
  else {
    if (val.startsWith("fi:")) ((tarjeta.ficha = tarjeta.ficha || {}), (tarjeta.ficha[val.slice(3)] = value));
    else {
      if (val.startsWith("cl:")) {
        const hallado = (tarjeta.checklist || []).find((arg) => arg.id === val.slice(3));
        if (hallado) hallado.text = value;
      } else {
        if (val.startsWith("ft:")) {
          const partes = val.split(":"),
            hallado2 = (tarjeta.fases || []).find((arg) => arg.id === partes[1]);
          if (hallado2) {
            const hallado3 = (hallado2.tareas || []).find((arg) => arg.id === partes[2]);
            if (hallado3) hallado3[partes[3]] = value;
          }
        } else {
          if (val.startsWith("fz:")) {
            const [, faseId, campo] = val.split(":"),
              hallado4 = (tarjeta.fases || []).find((arg) => arg.id === faseId);
            if (hallado4) hallado4[campo] = value;
          } else {
            // El <select> de estado dispara "input" y "change" para el mismo
            // cambio: applyField() se llama dos veces, así que el chequeo de
            // "cambió de verdad" tiene que vivir acá adentro (antes de pisar
            // el valor viejo), no en el handler de "change" — para cuando ese
            // corre, el de "input" ya dejó tarjeta.estado igual al nuevo valor.
            if (val === "estado" && tarjeta.estado !== value) {
              logAct(tarjeta, "pasó a " + ((ESTADOS.find((estado) => estado.id === value) || {}).nombre || value));
              if (value === "en-revision") tarjeta.revisionDesde = isoOf(new Date());
            }
            tarjeta[val] = value;
          }
        }
      }
    }
  }
  touch();
}
const STRUCTURAL = ["tipo", "estado", "responsable", "inicio", "fin", "prioridad"];
document.addEventListener("click", (ev) => {
  const el3 = ev.target.closest(".tab[data-view]");
  if (el3) {
    state.view !== el3.dataset.view &&
      ((state.view = el3.dataset.view), pushNav(), render());
    return;
  }
  const el = ev.target.closest("[data-action]");
  if (!el) return;
  const val9 = el.dataset.action,
    val10 = el.dataset.id;
  switch (val9) {
    case "gate:enter":
      gateTry($("#gateInput").value);
      break;
    case "reintentar:guardar":
      (flash("Reintentando…"), persist());
      break;
    case "reintentar:conexion":
      location.reload();
      break;
    case "gate:person": {
      const nombre = el.dataset.nombre;
      if (state.appPassHash) {
        const campo = $("#gateInput");
        if (campo) campo.value = nombre;
        const el4 = $("#gatePassInput");
        if (el4) el4.focus();
      } else gateTry(nombre);
      break;
    }
    case "gate:open":
      $("#gate").classList.remove("hidden");
      break;
    case "theme:toggle":
      toggleTheme();
      break;
    case "menu:toggle": {
      const el5 = $("#userMenu");
      if (el5) el5.classList.toggle("hidden");
      break;
    }
    case "filtros:toggle": {
      const el5b = $("#filtrosPop");
      if (el5b) el5b.classList.toggle("hidden");
      break;
    }
    case "user:logout": {
      ((state.user = null), (state.userId = null), (state.mis = false));
      const el6 = $("#userMenu");
      if (el6) el6.classList.add("hidden");
      $("#gate").classList.remove("hidden");
      const campo2 = $("#gateInput");
      if (campo2) campo2.value = "";
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
      ((state.mapaSec = el.dataset.sec),
        (state.eduSector = null),
        (state.eduEst = ""),
        (state.eduQ = ""),
        pushNav(),
        render());
      break;
    case "mapa:bubble": {
      const sec2 = el.dataset.sector;
      ((state.filters.sector = state.filters.sector === sec2 ? "" : sec2), (state.mapaSec = "todos"), render());
      break;
    }
    case "edu:sec":
      ((state.eduSector = el.dataset.sec), (state.eduEst = ""), (state.eduQ = ""), pushNav(), render());
      break;
    case "edu:back":
      ((state.eduSector = null), (state.eduEst = ""), (state.eduQ = ""), pushNav(), render());
      break;
    case "edu:est":
      ((state.eduEst = state.eduEst === el.dataset.est ? "" : el.dataset.est), renderView());
      break;
    case "kpi:go":
      state.view = el.dataset.go;
      if (el.dataset.sec) state.mapaSec = el.dataset.sec;
      if (el.dataset.filtEstado) ((state.filters = Object.assign({}, state.filters, { estado: el.dataset.filtEstado })), (state.quick = ""));
      else if (el.dataset.quick) state.quick = el.dataset.quick;
      (pushNav(), render());
      break;
    case "sec:go":
      ((state.view = "kanban"),
        (state.filters = Object.assign({}, state.filters, { sector: el.dataset.sector })),
        pushNav(),
        render());
      break;
    case "panel:goplanner":
      ((state.view = "kanban"), pushNav(), render(), renderPanel());
      break;
    case "hub:go":
      ((state.view = el.dataset.go), pushNav(), render());
      break;
    case "search:open":
      openPalette();
      break;
    case "sr:open":
      (closeModal(), openDetail(el.dataset.id));
      break;
    case "notif:open":
      openNotif();
      break;
    case "notif:markread":
      (marcarAlertasLeidas(computeAlerts().map(alertaKey)), openNotif(), updateBell());
      break;
    case "settings:open":
      openSettings();
      break;
    case "cmt:add":
      addComment();
      break;
    case "card:recurrar": {
      const val16 = current();
      if (val16) {
        const val = recurrar(val16);
        (openDetail(val.id), render(), flash("↻ Próxima instancia generada"));
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
      const txt2 = ($("#setPass").value || "").trim();
      if (!txt2) {
        flash("Escribí una clave", true);
        break;
      }
      ((state.appPassHash = hashStr(txt2)),
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
    case "backup:restore":
      restoreBackup(el.dataset.ts);
      break;
    case "set:add-member":
      addMember();
      break;
    case "tpl:del":
      delTpl(el.dataset.tpl);
      break;
    case "view":
      break;
    case "card:open":
      val10 && openDetail(val10);
      break;
    case "panel:close":
      closePanel();
      break;
    case "confirm:yes": {
      const fn = _confirmCb;
      ((_confirmCb = null), closeModal(), fn && fn());
      break;
    }
    case "confirm:no":
      ((_confirmCb = null), closeModal());
      break;
    case "undo:del":
      undoBorrado();
      break;
    case "slot:pull":
      tirarSlot();
      break;
    case "roulette:open":
      abrirRuleta();
      break;
    case "roulette:spin":
      tirarRuleta();
      break;
    case "misemana:open":
      openMiSemana();
      break;
    case "view:save": {
      const txt3 = (prompt("Nombre de la vista (ej: Mías vencidas)") || "").trim();
      if (!txt3) break;
      ((state.savedViews = [
        ...state.savedViews,
        {
          id: uid(),
          name: txt3,
          filters: Object.assign({}, state.filters),
          quick: state.quick,
          mis: state.mis,
        },
      ]),
        saveViews(),
        render(),
        flash("💾 Vista “" + txt3 + "” guardada"));
      break;
    }
    case "view:apply": {
      const hallado = state.savedViews.find((arg) => arg.id === el.dataset.id);
      hallado &&
        ((state.filters = Object.assign(
          {
            persona: "",
            tipo: "",
            sector: "",
            estado: "",
            texto: "",
            cursoEstado: "",
          },
          hallado.filters || {},
        )),
        (state.quick = hallado.quick || ""),
        (state.mis = !!hallado.mis),
        render());
      break;
    }
    case "view:del": {
      ((state.savedViews = state.savedViews.filter((arg) => arg.id !== el.dataset.id)),
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
      ((state.quick = state.quick === el.dataset.q ? "" : el.dataset.q), render());
      break;
    case "card:link":
      copyCardLink(val10 ? state.cards.find((c) => c.id === val10) : current());
      break;
    case "card:save":
      // El guardado automático ya corre solo (debounce + polling), pero
      // este botón fuerza un guardado inmediato y da una confirmación
      // explícita para quien prefiere no confiar en el automático.
      guardarAhora(false).then(() => flash(state.saveError ? "✗ No se pudo guardar" : "✓ Guardado"));
      break;
    case "qedit:open":
      openQEdit(val10);
      break;
    case "qedit:save": {
      const tarjeta9 = state.cards.find((c) => c.id === el.dataset.id);
      if (tarjeta9) {
        const prio = $("#qePrio"),
          fin = $("#qeFin");
        (prio && (tarjeta9.prioridad = prio.value),
          fin && (tarjeta9.fin = fin.value || null),
          touch(),
          closeModal(),
          render(),
          flash("✓ Actualizada"));
      }
      break;
    }
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
      ((state.calCursor = parseISO(el.dataset.iso)), render());
      break;
    case "cal:mes":
      ((state.calMode = "mes"), render());
      break;
    case "cal:semana":
      ((state.calMode = "semana"), render());
      break;
    case "nuevo:tipo":
      ((state.draftTipo = el.dataset.tipo),
        document
          .querySelectorAll(".tipo-opt")
          .forEach((el2) => el2.classList.toggle("on", el2.dataset.tipo === el.dataset.tipo)));
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
      (toggleArr(current(), "sectores", el.dataset.sector), renderPanel());
      break;
    case "sector:add": {
      (toggleArr(current(), "sectores", el.dataset.sector), renderPanel());
      const el8 = $("#sectorSearch");
      if (el8) el8.focus();
      break;
    }
    case "sector:create": {
      createSectorInline(el.dataset.sectorName);
      break;
    }
    case "asig:toggle":
      (toggleArr(current(), "asignados", el.dataset.person), renderPanel());
      break;
    case "cl:toggle": {
      const tarjeta = current(),
        hallado2 = tarjeta.checklist.find((item) => item.id === el.dataset.cl);
      if (hallado2) {
        const val18 = progress(tarjeta).pct;
        ((hallado2.done = !hallado2.done), touch());
        const val19 = progress(tarjeta).pct;
        renderPanel();
        if (val19 === 100 && val18 < 100 && (tarjeta.checklist || []).length) {
          const caja = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
          (confettiBurst(caja ? caja.left + 8 : innerWidth / 2, caja ? caja.top + 8 : innerHeight / 2),
            flash("🎉 ¡Checklist completo!"));
        }
      }
      break;
    }
    case "palette:run": {
      const val20 = el.dataset.prun,
        val21 = el.dataset.arg;
      closeModal();
      if (val20 === "view") (state.view !== val21 && ((state.view = val21), pushNav()), render());
      else {
        if (val20 === "card") openDetail(el.dataset.id);
        else {
          if (val20 === "do") {
            if (val21 === "nuevo:open") openNuevo();
            else {
              if (val21 === "mis:toggle")
                !state.userId
                  ? flash("Entrá con tu nombre del equipo para usar “Mis tareas”", true)
                  : ((state.mis = !state.mis), render());
              else {
                if (val21 === "misemana:open") openMiSemana();
                else {
                  if (val21 === "app:print") window.print();
                  else {
                    if (val21 === "carga:open") openCarga();
                    else {
                      if (val21 === "notif:open") openNotif();
                      else {
                        if (val21 === "settings:open") openSettings();
                        else {
                          if (val21 === "theme:toggle") toggleTheme();
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
      const tarjeta2 = current();
      (tarjeta2.checklist.push({
        id: uid(),
        text: "Nuevo ítem",
        done: false,
      }),
        touch(),
        renderPanel());
      break;
    }
    case "cl:del": {
      const tarjeta3 = current();
      ((tarjeta3.checklist = tarjeta3.checklist.filter((item) => item.id !== el.dataset.cl)),
        touch(),
        renderPanel());
      break;
    }
    case "link:add": {
      const val2 = current();
      if (!val2) break;
      const campo3 = $("#linkLabel"),
        campo4 = $("#linkUrl");
      let txt4 = ((campo4 && campo4.value) || "").trim();
      if (!txt4) {
        flash("Poné el link (URL)", true);
        break;
      }
      if (!/^https?:\/\//i.test(txt4)) txt4 = "https://" + txt4;
      ((val2.links || (val2.links = [])).push({
        label: ((campo3 && campo3.value) || "").trim() || txt4,
        url: txt4,
      }),
        touch(),
        renderPanel());
      break;
    }
    case "link:del": {
      const val3 = current();
      if (!val3 || !val3.links) break;
      (val3.links.splice(+el.dataset.i, 1), touch(), renderPanel());
      break;
    }
    case "fase:add": {
      const val4 = current();
      (val4.fases.push({
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
      const val5 = current();
      ((val5.fases = val5.fases.filter((fase) => fase.id !== el.dataset.fase)), touch(), renderPanel());
      break;
    }
    case "ft:add": {
      const val6 = current(),
        hallado3 = val6.fases.find((fase) => fase.id === el.dataset.fase);
      hallado3 &&
        ((hallado3.tareas = hallado3.tareas || []),
        hallado3.tareas.push({
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
      const val7 = current(),
        hallado4 = val7.fases.find((fase) => fase.id === el.dataset.fase);
      hallado4 &&
        ((hallado4.tareas = (hallado4.tareas || []).filter((arg) => arg.id !== el.dataset.task)),
        touch(),
        renderPanel());
      break;
    }
    case "ft:toggle": {
      const val8 = current(),
        hallado5 = val8.fases.find((fase) => fase.id === el.dataset.fase);
      if (hallado5) {
        const hallado6 = (hallado5.tareas || []).find((arg) => arg.id === el.dataset.task);
        hallado6 && ((hallado6.done = !hallado6.done), touch(), renderPanel());
      }
      break;
    }
    case "curso:publicar": {
      const val22 = current();
      (logAct(val22, "publicó al inventario"),
        patch(val22, {
          publicado: true,
          enActualizacion: false,
        }),
        renderPanel(),
        render(),
        flash("◎ Publicado al inventario del Mapa"));
      break;
    }
    case "curso:actualizar": {
      const val23 = current();
      (logAct(val23, "generó actualización"),
        patch(val23, {
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
      const val24 = current();
      (logAct(val24, "republicó al mapa"),
        patch(val24, {
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
    case "kcard:dup":
      doDup(val10);
      break;
    case "kcard:del":
      doDelete(val10);
      break;
    case "vinc:add": {
      const tarjeta5 = current();
      if (tarjeta5 && val10) {
        ((tarjeta5.vinculos = tarjeta5.vinculos || []),
          !tarjeta5.vinculos.includes(val10) && tarjeta5.vinculos.push(val10),
          touch(),
          renderPanel());
      }
      break;
    }
    case "vinc:del": {
      const tarjeta6 = current();
      if (tarjeta6 && val10) {
        ((tarjeta6.vinculos = (tarjeta6.vinculos || []).filter((arg) => arg !== val10)), touch(), renderPanel());
      }
      break;
    }
    case "mapa:relacionadas":
      ((state.view = "kanban"),
        (state.filters = Object.assign({}, state.filters, { sector: el.dataset.sector })),
        pushNav(),
        render());
      break;
    case "date:preset": {
      const tarjeta8 = current(),
        campo = el.dataset.field,
        val22 = el.dataset.preset;
      if (tarjeta8 && campo) {
        const iso3 =
          val22 === "hoy" ? todayISO() : val22 === "manana" ? isoOf(addDays(new Date(), 1)) : isoOf(addDays(new Date(), 7));
        ((tarjeta8[campo] = iso3), touch(), renderPanel());
      }
      break;
    }
    case "panel:menu":
      el.closest(".panel-menu-wrap") && el.closest(".panel-menu-wrap").classList.toggle("open");
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
  } catch (err) {}
}
window.addEventListener("popstate", (arg) => {
  if (!$("#modal").classList.contains("hidden")) {
    closeModal();
    try {
      history.pushState(navState(), "");
    } catch (err) {}
    return;
  }
  if ($("#panel").classList.contains("open")) {
    closePanel();
    try {
      history.pushState(navState(), "");
    } catch (err2) {}
    return;
  }
  const val = arg.state;
  val &&
    ((state.view = val.v),
    (state.mapaSec = val.ms || state.mapaSec),
    (state.eduSector = val.es || null),
    (state.eduEst = ""),
    (state.eduQ = ""),
    render());
});
function toggleArr(arg, txt, sector) {
  if (!arg) return;
  arg[txt] = arg[txt] || [];
  const n = arg[txt].indexOf(sector);
  if (n >= 0) arg[txt].splice(n, 1);
  else arg[txt].push(sector);
  touch();
}
(document.addEventListener("input", (ev) => {
  if (ev.target.id === "searchInput") {
    renderSearchResults(ev.target.value);
    return;
  }
  if (ev.target.id === "cmdkInput") {
    renderPalette(ev.target.value);
    return;
  }
  if (ev.target.id === "sectorSearch") {
    renderSectorResults(ev.target.value);
    return;
  }
  if (ev.target.id === "eduSearch") {
    ((state.eduQ = ev.target.value), renderEduList());
    return;
  }
  const val = ev.target.dataset.filter;
  if (val) {
    state.filters[val] = ev.target.value;
    val === "texto" && renderView();
    return;
  }
  const val2 = ev.target.dataset.field;
  if (val2) {
    const val3 = current();
    if (val3) {
      applyField(val3, val2, ev.target);
      if (val2 === "titulo" && state.view !== "cursos") {
      }
    }
  }
}),
  document.addEventListener(
    "blur",
    (ev) => {
      if (ev.target && ev.target.dataset && ev.target.dataset.field === "titulo" && !ev.target.value.trim()) {
        const tarjeta11 = current();
        if (tarjeta11) {
          ((ev.target.value = "Sin título"), (tarjeta11.titulo = "Sin título"), touch());
          flash("El título no puede quedar vacío", true);
        }
      }
    },
    true,
  ),
  document.addEventListener("change", (ev) => {
    if (ev.target.id === "vincAdd") {
      const tarjeta10 = current(),
        val0 = ev.target.value;
      if (tarjeta10 && val0) {
        ((tarjeta10.vinculos = tarjeta10.vinculos || []),
          !tarjeta10.vinculos.includes(val0) && tarjeta10.vinculos.push(val0),
          touch(),
          renderPanel());
      }
      return;
    }
    const val2 = ev.target.dataset.filter;
    if (val2) {
      ((state.filters[val2] = ev.target.value), render());
      return;
    }
    const val3 = ev.target.dataset.control;
    if (val3) {
      ((state[val3] = ev.target.value), render());
      return;
    }
    const val4 = ev.target.dataset.set;
    if (val4) {
      applySetting(val4, ev.target.value);
      return;
    }
    const val5 = ev.target.dataset.field;
    if (val5) {
      const val6 = current();
      if (val6) {
        applyField(val6, val5, ev.target);
        // Los inputs de fecha nativos disparan "change" más de una vez
        // mientras se completa el valor (por ej. al tipear cada dígito del
        // año): si renderPanel() reconstruye el <input> en el medio, el
        // usuario pierde el foco y no puede terminar de elegir el año.
        if (val5 === "inicio" || val5 === "fin") render();
        else if (STRUCTURAL.includes(val5)) (renderPanel(), render());
        else render();
      }
    }
  }),
  document.addEventListener("dragstart", (ev) => {
    const el = ev.target.closest(".kcard");
    if (el) {
      ((state.dragId = el.dataset.id), el.classList.add("drag"));
      return;
    }
    const el2 = ev.target.closest(".cal-bar");
    if (el2) {
      ((state.dragCal = el2.dataset.id), el2.classList.add("drag"));
      try {
        ev.dataTransfer.effectAllowed = "move";
      } catch (err) {}
      return;
    }
    const el3 = ev.target.closest(".tl-bar");
    if (el3) {
      ((state.dragTl = el3.dataset.id), el3.classList.add("drag"));
      try {
        ev.dataTransfer.effectAllowed = "move";
      } catch (err2) {}
    }
  }),
  document.addEventListener("dragend", (ev) => {
    const el = ev.target.closest(".kcard");
    if (el) el.classList.remove("drag");
    const el2 = ev.target.closest(".cal-bar");
    if (el2) el2.classList.remove("drag");
    const el3 = ev.target.closest(".tl-bar");
    if (el3) el3.classList.remove("drag");
    (document.querySelectorAll(".kcol-body.drop").forEach((el4) => el4.classList.remove("drop")),
      document.querySelectorAll(".cwd.cwd-drop").forEach((el4) => el4.classList.remove("cwd-drop")),
      document.querySelectorAll(".tl-canvas.drop").forEach((el4) => el4.classList.remove("drop")),
      (state.dragCal = null),
      (state.dragTl = null));
  }),
  document.addEventListener("dragover", (ev) => {
    const el = ev.target.closest(".kcol-body");
    if (el) {
      (ev.preventDefault(), el.classList.add("drop"));
      return;
    }
    if (state.dragCal) {
      const el2 = ev.target.closest(".cwd");
      if (el2) {
        (ev.preventDefault(), el2.classList.add("cwd-drop"));
        return;
      }
    }
    if (state.dragTl) {
      const el3 = ev.target.closest(".tl-canvas");
      el3 && (ev.preventDefault(), el3.classList.add("drop"));
    }
  }),
  document.addEventListener("dragleave", (ev) => {
    const el = ev.target.closest(".kcol-body");
    if (el) el.classList.remove("drop");
    const el2 = ev.target.closest(".cwd");
    if (el2) el2.classList.remove("cwd-drop");
    const el3 = ev.target.closest(".tl-canvas");
    if (el3) el3.classList.remove("drop");
  }),
  document.addEventListener("drop", (ev) => {
    const el2 = ev.target.closest(".kcol-body");
    if (el2 && state.dragId) {
      ev.preventDefault();
      const hallado = state.cards.find((tarjeta) => tarjeta.id === state.dragId);
      hallado &&
        hallado.estado !== el2.dataset.estado &&
        (logAct(
          hallado,
          "pasó a " + ((ESTADOS.find((estado) => estado.id === el2.dataset.estado) || {}).nombre || ""),
        ),
        el2.dataset.estado === "en-revision" && (hallado.revisionDesde = isoOf(new Date())),
        (hallado.estado = el2.dataset.estado),
        touch());
      ((state.dragId = null), render());
      return;
    }
    const el3 = ev.target.closest(".cwd");
    if (el3 && state.dragCal) {
      (ev.preventDefault(), rescheduleCard(state.dragCal, el3.dataset.iso), (state.dragCal = null));
      return;
    }
    const el = ev.target.closest(".tl-canvas");
    if (el && state.dragTl) {
      ev.preventDefault();
      const caja = el.getBoundingClientRect(),
        n = parseInt(el.dataset.tldays, 10) || 1,
        val = Math.max(0, Math.min(caja.width, (ev.clientX || 0) - caja.left)),
        n2 = caja.width ? Math.round((val / caja.width) * (n - 1)) : 0,
        iso = isoOf(addDays(parseISO(el.dataset.tlstart), n2));
      (rescheduleCard(state.dragTl, iso), (state.dragTl = null));
    }
  }));
function rescheduleCard(arg, iso) {
  const tarjeta = state.cards.find((tarjeta2) => tarjeta2.id === arg);
  if (!tarjeta || !iso) return;
  const val = tarjeta.inicio || tarjeta.fin,
    val2 = tarjeta.fin || tarjeta.inicio,
    n = val && val2 ? Math.max(0, daysBetween(val, val2)) : 0;
  ((tarjeta.inicio = iso),
    (tarjeta.fin = isoOf(addDays(parseISO(iso), n))),
    logAct(tarjeta, "reprogramada a " + fmtShort(iso)),
    touch(),
    render(),
    flash(
      "📅 “" + tarjeta.titulo + "” → " + fmtShort(tarjeta.inicio) + (n ? " – " + fmtShort(tarjeta.fin) : ""),
    ));
}
function copyCardLink(arg) {
  if (!arg) return;
  const txt = location.origin + location.pathname + "#card=" + encodeURIComponent(arg.id),
    fn = () => flash("🔗 Enlace copiado"),
    fn2 = (txt2) => {
      try {
        const el = document.createElement("textarea");
        ((el.value = txt2),
          (el.style.cssText = "position:fixed;opacity:0"),
          document.body.appendChild(el),
          el.select(),
          document.execCommand("copy"),
          el.remove(),
          fn());
      } catch (err) {
        flash("No pude copiar — copialo de la barra del navegador", true);
      }
    };
  if (navigator.clipboard && navigator.clipboard.writeText)
    navigator.clipboard
      .writeText(txt)
      .then(fn)
      ["catch"](() => fn2(txt));
  else fn2(txt);
}
function pushRecent(id2) {
  if (!id2) return;
  state.recent = [id2, ...(state.recent || []).filter((arg) => arg !== id2)].slice(0, 8);
}
(document.addEventListener("click", (ev) => {
  const el = $("#userMenu");
  if (el && !el.classList.contains("hidden")) {
    if (
      !ev.target.closest('[data-action="menu:toggle"]') &&
      (!ev.target.closest("#userMenu") || ev.target.closest(".menu-item"))
    )
      el.classList.add("hidden");
  }
  const elFiltros = $("#filtrosPop");
  if (elFiltros && !elFiltros.classList.contains("hidden") && !ev.target.closest(".filt-pop-wrap"))
    elFiltros.classList.add("hidden");
  document.querySelectorAll(".panel-menu-wrap.open").forEach((wrap) => {
    if (!wrap.contains(ev.target)) wrap.classList.remove("open");
  });
}),
  document.addEventListener("keydown", (ev) => {
    if ((ev.metaKey || ev.ctrlKey) && (ev.key === "k" || ev.key === "K")) {
      (ev.preventDefault(), openPalette());
      return;
    }
    if ($("#cmdkInput")) {
      if (ev.key === "ArrowDown") {
        (ev.preventDefault(), paletteMove(1));
        return;
      }
      if (ev.key === "ArrowUp") {
        (ev.preventDefault(), paletteMove(-1));
        return;
      }
      if (ev.key === "Enter") {
        const el = document.querySelector(".cmdk-item.sel") || document.querySelector(".cmdk-item");
        el && (ev.preventDefault(), el.click());
        return;
      }
    }
    if (ev.key === "Escape") {
      const el2 = $("#userMenu");
      if (el2 && !el2.classList.contains("hidden")) {
        el2.classList.add("hidden");
        return;
      }
      if (!$("#modal").classList.contains("hidden")) closeModal();
      else {
        if ($("#panel").classList.contains("open")) closePanel();
      }
    }
    if (ev.key === "Enter" && (ev.target.id === "gateInput" || ev.target.id === "gatePassInput")) {
      (ev.preventDefault(), gateTry($("#gateInput").value));
      return;
    }
    if (ev.key === "Enter" && ev.target.dataset && ev.target.dataset.quickadd) {
      ev.preventDefault();
      const val = ev.target.dataset.quickadd,
        txt = (ev.target.value || "").trim();
      if (txt) {
        const tarjeta = newCard("libre", txt);
        ((tarjeta.estado = val), logAct(tarjeta, "creada"), state.cards.push(tarjeta), touch(), render());
        const el3 = document.querySelector('[data-quickadd="' + val + '"]');
        if (el3) el3.focus();
      }
    }
    // Enter en un ítem del checklist confirma el texto tipeado y abre uno
    // nuevo con el foco puesto, para cargar varios sin soltar el teclado.
    if (
      ev.key === "Enter" &&
      ev.target.dataset &&
      ev.target.dataset.field &&
      ev.target.dataset.field.indexOf("cl:") === 0
    ) {
      ev.preventDefault();
      const tarjeta2 = current();
      if (tarjeta2) {
        const idActual = ev.target.dataset.field.slice(3),
          hallado = (tarjeta2.checklist || []).find((arg) => arg.id === idActual);
        if (hallado) hallado.text = ev.target.value;
        const nuevoItem = {
          id: uid(),
          text: "",
          done: false,
        };
        (tarjeta2.checklist.push(nuevoItem), touch(), renderPanel());
        const el4 = document.querySelector('[data-field="cl:' + nuevoItem.id + '"]');
        if (el4) el4.focus();
      }
    }
  }));
function calShift(n) {
  const fecha = state.calCursor;
  ((state.calCursor =
    state.calMode === "mes" ? new Date(fecha.getFullYear(), fecha.getMonth() + n, 1) : addDays(fecha, 7 * n)),
    render());
}
function doCreate() {
  const txt = ($("#nuevoTitulo").value || "").trim() || "Sin título",
    tarjeta = newCard(state.draftTipo, txt);
  (logAct(tarjeta, "creada"), state.cards.push(tarjeta), touch(), closeModal());
  if (state.view === "mapa") state.view = "kanban";
  (render(), openDetail(tarjeta.id));
}
function doIngest() {
  const ingestReplace = $("#ingestReplace") && $("#ingestReplace").checked;
  let val3;
  try {
    let val = $("#ingestText")
      .value.trim()
      .replace(/^const\s+CURSOS\s*=\s*/, "")
      .replace(/;?\s*$/, "");
    val3 = JSON.parse(val);
  } catch (err) {
    flash("⚠ JSON inválido: " + err.message, true);
    return;
  }
  if (!Array.isArray(val3)) {
    flash("⚠ Esperaba un array", true);
    return;
  }
  const val2 = ingestCatalogo(val3, {
    replace: ingestReplace,
  });
  (touch(),
    closeModal(),
    (state.view = "cursos"),
    render(),
    flash("◎ " + val2 + " curso(s) ingresados como activos"));
}
function doSaveTpl() {
  const tarjeta = current(),
    txt = ($("#tplName").value || "").trim();
  if (!txt) {
    flash("Poné un nombre", true);
    return;
  }
  const txt2 = "tpl-" + txt.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  ((state.customTpl[txt2] = {
    nombre: txt,
    fases: (tarjeta.fases || []).map((def) => def.nombre),
    checklist: (tarjeta.checklist || []).map((arg) => arg.text),
  }),
    touch(),
    closeModal(),
    flash("🧩 Plantilla “" + txt + "” guardada"));
}
function doDup(id) {
  const tarjeta2 = id ? state.cards.find((c) => c.id === id) : current();
  if (!tarjeta2) return;
  const tarjeta = JSON.parse(JSON.stringify(tarjeta2));
  ((tarjeta.id = uid()),
    (tarjeta.titulo = tarjeta2.titulo + " (copia)"),
    (tarjeta.publicado = false),
    tarjeta.checklist.forEach((item) => (item.id = uid())),
    (tarjeta.fases || []).forEach((arg) => (arg.id = uid())),
    state.cards.push(tarjeta),
    touch(),
    flash("⧉ Tarjeta duplicada"),
    id ? render() : (openDetail(tarjeta.id), render()));
}
function doDelete(id) {
  const tarjeta = id ? state.cards.find((c) => c.id === id) : current();
  if (!tarjeta) return;
  confirmar("¿Eliminar “" + tarjeta.titulo + "”?", () => {
    const eraSeleccionada = tarjeta.id === state.selectedId;
    (dropCardsWithUndo([tarjeta.id]), eraSeleccionada ? closePanel() : render());
  });
}
// Snackbar de "Deshacer" para el último borrado: guarda una copia completa
// de las tarjetas justo antes de tirarlas, y las repone si nadie tocó nada
// más en el medio.
let _ultimoBorrado = null,
  _undoTimer = null;
function dropCardsWithUndo(ids) {
  const snap = ids
    .map((id) => state.cards.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => JSON.parse(JSON.stringify(c)));
  if (!snap.length) return;
  (dropCards(ids), touch());
  ((_ultimoBorrado = snap), clearTimeout(_undoTimer), mostrarUndo(snap.length));
  _undoTimer = setTimeout(() => {
    ((_ultimoBorrado = null), ocultarUndo());
  }, 6000);
}
function undoBorrado() {
  if (!_ultimoBorrado) return;
  (_ultimoBorrado.forEach((c) => {
    (delete state.deleted[c.id], state.cards.push(c));
  }),
    (_ultimoBorrado = null),
    clearTimeout(_undoTimer),
    ocultarUndo(),
    touch(),
    render(),
    flash("↩ Restaurada"));
}
function mostrarUndo(cantidad) {
  let el = $("#undoBar");
  (!el &&
    ((el = document.createElement("div")), (el.id = "undoBar"), (el.className = "snackbar"),
    document.body.appendChild(el)),
    (el.innerHTML =
      "<span>" +
      (cantidad > 1 ? cantidad + " tarjetas eliminadas" : "Tarjeta eliminada") +
      '</span><button class="btn btn-sm" data-action="undo:del">↩ Deshacer</button>'),
    el.classList.add("show"));
}
function ocultarUndo() {
  const el = $("#undoBar");
  if (el) el.classList.remove("show");
}
// Edición rápida: un mini-modal con solo responsable/prioridad/fecha fin,
// para no tener que abrir el panel completo por un cambio de un campo.
function openQEdit(id) {
  const tarjeta = state.cards.find((c) => c.id === id);
  if (!tarjeta) return;
  openModal(
    '<h2 style="font-size:16px">✎ Edición rápida</h2><div class="sub-t">' +
      esc(tarjeta.titulo) +
      '</div><div class="fld-row"><div class="fld"><label>Prioridad</label><select id="qePrio"><option value="normal" ' +
      (tarjeta.prioridad === "normal" ? "selected" : "") +
      '>Normal</option><option value="alta" ' +
      (tarjeta.prioridad === "alta" ? "selected" : "") +
      '>Alta</option></select></div><div class="fld"><label>Fecha fin</label><input type="date" id="qeFin" value="' +
      (tarjeta.fin || "") +
      '"></div></div><div class="modal-foot"><button class="btn" data-action="modal:close">Cancelar</button><button class="btn btn-primary" data-action="qedit:save" data-id="' +
      id +
      '">Guardar</button></div>',
  );
}
// Botón "volver arriba": el Mapa y el Planner pueden crecer mucho (80+
// tarjetas, columnas largas) y la app no tiene un scroll propio por
// sección — es el documento entero el que se desplaza.
(function initGoTop() {
  const el = document.createElement("button");
  ((el.id = "goTop"), (el.className = "gotop"), (el.title = "Volver arriba"), (el.setAttribute("aria-label", "Volver arriba")), (el.innerHTML = "↑"));
  document.addEventListener("click", (ev) => {
    if (ev.target.closest("#goTop")) window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(el));
  if (document.readyState !== "loading") document.body.appendChild(el);
  window.addEventListener(
    "scroll",
    () => {
      el.classList.toggle("show", window.scrollY > 480);
    },
    { passive: true },
  );
})();
const ICON_SUN =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  ICON_MOON =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
function toggleTheme() {
  const el = document.documentElement;
  el.dataset.theme = el.dataset.theme === "dark" ? "light" : "dark";
  const el2 = $("#themeBtn");
  if (el2) el2.innerHTML = el.dataset.theme === "dark" ? ICON_SUN : ICON_MOON;
}
// Pantalla de corte cuando no se pudo leer el backend. Es preferible que la
// app no se pueda usar a que se pueda usar en falso.
let errorConexion = null;
function mostrarPantallaSinConexion(err) {
  errorConexion = err || errorConexion;
  const copias = readBackups(),
    ultima = copias && copias[0];
  ($("#view") || document.body).innerHTML =
    '<div class="empty" style="max-width:560px;margin:40px auto;text-align:left">' +
    '<h2 style="margin:0 0 10px">No pude conectarme al tablero del equipo</h2>' +
    "<p>Los datos están en Supabase y ahora mismo no responde, así que no puedo mostrarte " +
    "el tablero real. No te muestro uno de ejemplo para que no trabajes sobre algo que " +
    "después no se guarda.</p>" +
    "<p><b>Qué suele ser:</b> el proyecto de Supabase quedó pausado por inactividad (pasa " +
    "en el plan gratuito), la clave cambió, o se cayó la conexión.</p>" +
    (ultima
      ? "<p>Tenés una copia local de " +
        esc(relTime(ultima.ts)) +
        " con " +
        (ultima.tarjetas || 0) +
        " tarjetas. No se pierde: sigue guardada en este navegador.</p>"
      : "") +
    '<p style="margin-top:16px">' +
    '<button class="btn primary" data-action="reintentar:conexion">Reintentar</button></p>' +
    '<p style="margin-top:14px;font-size:12px;opacity:.7">Detalle técnico: ' +
    esc(String((err && err.message) || err)) +
    "</p></div>";
  ($("#filters") && ($("#filters").innerHTML = ""), (state.ready = false));
}
function showBanner() {
  const val = Store.mode();
  let val2;
  if (val === "supabase")
    val2 =
      '<div class="note" style="background:var(--ok-soft);border-color:color-mix(in srgb, var(--ok) 40%, transparent);color:var(--ok)">🟢 <b>Equipo conectado (Supabase)</b> — lo que carga cada uno lo ven todos en vivo. <span id="syncAgo" class="sync-ago"></span></div>';
  else {
    if (val === "error")
      val2 =
        '<div class="note warn">🔴 <b>Sin conexión al backend.</b> Revisá las claves en <code>BACKEND</code> y recargá. No se guardan cambios para no pisar datos del equipo.</div>';
    else {
      if (val === "memoria")
        val2 =
          '<div class="note warn">⚠ <b>Modo demo (memoria):</b> no hay backend compartido acá; los cambios no se comparten ni persisten al recargar.</div>';
      else
        val2 = '<div class="note">🔗 Persistencia compartida activa — lo que cargás lo ve el equipo.</div>';
    }
  }
  ($("#banner").innerHTML = val2), updateSyncAgo();
}
function updateSyncAgo() {
  const el = $("#syncAgo");
  if (el && state.lastSyncTs) el.textContent = "· sincronizado " + relTime(state.lastSyncTs);
}
setInterval(updateSyncAgo, 1000);
let flashT = null;
function flash(txt, flag) {
  clearTimeout(flashT);
  let flash2 = $("#flash");
  (!flash2 &&
    ((flash2 = document.createElement("div")),
    (flash2.id = "flash"),
    (flash2.style.cssText =
      "position:fixed;bottom:22px;left:50%;transform:translateX(-50%);z-index:90;padding:11px 20px;border-radius:999px;font-size:13px;font-weight:600;box-shadow:var(--shadow-lg);pointer-events:none"),
    document.body.appendChild(flash2)),
    (flash2.style.background = flag ? "var(--bad)" : "var(--coto-navy)"),
    (flash2.style.color = "#fff"),
    (flash2.textContent = txt),
    (flash2.style.opacity = "1"),
    (flash2.hidden = false),
    (flashT = setTimeout(() => {
      ((flash2.style.opacity = "0"), (flash2.hidden = true));
    }, 2600)));
}
function renderGateTeam() {
  $("#gateTeam").innerHTML = TEAM.map(
    (miembro) =>
      '<button type="button" class="gate-person" data-action="gate:person" data-nombre="' +
      esc(miembro.nombre) +
      '">' +
      avatarHTML(miembro.id) +
      '<div><div class="nm">' +
      esc(miembro.nombre) +
      "</div></div></button>",
  ).join("");
}
function enterAs(value) {
  if (!value) {
    flash("Decinos quién sos 🙂", true);
    return;
  }
  ((state.user = value), $("#gate").classList.add("hidden"));
  const hallado = TEAM.find((miembro) => miembro.nombre.toLowerCase() === value.toLowerCase());
  ((state.userId = hallado ? hallado.id : null),
    ($("#userChip").innerHTML =
      (hallado
        ? avatarHTML(hallado.id)
        : '<span class="avatar" style="background:var(--coto-blue)">' +
          value.slice(0, 1).toUpperCase() +
          "</span>") +
      "<span>" +
      esc(value) +
      '</span><span style="opacity:.45;font-size:11px">▾</span>'));
  try {
    const val = (location.hash || "").match(/card=([^&]+)/);
    if (val) {
      const val2 = decodeURIComponent(val[1]);
      if (state.cards.some((tarjeta) => tarjeta.id === val2)) setTimeout(() => openDetail(val2), 60);
    }
  } catch (err) {}
}
function updateGatePass() {
  const el = $("#gatePassInput");
  if (el) el.classList.toggle("hidden", !state.appPassHash);
}
function gateTry(value) {
  value = (value || "").trim();
  if (!value) {
    flash("Decinos quién sos 🙂", true);
    return;
  }
  if (state.appPassHash) {
    const el = $("#gatePassInput"),
      value2 = el ? el.value : "";
    if (hashStr(value2) !== state.appPassHash) {
      flash("Clave incorrecta 🔒", true);
      el && ((el.value = ""), el.focus());
      return;
    }
    if (el) el.value = "";
  }
  enterAs(value);
}
function relTime(ts2) {
  if (!ts2) return "";
  const val = Math.floor((Date.now() - ts2) / 1000);
  if (val < 60) return "recién";
  if (val < 3600) return "hace " + Math.floor(val / 60) + " min";
  if (val < 86400) return "hace " + Math.floor(val / 3600) + " h";
  const val2 = Math.floor(val / 86400);
  if (val2 === 1) return "ayer";
  if (val2 < 7) return "hace " + val2 + " días";
  return new Date(ts2).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}
function logAct(val, txt) {
  if (!val) return;
  ((val.actividad = val.actividad || []),
    val.actividad.push({
      ts: Date.now(),
      autor: state.user || "sistema",
      texto: txt,
    }));
  if (val.actividad.length > 60) val.actividad = val.actividad.slice(-60);
}
function addComment() {
  const val = current();
  if (!val) return;
  const campo = $("#cmtInput"),
    txt = ((campo && campo.value) || "").trim();
  if (!txt) return;
  ((val.comentarios = val.comentarios || []),
    val.comentarios.push({
      id: uid(),
      autor: state.user || "—",
      texto: txt,
      ts: Date.now(),
    }),
    logAct(val, "comentó"),
    touch(),
    renderPanel());
}
function shiftISO(inicio, arg) {
  if (!inicio) return inicio;
  const fecha = parseISO(inicio);
  if (arg === "semanal") fecha.setDate(fecha.getDate() + 7);
  else {
    if (arg === "mensual") fecha.setMonth(fecha.getMonth() + 1);
    else {
      if (arg === "trimestral") fecha.setMonth(fecha.getMonth() + 3);
    }
  }
  return isoOf(fecha);
}
function recurrar(val) {
  const tarjeta = JSON.parse(JSON.stringify(val));
  return (
    (tarjeta.id = uid()),
    (tarjeta.estado = "pendiente"),
    (tarjeta.publicado = false),
    (tarjeta.enActualizacion = false),
    (tarjeta.comentarios = []),
    (tarjeta.actividad = []),
    (tarjeta.inicio = shiftISO(val.inicio, val.recurrencia)),
    (tarjeta.fin = shiftISO(val.fin, val.recurrencia)),
    (tarjeta.checklist || []).forEach((arg) => {
      ((arg.id = uid()), (arg.done = false));
    }),
    (tarjeta.fases || []).forEach((arg) => {
      ((arg.id = uid()),
        (arg.inicio = shiftISO(arg.inicio, val.recurrencia)),
        (arg.fin = shiftISO(arg.fin, val.recurrencia)),
        (arg.tareas || []).forEach((arg2) => {
          ((arg2.id = uid()), (arg2.done = false), (arg2.fecha = shiftISO(arg2.fecha, val.recurrencia)));
        }));
    }),
    logAct(tarjeta, "instancia recurrente generada"),
    logAct(val, "generó próxima instancia"),
    state.cards.push(tarjeta),
    touch(),
    tarjeta
  );
}
function openSearch() {
  (openModal(
    '<div class="search-modal"><div class="search-top">🔎<input id="searchInput" placeholder="Buscar tarjetas, cursos, apps, sectores..." autocomplete="off"><span class="kbd">esc</span></div><div class="search-results" id="searchResults"></div></div>',
  ),
    setTimeout(() => {
      const el = $("#searchInput");
      el && (el.focus(), renderSearchResults(""));
    }, 40));
}
function renderSearchResults(value) {
  const el = $("#searchResults");
  if (!el) return;
  value = (value || "").trim().toLowerCase();
  let lista = state.cards.slice();
  if (value)
    lista = lista.filter(
      (tarjeta) =>
        tarjeta.titulo.toLowerCase().includes(value) ||
        (tarjeta.sectores || []).some((arg) => (sectorName(arg) || arg).toLowerCase().includes(value)) ||
        ((allTipos()[tarjeta.tipo] || {}).nombre || "").toLowerCase().includes(value) ||
        (tarjeta.catalogo && (tarjeta.catalogo.bajada || "").toLowerCase().includes(value)),
    );
  lista = lista.slice(0, 14);
  if (!lista.length) {
    el.innerHTML = '<div style="padding:18px;text-align:center;color:var(--ink-soft)">Sin resultados</div>';
    return;
  }
  el.innerHTML = lista
    .map((tarjeta, arg) => {
      const txt = inInventory(tarjeta) ? "Mapa" : "Tablero",
        tipo = allTipos()[tarjeta.tipo] || {};
      return (
        '<div class="sr-item ' +
        (arg === 0 ? "sel" : "") +
        '" data-cat="' +
        primaryCat(tarjeta) +
        '" data-action="sr:open" data-id="' +
        tarjeta.id +
        '">\n      <span>' +
        (tipo.icon || "•") +
        '</span><div style="flex:1;overflow:hidden"><div class="sr-t">' +
        esc(tarjeta.titulo) +
        '</div>\n      <div class="sr-m">' +
        esc(tipo.nombre || tarjeta.tipo) +
        " · " +
        ((tarjeta.sectores || []).map((arg2) => sectorName(arg2) || arg2).join(", ") || "Sin sector") +
        '</div></div>\n      <span class="sr-where">' +
        txt +
        "</span></div>"
      );
    })
    .join("");
}
function paletteCommands() {
  const fn = (txt, txt2, txt3) => ({
    t: txt,
    d: "Saltar a la sección",
    ic: "→",
    act: "view",
    arg: txt2,
    kw: txt3,
  });
  return [
    fn("Inicio", "inicio", "home panel principal resumen dashboard kpi indicadores carga"),
    fn("Planner", "kanban", "planner tablero kanban tareas estados"),
    fn("Calendario", "calendario", "fechas mes semana"),
    fn("Timeline", "timeline", "gantt cronograma"),
    fn("Mapa del área", "mapa", "cursos edu points apps bases inventario"),
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
      d: "Quién tiene más carga",
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
    '<div class="cmdk">\n    <div class="cmdk-top"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.1-4.1"/></svg><input id="cmdkInput" placeholder="Buscar tarjetas o saltar a una sección…" autocomplete="off"><span class="kbd">esc</span></div>\n    <div class="cmdk-list" id="cmdkList"></div>\n    <div class="cmdk-foot"><span><span class="kbd">↑</span><span class="kbd">↓</span> moverse</span><span><span class="kbd">↵</span> abrir</span><span><span class="kbd">⌘K</span> abrir comando</span></div>\n  </div>',
  ),
    renderPalette(""),
    setTimeout(() => {
      const el = $("#cmdkInput");
      if (el) el.focus();
    }, 40));
}
function paletteCardItem(tarjeta) {
  return (
    '<button class="cmdk-item" data-action="palette:run" data-prun="card" data-id="' +
    tarjeta.id +
    '" data-cat="' +
    primaryCat(tarjeta) +
    '"><span class="cmdk-ic ic-cat">' +
    ((allTipos()[tarjeta.tipo] || {}).icon || "•") +
    '</span><span class="cmdk-tx"><b>' +
    esc(tarjeta.titulo) +
    "</b><i>" +
    esc((allTipos()[tarjeta.tipo] || {}).nombre || tarjeta.tipo) +
    '</i></span><span class="cmdk-go">↵</span></button>'
  );
}
function renderPalette(value) {
  const el = $("#cmdkList");
  if (!el) return;
  value = (value || "").trim().toLowerCase();
  const lista = paletteCommands().filter(
      (arg) => !value || (arg.t + " " + arg.kw).toLowerCase().includes(value),
    ),
    lista2 = value
      ? state.cards
          .filter(
            (tarjeta) =>
              tarjeta.titulo.toLowerCase().includes(value) ||
              (tarjeta.sectores || []).some((arg) => (sectorName(arg) || arg).toLowerCase().includes(value)),
          )
          .slice(0, 6)
      : [],
    lista3 = value
      ? []
      : (state.recent || [])
          .map((arg) => state.cards.find((tarjeta) => tarjeta.id === arg))
          .filter(Boolean)
          .slice(0, 5);
  let txt = "";
  lista3.length && (txt += '<div class="cmdk-group">Recientes</div>' + lista3.map(paletteCardItem).join(""));
  lista.length &&
    (txt +=
      '<div class="cmdk-group">Ir a · Acciones</div>' +
      lista
        .map(
          (arg) =>
            '<button class="cmdk-item" data-action="palette:run" data-prun="' +
            arg.act +
            '" data-arg="' +
            esc(arg.arg) +
            '"><span class="cmdk-ic">' +
            arg.ic +
            '</span><span class="cmdk-tx"><b>' +
            esc(arg.t) +
            "</b><i>" +
            esc(arg.d) +
            '</i></span><span class="cmdk-go">↵</span></button>',
        )
        .join(""));
  lista2.length && (txt += '<div class="cmdk-group">Tarjetas</div>' + lista2.map(paletteCardItem).join(""));
  if (!txt) txt = '<div class="cmdk-empty">Sin resultados para “' + esc(value) + "”</div>";
  el.innerHTML = txt;
  const el2 = el.querySelector(".cmdk-item");
  if (el2) el2.classList.add("sel");
}
function paletteMove(n) {
  const lista = [...document.querySelectorAll(".cmdk-item")];
  if (!lista.length) return;
  let val = lista.findIndex((el) => el.classList.contains("sel"));
  (lista.forEach((el) => el.classList.remove("sel")),
    (val = n > 0 ? (val + 1) % lista.length : (val - 1 + lista.length) % lista.length),
    lista[val].classList.add("sel"),
    lista[val].scrollIntoView({
      block: "nearest",
    }));
}
function confettiBurst(txt, txt2) {
  try {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    if (!document.body) return;
    const lista = ["#006EA0", "#26B3E8", "#2E9E8F", "#E2A03F", "#8232C8", "#D8553F", "#1EAADC"];
    for (let i = 0; i < 20; i++) {
      const el = document.createElement("i");
      el.className = "confetti";
      const n = Math.random() * Math.PI * 2,
        txt3 = 46 + Math.random() * 78;
      ((el.style.cssText =
        "left:" +
        txt +
        "px;top:" +
        txt2 +
        "px;background:" +
        lista[i % lista.length] +
        ";--dx:" +
        ((Math.cos(n) * txt3) | 0) +
        "px;--dy:" +
        ((Math.sin(n) * txt3 + 70) | 0) +
        "px;--r:" +
        ((Math.random() * 420) | 0) +
        "deg;animation-delay:" +
        ((Math.random() * 80) | 0) +
        "ms"),
        document.body.appendChild(el),
        setTimeout(() => el.remove(), 1000));
    }
  } catch (err) {}
}
function computeAlerts() {
  const iso = todayISO(),
    iso2 = isoOf(addDays(new Date(), 3)),
    lista = [];
  (boardCards().forEach((arg) => {
    const val = arg.fin || arg.inicio;
    if (!val) return;
    if (val < iso)
      lista.push({
        c: arg,
        kind: "bad",
        ic: "⚑",
        label: "Vencida",
        sub: "venció " + fmtShort(val),
      });
    else {
      if (val <= iso2)
        lista.push({
          c: arg,
          kind: "warn",
          ic: "⏳",
          label: "Vence pronto",
          sub: "para " + fmtShort(val),
        });
    }
  }),
    state.cards.forEach((tarjeta) => {
      if (tarjeta.recurrencia && tarjeta.recurrencia !== "none" && !isInventory(tarjeta)) {
        const val = tarjeta.fin || tarjeta.inicio;
        if (val && val <= iso)
          lista.push({
            c: tarjeta,
            kind: "rec",
            ic: "↻",
            label: "Recurrente",
            sub: "corresponde nueva instancia",
          });
      }
    }));
  const obj = {};
  return lista.filter((arg) => {
    if (obj[arg.c.id]) return false;
    return ((obj[arg.c.id] = 1), true);
  });
}
// Las alertas se recalculan en vivo desde las tarjetas (no son un log
// guardado), así que "leídas" no las borra: solo las oculta hasta que
// algo cambie en esa tarjeta (nueva fecha, otro estado). Queda en este
// navegador (localStorage), no es un dato de equipo.
function alertaKey(recurso) {
  return recurso.c.id + "|" + recurso.kind + "|" + recurso.sub;
}
function alertasLeidas() {
  try {
    return new Set(JSON.parse(localStorage.getItem("cf.alertasLeidas") || "[]"));
  } catch (e) {
    return new Set();
  }
}
function marcarAlertasLeidas(claves) {
  try {
    const set = alertasLeidas();
    claves.forEach((clave) => set.add(clave));
    localStorage.setItem("cf.alertasLeidas", JSON.stringify([...set]));
  } catch (e) {}
}
function alertasSinLeer() {
  const leidas = alertasLeidas();
  return computeAlerts().filter((recurso) => !leidas.has(alertaKey(recurso)));
}
function updateBell() {
  const el = $("#notifBadge");
  if (!el || !el.classList) return;
  const cantidad = alertasSinLeer().length;
  if (cantidad) ((el.textContent = cantidad), el.classList.remove("hidden"));
  else el.classList.add("hidden");
}
function openNotif() {
  const lista = alertasSinLeer();
  state.selectedId = null;
  const txt = lista.length
    ? lista
        .map(
          (recurso) =>
            '<div class="notif-item" data-action="card:open" data-id="' +
            recurso.c.id +
            '"><div class="notif-ic ' +
            recurso.kind +
            '">' +
            recurso.ic +
            '</div><div style="flex:1"><div class="notif-t">' +
            esc(recurso.c.titulo) +
            '</div><div class="notif-s">' +
            recurso.label +
            " · " +
            recurso.sub +
            "</div></div></div>",
        )
        .join("")
    : '<div class="empty"><div class="big">✅</div><div style="font-weight:700;color:var(--ink)">Todo al día</div><div style="margin-top:4px">Sin vencidas ni alertas.</div></div>';
  (($("#panel").innerHTML =
    '<div class="panel-head"><div style="flex:1"><div class="tipo-pill">🔔 Alertas</div><div style="font-family:var(--titulo);font-size:18px;font-weight:700;margin-top:4px">' +
    lista.length +
    " pendiente" +
    (lista.length !== 1 ? "s" : "") +
    '</div></div>' +
    (lista.length
      ? '<button class="btn btn-ghost btn-sm" data-action="notif:markread">✓ Marcar todas como leídas</button>'
      : "") +
    '<button class="btn btn-icon btn-ghost" data-action="panel:close">✕</button></div><div class="panel-body">' +
    txt +
    "</div>"),
    $("#panel").classList.add("open"),
    $("#overlay").classList.remove("hidden"));
}
function openSettings() {
  const txt = Object.keys(SECTORES)
      .map(
        (arg) =>
          '<div class="set-row"><input type="color" data-set="sec:' +
          arg +
          ':cat" value="' +
          SECTORES[arg].cat +
          '"><input type="text" data-set="sec:' +
          arg +
          ':nombre" value="' +
          esc(SECTORES[arg].nombre) +
          '"><span style="font-size:11px;color:var(--ink-soft);min-width:118px">' +
          esc(arg) +
          "</span></div>",
      )
      .join(""),
    txt2 = TEAM.map(
      (miembro) =>
        '<div class="set-row" style="flex-wrap:wrap">' +
        avatarHTML(miembro.id, true) +
        '<input type="text" data-set="team:' +
        miembro.id +
        ':nombre" value="' +
        esc(miembro.nombre) +
        '" placeholder="Nombre"><input type="color" data-set="team:' +
        miembro.id +
        ':color" value="' +
        miembro.color +
        '"><input type="email" data-set="team:' +
        miembro.id +
        ':email" value="' +
        esc(miembro.email || "") +
        '" placeholder="📧 email para alertas" style="flex:1 1 100%;min-width:0"></div>',
    ).join(""),
    txt3 = Object.keys(state.customTpl).length
      ? Object.keys(state.customTpl)
          .map(
            (arg) =>
              '<div class="tpl-row">🧩 ' +
              esc(state.customTpl[arg].nombre) +
              ' <span class="chk-del" data-action="tpl:del" data-tpl="' +
              arg +
              '">✕</span></div>',
          )
          .join("")
      : '<div style="font-size:12.5px;color:var(--ink-soft)">Sin plantillas propias todavía.</div>';
  openModal(
    '<h2>Ajustes</h2><div class="sub-t">Configurá el área. Los cambios se comparten con el equipo.</div>\n    <div class="set-sec"><h3>🎨 Sectores (data-cat) <span style="margin-left:auto;font-size:12px;color:var(--ink-soft)">' +
      Object.keys(SECTORES).length +
      '</span></h3>\n      <div class="set-grid">' +
      txt +
      '</div>\n      <div class="set-row" style="margin-top:10px"><input type="color" id="newSecCat" value="#3FA7D6"><input type="text" id="newSecNombre" placeholder="Nuevo sector (nombre)"><button class="btn btn-sm" data-action="set:add-sector">+ Agregar</button></div></div>\n    <div class="set-sec"><h3>👥 Equipo</h3>' +
      txt2 +
      '\n      <div class="set-row" style="margin-top:10px"><input type="text" id="newMemNombre" placeholder="Nombre"><input type="text" id="newMemRol" placeholder="Rol"><input type="color" id="newMemColor" value="#006EA0"><button class="btn btn-sm" data-action="set:add-member">+ Agregar</button></div></div>\n    <div class="set-sec"><h3>🔐 Ingreso del equipo</h3>\n      <div style="font-size:12.5px;color:var(--ink-soft);margin-bottom:8px">Clave grupal para entrar. ' +
      (state.appPassHash ? '<b style="color:var(--ok)">Clave activa ✓</b>' : "Sin clave — ingreso abierto.") +
      '</div>\n      <div class="set-row"><input type="password" id="setPass" placeholder="' +
      (state.appPassHash ? "Nueva clave…" : "Definir clave grupal…") +
      '"><button class="btn btn-sm" data-action="set:pass">Guardar</button>' +
      (state.appPassHash
        ? '<button class="btn btn-sm" data-action="set:pass-clear" style="color:var(--bad)">Quitar</button>'
        : "") +
      '</div>\n      <div style="font-size:11px;color:var(--ink-soft);margin-top:5px">Barrera para que no entre cualquiera con el link. No es seguridad fuerte (para eso haría falta login real).</div></div>\n    <div class="set-sec"><h3>🛟 Copias de resguardo</h3>' +
      backupListHTML() +
      '</div>\n    <div class="set-sec"><h3>🧩 Plantillas propias</h3>' +
      txt3 +
      '</div>\n    <div class="set-sec"><h3>💾 Datos</h3><div class="set-data">\n      <button class="btn" data-action="ingest:open">⤓ Ingestar catálogo</button>\n      <button class="btn" data-action="data:export">⬇ Exportar JSON</button>\n      <button class="btn" data-action="data:import">⬆ Importar JSON</button>\n      <button class="btn" data-action="data:csv">📄 Exportar CSV</button>\n      <button class="btn" data-action="data:reset" style="color:var(--bad);border-color:color-mix(in srgb,var(--bad) 40%,var(--line))">🧹 Reiniciar (Planner vacío + catálogo)</button>\n    </div></div>\n    <div class="modal-foot"><button class="btn btn-primary" data-action="modal:close">Listo</button></div>',
  );
}
function backupListHTML() {
  const list = readBackups();
  if (!list.length)
    return '<div style="font-size:12.5px;color:var(--ink-soft)">Todavía no hay copias. Se guarda una en este navegador cada vez que se graba, como mucho una cada 15 minutos.</div>';
  return (
    '<div style="font-size:12.5px;color:var(--ink-soft);margin-bottom:8px">Guardadas en este navegador, no en el servidor. Sirven para volver atrás si alguien vacía el tablero.</div>' +
    list
      .map(
        (b) =>
          '<div class="set-row"><span style="flex:1;font-size:13px">' +
          esc(fmtBackupDate(b.ts)) +
          ' <span style="color:var(--ink-soft)">· ' +
          b.tarjetas +
          " tarjetas" +
          (b.autor ? " · " + esc(b.autor) : "") +
          '</span></span><button class="btn btn-sm" data-action="backup:restore" data-ts="' +
          b.ts +
          '">Restaurar</button></div>',
      )
      .join("")
  );
}
function fmtBackupDate(ts) {
  return new Date(ts).toLocaleString("es-AR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function restoreBackup(ts) {
  const hit = readBackups().find((b) => String(b.ts) === String(ts));
  if (!hit) {
    flash("No encontré esa copia", true);
    return;
  }
  confirmar("Restaurar la copia del " + fmtBackupDate(hit.ts) + "? Reemplaza el tablero actual.", () => {
    let doc;
    try {
      doc = JSON.parse(hit.doc);
    } catch (e) {
      flash("La copia está dañada", true);
      return;
    }
    const ids = new Set(doc.cards.map((c) => c.id));
    (dropCards(state.cards.filter((c) => !ids.has(c.id)).map((c) => c.id)),
      (state.cards = doc.cards),
      (state.customTpl = doc.templates || {}));
    if (doc.sectores) Object.assign(SECTORES, doc.sectores);
    if (doc.agenda && typeof doc.agenda === "object") state.agenda = doc.agenda;
    if (doc.cotofrase && typeof doc.cotofrase === "object") state.cotofrase = doc.cotofrase;
    ensureFraseDay();
    (Array.isArray(doc.team) && doc.team.length && ((TEAM.length = 0), doc.team.forEach((m) => TEAM.push(m))),
      injectSectorStyles(),
      touch(),
      closeModal(),
      render(),
      flash("🛟 Copia restaurada"));
  });
}
function applySetting(val, value) {
  const partes = val.split(":");
  if (partes[0] === "sec") {
    const val2 = partes[1];
    SECTORES[val2] && ((SECTORES[val2][partes[2]] = value), injectSectorStyles(), persist(), render());
  } else {
    if (partes[0] === "team") {
      const miembro = member(partes[1]);
      miembro && ((miembro[partes[2]] = value), persist(), render());
    }
  }
}
function addSector() {
  const txt = ($("#newSecNombre").value || "").trim(),
    value = $("#newSecCat").value || "#3FA7D6";
  if (!txt) {
    flash("Poné un nombre de sector", true);
    return;
  }
  let val = txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!val || SECTORES[val]) val = "sector-" + Date.now();
  ((SECTORES[val] = {
    nombre: txt,
    cat: value,
  }),
    injectSectorStyles(),
    persist(),
    openSettings(),
    render(),
    flash("🎨 Sector agregado"));
}
const SEC_PALETTE = ["#006EA0", "#00C88C", "#8232C8", "#F0A032", "#D71E50", "#1EAADC", "#6E328C", "#CD1E1E"];
function createSectorInline(nombre) {
  const txt = (nombre || "").trim();
  if (!txt) return;
  let val = txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!val || SECTORES[val]) val = "sector-" + Date.now();
  ((SECTORES[val] = {
    nombre: txt,
    cat: SEC_PALETTE[Object.keys(SECTORES).length % SEC_PALETTE.length],
  }),
    injectSectorStyles(),
    persist());
  const tarjeta = current();
  if (tarjeta) {
    ((tarjeta.sectores = tarjeta.sectores || []),
      tarjeta.sectores.includes(val) || tarjeta.sectores.push(val),
      touch());
  }
  renderPanel();
  flash('🎨 Sector "' + txt + '" creado');
  const el = $("#sectorSearch");
  if (el) ((el.value = ""), el.focus());
}
function addMember() {
  const txt = ($("#newMemNombre").value || "").trim();
  if (!txt) {
    flash("Poné un nombre", true);
    return;
  }
  const txt2 = ($("#newMemRol").value || "").trim() || "Equipo",
    value = $("#newMemColor").value || "#006EA0",
    txt3 = "m-" + txt.toLowerCase().replace(/[^a-z0-9]+/g, "") + "-" + Math.random().toString(36).slice(2, 5);
  (TEAM.push({
    id: txt3,
    nombre: txt,
    rol: txt2,
    color: value,
  }),
    persist(),
    openSettings(),
    render(),
    flash("👤 Miembro agregado"));
}
function delTpl(arg) {
  (delete state.customTpl[arg], persist(), openSettings());
}
function download(txt, json, txt2) {
  try {
    const val = new Blob([json], {
        type: txt2 || "application/json",
      }),
      val2 = URL.createObjectURL(val),
      el = document.createElement("a");
    ((el.href = val2),
      (el.download = txt),
      document.body.appendChild(el),
      el.click(),
      setTimeout(() => {
        (document.body.removeChild(el), URL.revokeObjectURL(val2));
      }, 100));
  } catch (err) {
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
  const lista = [
    ["Titulo", "Tipo", "Estado", "Sectores", "Responsable", "Inicio", "Fin", "Prioridad", "Progreso"],
  ];
  // Respeta los filtros activos del Planner (persona/sector/tipo/estado/
  // texto/chips rápidos/"Mis tareas"): lo que exportás es lo que estás
  // viendo, no todo el tablero de memoria.
  (filteredBoard().forEach((tarjeta) => {
    const avance = progress(tarjeta);
    lista.push([
      tarjeta.titulo,
      (allTipos()[tarjeta.tipo] || {}).nombre || tarjeta.tipo,
      tarjeta.estado,
      (tarjeta.sectores || []).map((arg) => sectorName(arg) || arg).join(" / "),
      (member(tarjeta.responsable) || {}).nombre || "",
      tarjeta.inicio || "",
      tarjeta.fin || "",
      tarjeta.prioridad,
      avance.total ? avance.done + "/" + avance.total : "",
    ]);
  }),
    download(
      "tablero-coto.csv",
      "﻿" +
        lista
          .map((lista2) => lista2.map((arg) => '"' + String(arg).replace(/"/g, '""') + '"').join(","))
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
  let tarjeta;
  try {
    tarjeta = JSON.parse($("#importText").value);
  } catch (err) {
    flash("JSON inválido", true);
    return;
  }
  if (!tarjeta || !Array.isArray(tarjeta.cards)) {
    flash('Backup sin "cards"', true);
    return;
  }
  confirmar("Esto reemplaza todos los datos actuales. ¿Seguir?", () => {
    const restoredIds = new Set(tarjeta.cards.map((c) => c.id));
    (dropCards(state.cards.filter((c) => !restoredIds.has(c.id)).map((c) => c.id)),
      (state.cards = tarjeta.cards),
      (state.customTpl = tarjeta.templates || {}));
    if (tarjeta.sectores) Object.assign(SECTORES, tarjeta.sectores);
    (Array.isArray(tarjeta.team) &&
      tarjeta.team.length &&
      ((TEAM.length = 0), tarjeta.team.forEach((miembro) => TEAM.push(miembro))),
      injectSectorStyles(),
      touch(),
      closeModal(),
      render(),
      flash("⬆ Datos importados"));
  });
}
function resetSeed() {
  confirmar(
    "Esto VACÍA el Planner (tablero/calendario/timeline) y (re)carga el catálogo de cursos en el Mapa — también en el backend compartido. La agenda y los Edu Points se conservan. Conviene exportar un backup antes. ¿Seguir?",
    () => resetSeedRun(),
  );
}
function resetSeedRun() {
  ((state.cards = seedCards()),
    ingestCatalogo(CURSOS, {}),
    (state.selectedId = null),
    touch(),
    closeModal(),
    (state.view = "mapa"),
    (state.mapaSec = "cursos"),
    render(),
    flash("🧹 Planner vacío · catálogo cargado en el Mapa"));
}
document.addEventListener("keydown", (ev) => {
  const txt = (ev.target.tagName || "").toLowerCase();
  if (txt === "input" || txt === "textarea" || txt === "select" || ev.target.isContentEditable) return;
  if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
  if (ev.key === "/") (ev.preventDefault(), openPalette());
  else {
    if (ev.key.toLowerCase() === "n") openNuevo();
    else {
      if (ev.key >= "1" && ev.key <= "5") {
        const val = ["inicio", "kanban", "calendario", "timeline", "mapa"][+ev.key - 1];
        val && ((state.view = val), render());
      }
    }
  }
});
function injectSectorStyles() {
  let txt = "";
  for (const val3 in SECTORES) {
    if (OFFICIAL_CATS.has(val3)) continue;
    const val2 = SECTORES[val3].cat;
    txt +=
      '[data-cat="' +
      val3 +
      '"]{--cat:' +
      val2 +
      ";--cat-strong:color-mix(in srgb," +
      val2 +
      " 70%,#1E2D46);--cat-soft:color-mix(in srgb," +
      val2 +
      " 55%,#fff);--cat-grad:linear-gradient(135deg," +
      val2 +
      ",color-mix(in srgb," +
      val2 +
      " 68%,#000));--on-cat:#fff;}";
  }
  let val = document.getElementById("sectorStyles");
  (!val &&
    ((val = document.createElement("style")), (val.id = "sectorStyles"), document.head.appendChild(val)),
    (val.textContent = txt));
}
async function boot() {
  ((state.savedViews = loadViews()),
    injectSectorStyles(),
    renderGateTeam(),
    document.querySelectorAll(".logo-slot").forEach((el) => (el.innerHTML = logoLockup())));
  {
    const footYear = $("#footYear");
    if (footYear) footYear.textContent = new Date().getFullYear();
  }
  $("#app").classList.remove("hidden");
  try {
    const tarjeta = await Store.load();
    if (tarjeta && Array.isArray(tarjeta.cards)) {
      ((state.cards = tarjeta.cards), (state.customTpl = tarjeta.templates || {}));
      if (tarjeta.deleted && typeof tarjeta.deleted === "object")
        state.deleted = pruneTombstones(tarjeta.deleted);
      if (tarjeta.sectores) Object.assign(SECTORES, tarjeta.sectores);
      Array.isArray(tarjeta.team) &&
        tarjeta.team.length &&
        ((TEAM.length = 0), tarjeta.team.forEach((miembro) => TEAM.push(miembro)));
      if (typeof tarjeta.appPassHash === "string") state.appPassHash = tarjeta.appPassHash;
      if (tarjeta.agenda && typeof tarjeta.agenda === "object") state.agenda = tarjeta.agenda;
      if (tarjeta.cotofrase && typeof tarjeta.cotofrase === "object") state.cotofrase = tarjeta.cotofrase;
      ensureFraseDay();
      (ensureTeam(), injectSectorStyles(), renderGateTeam());
      // ingestCatalogo() con replace:false es no-destructivo: solo agrega los
      // títulos del catálogo que todavía no existen como curso. Antes esto
      // solo corría si el inventario estaba vacío, así que un tablero real
      // con apenas un par de cursos de ejemplo nunca llegaba a sumar el
      // resto del catálogo — quedaba "atascado" para siempre. Corriéndolo
      // siempre, cada título faltante se suma solo, sin duplicar ni pisar
      // nada de lo que ya está cargado.
      if (CURSOS.length) {
        const val = ingestCatalogo(CURSOS, {}) + backfillCatalogoImages();
        if (val > 0)
          try {
            await Store.save({
              cards: state.cards,
              templates: state.customTpl,
              sectores: SECTORES,
              team: TEAM,
              appPassHash: state.appPassHash,
              agenda: state.agenda,
              cotofrase: state.cotofrase,
            });
          } catch (err) {}
      }
    } else {
      (ensureFraseDay(),
        (state.cards = seedCards()),
        ingestCatalogo(CURSOS, {}),
        await Store.save({
          cards: state.cards,
          templates: state.customTpl,
          sectores: SECTORES,
          team: TEAM,
          cotofrase: state.cotofrase,
        }));
    }
  } catch (err2) {
    console.error(err2);
    ensureFraseDay();
    // Si no se pudo leer el backend NO se arma un tablero de demo: mostrar
    // tarjetas inventadas hace creer que la app anda y el equipo termina
    // trabajando sobre algo que no existe y que no se va a guardar.
    if (useSupabase()) {
      (mostrarPantallaSinConexion(err2), (state.connOk = false));
      return;
    }
    ((state.cards = seedCards()), ingestCatalogo(CURSOS, {}), flash("Usando datos semilla", true));
  }
  (state.cards.forEach((tarjeta2) => {
    ((tarjeta2.ficha = tarjeta2.ficha || {
      url: "",
      owner: "",
      estadoOp: "operativo",
    }),
      (tarjeta2.comentarios = tarjeta2.comentarios || []),
      (tarjeta2.actividad = tarjeta2.actividad || []));
    if (!tarjeta2.recurrencia) tarjeta2.recurrencia = "none";
    if (!tarjeta2.catalogo)
      tarjeta2.catalogo = {
        categoria: "",
        bajada: "",
        anio: "",
        duracion: "",
        imagen: "",
        personas: "",
        descripcion: "",
      };
    tarjeta2.sectores = (tarjeta2.sectores || []).map((arg) => (SECTORES[arg] ? arg : SLUG_MAP[arg] || arg));
  }),
    rememberFingerprints(state.cards),
    (state.ready = true),
    updateGatePass(),
    showBanner(),
    render());
  try {
    history.replaceState(navState(), "");
  } catch (err3) {}
  startPolling();
}
function startPolling() {
  if (!useSupabase()) return;
  state.lastSyncTs = Date.now();
  setInterval(async () => {
    if (state.connOk === false) return;
    try {
      const editing = $("#panel").classList.contains("open") || !$("#modal").classList.contains("hidden"),
        changed = await mergeRemoteIntoState();
      state.lastSyncTs = Date.now();
      if (!changed.length) return;
      if (editing) return;
      (injectSectorStyles(), render());
    } catch (err) {
      // Un solo fallo de polling no significa que se cayó la conexión (el
      // guardado igual reintenta en segundo plano); no hace falta avisar
      // por un hipo puntual de la red.
    }
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
