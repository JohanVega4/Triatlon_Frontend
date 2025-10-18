import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Disciplina } from '../../interfaces/disciplina.interface';

@Component({
  selector: 'app-informacion-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion-evento.component.html',
  styleUrls: ['./informacion-evento.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformacionEventoComponent {
  disciplinas = signal<Disciplina[]>([
    {
      nombre: 'Natación',
      reglamento: 'El reglamento de natación principalmente es la la ropa adecuada y gorro abligatorio para picsinas.',
      reglas: '1. Seguir recomendaciones.\n2. No está permitido tener algun tipo de la ayuda.\n3. En caso de emergencia, levantar un brazo para ofecerle la devida atencion.',
      mapaUrl: 'assets/maps/natacion.png'
    },
    {
      nombre: 'Ciclismo',
      reglamento: 'Es obligatorio el uso de casco rígido. preferiblemente tener bicicleta de remplazo por si se pinchan.',
      reglas: '1. No bloquear a otros competidores.\n2. No desviarse o tomar atajos de la ruta\n3. Respetar las zonas de avituallamiento.',
      mapaUrl: 'assets/maps/ciclismo.png'
    },
    {
      nombre: 'Atletismo',
      reglamento: 'Se debe llevar el dorsal visible en la parte delantera. El recorrido estará claramente marcado y no se permite recibir ayuda externa fuera de las zonas designadas.',
      reglas: '1.Completar el recorrido establecido sin atajos. \n2.Mantener una conducta deportiva. \n 3....',
      mapaUrl: 'assets/maps/carrera.png'
    }
  ]);

  selectedDiscipline = signal<Disciplina | null>(null);

  selectDiscipline(disciplina: Disciplina) {
    this.selectedDiscipline.set(this.selectedDiscipline() === disciplina ? null : disciplina);
  }

  closeDetail() {
    this.selectedDiscipline.set(null);
  }
}
