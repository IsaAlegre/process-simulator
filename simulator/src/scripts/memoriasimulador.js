// src/scripts/memoriaSimulador.js
import * as d3 from 'd3';

class Simulador {
    constructor(memoriaTotal) {
        this.memoriaTotal = memoriaTotal;
        this.memoriaUsada = 0;
        this.procesosListos = [];
        this.procesosBloqueados = [];
        this.initVisualizacion();
      }
    
      initVisualizacion() {
        this.svg = d3.select("#memoria-viz")
          .append("svg")
          .attr("width", 500)
          .attr("height", 200);
    
        this.actualizarVisualizacion();
      }
    
      solicitarMemoria(proceso) {
        if (this.memoriaUsada + proceso.size <= this.memoriaTotal) {
          this.memoriaUsada += proceso.size;
          proceso.estado = 'Ejecutando';
          this.procesosListos.push(proceso);
        } else {
          proceso.estado = 'Bloqueado';
          this.procesosBloqueados.push(proceso);
        }
        this.actualizarVisualizacion();
      }
    
      liberarMemoria(proceso) {
        this.memoriaUsada -= proceso.size;
        proceso.estado = 'Terminado';
        this.procesosListos = this.procesosListos.filter(p => p.id !== proceso.id);
        if (this.procesosBloqueados.length > 0) {
          this.solicitarMemoria(this.procesosBloqueados.shift());
        }
        this.actualizarVisualizacion();
      }
    
      actualizarVisualizacion() {
        const data = [{used: this.memoriaUsada, free: this.memoriaTotal - this.memoriaUsada}];
    
        this.svg.selectAll("rect")
          .data(data)
          .join(
            enter => enter.append("rect")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", d => d.used / this.memoriaTotal * 500)
              .attr("height", 50)
              .attr("fill", "steelblue"),
            update => update
              .attr("width", d => d.used / this.memoriaTotal * 500),
            exit => exit.remove()
          );
    
        this.svg.selectAll("text")
          .data(data)
          .join(
            enter => enter.append("text")
              .attr("x", 10)
              .attr("y", 30)
              .text(d => `Memoria Usada: ${d.used} / ${this.memoriaTotal}`),
            update => update.text(d => `Memoria Usada: ${d.used} / ${this.memoriaTotal}`)
          );
      }
    }
    


// Inicializa el simulador
document.addEventListener("DOMContentLoaded", function() {
  const simulador = new Simulador(1024);
  const proceso1 = { id: 1, size: 100, estado: 'Listo' };
  simulador.solicitarMemoria(proceso1);
});

