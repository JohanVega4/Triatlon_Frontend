import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../components/loading/loading';
import { PARTICIPANTES_2024 } from '../participantes/participantes-2024.data';

@Component({
  selector: 'app-resultados-2024',
  standalone: true,
  imports: [CommonModule, FormsModule, Loading],
  templateUrl: './resultados-2024.html',
  styleUrls: ['./resultados-2024.scss']
})
export class Resultados2024 implements OnInit {
  participantes2024: any[] = PARTICIPANTES_2024;
  participantes2024Filtrados: any[] = [];
  terminoBusqueda: string = '';
  loading = false;

  ngOnInit(): void {
    this.participantes2024Filtrados = [...this.participantes2024];
  }

  filtrarParticipantes(): void {
    if (!this.terminoBusqueda) {
      this.participantes2024Filtrados = [...this.participantes2024];
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.participantes2024Filtrados = this.participantes2024.filter(
      (p) =>
        p.nombre.toLowerCase().includes(termino) || 
        p.equipoNombre?.toLowerCase().includes(termino)
    );
  }

  getIconoDisciplina(disciplina: string): string {
    const iconos: { [key: string]: string } = {
      natacion: 'bi-droplet',
      ciclismo: 'bi-bicycle',
      atletismo: 'bi-person-running',
    };
    return iconos[disciplina] || 'bi-question-circle';
  }
}
