import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Galeria } from './features/galeria/galeria';
import { ListaEquipos } from './features/lista-equipos/lista-equipos';
import { Podio } from './features/podio/podio';
import { EquipoDetalle } from './features/equipo-detalle/equipo-detalle';
import { PremiosIndividuales } from './features/premios-individuales/premios-individuales';
import { ResultadosDisciplina } from './features/resultados-disciplina/resultados-disciplina';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { EditarEquipo } from './admin/editar-equipo/editar-equipo';
import { GestionTiempos } from './admin/gestion-tiempos/gestion-tiempos';
import { GestionImagenes } from './admin/gestion-imagenes/gestion-imagenes';
import { VisibilidadResultados } from './admin/visibilidad-resultados/visibilidad-resultados';
import { GestionNoticias } from './admin/gestion-noticias/gestion-noticias';
import { AdminGuard } from './guards/admin-guard';
import { Participantes } from './features/participantes/participantes';
import { Noticias } from './features/noticias/noticias';
import { NoticiaDetalle } from './features/noticia-detalle/noticia-detalle';
import { FormularioInscripcion } from './features/formulario-inscripcion/formulario-inscripcion';
import { GestionEquipos } from './admin/gestion-equipos/gestion-equipos';
import { EquipoTrabajo } from './features/equipo-trabajo/equipo-trabajo';

export const routes: Routes = [
  // Rutas públicas
  { path: '', component: Home, title: 'Triatlón Universitario UPTC 2025' },
  { path: 'galeria', component: Galeria, title: 'Galería Completa - Triatlón UPTC' },
  { path: 'noticias', component: Noticias, title: 'Noticias - Triatlón UPTC' },
  { path: 'noticia/:id', component: NoticiaDetalle, title: 'Detalle de Noticia - Triatlón UPTC' },
  { path: 'equipos', component: ListaEquipos, title: 'Lista de Equipos - Triatlón' },
  { path: 'podio', component: Podio, title: 'Podio - Triatlón' },
  { path: 'participantes', component: Participantes, title: 'Participantes - Triatlón' },
  { path: 'equipo/:id', component: EquipoDetalle, title: 'Detalle de Equipo - Triatlón' },
  { path: 'premios-individuales', component: PremiosIndividuales, title: 'Premios Individuales - Triatlón' },
  { path: 'resultados/:disciplina', component: ResultadosDisciplina, title: 'Resultados por Disciplina - Triatlón' },
  { path: 'acercade', component: EquipoTrabajo, title: 'Acerca de - Triatlón' },
  { path: 'inscripcion', component: FormularioInscripcion, title: 'Inscripción de Equipos - Triatlón' },
  
  // Rutas de administración (sin children, cada una con su propio guard)
  { path: 'admin', component: AdminDashboard, canActivate: [AdminGuard], title: 'Admin Dashboard - Triatlón' },
  { path: 'admin/editar-equipo/:id', component: EditarEquipo, canActivate: [AdminGuard], title: 'Editar Equipo - Admin' },
  { path: 'admin/gestion-tiempos', component: GestionTiempos, canActivate: [AdminGuard], title: 'Gestión de Tiempos - Admin' },
  { path: 'admin/gestion-equipos', component: GestionEquipos, canActivate: [AdminGuard], title: 'Gestión de Equipos - Admin' },
  { path: 'admin/gestion-imagenes', component: GestionImagenes, canActivate: [AdminGuard], title: 'Gestión de Imágenes - Admin' },
  { path: 'admin/gestion-noticias', component: GestionNoticias, canActivate: [AdminGuard], title: 'Gestión de Noticias - Admin' },
  { path: 'admin/visibilidad-resultados', component: VisibilidadResultados, canActivate: [AdminGuard], title: 'Visibilidad de Resultados - Admin' },

  // Redirección para rutas no encontradas
  { path: '**', redirectTo: '', pathMatch: 'full' }
];