import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, FormArray,
  AbstractControl, ValidatorFn, ReactiveFormsModule, FormsModule
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { EquiposService } from '../../services/equipos';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario-inscripcion',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './formulario-inscripcion.html',
  styleUrl: './formulario-inscripcion.scss'
})
export class FormularioInscripcion implements OnInit {
  form!: FormGroup;
  disciplines = ['Natación', 'Ciclismo', 'Atletismo'];
  genres=['Masculino', 'Femenino'];
  seccionales = ['Tunja', 'Sogamoso', 'Chiquinquirá', 'Duitama', 'Aguazul'];
  roles = ['Estudiante', 'Funcionario'];
  ascunDisciplines: string[] = ['Natación', 'Ciclismo', 'Atletismo'];
  maxFileSizeBytes = 5 * 1024 * 1024;
  loading = false;
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  isSuccess = false;
  inscripcionAbierta = true;
  mostrarInfoImportante = false;
  showPrivacyModal = false;
  aceptaPrivacidad = false;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private equiposService: EquiposService,
              private router: Router) {}

  ngOnInit(): void {
    this.validarFechaInscripcion();
    this.form = this.fb.group({
      teamName: ['', [Validators.required, Validators.maxLength(60)]],
      teamFile: [null, [Validators.required]], // Archivo del equipo
      participants: this.fb.array([], this.exactLengthArrayValidator(3)) // Exactamente 3 participantes
    });

    // Crear 3 participantes
    for (let i = 0; i < 3; i++) {
      this.participants.push(this.createParticipantGroup());
    }
  }

  validarFechaInscripcion(): void {
    const fechaLimite = new Date('2025-11-12T23:59:59'); // Fecha límite de inscripción
    const fechaActual = new Date();

    if (fechaActual > fechaLimite) {
      this.inscripcionAbierta = false;
      if (this.form) {
        this.form.disable(); // Deshabilita el formulario si la fecha ha pasado
      }
    }
  }

  toggleInfoImportante(): void {
    this.mostrarInfoImportante = !this.mostrarInfoImportante;
  }

  openPrivacyModal(): void {
    this.showPrivacyModal = true;
  }

  closePrivacyModal(): void {
    this.showPrivacyModal = false;
  }


  get participants() {
    return this.form.get('participants') as FormArray;
  }

  createParticipantGroup(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, this.uptcEmailValidator()]],
      telefono: ['', [Validators.required, Validators.pattern(/^\+?\d{10}$/)]],
      genero: ['', Validators.required],
      seccional:['', Validators.required],
      rol: ['', Validators.required],
      disciplina: ['', Validators.required],
      participacion: ['', Validators.required],
      disciplina_ascun: ['']
    });
  }

  openModal(title: string, message: string, isSuccess: boolean) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.isSuccess = isSuccess;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;

    if (this.isSuccess) {
      this.form.reset();
      this.router.navigate(['/']); // redirigir solo si fue exitoso
    }
  }

  uptcEmailValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const v = control.value;
      if (!v) return null;
      return /^[a-zA-Z0-9._%+-]+@uptc\.edu\.co$/i.test(v) ? null : { uptcEmail: true };
    };
  }

  exactLengthArrayValidator(len: number): ValidatorFn {
    return (arr: AbstractControl) => {
      return arr instanceof FormArray && arr.length === len ? null : { exactLength: true };
    };
  }


  validatePdfFile(file: File | null) {
    if (!file) return { requiredFile: true };
    
    if (file.type !== 'application/pdf') return { invalidType: true };
    
    if (file.size > this.maxFileSizeBytes) return { tooLarge: true };
    
    return null;
  }


  onTeamFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    const control = this.form.get('teamFile');
    
    if (file) {
      const error = this.validatePdfFile(file);
      if (error) {
        control?.setErrors(error);
      } else {
        const teamName = this.form.get('teamName')?.value?.trim().replace(/\s+/g, '_') || 'equipo';
        const newFileName = `${teamName}_documentacion.pdf`;
        const renamedFile = new File([file], newFileName, { type: file.type });
        control?.setErrors(null);
        control?.setValue(renamedFile);
      }
    } else {
      control?.setErrors({ requiredFile: true });
    }
    control?.markAsTouched();
  }

  getParticipantControl(i: number, controlName: string): AbstractControl | null {
    return this.participants.at(i).get(controlName);
  }
  private normalizeDiscipline(value: string): 'natacion' | 'ciclismo' | 'atletismo' | 'ninguno' {
    if (!value) return 'ninguno';
    const lower = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quita tildes
    if (lower.includes('natacion')) return 'natacion';
    if (lower.includes('ciclismo')) return 'ciclismo';
    if (lower.includes('atletismo')) return 'atletismo';
    return 'ninguno';
  }
  private normalizeSeccionales(value: string): 'tunja' | 'sogamoso' | 'chiquinquira' | 'duitama' | 'aguazul' | 'ninguno' {
    const lower = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quita tildes
    if (lower.includes('tunja')) return 'tunja';
    if (lower.includes('sogamoso')) return 'sogamoso';
    if (lower.includes('chiquinquira')) return 'chiquinquira';
    if (lower.includes('duitama')) return 'duitama';
    if (lower.includes('aguazul')) return 'aguazul';
    return 'ninguno';
  }
  private normalizeGenero(value: string): 'masculino' | 'femenino' | 'ninguno' {
    const lower = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quita tildes
    if (lower.includes('masculino')) return 'masculino';
    if (lower.includes('femenino')) return 'femenino';
    return 'ninguno';
  }
  
  private normalizeRol(value: string): 'estudiante' | 'funcionario' | 'ninguno' {
    const lower = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quita tildes
    if (lower.includes('estudiante')) return 'estudiante';
    if (lower.includes('funcionario')) return 'funcionario';
    return 'ninguno';
  }

  async enviarInscripcion(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
        this.openModal(
          'Campos incompletos ⚠️',
          'Por favor complete todos los campos correctamente antes de enviar el formulario.',
          false
      );
      return;
    }

    if (!this.aceptaPrivacidad) {
      this.openModal(
        'Aviso de privacidad ⚠️',
        'Debe aceptar el aviso de privacidad y tratamiento de datos para continuar con la inscripción.',
        false
      );
      return;
    }

  const participantes = this.participants.value;
  const disciplinas = participantes.map((p: any) => this.normalizeDiscipline(p.disciplina));

  const disciplinasRepetidas = disciplinas.some(
    (disc:string, index:number) => disciplinas.indexOf(disc) !== index
  );

  if (disciplinasRepetidas) {
    this.openModal(
      'Disciplinas repetidas ⚠️',
      'Cada participante debe tener una disciplina diferente. Verifique e inténtelo nuevamente.',
      false
    );
    return; // 🚫 Detiene el envío
  }

    const generos = participantes.map((p: any) => this.normalizeGenero(p.genero));
    const hayFemenino = generos.includes('femenino');
    const hayMasculino = generos.includes('masculino');

    if (!hayFemenino || !hayMasculino) {
    this.openModal(
      'Género incompleto ⚠️',
      'El equipo debe tener al menos una participante femenina y un participante masculino.',
      false
    );
    return;
  }  

    this.loading = true;
    try {
      // 1️⃣ Crear equipo
      const equipo = await this.equiposService
        .createEquipo({nombre: this.form.get('teamName')?.value})
        .toPromise();
        if (!equipo) throw new Error('No se pudo crear el equipo');

      const equipoId = equipo.id;
      if (!equipoId) throw new Error('No se encontro el Id del equipo creado');

      // 3️⃣ Registrar participantes
      const participantes = this.participants.value.map((p: any,index:number) => ({
        nombre: p.nombre,
        correo: p.correo,
        telefono: p.telefono,
        genero: this.normalizeGenero(p.genero),
        seccional: this.normalizeSeccionales(p.seccional),
        rol: this.normalizeRol(p.rol),
        delegado: index === 0 ? true : false,
        disciplina: this.normalizeDiscipline(p.disciplina),
        disciplina_ascun: p.participacion.toLowerCase() === 'no' ? 'ninguno' : this.normalizeDiscipline(p.disciplina_ascun),
        equipo_id: equipoId
      }));
      for (const p of participantes) {
        try {
            await this.equiposService.addParticipante(equipoId, p).toPromise();
        } catch (participantError: any) {
            console.error('❌ Error creando participante:', participantError);

            // Eliminar equipo si falla uno de los participantes
            if (equipoId) {
                await this.equiposService.deleteEquipo(equipoId).toPromise();
                console.warn(`🗑️ Equipo ${equipoId} eliminado por error en participante`);
              }

            // Mostrar modal personalizado si es correo duplicado
            const errorMsg =
                participantError?.error?.message ||
                participantError?.error ||
                participantError?.message ||
            '';
            if (errorMsg.includes('duplicate key') || errorMsg.includes('E11000')) {
                this.openModal(
                  'Correo repetido ⚠️',
                  `Uno de los correos ingresados ya está registrado. Por favor verifique los participantes e intente nuevamente.`,
                  false
                  );
            } else {
                this.openModal(
                    'Error 😢',
                    'Ocurrió un problema al registrar los participantes. Intente nuevamente.',
                    false
                );
            }
              return; // 🚫 Detener todo si falla un participante
            }
            }

      // 2️⃣ Subir archivo del equipo
      const teamFile = this.form.get('teamFile')?.value;
      await this.equiposService.uploadArchivoEquipo(teamFile, equipoId).toPromise();
      this.openModal('Inscripción exitosa 🎉', 'Tu inscripción fue enviada correctamente.', true);
      this.form.reset();

    } catch (error:any) {
        console.error('❌ Error en la inscripción:', error);

        const errorMsg = error?.error?.message || error?.error || error?.message || '';
        if (errorMsg.includes('IndexKeySpecsConflict') || errorMsg.includes('duplicate key')|| errorMsg.includes('ya existe')) {
            this.openModal(
            'Nombre de equipo repetido ⚠️',
            'El nombre de tu equipo ya está registrado. Por favor cámbialo e inténtalo nuevamente.',
            false
            );
        } else {
            this.openModal(
              'Error 😢',
              'No se pudo completar la inscripción. Intenta nuevamente.',
              false
              );
        }
    } finally {
      this.loading = false;
    }
  }
}
