# Prana Pilates - Sitio Web 🌿

Este es el sitio web oficial de **Prana Pilates**, diseñado para ofrecer una experiencia de usuario de lujo, moderna y totalmente adaptativa.

## ✨ Características Principales

- **Diseño de Lujo**: Estética minimalista con tonos Sage Green, Warm Sand y Cream.
- **Tipografía Elegante**: Uso de *Playfair Display* para una imagen premium.
- **Totalmente Responsivo**: Optimizado para celulares, tablets y computadoras mediante CSS moderno (`clamp`, Grid, Flexbox).
- **Sistema de Reservas**: Formulario integrado para solicitar turnos en Pilates Combinado o Yoga.
- **Galería de Fotos**: Sección dedicada para mostrar el ambiente y equipamiento del estudio.
- **Mapa Interactivo**: Ubicación exacta en Villa de Mayo integrada con Google Maps.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5 Semántico, CSS3 (Custom Properties, Grid, Flexbox, Animations).
- **Backend**: Node.js & Express.
- **Base de Datos**: MongoDB Atlas (Persistencia real en la nube).
- **Lógica**: JavaScript (Asíncrono, Mongoose).

---

## 🚀 Configuración de MongoDB

Para que el sitio no pierda datos en Render, necesitas conectar **MongoDB Atlas**:

1. Crea un clúster gratuito en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Obtén tu **Connection String** (ejemplo: `mongodb+srv://usuario:password@cluster.mongodb.net/...`).
3. Crea un archivo `.env` en la raíz del proyecto (basado en `.env.example`) y pega tu link en `MONGODB_URI`.
4. **Migración**: Si tienes datos locales, ejecuta `node migrate.js` para subirlos a la nube.

### Variables de Entorno en Render:
Al configurar tu servicio en Render, ve a la pestaña **Environment** y añade:
- `MONGODB_URI`: Tu link de conexión de MongoDB.
- `ADMIN_TOKEN`: `prana2026` (o la contraseña que prefieras para el panel admin).
- **Iconografía**: FontAwesome.
- **Fuentes**: Google Fonts.

---

## 🚀 Cómo Iniciar el Backend (Node.js)

Este proyecto ahora cuenta con un servidor para la persistencia real de datos.

### Requisitos
- Node.js instalado (v14 o superior).

### Instalación y Uso
1. Abre una terminal en la carpeta del proyecto.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor:
   ```bash
   npm start
   ```
El servidor correrá en `http://localhost:3000`.

---

---

## 🚀 Despliegue en la Nube (Acceso desde Móvil)

Para que el sitio sea accesible desde cualquier móvil en el mundo, utilizaremos **Render.com**.

### Pasos para el Usuario:
1. Crea una cuenta en [Render.com](https://render.com).
2. Haz clic en **"New +"** y selecciona **"Web Service"**.
3. Conecta tu repositorio de GitHub `prana-pilates`.
4. Configura los siguientes valores:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Variables de Entorno**: Ve a la pestaña **Environment** y añade:
   - `MONGODB_URI`: Tu link de conexión de MongoDB Atlas.
   - `ADMIN_TOKEN`: `prana2026`
6. Haz clic en **"Create Web Service"**.

Una vez finalizado, Render te dará una URL (ejemplo: `https://prana-pilates.onrender.com`) que podrás abrir en cualquier celular con persistencia real de datos.

---
© 2024 Prana Pilates. Todos los derechos reservados.
