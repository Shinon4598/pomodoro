
// Variables para controlar el temporizador
let duracionDescanso;
let duracionTrabajo;
let tiempo = duracionTrabajo * 60; // 25 minutos en segundos
let intervalo = null; //actualiza temporizador
let descanso = false;
let pausa = false;
let tareaActual = ''; // Tarea actual ingresada por el usuario
let tiempoDedicado = null; // Tiempo dedicado a la tarea actual
let interval = null;  // Intervalo barra de progreso
let tiempoActual; // 
let btnPausa= document.getElementById("btn-pausa");
let btnReiniciar= document.getElementById("btn-reiniciar");
let btnIniciar = document.getElementById("btn-iniciar");
var audio= new Audio();
audio.src='/assets/sounds/sound.mp3';

//------------------Temporizador------------------------------//
// Función para actualizar el temporizador en la página
function mostrarTiempo() {
  document.getElementById('tiempo').textContent = formatoTiempo(tiempo);
}
function formatoTiempo(tiempo) {
  const minutos = Math.floor(tiempo / 60);
  let segundos = String(tiempo % 60).padStart(2, '0');
  return `${minutos}:${segundos}`;
}
//Funcion para obtener la duracion de las sesiones
function obtenerValoresCampos() {
  duracionDescanso = parseInt(document.getElementById("duracion-descanso").value);
  duracionTrabajo = parseInt(document.getElementById("duracion-trabajo").value);
  tiempo = duracionTrabajo * 60;
}
function reproducirAudio() {
  audio.play(); 
}
// Función para actualizar el temporizador en cada segundo
function actualizarTemporizador() {
  if (!pausa) { 
    tiempo--;
    if (tiempo < 0) {
      obtenerValoresCampos();
      reproducirAudio(); 
      // El temporizador ha terminado
      clearInterval(intervalo);
      
      descanso = !descanso;
      tiempo = descanso ? duracionDescanso * 60 : duracionTrabajo * 60; // 5 minutos de descanso, 25 minutos de trabajo
      // Registrar tiempo dedicado a la tarea actual
      registrarTiempo();
      progress=0;
      // Iniciar el siguiente temporizador
      iniciarTemporizador(descanso && descanso);
    }
  }
  mostrarTiempo();
}
 
//-----------------------Tareas----------------------------------//

// Función para registrar el tiempo dedicado a la tarea actual
function registrarTiempo() {
  tiempoDedicado = duracionTrabajo * 60 - tiempo;
}

// Función para mostrar la tarea y el tiempo dedicado
function mostrarTareaYTiempo() {
  let listaTareas = document.getElementById('lista-tareas');
  const tarea_li= document.createElement('li');
  tarea_li.textContent = `Tarea: ${tareaActual}\nTiempo dedicado: ${formatoTiempo(tiempoDedicado)}`
  listaTareas.appendChild(tarea_li)
}


//-------------------------Botones---------------------------------------//
// Función para iniciar el temporizador
function iniciarTemporizador(pausa) {
  !pausa && obtenerValoresCampos();
  estadoBtn(true);
  mostrarTiempo();
  intervalo = setInterval(actualizarTemporizador, 1000);
  progreso()
  
}

//Funcion para pausar el pomodoro
function pausado() {
  pausa = !pausa;
  if(pausa){
    clearInterval(intervalo);
    clearInterval(interval);
  }else{
    iniciarTemporizador(true);
  }
}
//Cambiar estado botones
function estadoBtn(estado) {
  if(estado){
    btnPausa.style.display="inline-block";
    btnReiniciar.style.display="inline-block";
    btnIniciar.style.display="none";
  }else{
    btnPausa.style.display="none";
    btnReiniciar.style.display="none";
    btnIniciar.style.display="inline-block";
  }
}
//Funcion para reiniciar el pomodoro
function reiniciarTemporizador() {
  registrarTiempo();
  estadoBtn(false);
  obtenerValoresCampos();
  tareaActual = document.getElementById('nombre-tarea').value;
  mostrarTareaYTiempo();
  tiempo = duracionTrabajo * 60;
  descanso = false;
  tiempoDedicado = 0;
  clearInterval(intervalo);
  clearInterval(interval);
  setProgress(0)
  mostrarTiempo();
}

//-----------------------Barra de carga circular-------------------------------
function setProgress(progress) {
  var fillElement = document.querySelector('.fill');
  var circumference = 314; // Perímetro del círculo
  var offset = circumference * (1 - progress / 100);
  fillElement.style.stroke= descanso ? "blue" : "red";
  fillElement.style.strokeDashoffset = offset;
}
obtenerValoresCampos();
// Simular progreso de carga
var progress = 0;
 // 25 minutos convertidos a segundos
 // Incremento porcentual en cada segundo
function progreso() {
  var totalTime = descanso ? duracionDescanso * 60 : duracionTrabajo * 60;
  var increment = 100 / totalTime;
  interval = setInterval(function() {
  progress += increment;
  setProgress(progress);

  if (progress >= 100) {
    clearInterval(interval);
  }
}, 1000); // Actualiza el progreso cada segundo (1000 milisegundos)

}
estadoBtn(false);
mostrarTiempo();
