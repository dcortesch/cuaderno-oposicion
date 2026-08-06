# T04 - Sistema de tres niveles para problemas

**Proyecto:** OPOSICIONES de Matemáticas  
**Semana:** 01  
**Tema:** T04 - Números enteros, divisibilidad, congruencias y aplicaciones  
**Versión:** 2.0  
**Fecha de revisión:** 6 de agosto de 2026

## Finalidad

Este paquete amplía la base teórica destinada a **resolver problemas**, sin aumentar innecesariamente el tema escrito de examen. El sistema diferencia tres productos complementarios:

1. **Manual operativo:** estudio profundo, reconocimiento de técnicas, procedimientos, ejemplos, errores y transferencia.
2. **Fichas rápidas:** recuperación breve sin releer el manual completo.
3. **Matriz:** trazabilidad entre teoría, técnicas, problemas, vídeos y repasos.

Los vídeos son recursos opcionales de desbloqueo. La secuencia obligatoria es: **intentar -> localizar el bloqueo -> consultar un fragmento -> cerrar el recurso -> resolver de nuevo sin ayuda**.

## Archivos principales

### 01_MANUAL

- `T04_P01_Manual_operativo_problemas_v2.pdf` - manual completo de 61 páginas.
- `T04_P01_Manual_operativo_problemas_v2.tex` - archivo maestro LaTeX.
- `t04_manual_style.tex` - estilo común.
- `chapters/ch01.tex` a `chapters/ch24.tex` - capítulos editables.

### 02_FICHAS

- `T04_P02_Fichas_rapidas_v1.pdf` - 15 páginas: portada y 14 fichas.
- `T04_P02_Fichas_rapidas_v1.tex` - fuente LaTeX.

### 03_MATRIZ

- `T04_P03_Matriz_teoria_tecnicas_problemas_v1.xlsx` - libro de trabajo con seis hojas.
- `T04_P03_Matriz_teoria_tecnicas_problemas_v1.csv` - exportación de la matriz principal.
- `create_matrix.py` - fuente de generación mediante `openpyxl`.

### 04_FUENTES

- `CATALOGO_RECURSOS_AUDIOVISUALES.md` - relación de los 15 vídeos, uso, prioridad y fecha de revisión.
- `CONTROL_CALIDAD.md` - verificaciones realizadas.

## Contenido del manual

El manual contiene 24 capítulos: diagnóstico; Euclides y Bézout; factorización y valoraciones; congruencias; inversos; potencias y orden; Fermat, Euler y Wilson; TCR; módulos compuestos; funciones aritméticas; sistemas de numeración; palomar; recurrencias; modelización diofántica; ternas pitagóricas; problemas híbridos; auditoría de enunciados; rutas para P2, P8, P10, P12, P15, P20, P24 y P25; transferencia; repasos; catálogo audiovisual; microproblemas; guion oral; y mapa de navegación.

## Hojas de la matriz

- `Resumen`: alcance y reglas de uso.
- `Mapa`: teoría, señales, hipótesis, procedimiento, problemas y repasos.
- `Problemas_8`: conexión detallada con los ocho problemas de la semana.
- `Videos`: título, canal, URL, prioridad, uso y fecha de revisión.
- `Repasos`: 24 h, 7 días, 30 días, 60-90 días, mitad de curso y cierre.
- `Leyenda`: niveles y estados.

## Integración recomendada en la semana 1

- **Primera vuelta:** capítulos de nivel A y fichas 1-12.
- **Tras cada bloqueo:** un único vídeo pertinente y repetición inmediata.
- **A las 24 horas:** índice de técnicas y dos microproblemas.
- **A los 7 días:** cuatro problemas, al menos uno nuevo.
- **A los 30 días:** simulacro mixto de 90 minutos y actualización de errores.
- **Durante el año:** reactivaciones selectivas; no releer el manual completo salvo diagnóstico de lagunas.

## Estado

Los PDF se han compilado y renderizado. La hoja de cálculo se ha reabierto y validado con `openpyxl`; no contiene fórmulas ni errores de referencia. Los enlaces de YouTube deben volver a comprobarse antes de una edición definitiva, porque los recursos externos pueden cambiar o retirarse.
