'use strict';

// Preloader con tiempo mínimo garantizado
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    const minimumTime = 2000; // 3 segundos mínimos
    
    // Tiempo ya transcurrido desde que empezó a cargar
    const timeElapsed = Date.now() - performance.timing.navigationStart;
    const timeRemaining = Math.max(minimumTime - timeElapsed, 0);
    
    setTimeout(function() {
        preloader.classList.add('hidden');
        
        // Opcional: Remover completamente después de la animación
        setTimeout(function() {
            preloader.remove();
        }, 800); // Coincide con la duración del transition (0.8s)
    }, timeRemaining);
});

// navbar variables
const nav = document.querySelector('.navbar-nav');
const navLinks = document.querySelectorAll('.nav-link');
const cartToggleBtn = document.querySelector('.shopping-cart-btn');
const navToggleBtn = document.querySelector('.menu-toggle-btn');
const shoppingCart = document.querySelector('.cart-box');



// nav toggle function
const navToggleFunc = function () {
  nav.classList.toggle('active');
  navToggleBtn.classList.toggle('active');
}

// shopping cart toggle function
const cartToggleFunc = function () { shoppingCart.classList.toggle('active') }



// add event on nav-toggle-btn
navToggleBtn.addEventListener('click', function () {

  // If the shopping-cart has an `active` class, it will be removed.
  if (shoppingCart.classList.contains('active')) cartToggleFunc();

  navToggleFunc();

});

// add event on cart-toggle-btn
cartToggleBtn.addEventListener('click', function () {

  // If the navbar-nav has an `active` class, it will be removed.
  if (nav.classList.contains('active')) navToggleFunc();

  cartToggleFunc();

});

// add event on all nav-link
for (let i = 0; i < navLinks.length; i++) {

  navLinks[i].addEventListener('click', navToggleFunc);

}