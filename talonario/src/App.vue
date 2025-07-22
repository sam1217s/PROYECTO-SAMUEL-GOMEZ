<template>
  <div id="app" class="container-fluid p-4">
    <!-- Header -->
    <div class="header-gradient text-white p-5 rounded-4 mb-5 shadow-lg">
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <h1 class="h1 mb-0 fw-bold">
          <i class="bi bi-ticket-perforated me-3"></i>Sistema de Rifas
        </h1>
        <div class="stats-badges">
          <span class="badge badge-custom me-3 fs-6">
            <i class="bi bi-collection me-1"></i>Rifas: {{ rifas.length }}
          </span>
          <span v-if="rifaActual" class="badge badge-custom fs-6">
            <i class="bi bi-check-circle me-1"></i>Vendidas: {{ contarPorEstado('vendido') }}/{{ rifaActual.cantidadBoletas }}
          </span>
        </div>
      </div>
    </div>

    <!-- Vista Lista -->
    <div v-if="!rifaActual">
      <div class="text-center mb-5">
        <button @click="showFormRifa = !showFormRifa" class="btn btn-lg btn-modern shadow-sm"
          :class="showFormRifa ? 'btn-danger' : 'btn-success'">
          <i class="bi me-2" :class="showFormRifa ? 'bi-x-circle' : 'bi-plus-circle'"></i>
          {{ showFormRifa ? 'Cancelar' : 'Nueva Rifa' }}
        </button>
      </div>

      <!-- Formulario -->
      <div v-if="showFormRifa" class="card card-modern mb-5 shadow-lg">
        <div class="card-body p-4">
          <h4 class="card-title mb-4 text-primary fw-bold">
            <i class="bi bi-gear me-2"></i>Configurar Nueva Rifa
          </h4>
          <form @submit.prevent="crearRifa" class="row g-4">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Premio</label>
              <input v-model="formRifa.premio" class="form-control form-control-modern" placeholder="Ej: iPhone 15 Pro" required>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold">Valor Boleta</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input v-model.number="formRifa.valorBoleta" type="number" class="form-control form-control-modern" step="0.01" placeholder="0.00" required>
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Lotería</label>
              <select v-model="formRifa.loteria" class="form-select form-control-modern" required>
                <option value="">Seleccione...</option>
                <option v-for="lot in loterias" :key="lot">{{ lot }}</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Cantidad de Cifras</label>
              <select v-model.number="formRifa.cantidadBoletas" class="form-select form-control-modern" required>
                <option value="">Seleccione...</option>
                <option :value="100">2 cifras (00-99)</option>
                <option :value="1000">3 cifras (000-999)</option>
                <option :value="10000">4 cifras (0000-9999)</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Fecha Sorteo</label>
              <input v-model="formRifa.fechaSorteo" type="date" class="form-control form-control-modern" required>
            </div>
            <div class="col-12 text-center mt-4">
              <button type="submit" class="btn btn-success btn-lg btn-modern shadow">
                <i class="bi bi-check-circle me-2"></i>Crear Rifa
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista Rifas -->
      <div class="row g-4">
        <div v-for="rifa in rifas" :key="rifa.id" class="col-md-6 col-xl-4">
          <div class="card card-modern h-100 shadow-hover" role="button" @click="rifaActual = rifa">
            <div class="card-header header-gradient text-white border-0">
              <h5 class="mb-1 fw-bold">{{ rifa.premio }}</h5>
              <small class="opacity-90">
                <i class="bi bi-calendar-event me-1"></i>{{ rifa.fechaSorteo }}
              </small>
            </div>
            <div class="card-body p-4">
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <div class="info-item">
                    <small class="text-muted">Valor</small>
                    <p class="mb-0 fw-bold text-success">${{ formatearMonto(rifa.valorBoleta) }}</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="info-item">
                    <small class="text-muted">Lotería</small>
                    <p class="mb-0 fw-bold">{{ rifa.loteria }}</p>
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="fw-semibold">Vendidas</span>
                  <span class="badge bg-primary">{{ contarBoletasVendidas(rifa) }}/{{ rifa.cantidadBoletas }}</span>
                </div>
                <div class="progress progress-modern">
                  <div class="progress-bar bg-gradient-success"
                    :style="{ width: (contarBoletasVendidas(rifa) / rifa.cantidadBoletas * 100) + '%' }">
                  </div>
                </div>
              </div>
              
              <div class="recaudado-box">
                <i class="bi bi-cash-stack me-2"></i>
                <span class="fw-bold">Recaudado: ${{ formatearMonto(contarBoletasVendidas(rifa) * rifa.valorBoleta) }}</span>
              </div>
            </div>
            <div class="card-footer bg-transparent border-0 d-flex gap-2 p-3">
              <button class="btn btn-outline-primary btn-sm flex-fill">
                <i class="bi bi-eye me-1"></i> Ver
              </button>
              <button @click.stop="eliminarRifa(rifa.id)" class="btn btn-outline-danger btn-sm">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista Detalle -->
    <div v-else>
      <div class="card card-modern mb-4 shadow-lg">
        <div class="card-body p-4">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h2 class="mb-4 text-primary fw-bold">
                <i class="bi bi-trophy me-2"></i>{{ rifaActual.premio }}
              </h2>
              <div class="row g-4">
                <div class="col-6 col-lg-3">
                  <div class="info-card text-center">
                    <i class="bi bi-currency-dollar text-success mb-2"></i>
                    <small class="text-muted d-block">Valor Boleta</small>
                    <p class="mb-0 fw-bold fs-5">${{ formatearMonto(rifaActual.valorBoleta) }}</p>
                  </div>
                </div>
                <div class="col-6 col-lg-3">
                  <div class="info-card text-center">
                    <i class="bi bi-ticket-detailed text-primary mb-2"></i>
                    <small class="text-muted d-block">Lotería</small>
                    <p class="mb-0 fw-bold">{{ rifaActual.loteria }}</p>
                  </div>
                </div>
                <div class="col-6 col-lg-3">
                  <div class="info-card text-center">
                    <i class="bi bi-calendar-check text-warning mb-2"></i>
                    <small class="text-muted d-block">Sorteo</small>
                    <p class="mb-0 fw-bold">{{ rifaActual.fechaSorteo }}</p>
                  </div>
                </div>
                <div class="col-6 col-lg-3">
                  <div class="info-card text-center">
                    <i class="bi bi-check-circle text-success mb-2"></i>
                    <small class="text-muted d-block">Vendidas</small>
                    <p class="mb-0 fw-bold">{{ contarPorEstado('vendido') }}/{{ rifaActual.cantidadBoletas }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4 text-md-end mt-4 mt-md-0">
              <div class="btn-group-vertical w-100 gap-2">
                <button @click="rifaActual = null" class="btn btn-secondary btn-modern">
                  <i class="bi bi-arrow-left me-2"></i>Volver
                </button>
                <button @click="editarRifaActual" class="btn btn-warning btn-modern">
                  <i class="bi bi-pencil me-2"></i>Editar
                </button>
                <button @click="mostrarListado = true" class="btn btn-info btn-modern">
                  <i class="bi bi-list-ul me-2"></i>Listado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Boletas -->
      <div class="card card-modern shadow-lg">
        <div class="card-body p-4">
          <h4 class="card-title mb-4 text-primary fw-bold">
            <i class="bi bi-grid-3x3-gap me-2"></i>Seleccionar Número - Rifa
          </h4>
          
          <!-- Grid de Boletas Dividida -->
          <div class="boletas-container mb-4">
            <div class="boletas-section">
              <h6 class="section-title">Números 00-49</h6>
              <div class="boletas-grid-half">
                <div v-for="n in Math.ceil(rifaActual.cantidadBoletas / 2)" :key="n - 1" 
                     class="boleta rounded-3 position-relative shadow-sm"
                     :class="{
                       'boleta-disponible': getEstadoBoleta(n - 1) === 'disponible',
                       'boleta-apartado': getEstadoBoleta(n - 1) === 'apartado',
                       'boleta-vendida': getEstadoBoleta(n - 1) === 'vendido'
                     }" 
                     @click="abrirModalBoleta(n - 1)" 
                     :title="getTooltipBoleta(n - 1)">
                  {{ formatearNumero(n - 1) }}
                  <i v-if="rifaActual.boletas?.[n - 1]?.nombre" 
                     class="bi bi-person-fill position-absolute top-0 end-0 text-white"
                     style="font-size: 0.7rem; margin: 2px;"></i>
                </div>
              </div>
            </div>
            
            <div class="boletas-section">
              <h6 class="section-title">Números 50-99</h6>
              <div class="boletas-grid-half">
                <div v-for="n in Math.floor(rifaActual.cantidadBoletas / 2)" :key="n + Math.ceil(rifaActual.cantidadBoletas / 2) - 1" 
                     class="boleta rounded-3 position-relative shadow-sm"
                     :class="{
                       'boleta-disponible': getEstadoBoleta(n + Math.ceil(rifaActual.cantidadBoletas / 2) - 1) === 'disponible',
                       'boleta-apartado': getEstadoBoleta(n + Math.ceil(rifaActual.cantidadBoletas / 2) - 1) === 'apartado',
                       'boleta-vendida': getEstadoBoleta(n + Math.ceil(rifaActual.cantidadBoletas / 2) - 1) === 'vendido'
                     }" 
                     @click="abrirModalBoleta(n + Math.ceil(rifaActual.cantidadBoletas / 2) - 1)" 
                     :title="getTooltipBoleta(n + Math.ceil(rifaActual.cantidadBoletas / 2) - 1)">
                  {{ formatearNumero(n + Math.ceil(rifaActual.cantidadBoletas / 2) - 1) }}
                  <i v-if="rifaActual.boletas?.[n + Math.ceil(rifaActual.cantidadBoletas / 2) - 1]?.nombre" 
                     class="bi bi-person-fill position-absolute top-0 end-0 text-white"
                     style="font-size: 0.7rem; margin: 2px;"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen Mejorado -->
          <div class="row g-3">
            <div class="col-6 col-lg-3">
              <div class="stats-card stats-available">
                <div class="stats-icon">
                  <i class="bi bi-circle"></i>
                </div>
                <div class="stats-content">
                  <h4 class="mb-0">{{ contarPorEstado('disponible') }}</h4>
                  <small>Disponibles</small>
                </div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stats-card stats-reserved">
                <div class="stats-icon">
                  <i class="bi bi-clock"></i>
                </div>
                <div class="stats-content">
                  <h4 class="mb-0">{{ contarPorEstado('apartado') }}</h4>
                  <small>Apartadas</small>
                </div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stats-card stats-sold">
                <div class="stats-icon">
                  <i class="bi bi-check-circle"></i>
                </div>
                <div class="stats-content">
                  <h4 class="mb-0">{{ contarPorEstado('vendido') }}</h4>
                  <small>Vendidas</small>
                </div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stats-card stats-money">
                <div class="stats-icon">
                  <i class="bi bi-cash-stack"></i>
                </div>
                <div class="stats-content">
                  <h4 class="mb-0">${{ formatearMonto(calcularRecaudado()) }}</h4>
                  <small>Recaudado</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Boleta -->
    <div v-if="modalBoleta.mostrar" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-modern">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">
              <i class="bi me-2" :class="modalBoleta.editando ? 'bi-pencil-square' : 'bi-ticket'"></i>
              {{ modalBoleta.editando ? 'Editar' : 'Comprar' }} Boleta #{{ formatearNumero(modalBoleta.numero) }}
            </h5>
            <button @click="cerrarModalBoleta" class="btn-close"></button>
          </div>
          <form @submit.prevent="guardarDatosBoleta">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  <i class="bi bi-person me-1"></i>Nombre Completo
                </label>
                <input v-model="modalBoleta.datos.nombre" class="form-control form-control-modern" placeholder="Ingrese el nombre completo" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  <i class="bi bi-geo-alt me-1"></i>Dirección
                </label>
                <input v-model="modalBoleta.datos.direccion" class="form-control form-control-modern" placeholder="Ingrese la dirección" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  <i class="bi bi-telephone me-1"></i>Teléfono
                </label>
                <input v-model="modalBoleta.datos.telefono" class="form-control form-control-modern" minlength="10" maxlength="10" placeholder="ejemplo: 3001234567" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  <i class="bi bi-flag me-1"></i>Estado
                </label>
                <select v-model="modalBoleta.datos.estado" class="form-select form-control-modern" required>
                  <option value="disponible" disabled>Selecciona estado de la rifa</option>
                  <option value="vendido">Vendido</option>
                  <option value="apartado">Apartado</option>
                  <option value="disponible">Disponible</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" @click="cerrarModalBoleta" class="btn btn-outline-secondary btn-modern">
                Cancelar
              </button>
              <button v-if="modalBoleta.editando" @click="eliminarDatosBoleta" type="button" class="btn btn-outline-danger btn-modern">
                <i class="bi bi-trash me-1"></i>Eliminar
              </button>
              <button type="submit" class="btn btn-primary btn-modern">
                <i class="bi bi-save me-1"></i>{{ modalBoleta.editando ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Listado -->
    <div v-if="mostrarListado" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content modal-modern">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-list-ul me-2"></i>Listado de Boletas - {{ rifaActual?.premio }}
            </h5>
            <button @click="mostrarListado = false" class="btn-close"></button>
          </div>
          <div class="modal-body">
            <div class="table-responsive">
              <table class="table table-hover table-modern">
                <thead>
                  <tr>
                    <th><i class="bi bi-hash me-1"></i>N°</th>
                    <th><i class="bi bi-person me-1"></i>Nombre</th>
                    <th><i class="bi bi-geo-alt me-1"></i>Dirección</th>
                    <th><i class="bi bi-telephone me-1"></i>Teléfono</th>
                    <th><i class="bi bi-calendar me-1"></i>Fecha</th>
                    <th><i class="bi bi-flag me-1"></i>Estado</th>
                    <th><i class="bi bi-tools me-1"></i>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="boleta in boletasConDatos" :key="boleta.numero">
                    <td class="fw-bold">{{ formatearNumero(boleta.numero) }}</td>
                    <td>{{ boleta.datos.nombre || '-' }}</td>
                    <td>{{ boleta.datos.direccion || '-' }}</td>
                    <td>{{ boleta.datos.telefono || '-' }}</td>
                    <td>{{ formatearFecha(boleta.datos.fechaCompra) }}</td>
                    <td>
                      <span class="badge badge-modern" :class="{
                        'bg-primary': boleta.datos.estado === 'disponible',
                        'bg-warning': boleta.datos.estado === 'apartado',
                        'bg-success': boleta.datos.estado === 'vendido'
                      }">{{ boleta.datos.estado }}</span>
                    </td>
                    <td>
                      <button @click="editarBoletaDesdeListado(boleta.numero)" class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="row mt-4 g-3">
              <div class="col-md-6">
                <div class="alert alert-success border-0 shadow-sm">
                  <i class="bi bi-cash-stack me-2"></i>
                  <strong>Recaudado:</strong> ${{ formatearMonto(calcularRecaudado()) }}
                </div>
              </div>
              <div class="col-md-6">
                <div class="alert alert-warning border-0 shadow-sm">
                  <i class="bi bi-clock me-2"></i>
                  <strong>Deuda:</strong> ${{ formatearMonto(calcularDeuda()) }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button @click="descargarPDF" class="btn btn-primary btn-modern">
              <i class="bi bi-download me-2"></i>Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Rifa -->
    <div v-if="modalEditarRifa" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-modern">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-pencil-square me-2"></i>Editar Rifa
            </h5>
            <button @click="modalEditarRifa = false" class="btn-close"></button>
          </div>
          <form @submit.prevent="actualizarRifa">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-semibold">Premio</label>
                <input v-model="formEditarRifa.premio" class="form-control form-control-modern" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Valor Boleta</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input v-model.number="formEditarRifa.valorBoleta" type="number" class="form-control form-control-modern" step="0.01" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Lotería</label>
                <select v-model="formEditarRifa.loteria" class="form-select form-control-modern" required>
                  <option v-for="lot in loterias" :key="lot">{{ lot }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Fecha Sorteo</label>
                <input v-model="formEditarRifa.fechaSorteo" type="date" class="form-control form-control-modern" required>
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" @click="modalEditarRifa = false" class="btn btn-outline-secondary btn-modern">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary btn-modern">
                <i class="bi bi-save me-2"></i>Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Estados
const rifas = ref([])
const rifaActual = ref(null)
const showFormRifa = ref(false)
const mostrarListado = ref(false)
const modalEditarRifa = ref(false)
const formRifa = ref({
  premio: '', valorBoleta: '', loteria: '', cantidadBoletas: '', fechaSorteo: ''
})
const formEditarRifa = ref({
  premio: '', valorBoleta: '', loteria: '', fechaSorteo: ''
})
const modalBoleta = ref({
  mostrar: false, numero: 0, editando: false,
  datos: { nombre: '', direccion: '', telefono: '', estado: 'disponible' }
})

const loterias = ['Cruz Roja', 'Lotería de Bogotá', 'Lotería del Tolima',
  'Lotería de Cundinamarca', 'Lotería del Huila', 'Baloto']

// Lifecycle
onMounted(() => {
  const guardadas = localStorage.getItem('rifas-v2')
  if (guardadas) rifas.value = JSON.parse(guardadas)
})

// Watchers
watch(rifas, (val) => localStorage.setItem('rifas-v2', JSON.stringify(val)), { deep: true })

// Computed
const boletasConDatos = computed(() => {
  if (!rifaActual.value?.boletas) return []
  return Object.entries(rifaActual.value.boletas)
    .map(([num, datos]) => ({ numero: parseInt(num), datos }))
    .filter(b => b.datos.estado !== 'disponible')
    .sort((a, b) => a.numero - b.numero)
})

// Métodos
const crearRifa = () => {
  rifas.value.push({
    id: Date.now(),
    ...formRifa.value,
    valorBoleta: parseFloat(formRifa.value.valorBoleta),
    cantidadBoletas: parseInt(formRifa.value.cantidadBoletas),
    boletas: {}
  })
  Object.keys(formRifa.value).forEach(k => formRifa.value[k] = '')
  showFormRifa.value = false
}

const editarRifaActual = () => {
  formEditarRifa.value = {
    premio: rifaActual.value.premio,
    valorBoleta: rifaActual.value.valorBoleta,
    loteria: rifaActual.value.loteria,
    fechaSorteo: rifaActual.value.fechaSorteo
  }
  modalEditarRifa.value = true
}

const actualizarRifa = () => {
  const rifa = rifas.value.find(r => r.id === rifaActual.value.id)
  if (rifa) {
    Object.assign(rifa, {
      ...formEditarRifa.value,
      valorBoleta: parseFloat(formEditarRifa.value.valorBoleta)
    })
    rifaActual.value = rifa
  }
  modalEditarRifa.value = false
}

const eliminarRifa = (id) => {
  if (confirm('¿Eliminar esta rifa?')) {
    rifas.value = rifas.value.filter(r => r.id !== id)
  }
}

const getEstadoBoleta = (num) => rifaActual.value?.boletas?.[num]?.estado || 'disponible'

const abrirModalBoleta = (num) => {
  const datos = rifaActual.value.boletas?.[num]
  modalBoleta.value = {
    mostrar: true,
    numero: num,
    editando: !!datos,
    datos: datos ? { ...datos } : { nombre: '', direccion: '', telefono: '', estado: 'disponible' }
  }
}

const cerrarModalBoleta = () => {
  modalBoleta.value.mostrar = false
}

const guardarDatosBoleta = () => {
  if (!rifaActual.value.boletas) rifaActual.value.boletas = {}
  rifaActual.value.boletas[modalBoleta.value.numero] = {
    ...modalBoleta.value.datos,
    fechaCompra: new Date()
  }
  cerrarModalBoleta()
}

const eliminarDatosBoleta = () => {
  if (confirm('¿Eliminar datos?')) {
    delete rifaActual.value.boletas[modalBoleta.value.numero]
    cerrarModalBoleta()
  }
}

const editarBoletaDesdeListado = (num) => {
  mostrarListado.value = false
  setTimeout(() => abrirModalBoleta(num), 300)
}

const getTooltipBoleta = (num) => {
  const boleta = rifaActual.value?.boletas?.[num]
  if (!boleta) return 'Click para registrar'
  return `${boleta.nombre || 'Sin nombre'} - ${boleta.estado}`
}

const contarPorEstado = (estado) => {
  if (!rifaActual.value?.boletas) {
    return estado === 'disponible' ? rifaActual.value?.cantidadBoletas || 0 : 0
  }
  
  if (estado === 'disponible') {
    const totalBoletas = rifaActual.value.cantidadBoletas
    const boletasOcupadas = Object.keys(rifaActual.value.boletas).length
    return totalBoletas - boletasOcupadas
  }
  
  return Object.values(rifaActual.value.boletas).filter(b => b.estado === estado).length
}

const contarBoletasVendidas = (rifa) => {
  if (!rifa.boletas) return 0
  return Object.values(rifa.boletas).filter(b => b.estado === 'vendido').length
}

const calcularRecaudado = () => contarPorEstado('vendido') * (rifaActual.value?.valorBoleta || 0)
const calcularDeuda = () => contarPorEstado('apartado') * (rifaActual.value?.valorBoleta || 0)

const formatearNumero = (num) => {
  if (!rifaActual.value) return num
  const cantBoletas = rifaActual.value.cantidadBoletas
  const digitos = cantBoletas === 10000 ? 4 : cantBoletas === 1000 ? 3 : 2
  return num.toString().padStart(digitos, '0')
}

const formatearFecha = (fecha) => fecha ? new Date(fecha).toLocaleDateString('es-ES') : '-'
const formatearMonto = (monto) => new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(monto || 0)

// Descargar PDF
const descargarPDF = () => {
  // Verificar si jsPDF está disponible
  if (typeof window.jspdf === 'undefined') {
    alert('Por favor, incluye jsPDF en tu index.html')
    return
  }

  const { jsPDF } = window.jspdf
  const doc = new jsPDF()

  // Título
  doc.setFontSize(20)
  doc.text('LISTADO DE BOLETAS', 105, 20, { align: 'center' })
  doc.setFontSize(16)
  doc.text(rifaActual.value.premio, 105, 30, { align: 'center' })

  // Información de la rifa
  doc.setFontSize(12)
  doc.text(`Lotería: ${rifaActual.value.loteria}`, 20, 45)
  doc.text(`Fecha Sorteo: ${rifaActual.value.fechaSorteo}`, 20, 52)
  doc.text(`Valor Boleta: ${formatearMonto(rifaActual.value.valorBoleta)}`, 20, 59)
  doc.text(`Total Boletas: ${rifaActual.value.cantidadBoletas}`, 20, 66)

  // Tabla de boletas
  const headers = [['N° Boleta', 'Nombre', 'Dirección', 'Teléfono', 'Fecha', 'Estado']]
  const data = boletasConDatos.value.map(b => [
    formatearNumero(b.numero),
    b.datos.nombre || '-',
    b.datos.direccion || '-',
    b.datos.telefono || '-',
    formatearFecha(b.datos.fechaCompra),
    b.datos.estado
  ])

  doc.autoTable({
    head: headers,
    body: data,
    startY: 75,
    headStyles: { fillColor: [13, 110, 253] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })

  // Resumen
  const finalY = doc.lastAutoTable.finalY + 10
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text(`Total Recaudado: ${formatearMonto(calcularRecaudado())}`, 20, finalY)
  doc.text(`Total Deuda: ${formatearMonto(calcularDeuda())}`, 20, finalY + 7)
  doc.text(`Total Disponibles: ${contarPorEstado('disponible')}`, 20, finalY + 14)

  // Descargar
  doc.save(`boletas_${rifaActual.value.premio.replace(/\s/g, '_')}.pdf`)
}
</script>

<style>
/* Variables CSS para el tema */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --warning-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --danger-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  --card-shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
  --border-radius: 12px;
}

/* Header con gradiente */
.header-gradient {
  background: var(--primary-gradient);
  border: none;
}

.badge-custom {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

/* Cards modernos */
.card-modern {
  border: none;
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
  overflow: hidden;
}

.shadow-hover:hover {
  transform: translateY(-5px);
  box-shadow: var(--card-shadow-hover);
}

/* Botones modernos */
.btn-modern {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
}

.btn-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Formularios modernos */
.form-control-modern {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.form-control-modern:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Info cards */
.info-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.info-card {
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: var(--border-radius);
  border: 1px solid #e9ecef;
}

.info-card i {
  font-size: 1.5rem;
}

/* Recaudado box */
.recaudado-box {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
  margin-top: 10px;
}

/* Contenedor de boletas dividido */
.boletas-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: var(--border-radius);
  border: 2px solid #e9ecef;
}

.boletas-section {
  background: white;
  border-radius: var(--border-radius);
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.section-title {
  text-align: center;
  margin-bottom: 15px;
  font-weight: bold;
  color: #495057;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
}

.boletas-grid-half {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

/* Boletas mejoradas */
.boleta {
  cursor: pointer;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  user-select: none;
  position: relative;
  border: 2px solid transparent;
}

.boleta:hover {
  transform: scale(1.1);
  z-index: 10;
}

.boleta-disponible {
  background: linear-gradient(135deg, #0d6efd 0%, #0056b3 100%);
  color: white;
}

.boleta-apartado {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: #212529;
}

.boleta-vendida {
  background: linear-gradient(135deg, #198754 0%, #146c43 100%);
  color: white;
}

.boleta:hover {
  border-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Stats cards mejoradas */
.stats-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 20px;
  text-align: center;
  box-shadow: var(--card-shadow);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--card-shadow-hover);
}

.stats-available {
  border-left: 4px solid #0d6efd;
}

.stats-reserved {
  border-left: 4px solid #ffc107;
}

.stats-sold {
  border-left: 4px solid #198754;
}

.stats-money {
  border-left: 4px solid #20c997;
}

.stats-icon {
  font-size: 2rem;
  margin-bottom: 10px;
  opacity: 0.7;
}

.stats-available .stats-icon {
  color: #0d6efd;
}

.stats-reserved .stats-icon {
  color: #ffc107;
}

.stats-sold .stats-icon {
  color: #198754;
}

.stats-money .stats-icon {
  color: #20c997;
}

.stats-content h4 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5px;
}

/* Modal moderno */
.modal-modern .modal-content {
  border: none;
  border-radius: var(--border-radius);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
}

/* Tabla moderna */
.table-modern {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.table-modern thead {
  background: var(--primary-gradient);
  color: white;
}

.table-modern tbody tr:hover {
  background-color: #f8f9fa;
}

.badge-modern {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
}

/* Progress bar moderna */
.progress-modern {
  height: 8px;
  border-radius: 10px;
  background: #e9ecef;
}

.progress-modern .progress-bar {
  border-radius: 10px;
}

.bg-gradient-success {
  background: var(--success-gradient) !important;
}

/* Responsivo */
@media (max-width: 768px) {
  .boletas-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .boletas-grid-half {
    grid-template-columns: repeat(5, 1fr);
  }
  
  .boleta {
    font-size: 0.7rem;
  }
  
  .stats-card {
    padding: 15px;
  }
}

@media (max-width: 576px) {
  .boletas-grid-half {
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
  }
  
  .header-gradient {
    padding: 20px !important;
  }
  
  .badge-custom {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>