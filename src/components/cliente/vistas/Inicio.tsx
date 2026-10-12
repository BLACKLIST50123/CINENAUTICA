"use client";

import { abrirModalTrailer, alCambiarCiudadInicio, aplicarFiltroInicio, elegirFechaInicio, limpiarFiltrosInicio, moverCarrusel } from "@/src/lib/ui/cliente";
import { abrirDetallePelicula, cambiarVista, intentarSalirDelFlujoDeCompra, vistaActual } from "@/src/lib/ui/nav";

export default function Inicio() {
  return (
    <>
      <div className="transition-opacity duration-300 w-full min-h-screen" id="vista-inicio">
        <section className="relative h-[70vh] min-h-[500px] md:h-[85vh] w-full bg-dark-900 overflow-hidden">
          <div className="relative w-full h-full" id="carrusel-principal">
            <div className="relative w-full h-full" id="carrusel-slides">
              <div className="carousel-item active">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://w0.peakpx.com/wallpaper/857/946/HD-wallpaper-avengers-end-game-banner-avengers-endgame-2019-movies-movies-superheroes.jpg')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 max-w-4xl z-20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-brand-blue text-white text-xs font-bold rounded-full w-max uppercase tracking-wider">
                      Estreno
                    </span>
                    {" "}
                    <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 rounded text-xs font-bold text-white">
                      APT
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                    Avengers: Endgame Encore
                  </h1>
                  <p className="text-slate-300 text-lg md:text-xl mb-6 max-w-2xl line-clamp-3">
                    El reestreno del épico final de la Saga del Infinito. Incluye 4 minutos de material extra inédito y escenas especiales que funcionan como puente directo hacia Avengers: Doomsday.
                  </p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <button className="bg-brand-blue hover:bg-brand-dark-blue text-white shadow-blue-500/40 px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all flex items-center gap-2" onClick={(event) => { abrirDetallePelicula('endgame-bonus','cartelera'); }}>
                      <i className="fa-solid fa-ticket"></i>
                      {" "}
                      Ver funciones
                    </button>
                    {" "}
                    <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 py-3 rounded-full font-bold text-lg border border-white/20 transition-all flex items-center gap-2" onClick={(event) => { abrirModalTrailer('endgame-bonus'); }}>
                      <i className="fa-solid fa-play"></i>
                      {" "}
                      Ver Tráiler
                    </button>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images7.alphacoders.com/141/thumb-1920-1411911.jpg')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 max-w-4xl z-20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-brand-blue text-white text-xs font-bold rounded-full w-max uppercase tracking-wider">
                      Estreno
                    </span>
                    {" "}
                    <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 rounded text-xs font-bold text-white">
                      APT
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                    Spider-Man: Un Nuevo Día
                  </h1>
                  <p className="text-slate-300 text-lg md:text-xl mb-6 max-w-2xl line-clamp-3">
                    Peter Parker se enfrenta a su mayor desafío cuando las barreras entre multiversos colisionan inesperadamente. Viejos enemigos de realidades alternativas llegan a Nueva York, y Peter deberá aliarse con versiones de sí mismo para restaurar el equilibrio antes de que su mundo sea destruido por completo.
                  </p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <button className="bg-brand-blue hover:bg-brand-dark-blue text-white shadow-blue-500/40 px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all flex items-center gap-2" onClick={(event) => { abrirDetallePelicula('spiderman','cartelera'); }}>
                      <i className="fa-solid fa-ticket"></i>
                      {" "}
                      Ver funciones
                    </button>
                    {" "}
                    <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 py-3 rounded-full font-bold text-lg border border-white/20 transition-all flex items-center gap-2" onClick={(event) => { abrirModalTrailer('spiderman'); }}>
                      <i className="fa-solid fa-play"></i>
                      {" "}
                      Ver Tráiler
                    </button>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://sm.ign.com/t/ign_latam/screenshot/default/avengers-doomsday_e91x.1200.jpg')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 max-w-4xl z-20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-brand-blue text-white text-xs font-bold rounded-full w-max uppercase tracking-wider">
                      Próximo Estreno
                    </span>
                    {" "}
                    <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 rounded text-xs font-bold text-white">
                      APT
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                    Avengers: Doomsday
                  </h1>
                  <p className="text-slate-300 text-lg md:text-xl mb-6 max-w-2xl line-clamp-3">
                    En medio del colapso del multiverso, grupos de héroes de tres universos diferentes —los Vengadores, los 4 Fantásticos y los X-Men— convergen para enfrentarse a la amenaza existencial del Doctor Doom.
                  </p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 py-3 rounded-full font-bold text-lg border border-white/20 transition-all flex items-center gap-2" onClick={(event) => { abrirModalTrailer('doomsday'); }}>
                      <i className="fa-solid fa-play"></i>
                      {" "}
                      Ver Tráiler
                    </button>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://i0.wp.com/www.lacosacine.com/wp-content/uploads/2026/04/La-Noche-del-Demonio-Banner-1.jpg?resize=1200%2C720&ssl=1')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 max-w-4xl z-20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-brand-yellow text-black text-xs font-bold rounded-full w-max uppercase tracking-wider">
                      Preventa Exclusiva
                    </span>
                    {" "}
                    <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 rounded text-xs font-bold text-white">
                      +14
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                    La Noche del Demonio
                  </h1>
                  <p className="text-slate-300 text-lg md:text-xl mb-6 max-w-2xl line-clamp-3">
                    Una familia se muda a una nueva casa buscando un nuevo comienzo, solo para descubrir que el lugar está plagado de entidades oscuras. A medida que las manifestaciones empeoran, descubren que el verdadero mal no reside en la casa, sino que ha poseído a su hijo menor.
                  </p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <button className="bg-brand-yellow hover:bg-yellow-400 text-black shadow-yellow-500/40 px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all flex items-center gap-2" onClick={(event) => { abrirDetallePelicula('demonio','cartelera'); }}>
                      <i className="fa-solid fa-ticket"></i>
                      {" "}
                      Ver funciones
                    </button>
                    {" "}
                    <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 py-3 rounded-full font-bold text-lg border border-white/20 transition-all flex items-center gap-2" onClick={(event) => { abrirModalTrailer('demonio'); }}>
                      <i className="fa-solid fa-play"></i>
                      {" "}
                      Ver Tráiler
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {" "}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-brand-blue text-white backdrop-blur-sm border border-white/10 transition-colors" id="slide-anterior" onClick={(event) => { moverCarrusel(-1); }}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            {" "}
            <button className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-brand-blue text-white backdrop-blur-sm border border-white/10 transition-colors" id="slide-siguiente" onClick={(event) => { moverCarrusel(1); }}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </section>
        <div className="hidden cursor-pointer bg-gradient-to-r from-brand-yellow to-yellow-500 text-black px-6 py-3 text-center font-bold text-sm md:text-base flex items-center justify-center gap-2" id="banner-cumpleanos-socio" onClick={(event) => { intentarSalirDelFlujoDeCompra(() => cambiarVista(vistaActual(), 'vista-beneficios')); }}>
          <i className="fa-solid fa-cake-candles"></i>
          {" "}
          ¡Es tu mes de cumpleaños! Reclama tu entrada gratis en counter con tu código de socio.
        </div>
        <section className="relative z-30 mt-6 md:mt-8 px-4 md:px-12 max-w-[1600px] mx-auto" id="barra-filtros-inicio">
          <div className="filtro-barra rounded-3xl p-4 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,.6)]">
            <div className="flex items-center justify-between mb-5">
              <p className="text-white font-bold flex items-center gap-2">
                <i className="fa-solid fa-sliders text-brand-yellow"></i>
                {" "}
                Encuentra tu función
              </p>
              {" "}
              <button className="text-xs text-slate-400 hover:text-white underline" onClick={(event) => { limpiarFiltrosInicio(); }}>
                Limpiar filtros
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              <div className="filtro-campo">
                <label>
                  Película
                </label>
                <i className="fa-solid fa-film"></i>
                <select className="filtro-select" id="f-peli" onChange={(event) => { aplicarFiltroInicio(); }}>
                  <option value="">
                    Todas las películas
                  </option>
                  <option value="endgame-bonus">
                    Avengers: Endgame Encore
                  </option>
                  <option value="re-noche-cero">
                    Resident Evil: Noche Cero
                  </option>
                  <option value="spiderman">
                    Spider-Man: Un Nuevo Día
                  </option>
                  <option value="coyote-acme">
                    Coyote vs. Acme
                  </option>
                  <option value="sombra-exorcista">
                    La Sombra del Exorcista
                  </option>
                  <option value="demonio">
                    La Noche del Demonio
                  </option>
                </select>
              </div>
              <div className="filtro-campo">
                <label>
                  Ciudad
                </label>
                <i className="fa-solid fa-city"></i>
                <select className="filtro-select" id="f-ciudad" onChange={(event) => { alCambiarCiudadInicio(); }}>
                  <option value="">
                    Todas las ciudades
                  </option>
                  <option value="Chimbote">
                    Chimbote
                  </option>
                  <option value="Nuevo Chimbote">
                    Nuevo Chimbote
                  </option>
                  <option value="Trujillo">
                    Trujillo
                  </option>
                  <option value="Lima Metropolitana">
                    Lima Metropolitana
                  </option>
                </select>
              </div>
              <div className="filtro-campo">
                <label>
                  Sede
                </label>
                <i className="fa-solid fa-location-dot"></i>
                <select className="filtro-select" id="f-sede" onChange={(event) => { aplicarFiltroInicio(); }}>
                  <option value="">
                    Todas las sedes
                  </option>
                  <option data-ciudad="Chimbote" value="s1">
                    Náutica Megaplaza
                  </option>
                  <option data-ciudad="Chimbote" value="s2">
                    Náutica Costa Azul
                  </option>
                  <option data-ciudad="Nuevo Chimbote" value="s3">
                    Náutica Nuevo Chimbote
                  </option>
                  <option data-ciudad="Trujillo" value="s4">
                    Náutica Trujillo Centro
                  </option>
                  <option data-ciudad="Trujillo" value="s5">
                    Náutica Mall Trujillo
                  </option>
                  <option data-ciudad="Lima Metropolitana" value="s6">
                    Náutica Lima Norte
                  </option>
                  <option data-ciudad="Lima Metropolitana" value="s7">
                    Náutica Miraflores
                  </option>
                  <option data-ciudad="Lima Metropolitana" value="s8">
                    Náutica San Miguel
                  </option>
                </select>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
                <i className="fa-regular fa-calendar mr-1 text-brand-blue"></i>
                {" "}
                Fecha
              </p>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                <button className="chip-fecha activo" type="button" onClick={(event) => { elegirFechaInicio(event.currentTarget,'d0'); }}>
                  <b>
                    Hoy
                  </b>
                  <span>
                    Sáb 10
                  </span>
                </button>
                <button className="chip-fecha" type="button" onClick={(event) => { elegirFechaInicio(event.currentTarget,'d1'); }}>
                  <b>
                    Mañana
                  </b>
                  <span>
                    Dom 11
                  </span>
                </button>
                <button className="chip-fecha" type="button" onClick={(event) => { elegirFechaInicio(event.currentTarget,'d2'); }}>
                  <b>
                    Lun
                  </b>
                  <span>
                    12 Oct
                  </span>
                </button>
                <button className="chip-fecha" type="button" onClick={(event) => { elegirFechaInicio(event.currentTarget,'d3'); }}>
                  <b>
                    Mar
                  </b>
                  <span>
                    13 Oct
                  </span>
                </button>
                <button className="chip-fecha" type="button" onClick={(event) => { elegirFechaInicio(event.currentTarget,'d4'); }}>
                  <b>
                    Mié
                  </b>
                  <span>
                    14 Oct
                  </span>
                </button>
                <button className="chip-fecha" type="button" onClick={(event) => { elegirFechaInicio(event.currentTarget,'d5'); }}>
                  <b>
                    Jue
                  </b>
                  <span>
                    15 Oct
                  </span>
                </button>
                <button className="chip-fecha" type="button" onClick={(event) => { elegirFechaInicio(event.currentTarget,'d6'); }}>
                  <b>
                    Vie
                  </b>
                  <span>
                    16 Oct
                  </span>
                </button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-2" id="resumen-filtros">
              <span className="text-xs text-slate-500 mr-1">
                Mostrando:
              </span>
              {" "}
              <span className="chip-filtro" id="rf-cant">
                <i className="fa-solid fa-film"></i>
                {" "}
                6 películas
              </span>
              {" "}
              <span className="chip-filtro hidden" id="rf-ciudad"></span>
              <span className="chip-filtro hidden" id="rf-sede"></span>
              <span className="chip-filtro" id="rf-fecha">
                <i className="fa-regular fa-calendar"></i>
                {" "}
                Hoy · Sáb 10
              </span>
            </div>
          </div>
        </section>
        <main className="px-6 md:px-12 max-w-[1600px] mx-auto bg-dark-900 pt-10 md:pt-14 pb-12 md:pb-20">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Películas en Cartelera
              </h2>
              <div className="h-1 w-20 bg-brand-blue rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 mb-20" id="grid-cartelera">
            <article className="movie-card group cursor-pointer flex flex-col h-full relative" data-peli="endgame-bonus" data-sf="s1:d0 s1:d1 s1:d2 s1:d3 s2:d0 s2:d1 s2:d2 s2:d3 s4:d0 s4:d1 s4:d2 s6:d0 s6:d2 s6:d3" onClick={(event) => { abrirDetallePelicula('endgame-bonus','cartelera'); }}>
              <div className="absolute top-2 left-2 z-20 bg-black/80 border-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border">
                APT
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                <img alt="Avengers: Endgame Encore" className="w-full h-full object-cover" src="https://m.media-amazon.com/images/M/MV5BMWEyNDM2ZmQtMmFkNi00MTQ1LTk1MjItMzdlZGJlYmIyYzZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" />
                {" "}
                <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4 gap-2">
                  <button className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-2.5 rounded-lg font-bold transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirDetallePelicula('endgame-bonus','cartelera'); }}>
                    <i className="fa-solid fa-ticket"></i>
                    {" "}
                    Ver funciones
                  </button>
                  {" "}
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2.5 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirModalTrailer('endgame-bonus'); }}>
                    <i className="fa-solid fa-play"></i>
                    {" "}
                    Tráiler
                  </button>
                </div>
              </div>
              <div className="flex-grow flex flex-col">
                <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-blue transition-colors">
                  Avengers: Endgame Encore
                </h3>
                <p className="text-slate-400 text-sm mb-1">
                  Acción / Ciencia Ficción • 3h 06m
                </p>
                <p className="text-[11px] text-slate-500">
                  <i className="fa-solid fa-location-dot text-brand-blue mr-1"></i>
                  <span className="js-n-sedes">
                    4
                  </span>
                  {" "}
                  sedes con funciones
                </p>
              </div>
            </article>
            <article className="movie-card group cursor-pointer flex flex-col h-full relative" data-peli="re-noche-cero" data-sf="s1:d0 s1:d1 s1:d2 s1:d3 s1:d4 s3:d0 s3:d1 s3:d2 s3:d4 s3:d5 s5:d0 s5:d2 s5:d3 s5:d4 s5:d5 s6:d1 s6:d2 s6:d3 s6:d4 s6:d5 s7:d0 s7:d1 s7:d2 s7:d3 s7:d4 s7:d5" onClick={(event) => { abrirDetallePelicula('re-noche-cero','cartelera'); }}>
              <div className="absolute top-2 left-2 z-20 bg-red-600/90 border-red-500/30 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border">
                +14
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                <img alt="Resident Evil: Noche Cero" className="w-full h-full object-cover" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi1JbvAmZ5e0KgN2PzUgaLXtbxQWBvyIqTAER2zKH5paWC7YdRpWuJfI7r&s=10"} />
                {" "}
                <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4 gap-2">
                  <button className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-2.5 rounded-lg font-bold transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirDetallePelicula('re-noche-cero','cartelera'); }}>
                    <i className="fa-solid fa-ticket"></i>
                    {" "}
                    Ver funciones
                  </button>
                  {" "}
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2.5 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirModalTrailer('re-noche-cero'); }}>
                    <i className="fa-solid fa-play"></i>
                    {" "}
                    Tráiler
                  </button>
                </div>
              </div>
              <div className="flex-grow flex flex-col">
                <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-blue transition-colors">
                  Resident Evil: Noche Cero
                </h3>
                <p className="text-slate-400 text-sm mb-1">
                  Terror / Acción • 1h 30m
                </p>
                <p className="text-[11px] text-slate-500">
                  <i className="fa-solid fa-location-dot text-brand-blue mr-1"></i>
                  <span className="js-n-sedes">
                    5
                  </span>
                  {" "}
                  sedes con funciones
                </p>
              </div>
            </article>
            <article className="movie-card group cursor-pointer flex flex-col h-full relative" data-peli="spiderman" data-sf="s1:d0 s1:d1 s1:d2 s1:d3 s1:d5 s1:d6 s2:d0 s2:d1 s2:d2 s2:d4 s2:d5 s2:d6 s3:d0 s3:d1 s3:d3 s3:d4 s3:d5 s3:d6 s4:d0 s4:d2 s4:d3 s4:d4 s4:d5 s4:d6 s5:d1 s5:d2 s5:d3 s5:d4 s5:d5 s5:d6 s6:d0 s6:d1 s6:d2 s6:d3 s6:d4 s6:d5 s7:d0 s7:d1 s7:d2 s7:d3 s7:d4 s7:d6 s8:d0 s8:d1 s8:d2 s8:d3 s8:d5 s8:d6" onClick={(event) => { abrirDetallePelicula('spiderman','cartelera'); }}>
              <div className="absolute top-2 left-2 z-20 bg-black/80 border-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border">
                APT
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                <img alt="Spider-Man: Un Nuevo Día" className="w-full h-full object-cover" src="https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.webp" />
                {" "}
                <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4 gap-2">
                  <button className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-2.5 rounded-lg font-bold transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirDetallePelicula('spiderman','cartelera'); }}>
                    <i className="fa-solid fa-ticket"></i>
                    {" "}
                    Ver funciones
                  </button>
                  {" "}
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2.5 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirModalTrailer('spiderman'); }}>
                    <i className="fa-solid fa-play"></i>
                    {" "}
                    Tráiler
                  </button>
                </div>
              </div>
              <div className="flex-grow flex flex-col">
                <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-blue transition-colors">
                  Spider-Man: Un Nuevo Día
                </h3>
                <p className="text-slate-400 text-sm mb-1">
                  Acción / Aventura • 2h 25m
                </p>
                <p className="text-[11px] text-slate-500">
                  <i className="fa-solid fa-location-dot text-brand-blue mr-1"></i>
                  <span className="js-n-sedes">
                    8
                  </span>
                  {" "}
                  sedes con funciones
                </p>
              </div>
            </article>
            <article className="movie-card group cursor-pointer flex flex-col h-full relative" data-peli="coyote-acme" data-sf="s1:d0 s1:d1 s1:d2 s1:d4 s2:d0 s2:d1 s2:d3 s2:d4 s3:d0 s3:d2 s3:d3 s3:d4 s4:d1 s4:d2 s4:d3 s4:d4 s7:d0 s7:d1 s7:d2 s7:d3 s8:d0 s8:d1 s8:d2 s8:d4" onClick={(event) => { abrirDetallePelicula('coyote-acme','cartelera'); }}>
              <div className="absolute top-2 left-2 z-20 bg-black/80 border-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border">
                APT
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                <img alt="Coyote vs. Acme" className="w-full h-full object-cover" src="https://www.aceprensa.com/wp-content/uploads/2026/09/coyote_vs_acme-208646783-large.jpg" />
                {" "}
                <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4 gap-2">
                  <button className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-2.5 rounded-lg font-bold transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirDetallePelicula('coyote-acme','cartelera'); }}>
                    <i className="fa-solid fa-ticket"></i>
                    {" "}
                    Ver funciones
                  </button>
                  {" "}
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2.5 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirModalTrailer('coyote-acme'); }}>
                    <i className="fa-solid fa-play"></i>
                    {" "}
                    Tráiler
                  </button>
                </div>
              </div>
              <div className="flex-grow flex flex-col">
                <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-blue transition-colors">
                  Coyote vs. Acme
                </h3>
                <p className="text-slate-400 text-sm mb-1">
                  Animación / Comedia • 1h 44m
                </p>
                <p className="text-[11px] text-slate-500">
                  <i className="fa-solid fa-location-dot text-brand-blue mr-1"></i>
                  <span className="js-n-sedes">
                    6
                  </span>
                  {" "}
                  sedes con funciones
                </p>
              </div>
            </article>
            <article className="movie-card group cursor-pointer flex flex-col h-full relative" data-peli="sombra-exorcista" data-sf="s1:d0 s1:d1 s1:d3 s1:d4 s1:d5 s1:d6 s4:d0 s4:d1 s4:d2 s4:d3 s4:d4 s4:d5 s5:d0 s5:d1 s5:d2 s5:d3 s5:d4 s5:d6 s6:d0 s6:d1 s6:d2 s6:d3 s6:d5 s6:d6 s8:d0 s8:d1 s8:d3 s8:d4 s8:d5 s8:d6" onClick={(event) => { abrirDetallePelicula('sombra-exorcista','cartelera'); }}>
              <div className="absolute top-2 left-2 z-20 bg-red-600/90 border-red-500/30 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border">
                +18
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                <img alt="La Sombra del Exorcista" className="w-full h-full object-cover" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3N9ZGThaHM_sos4OLN-UW49t7VflG9c2u_7NMVBvH9PELM1VxGtRGNFY&s=10"} />
                {" "}
                <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4 gap-2">
                  <button className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-2.5 rounded-lg font-bold transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirDetallePelicula('sombra-exorcista','cartelera'); }}>
                    <i className="fa-solid fa-ticket"></i>
                    {" "}
                    Ver funciones
                  </button>
                  {" "}
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2.5 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirModalTrailer('sombra-exorcista'); }}>
                    <i className="fa-solid fa-play"></i>
                    {" "}
                    Tráiler
                  </button>
                </div>
              </div>
              <div className="flex-grow flex flex-col">
                <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-blue transition-colors">
                  La Sombra del Exorcista
                </h3>
                <p className="text-slate-400 text-sm mb-1">
                  Terror / Sobrenatural • 1h 27m
                </p>
                <p className="text-[11px] text-slate-500">
                  <i className="fa-solid fa-location-dot text-brand-blue mr-1"></i>
                  <span className="js-n-sedes">
                    5
                  </span>
                  {" "}
                  sedes con funciones
                </p>
              </div>
            </article>
            <article className="movie-card group cursor-pointer flex flex-col h-full relative" data-peli="demonio" data-sf="s1:d0 s1:d5 s1:d6 s2:d1 s2:d5 s2:d6 s3:d0 s3:d1 s3:d5 s5:d0 s5:d1 s5:d5 s5:d6 s7:d0 s7:d1 s7:d5 s7:d6" onClick={(event) => { abrirDetallePelicula('demonio','cartelera'); }}>
              <div className="absolute top-2 left-2 z-20 bg-red-600/90 border-red-500/30 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border">
                +14
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                <img alt="La Noche del Demonio" className="w-full h-full object-cover" src="https://i.pinimg.com/474x/4d/b9/98/4db998ba858a2680820def663582223e.jpg" />
                {" "}
                <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4 gap-2">
                  <button className="w-full bg-brand-blue hover:bg-brand-dark-blue text-white py-2.5 rounded-lg font-bold transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirDetallePelicula('demonio','cartelera'); }}>
                    <i className="fa-solid fa-ticket"></i>
                    {" "}
                    Ver funciones
                  </button>
                  {" "}
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2.5 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirModalTrailer('demonio'); }}>
                    <i className="fa-solid fa-play"></i>
                    {" "}
                    Tráiler
                  </button>
                </div>
              </div>
              <div className="flex-grow flex flex-col">
                <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-blue transition-colors">
                  La Noche del Demonio
                </h3>
                <p className="text-slate-400 text-sm mb-1">
                  Terror / Suspenso • 1h 46m
                </p>
                <p className="text-[11px] text-slate-500">
                  <i className="fa-solid fa-location-dot text-brand-blue mr-1"></i>
                  <span className="js-n-sedes">
                    5
                  </span>
                  {" "}
                  sedes con funciones
                </p>
              </div>
            </article>
          </div>
          <div className="hidden text-center py-16 bg-dark-800/60 border border-dashed border-white/10 rounded-3xl mb-20" id="cartelera-vacia">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center mb-4">
              <i className="fa-solid fa-film text-2xl text-brand-blue"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No hay funciones con estos filtros
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-5">
              Prueba con otra fecha, otra sede o quita algún filtro. También puedes ver qué hay en las sedes cercanas.
            </p>
            {" "}
            <button className="bg-brand-blue hover:bg-brand-dark-blue text-white px-6 py-2.5 rounded-full font-bold text-sm" onClick={(event) => { limpiarFiltrosInicio(); }}>
              Limpiar filtros
            </button>
          </div>
          <div className="mt-12">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Próximos Estrenos
              </h2>
              <div className="h-1 w-20 bg-brand-yellow rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8" id="grid-estrenos">
              <article className="movie-card group cursor-pointer flex flex-col h-full relative" onClick={(event) => { abrirDetallePelicula('doomsday', 'estreno'); }}>
                <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                  <img alt="Avengers: Doomsday" className="w-full h-full object-cover grayscale-[30%]" src="https://m.media-amazon.com/images/M/MV5BNGEwYWZkN2UtOTQ5Mi00MGQzLWEzNjYtMWMyNDBkMTkzMWNkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" />
                  {" "}
                  <div className="absolute top-2 right-2 bg-brand-yellow text-black font-bold text-xs px-2 py-1 rounded shadow-md z-20">
                    PRONTO
                  </div>
                  <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4">
                    <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirModalTrailer('doomsday'); }}>
                      <i className="fa-solid fa-play"></i>
                      {" "}
                      Ver Tráiler
                    </button>
                  </div>
                </div>
                <div className="flex-grow flex flex-col">
                  <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-yellow transition-colors">
                    Avengers: Doomsday
                  </h3>
                  <p className="text-slate-400 text-sm mb-2">
                    Acción / Superhéroes
                  </p>
                </div>
              </article>
              <article className="movie-card group cursor-pointer flex flex-col h-full relative" onClick={(event) => { abrirDetallePelicula('godzilla-minus-one', 'estreno'); }}>
                <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                  <img alt="Godzilla Minus One" className="w-full h-full object-cover grayscale-[30%]" src="https://metalcorrosivo.com/wp-content/uploads/2026/09/1790563661955.jpg" />
                  {" "}
                  <div className="absolute top-2 right-2 bg-brand-yellow text-black font-bold text-xs px-2 py-1 rounded shadow-md z-20">
                    PRONTO
                  </div>
                  <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4">
                    <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirModalTrailer('godzilla-minus-one'); }}>
                      <i className="fa-solid fa-play"></i>
                      {" "}
                      Ver Tráiler
                    </button>
                  </div>
                </div>
                <div className="flex-grow flex flex-col">
                  <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-yellow transition-colors">
                    Godzilla Minus One
                  </h3>
                  <p className="text-slate-400 text-sm mb-2">
                    Ciencia Ficción / Kaiju
                  </p>
                </div>
              </article>
              <article className="movie-card group cursor-pointer flex flex-col h-full relative" onClick={(event) => { abrirDetallePelicula('street-fighter', 'estreno'); }}>
                <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                  <img alt="Street Fighter" className="w-full h-full object-cover grayscale-[30%]" src="https://m.media-amazon.com/images/M/MV5BYjhlN2EyNGUtY2U4YS00ZTQ3LTg0NTgtNGIxZmVhMDlmMjIyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" />
                  {" "}
                  <div className="absolute top-2 right-2 bg-brand-yellow text-black font-bold text-xs px-2 py-1 rounded shadow-md z-20">
                    PRONTO
                  </div>
                  <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4">
                    <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirModalTrailer('street-fighter'); }}>
                      <i className="fa-solid fa-play"></i>
                      {" "}
                      Ver Tráiler
                    </button>
                  </div>
                </div>
                <div className="flex-grow flex flex-col">
                  <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-yellow transition-colors">
                    Street Fighter
                  </h3>
                  <p className="text-slate-400 text-sm mb-2">
                    Acción / Aventura
                  </p>
                </div>
              </article>
              <article className="movie-card group cursor-pointer flex flex-col h-full relative" onClick={(event) => { abrirDetallePelicula('juegos-hambre-cosecha', 'estreno'); }}>
                <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-4 bg-dark-800 shadow-xl shadow-black/50">
                  <img alt="Los Juegos del Hambre: Amanecer en la Cosecha" className="w-full h-full object-cover grayscale-[30%]" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-uPV6Sz1kBFP1ECzxe3cyNSfC5lxngoH4H19DkQZ_9jJkiGKxPqeeHxM&s=10"} />
                  {" "}
                  <div className="absolute top-2 right-2 bg-brand-yellow text-black font-bold text-xs px-2 py-1 rounded shadow-md z-20">
                    PRONTO
                  </div>
                  <div className="movie-overlay absolute inset-0 flex flex-col justify-end p-4">
                    <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 rounded-lg font-bold border border-white/30 transition-colors shadow-lg flex items-center justify-center gap-2" onClick={(event) => { event.stopPropagation(); abrirModalTrailer('juegos-hambre-cosecha'); }}>
                      <i className="fa-solid fa-play"></i>
                      {" "}
                      Ver Tráiler
                    </button>
                  </div>
                </div>
                <div className="flex-grow flex flex-col">
                  <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight group-hover:text-brand-yellow transition-colors">
                    Los Juegos del Hambre: Amanecer en la Cosecha
                  </h3>
                  <p className="text-slate-400 text-sm mb-2">
                    Acción / Ciencia Ficción
                  </p>
                </div>
              </article>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
