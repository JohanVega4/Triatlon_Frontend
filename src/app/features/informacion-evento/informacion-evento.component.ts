import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Disciplina } from '../../interfaces/disciplina.interface';

@Component({
  selector: 'app-informacion-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion-evento.component.html',
  styleUrls: ['./informacion-evento.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformacionEventoComponent {
  disciplinas = signal<Disciplina[]>([
    {
      nombre: 'Natación',
      reglamento:
        'Distancia: 400 Metros.\n Hora: 7:00 AM.\n  Ropa adecuada y gorro abligatorio para picsina. \n Penalizacion: Si se llama 3 veces al equipo y no se presenta\n Abandono: Se le asignará el tiempo del último competidor más 5 minutos.',
      reglas:
        '1. Seguir recomendaciones.\n2. No está permitido tener algun tipo de ayuda.\n3. En caso de emergencia, levantar un brazo para ofecerle la debida atención.\n4. Obligatorio tocar la pared con la mano o pie para que cuente la piscina.\n5. Uso obligatorio de gorro y chanclas.',
      mapaUrl: 'assets/maps/natacion.png',
    },
    {
      nombre: 'Ciclismo',
      reglamento:
        'Distancia: 21 Km (14 vueltas).\n Hora: 10:00 AM (revisión de bicicletas, asignación de juez y entrega de números).\n Es obligatorio el uso de casco rígido. preferiblemente tener bicicleta de remplazo.\n Penalización: Si se llama 3 veces al equipo y no se presenta\n Abandono: Se le asignara el tiempo del último competidor más 5 minutos.',
      reglas:
        '1. No bloquear a otros competidores.\n2. No desviarse o tomar atajos de la ruta\n3. Respetar las zonas de avituallamiento.\n4. Uso obligatorio de casco.',
      mapaUrl: 'assets/maps/ciclismo.png',
    },
    {
      nombre: 'Atletismo',
      reglamento:
        'Distancia: 4.5 Km.\n Hora: Después de ciclismo.\n Se debe llevar el dorsal visible en la parte delantera.\n Penalización: Si se llama 3 veces al equipo y no se presenta\n Abandono: Se le asignará el tiempo del último competidor más 5 minutos.',
      reglas:
        '1.Completar el recorrido establecido sin atajos. \n2.Mantener una conducta deportiva. \n3. Ropa cómoda.',
      mapaUrl: 'assets/maps/carrera.png',
    },
  ]);

  selectedDiscipline = signal<Disciplina | null>(null);

  selectDiscipline(disciplina: Disciplina) {
    // Si el modal está abierto, solo cambia la disciplina sin cerrar
    // Si el modal está cerrado, abre con la disciplina seleccionada
    this.selectedDiscipline.set(disciplina);
  }

  closeDetail() {
    this.selectedDiscipline.set(null);
  }

  verResultadosAnteriores() {
    window.open(
      'https://computadoresparaeducar-my.sharepoint.com/:x:/g/personal/10ap00000006_educacioncpe_gov_co/Eac3M4vYHZBLts0zQ_t_Yp0B-qRpWKJZbhnRUH0TOQrWdA?e=HlEwPQ',
      '_blank'
    );
  }
}
