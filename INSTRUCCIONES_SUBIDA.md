# SUBIDA A LA RAMA feature/explorador-preparacion

1. Abre el repositorio `dcortesch/cuaderno-oposicion`.
2. Cambia a la rama `feature/explorador-preparacion`.
3. Pulsa **Add file -> Upload files**.
4. Descomprime el ZIP y arrastra **el contenido interior** de `cuaderno-oposicion-explorador-v1`, no el ZIP cerrado.
5. Acepta la sustitución de `index.html` en la rama.
6. No borres `t04.html` ni `style.css`: la nueva ficha T04 enlaza la lectura extensa ya existente.
7. Usa como mensaje de commit: `Add navigable preparation explorer v1`.

## Revisión local antes de fusionar

En Windows, ejecuta `PREVIEW_LOCAL.bat`. Después abre `http://localhost:8000`.

## Publicación

La rama `main` y la web pública no cambian hasta fusionar la rama. Tras revisar, crea un Pull Request de `feature/explorador-preparacion` hacia `main`.
