import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InformacionEventoComponent } from '../informacion-evento/informacion-evento.component';
import { ImagenesService } from '../../services/imagenes';
import { NoticiasService, Noticia } from '../../services/noticias';

interface GalleryItem {
  imagen: string;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, InformacionEventoComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {
  countdownInterval: any;

  // Propiedades para la cuenta regresiva
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  // Noticias
  noticias: Noticia[] = [];
  loadingNoticias = true;

  // Galería
  galeria: GalleryItem[] = [];
  loadingGallery = true;
  galleryRotationInterval: any;
  private imagesByYear = new Map<number, any[]>();
  private currentIndices = { 2024: 0, 2023: 0 };

  // Resultados históricos
  resultadosHistoricos = [
    { anio: '2024', equipo: 'Los Titanes', tiempo: '2:15:30.450' },
    { anio: '2023', equipo: 'Velocistas UPTC', tiempo: '2:18:45.230' },
    { anio: '2022', equipo: 'Trifuerza', tiempo: '2:22:10.875' },
    { anio: '2021', equipo: 'Aguas Profundas', tiempo: '2:25:33.120' }
  ];

  constructor(
    private imagenesService: ImagenesService,
    private noticiasService: NoticiasService
  ) { }

  ngOnInit(): void {
    this.initCountdown();
    this.loadGalleryImages();
    this.loadNoticias();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.galleryRotationInterval) {
      clearInterval(this.galleryRotationInterval);
    }
  }

  private loadNoticias(): void {
    this.loadingNoticias = true;
    this.noticiasService.listarNoticias().subscribe({
      next: (response) => {
        if (response.success) {
          // Tomar solo las 3 noticias más recientes
          this.noticias = response.data.slice(0, 3);
        }
        this.loadingNoticias = false;
      },
      error: (error) => {
        console.error('Error al cargar noticias:', error);
        this.loadingNoticias = false;
      }
    });
  }

  private loadGalleryImages(): void {
    this.loadingGallery = true;

    this.imagenesService.getImagenes().subscribe({
      next: (response) => {
        if (response.success && response.data.length > 0) {
          // Agrupar imágenes por año
          this.imagesByYear.clear();

          response.data.forEach(img => {
            const year = new Date(img.fecha_imagen).getFullYear();
            if (!this.imagesByYear.has(year)) {
              this.imagesByYear.set(year, []);
            }
            this.imagesByYear.get(year)?.push(img);
          });

          // Mezclar aleatoriamente las imágenes de cada año
          this.imagesByYear.forEach((images, year) => {
            this.imagesByYear.set(year, this.shuffleArray(images));
          });

          // Seleccionar imágenes iniciales
          this.updateGalleryImages();

          // Iniciar rotación automática cada 5 segundos
          this.startGalleryRotation();
        } else {
          this.galeria = [];
        }

        this.loadingGallery = false;
      },
      error: (error) => {
        console.error('Error al cargar imágenes de galería:', error);
        this.galeria = [];
        this.loadingGallery = false;
      }
    });
  }

  private updateGalleryImages(): void {
    const selectedImages: GalleryItem[] = [];

    // Intentar obtener 2 imágenes de 2024
    const images2024 = this.imagesByYear.get(2024) || [];
    if (images2024.length > 0) {
      // Primera imagen de 2024
      const img1 = images2024[this.currentIndices[2024] % images2024.length];
      selectedImages.push({
        imagen: this.convertGoogleDriveUrl(img1.url),
        titulo: img1.nombre,
        descripcion: img1.descripcion || 'Triatlón 2024'
      });

      // Segunda imagen de 2024 (si hay más de una)
      if (images2024.length > 1) {
        const img2 = images2024[(this.currentIndices[2024] + 1) % images2024.length];
        selectedImages.push({
          imagen: this.convertGoogleDriveUrl(img2.url),
          titulo: img2.nombre,
          descripcion: img2.descripcion || 'Triatlón 2024'
        });
      } else {
        // Si solo hay una imagen de 2024, repetirla
        selectedImages.push(selectedImages[0]);
      }
    }

    // Intentar obtener 2 imágenes de 2023
    const images2023 = this.imagesByYear.get(2023) || [];
    if (images2023.length > 0) {
      // Primera imagen de 2023
      const img1 = images2023[this.currentIndices[2023] % images2023.length];
      selectedImages.push({
        imagen: this.convertGoogleDriveUrl(img1.url),
        titulo: img1.nombre,
        descripcion: img1.descripcion || 'Triatlón 2023'
      });

      // Segunda imagen de 2023 (si hay más de una)
      if (images2023.length > 1) {
        const img2 = images2023[(this.currentIndices[2023] + 1) % images2023.length];
        selectedImages.push({
          imagen: this.convertGoogleDriveUrl(img2.url),
          titulo: img2.nombre,
          descripcion: img2.descripcion || 'Triatlón 2023'
        });
      } else {
        // Si solo hay una imagen de 2023, repetirla
        selectedImages.push(selectedImages[selectedImages.length - 1]);
      }
    }

    // Si no hay suficientes imágenes de 2024 y 2023, completar con otros años
    if (selectedImages.length < 4) {
      const otherYears = [2022, 2021, 2020, 2019];
      for (const year of otherYears) {
        if (selectedImages.length >= 4) break;

        const yearImages = this.imagesByYear.get(year);
        if (yearImages && yearImages.length > 0) {
          const img = yearImages[0];
          selectedImages.push({
            imagen: this.convertGoogleDriveUrl(img.url),
            titulo: img.nombre,
            descripcion: img.descripcion || `Triatlón ${year}`
          });
        }
      }
    }

    this.galeria = selectedImages.slice(0, 4);
  }

