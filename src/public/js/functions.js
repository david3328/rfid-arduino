function mostrarMensaje(alert,tipo,mensaje){
  alert.innerHTML = mensaje;
  if(tipo==='err'){
    alert.classList.add('alert-danger');
  }else{
    alert.classList.add('alert-success');    
  }
  alert.style.display='block';
  setTimeout(function(){ 
    alert.classList.remove('alert-success');
    alert.classList.remove('alert-danger');    
    alert.style.display = 'none';
  }, 1000);  
}
