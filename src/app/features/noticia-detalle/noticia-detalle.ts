import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NoticiasService, Noticia } from '../../services/noticias';

@Component({
  selector: 'app-noticia-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './noticia-detalle.html',
  styleUrls: ['./noticia-detalle.scss']
})
export class NoticiaDetalle implements OnInit {
  noticia: Noticia | null = null;
  noticiasRelacionadas: Noticia[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private noticiasService: NoticiasService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.cargarNoticia(id);
      this.cargarNoticiasRelacionadas();
    });
  }

  cargarNoticia(id: string): void {
    this.loading = true;
    this.noticiasService.obtenerNoticia(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.noticia = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando noticia:', error);
        this.error = 'Error al cargar la noticia';
        this.loading = false;
      }
    });
  }

  cargarNoticiasRelacionadas(): void {
    this.noticiasService.listarNoticias().subscribe({
      next: (response) => {
        if (response.success) {
          // Tomar las primeras 3 noticias como relacionadas
          this.noticiasRelacionadas = response.data.slice(0, 3);
        }
      },
      error: (error) => {
        console.error('Error cargando noticias relacionadas:', error);
      }
    });
  }

  compartirEnFacebook(): void {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }

  compartirEnTwitter(): void {
    const url = window.location.href;
    const texto = this.noticia?.titulo || '';
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texto)}`, '_blank');
  }

  compartirEnWhatsApp(): void {
    const url = window.location.href;
    const texto = this.noticia?.titulo || '';
    window.open(`https://wa.me/?text=${encodeURIComponent(texto + ' ' + url)}`, '_blank');
  }

  formatearFecha(fecha: string): string {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const date = new Date(fecha);
    return `${date.getDate()} de ${meses[date.getMonth()]}, ${date.getFullYear()}`;
  }

  getImagenUrl(noticia: Noticia): string {
    const url = noticia.imagen?.url;
    if (!url) {
      return 'https://picsum.photos/seed/default/800/600.jpg';
    }
    
    // Convertir URL de Google Drive al formato que funciona mejor
    return this.convertGoogleDriveUrl(url);
  }

  convertGoogleDriveUrl(url: string): string {
    if (!url) return '';
    
    // Extraer el file ID de la URL
    const fileIdMatch = url.match(/id=([^&]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // Usar el formato de thumbnail de Google Drive que funciona mejor
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
    
    // Si no se puede extraer el ID, devolver la URL original
    return url;
  }

  getNoticiaId(noticia: Noticia): string {
    // El backend devuelve el ID en el campo 'id'
    return noticia.id || '';
  }
}
