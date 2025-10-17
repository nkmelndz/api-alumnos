# 🚀 Despliegue en Render

## Configuración paso a paso para desplegar en Render (GRATIS)

### **📋 Requisitos:**
- Cuenta en [render.com](https://render.com) (gratis)
- Repositorio en GitHub actualizado

---

## **🛠️ Pasos para desplegar:**

### **1. Crear base de datos PostgreSQL**
1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Clic en **"New +"** → **"PostgreSQL"**
3. Configuración:
   ```
   Name: alumnos-db
   Database: alumnos_db
   User: alumnos_user
   Plan: Free
   ```
4. Clic en **"Create Database"**
5. **Guarda la URL externa** que aparece

### **2. Crear Web Service**
1. Clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio `api-alumnos`
3. Configuración:
   ```
   Name: api-alumnos
   Environment: Node
   Build Command: npm run build
   Start Command: npm start
   Plan: Free
   ```

### **3. Variables de entorno**
En la sección "Environment Variables":
```
NODE_ENV=production
```
**Nota:** `DATABASE_URL` se configura automáticamente al conectar la base de datos.

### **4. Conectar base de datos**
1. En la configuración del Web Service
2. Busca la sección **"Environment"**
3. Clic en **"Add Database"**
4. Selecciona tu base PostgreSQL
5. Render configurará `DATABASE_URL` automáticamente

### **5. Deploy**
1. Clic en **"Create Web Service"**
2. Espera 3-5 minutos
3. Tu API estará disponible en: `https://api-alumnos-xxxx.onrender.com`

---

## **🧪 Probar la API**

Una vez desplegada, prueba estos endpoints:

```bash
# Obtener todos los alumnos
curl https://tu-app.onrender.com/api/alumnos

# Crear un alumno
curl -X POST https://tu-app.onrender.com/api/alumnos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana",
    "apellido": "González", 
    "email": "ana@email.com",
    "edad": 20,
    "curso": "Informática"
  }'
```

## **📊 URLs importantes:**
- **API**: `https://tu-app.onrender.com/api/alumnos`
- **Documentación**: `https://tu-app.onrender.com/`
- **Dashboard Render**: `https://dashboard.render.com`

## **🔧 Ventajas de esta configuración:**
✅ **Gratuito** - No necesitas tarjeta de crédito  
✅ **Automático** - Se despliega con cada push a GitHub  
✅ **Híbrido** - Funciona local (MySQL) y producción (PostgreSQL)  
✅ **Escalable** - Fácil de migrar a plan pagado  

## **🚨 Solución de problemas:**

### Error: "getaddrinfo ENOTFOUND mysql"
✅ **Solucionado** - Ahora usa PostgreSQL automáticamente

### Error: "Database connection failed" 
1. Verifica que la base PostgreSQL esté corriendo
2. Confirma que `DATABASE_URL` esté configurada
3. Revisa los logs en Render Dashboard

### La tabla no existe
1. Los scripts se ejecutan automáticamente
2. Si falla, ve a la consola en Render y ejecuta: `npm run init-db`

---

## **💰 Costos:**
- **Base PostgreSQL**: Gratis (hasta 1GB)
- **Web Service**: Gratis (750 horas/mes)
- **Total**: $0 USD

¡Perfecto para desarrollo y proyectos pequeños!