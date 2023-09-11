const assert = require('assert');

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function boton_call_to_action_check() {
     let driver = await new Builder().forBrowser('chrome').build();
     try {
    // Primero, navegamos a la página que queremos probar
    await driver.get('file:///C:/Users/jordi/Documents/GitHub/GTI_3A_Backend/src/ux/index.html');

    // Luego, buscamos el botón que queremos probar
    let button = await driver.findElement(By.id('boton_call_to_action'));
    //console.log("ha llegado al elemento");
    // Verificamos que el botón esté habilitado y tenga el texto correcto
    assert(await button.isEnabled());

    // Hacemos clic en el botón
    await button.click();
    //console.log("ha pulsado el boton");
    // Verificamos que se haya realizado la acción esperada (por ejemplo,
    // que se haya redirigido a otra página o que se haya mostrado un mensaje)
    let url = await driver.getCurrentUrl();
    assert(url.startsWith('file:///C:/Users/jordi/Documents/GitHub/GTI_3A_Backend/src/ux/mapas.html'));
    console.log("Funciona el test 1, comprobación call to action")

  } finally {
    // Asegúrate de cerrar el navegador cuando hayas terminado
    await driver.quit();
  }
})();

(async function boton_login_check() {
     let driver = await new Builder().forBrowser('chrome').build();
     try {
    // Primero, navegamos a la página que queremos probar
    await driver.get('file:///C:/Users/jordi/Documents/GitHub/GTI_3A_Backend/src/ux/index.html');

    // Luego, buscamos el botón que queremos probar
    let button = await driver.findElement(By.id('boton_iniciar_sesion'));
    //console.log("ha llegado al elemento");
    // Verificamos que el botón esté habilitado y tenga el texto correcto
    assert(await button.isEnabled());

    // Hacemos clic en el botón
    await button.click();
    //console.log("ha pulsado el boton");
    // Verificamos que se haya realizado la acción esperada (por ejemplo,
    // que se haya redirigido a otra página o que se haya mostrado un mensaje)
    let url = await driver.getCurrentUrl();
    assert(url.startsWith('file:///C:/Users/jordi/Documents/GitHub/GTI_3A_Backend/src/ux/login.html'));
    console.log("Funciona el test 2, comprobación inicio de sesión")

  } finally {
    // Asegúrate de cerrar el navegador cuando hayas terminado
    await driver.quit();
  }
})();

(async function logo_header_check() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
 // Primero, navegamos a la página que queremos probar
 await driver.get('file:///C:/Users/jordi/Documents/GitHub/GTI_3A_Backend/src/ux/index.html');

 // Luego, buscamos el botón que queremos probar
 let button = await driver.findElement(By.id('logo_header'));
 //console.log("ha llegado al elemento");
 // Verificamos que el botón esté habilitado y tenga el texto correcto
 assert(await button.isEnabled());

 // Hacemos clic en el botón
 await button.click();
 //console.log("ha pulsado el boton");
 // Verificamos que se haya realizado la acción esperada (por ejemplo,
 // que se haya redirigido a otra página o que se haya mostrado un mensaje)
 let url = await driver.getCurrentUrl();
 assert(url.startsWith('file:///C:/Users/jordi/Documents/GitHub/GTI_3A_Backend/src/ux/index.html'));
 console.log("Funciona el test 3, comprobación logo header")

} finally {
 // Asegúrate de cerrar el navegador cuando hayas terminado
 await driver.quit();
}
})();

