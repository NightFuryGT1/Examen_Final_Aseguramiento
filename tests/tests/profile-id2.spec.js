// tests/profile-id2.spec.js
// Pruebas Playwright para el requerimiento Id2 - Actualizar perfil de usuario

const { test, expect } = require('@playwright/test');

// Datos de prueba (ajusta según tu entorno)
const BASE_USER = {
  username: 'armandot123',       // 🔴 CAMBIA POR TU USUARIO REAL
  password: 'Ultra123!',       // 🔴 CAMBIA POR TU PASSWORD REAL
};

test.describe('ID2 - Actualización de perfil de usuario en BuggyCars', () => {
  // Antes de cada prueba: iniciar sesión y entrar al perfil
  test.beforeEach(async ({ page }) => {
    // 1. Ir a la página de login
    await page.goto('/login'); // baseURL viene del config

    // 2. Ingresar credenciales
    await page.fill('#username', BASE_USER.username);
    await page.fill('#password', BASE_USER.password);
    await page.click('button[type="submit"]');

    // 3. Verificar que el login fue exitoso (ajusta este assert a tu app)
    await expect(page.getByText('Profile')).toBeVisible();

    // 4. Ir a la página de perfil
    await page.click('text=Profile'); // link o botón con texto "Profile"
  });

  // CP01 - Actualizar perfil con datos válidos
  test('CP01 - Actualizar todos los datos del perfil con información válida', async ({ page }) => {
    // Llenar campos requeridos + opcionales
    await page.fill('#firstName', 'Armando');
    await page.fill('#lastName', 'Sierra');
    await page.fill('#address', 'Zona 1, Ciudad de Guatemala');
    await page.fill('#phone', '55554444');
    await page.fill('#hobby', 'Leer y jugar videojuegos');

    // Guardar cambios
    await page.click('button:has-text("Save")'); // Ajusta el texto del botón

    // Esperar mensaje de éxito
    // Ajusta el selector y el texto según tu app
    const successMessage = page.getByText(/profile/i);
    await expect(successMessage).toBeVisible();

    // (Opcional) volver a cargar la página y verificar que los datos se guardaron
    await page.reload();
    await expect(page.locator('#firstName')).toHaveValue('Armando');
    await expect(page.locator('#lastName')).toHaveValue('Sierra');
  });

  // CP02 - Validar que el campo Nombre es obligatorio
  test('CP02 - Validar que el campo Nombre es obligatorio', async ({ page }) => {
    // Limpiar nombre y colocar otros campos válidos
    await page.fill('#firstName', '');
    await page.fill('#lastName', 'Sierra');
    await page.fill('#address', 'Zona 1, Ciudad de Guatemala');
    await page.fill('#phone', '55554444');
    await page.fill('#hobby', 'Leer');

    // Intentar guardar
    await page.click('button:has-text("Save")');

    // Verificar mensaje de error (ajusta selector y texto)
    const errorNombre = page.getByText(/nombre.*obligatorio/i);
    await expect(errorNombre).toBeVisible();
  });

  // CP03 - Validar que el campo Apellido es obligatorio
  test('CP03 - Validar que el campo Apellido es obligatorio', async ({ page }) => {
    // Limpiar apellido y colocar otros campos válidos
    await page.fill('#firstName', 'Armando');
    await page.fill('#lastName', '');
    await page.fill('#address', 'Zona 1, Ciudad de Guatemala');
    await page.fill('#phone', '55554444');
    await page.fill('#hobby', 'Leer');

    // Intentar guardar
    await page.click('button:has-text("Save")');

    // Verificar mensaje de error para Apellido
    const errorApellido = page.getByText(/apellido.*obligatorio/i);
    await expect(errorApellido).toBeVisible();
  });

  // CP04 - No permitir cambiar password si NO cumple complejidad
  test('CP04 - Rechazar contraseña que no cumpla longitud y complejidad', async ({ page }) => {
    // Suposición: el cambio de contraseña está en la misma página de perfil
    // y requiere contraseña actual + nueva + confirmación

    // Contraseña nueva inválida (menos de 10 caracteres, sin mayúscula, sin número, sin carácter especial)
    const invalidPassword = 'abc123'; // Claramente inválida

    await page.fill('#currentPassword', BASE_USER.password);
    await page.fill('#newPassword', invalidPassword);
    await page.fill('#confirmPassword', invalidPassword);

    // Botón para cambiar contraseña (ajusta el selector)
    await page.click('button:has-text("Change Password")');

    // Verificar mensaje de validación de complejidad
    const passwordError = page.getByText(/10 caracteres/i);
    await expect(passwordError).toBeVisible();
  });

  // CP05 - Permitir cambiar password cuando CUMPLE complejidad
  test('CP05 - Aceptar contraseña que cumpla mínimo 10 caracteres, mayúscula, número y caracter especial', async ({ page }) => {
    // Ejemplo de contraseña válida:
    // - 10+ caracteres
    // - Al menos 1 mayúscula
    // - Al menos 1 número
    // - Al menos 1 caracter especial
    const validPassword = 'NuevoPass1!';

    await page.fill('#currentPassword', BASE_USER.password);
    await page.fill('#newPassword', validPassword);
    await page.fill('#confirmPassword', validPassword);

    await page.click('button:has-text("Change Password")');

    // Verificar mensaje de éxito
    const successPassword = page.getByText(/password.*actualizada/i);
    await expect(successPassword).toBeVisible();

    // (Opcional) Cerrar sesión e intentar entrar con la nueva password
    // Esto te sirve para validar también el cambio
    // await page.click('text=Logout');
    // await page.goto('/login');
    // await page.fill('#username', BASE_USER.username);
    // await page.fill('#password', validPassword);
    // await page.click('button[type="submit"]');
    // await expect(page.getByText('Profile')).toBeVisible();
  });
});
