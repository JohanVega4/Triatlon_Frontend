import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-equipo-trabajo',
  imports: [CommonModule],
  templateUrl: './equipo-trabajo.html',
  styleUrl: './equipo-trabajo.scss'
})
export class EquipoTrabajo {
 equipo = [
    {
      nombre: 'Andres Amaya',
      rol: 'Scrum Master',
      imagen: 'assets/img/equipo1.jpg',
      descripcion: 'Coordina y asegura la calidad en cada fase del desarrollo.'
    },
    {
      nombre: 'Sebastian Vega',
      rol: 'Product Owner',
      imagen: 'assets/img/equipo2.jpg',
      descripcion: 'Responsable de la validación de funcionalidades en cada fase de desarrollo.'
    },
    {
      nombre: 'Tatiana Lesmes',
      rol: 'Desarrolladora BackEnd',
      imagen: 'assets/img/equipo3.jpg',
      descripcion: 'Encargada del backend y la arquitectura de la aplicación.'
    },
   
    {
      nombre: 'Juan Beltrán',
      rol: 'Desarrollador BackEnd',
      imagen: 'assets/img/equipo5.jpg',
      descripcion: 'Encargado del backend y la arquitectura de la aplicación.'
    },
     {
      nombre: 'Alixon Lopez',
      rol: 'Tester QA',
      imagen: 'assets/img/equipo4.jpg',
      descripcion: 'Encargada de pruebas y aseguramiento de calidad.'
    },
    {
      nombre: 'Ingrith Rodriguez',
      rol: 'Desarrolladora FrontEnd',
      imagen: 'assets/img/equipo6.jpg',
      descripcion: 'Responsable del diseño visual y la experiencia de usuario.'
    }
  ];
}