  private startGalleryRotation(): void {
    // Tiempos para la rotación de imagenes
    const initialDelays = [10000, 15000, 20000, 25000];
    const intervals = [20200, 20500, 20800, 20300];

    initialDelays.forEach((delay, index) => {
      setTimeout(() => {
        // Primera rotación
        this.rotateImage(index);

        // Luego rotar con intervalos ligeramente diferentes
        setInterval(() => {
          this.rotateImage(index);
        }, intervals[index]);
      }, delay);
    });
  }

  private rotateImage(index: number): void {
    const images2024 = this.imagesByYear.get(2024) || [];
    const images2023 = this.imagesByYear.get(2023) || [];

    let newImage: GalleryItem | null = null;

    // Obtener la nueva imagen según el índice
    if (index === 0 || index === 1) {
      if (images2024.length > 1) {
        this.currentIndices[2024] = (this.currentIndices[2024] + 1) % images2024.length;
        const imgIndex = index === 0 ?
          this.currentIndices[2024] :
          (this.currentIndices[2024] + 1) % images2024.length;
        const img = images2024[imgIndex];
        newImage = {
          imagen: this.convertGoogleDriveUrl(img.url),
          titulo: img.nombre,
          descripcion: img.descripcion || 'Triatlón 2024'
        };
      }
    } else if (index === 2 || index === 3) {
      if (images2023.length > 1) {
        this.currentIndices[2023] = (this.currentIndices[2023] + 1) % images2023.length;
        const imgIndex = index === 2 ?
          this.currentIndices[2023] :
          (this.currentIndices[2023] + 1) % images2023.length;
        const img = images2023[imgIndex];
        newImage = {
          imagen: this.convertGoogleDriveUrl(img.url),
          titulo: img.nombre,
          descripcion: img.descripcion || 'Triatlón 2023'
        };
      }
    }

    // Actualizar solo la imagen específica con animación
    if (newImage && this.galeria[index]) {
      // Añadir clase de animación al elemento
      const galleryItems = document.querySelectorAll('.gallery-item');
      if (galleryItems[index]) {
        galleryItems[index].classList.add('image-transition');

        // Cambiar la imagen después de un breve delay
        setTimeout(() => {
          this.galeria[index] = newImage!;
          this.galeria = [...this.galeria];

          // Remover la clase después de la animación
          setTimeout(() => {
            if (galleryItems[index]) {
              galleryItems[index].classList.remove('image-transition');
            }
          }, 800);
        }, 100);
      }
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // TrackBy function para optimizar el rendering
  trackByIndex(index: number): number {
    return index;
  }

  // Convertir URL de Google Drive para que funcione como imagen
  private convertGoogleDriveUrl(url: string): string {
    if (!url) return '';

    const fileIdMatch = url.match(/id=([^&]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }

    return url;
  }

  // Obtener URL de imagen de noticia
  getNoticiaImagen(noticia: Noticia): string {
    const url = noticia.imagen?.url;
    if (!url) {
      return 'https://picsum.photos/seed/default/800/600.jpg';
    }
    return this.convertGoogleDriveUrl(url);
  }

  // Formatear fecha de noticia
  formatearFechaNoticia(fecha: string): string {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const date = new Date(fecha);
    return `${date.getDate()} de ${meses[date.getMonth()]}, ${date.getFullYear()}`;
  }

  // Obtener ID de noticia
  getNoticiaId(noticia: Noticia): string {
    return noticia.id || '';
  }

  private initCountdown(): void {
    // Establecer fecha del evento 
    const eventDate = new Date('Nov 13, 2025 08:00:00').getTime();

    // Actualizar cuenta regresiva cada segundo
    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      // Cálculos para días, horas, minutos y segundos
      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Si la cuenta regresiva termina
      if (distance < 0) {
        clearInterval(this.countdownInterval);
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
      }
    }, 1000);
  }
}