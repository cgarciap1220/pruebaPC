//var ATHM_Checkout;

Vue.component('modal', { //modal
	template: `
      <transition
      			mode="out-in"
				appear	
                enter-active-class="animated rollIn"
    			leave-active-class="animated rollOut">
    <div class="modal is-active" id="modal" >
  <div class="modal-card border border border-secondary">
    <div class="modal-card-head text-center">
    <div class="modal-card-title text-white">
          <slot name="head"></slot>
    </div>
<button class="delete" @click="$emit('close')"></button>
    </div>
    <div class="modal-card-body">
         <slot name="body"></slot>
    </div>
    <div class="modal-card-foot text-center" >
      <slot name="foot" class="" ></slot>
    </div>
  </div>
</div>
</transition>
    `
});

Vue.use(VueStripeCheckout, 'pk_live_dLO1WACA0sQJDy8OQRCfEM0r');
//Vue.use(VueStripeCheckout, 'pk_test_EK29oR97qNTa0MTg972EYobq00T3tAL2aD');
const reportes = new Vue({
	el: '#formReportes',
	data: {
		url: dir,
		addModal: false,
		addVisto: false,
		editModal: false,
		deleteModal: false,
		detallesModal: false,
		detallesComercioModal: false,
		dialog: false,
		reportes: [],
		rep: '',
		perdidoReportes: [],
		search: '',
		emptyResult: false,
		dialog_dest: false,
		dialogTipoReporte: false,
		dialog_don: donar,
		dialogCargandoImagen: false,
		dialog_destacar: false,
		contactar: false,
		dialogATH: false,
		ath: false,

		//search: { text: '' },
		email: '',
		contactarDuenno: {
			lugar: '',
			descripcion: '',
			fechaEncontrado: '',
			telefonoContacto: '',
			correoContacto: ''
		},
		nuevoReporte: {
			nombreMascota: '',
			caractEsp: '',
			foto: '',
			sexo: '',
			tipoMascota: 1,
			fechaReporte: fecha,
			fechaEvento: fecha,
			direccion: '',
			permitirContacto: 1,
			telContacto: '',
			emailContacto: '',
			tipoReporte: 0,
			estadoReporte: 1,
			recompensa: '',
			cantRecompensa: '',
			latitud: '',
			longitud: '',
			ciudad: ''
		},
		genero: [
			{
				opcion: 'Hembra',
				value: 1
			},
			{
				opcion: 'Macho',
				value: 2
			}
		],
		chooseReporte: {},
		chooseComercio: {},
		formValidate: [],
		successMSG: '',
		tipoMascotas: [],
		ciudades: [],
		comercios: [],
		nuevaFoto: false,
		ciudad: '',
		fecha: '',
		//pagination
		rowsPerPageItems: [20, 50, 100, {"text": "$vuetify.dataIterator.rowsPerPageAll", "value": -1}],
		pagination: {
			rowsPerPage: 15
		},
		rowsPerPageItemsCom: [20, 50, 100, {"text": "$vuetify.dataIterator.rowsPerPageAll", "value": -1}],
		paginationCom: {
			rowsPerPage: 5
		},
		notificaciones: [],
		detallesNontificacion: [],
		nuevaNotificacion: {
			fecha: fecha,
			lugar: '',
			descripcion: '',
			latitud: '',
			longitud: '',
			mascota: '',
		},
		chooseNotificacion: {},
		planes: [],
		//ATHM_Checkout: ATHM_Checkout,
		image: dir + 'assets/img/favicon-96x96.png',
		name: '',
		description: '',
		currency: 'usd',
		amount: 1,
		total: 1,
		rules: {
			required: value => !!value || 'Obligatorio.'
		},
		selected: '',
		rep: '',
		alerta: false,
		errorMSG: '',
		error: '',
		idLastRep: lastRep,
	},

	created() {
		this.mostrarDatosFuncion();
		this.obtenerPlanes();
		this.llenarEmail();
		this.mostrarComercios();

		//this.mostrarPerdidosUsuarios();
	},
	mounted() {


	},
	computed: {
		MostarComponentes() {
			var self = this;
			if (self.editModal == true) {
				document.getElementById("divCantRecompensa")
				if (event.target.value == 1) {
					$("#divCantRecompensa").css("display", "block");
				} else {
					$("#divCantRecompensa").css("display", "none");
				}
				return this.editModal
			}
			if (self.addModal == true) {
				this.llenarEmail();
				return this.addModal
			}
		},
	},
	methods: {
		llenarEmail() {
			self = this;
			axios.get(this.url + "Usuario_controller/obtenerCorreoUsuarioSesion").then(function (response) {
				if (response.data.email != null) {
					self.nuevoReporte.emailContacto = response.data.email;
				}
			});
		},
		mostrarPerdidos() {
			var self = this;
			self.obtenerCoord();
			self.getTipoMascota();
			self.getCiudades();
			axios.get(this.url + "Reportes_controller/obtenerPerdidos").then(function (response) {
				if (response.data.reportes == null) {
					self.noResult();
					self.reportes = [];
				} else {
					self.reportes = response.data.reportes;
					self.notificaciones = response.data.vistos;
					for (var i = 0; i < self.reportes.length; i++) {
						if (self.notificaciones != 0) {
							for (var j = 0; j < self.notificaciones.length; j++) {
								if (self.reportes[i].id_reporte == self.notificaciones[j].id_reporte) {
									self.reportes[i].visto = self.notificaciones[j].visto;
								}
								/*else {
									self.reportes[i].visto = 0;
								}*/
							}

						}
						if (self.reportes[i].sexo == 1) {
							self.reportes[i].sexo = 'Hembra';
						} else {
							self.reportes[i].sexo = 'Macho';
						}

					}

				}

			})
		},
		mostrarComercios() {
			var self = this;
			axios.get(this.url + "Comercio_controller/obtener_comercios_destacados").then(function (response) {
				if (response.data.comercios == null) {
					self.noResult();
					self.comercios = [];
				} else {
					self.comercios = response.data.comercios;
				}

			})
		},
		mostrarDatosFuncion() {
			//this.rep = 'perdido';
			if (reporte == 'perdido') {
				this.mostrarPerdidos();

			} else {
				this.mostrarPerdidosUsuarios();
			}

		},
		mostrarPerdidosUsuarios() {
			var self = this;
			self.obtenerCoord();
			self.getTipoMascota();
			self.getCiudades();
			axios.get(this.url + "Reportes_controller/obtenerPerdidosUsuario").then(function (response) {
				if (response.data.reportes == null) {
					self.noResult();
					self.reportes = [];
				} else {
					self.perdidoReportes = response.data.reportes;
					self.notificaciones = response.data.vistos;
					for (var i = 0; i < self.perdidoReportes.length; i++) {
						if (self.notificaciones != 0) {
							for (var j = 0; j < self.notificaciones.length; j++) {
								if (self.perdidoReportes[i].id_reporte == self.notificaciones[j].id_reporte) {
									self.perdidoReportes[i].visto = self.notificaciones[j].visto;
								}
								/*else {
									self.reportes[i].visto = 0;
								}*/

							}

						}
						if (self.perdidoReportes[i].sexo == 1) {
							self.perdidoReportes[i].sexo = 'Hembra';
						} else {
							self.perdidoReportes[i].sexo = 'Macho';
						}
					}

				}

			})
		},
		getCiudades() {
			var self = this;
			axios.get(this.url + "Referencias_controller/obtenerCiudades").then(function (response) {
				self.ciudades = response.data.ciudades;
				//self.addModal= true;
			});
		},
		getTipoMascota() {
			var self = this;
			axios.get(this.url + "Referencias_controller/obtenerTipoMascotas").then(function (response) {
				self.tipoMascotas = response.data.tipoMascotas;
				//self.addModal= true;
			});
		},
		buscarMascotaCiudad() {
			var self = this;
			var formData = new FormData();
			formData.append('ciudad', self.ciudad);
			//axios.post(self.url+"Reportes_controller/buscarMascotaCiudad", formData).then(function(response){
			axios.post(self.url + "Reportes_controller/buscarReporte", formData).then(function (response) {
				if (response.data.reportes == null) {
					self.mostrarPerdidos();
				} else {
					self.reportes = response.data.reportes;
					self.notificaciones = response.data.vistos;
					for (var i = 0; i < self.reportes.length; i++) {
						if (self.notificaciones != 0) {
							for (var j = 0; j < self.notificaciones.length; j++) {
								if (self.reportes[i].id_reporte == self.notificaciones[j].id_reporte) {
									self.reportes[i].visto = self.notificaciones[j].visto;
								}
								/*else {
									self.reportes[i].visto = 0;
								}*/
							}

						}
						if (self.reportes[i].sexo == 1) {
							self.reportes[i].sexo = 'Hembra';
						} else {
							self.reportes[i].sexo = 'Macho';
						}

					}

				}
			})
		},
		buscarMascota() {
			var self = this;
			var formData = new FormData();
			formData.append('search', self.search);
			//axios.post(self.url+"Reportes_controller/buscarMascota", formData).then(function(response){
			axios.post(self.url + "Reportes_controller/buscarReporte", formData).then(function (response) {
				if (response.data.reportes == null) {
					self.mostrarPerdidos();
				} else {
					self.reportes = response.data.reportes;
					self.notificaciones = response.data.vistos;
					for (var i = 0; i < self.reportes.length; i++) {
						if (self.notificaciones != 0) {
							for (var j = 0; j < self.notificaciones.length; j++) {
								if (self.reportes[i].id_reporte == self.notificaciones[j].id_reporte) {
									self.reportes[i].visto = self.notificaciones[j].visto;
								}
								/*else {
									self.reportes[i].visto = 0;
								}*/
							}

						}
						if (self.reportes[i].sexo == 1) {
							self.reportes[i].sexo = 'Hembra';
						} else {
							self.reportes[i].sexo = 'Macho';
						}

					}

				}
			})
		},
		buscarMascotaFecha() {
			var self = this;
			var formData = new FormData();
			formData.append('fecha', self.fecha);
			//axios.post(self.url+"Reportes_controller/buscarMascotaFecha", formData).then(function(response){
			axios.post(self.url + "Reportes_controller/buscarReporte", formData).then(function (response) {
				if (response.data.reportes == null) {
					self.mostrarPerdidos();
				} else {
					self.reportes = response.data.reportes;
					self.notificaciones = response.data.vistos;
					for (var i = 0; i < self.reportes.length; i++) {
						if (self.notificaciones != 0) {
							for (var j = 0; j < self.notificaciones.length; j++) {
								if (self.reportes[i].id_reporte == self.notificaciones[j].id_reporte) {
									self.reportes[i].visto = self.notificaciones[j].visto;
								}
								/*else {
									self.reportes[i].visto = 0;
								}*/
							}

						}
						if (self.reportes[i].sexo == 1) {
							self.reportes[i].sexo = 'Hembra';
						} else {
							self.reportes[i].sexo = 'Macho';
						}

					}

				}
			})
		},
		buscar() {
			var self = this;
			var formData = new FormData();
			formData.append('ciudad', self.ciudad);
			formData.append('search', self.search);
			formData.append('fecha', self.fecha);
			formData.append('tipoReporte', 0);
			axios.post(self.url + "Reportes_controller/buscarReporte", formData).then(function (response) {

				if (response.data.reportes == null) {
					self.alerta = true;
				} else {
					self.alerta = false;
					self.reportes = response.data.reportes;
					for (var i = 0; i < self.reportes.length; i++) {
						if (self.reportes[i].sexo == 1) {
							self.reportes[i].sexo = 'Hembra';
						} else {
							self.reportes[i].sexo = 'Macho';
						}

					}

				}
			})
		},
		addRep() {
			var self = this;
			/*if(self.nuevoReporte.fechaEvento ==''){
				self.nuevoReporte.fechaEvento = fecha;
			}*/
			this.nuevoReporte.foto = $('#foto').prop('files')[0];
			var formData = self.formData(this.nuevoReporte);
			if (this.nuevoReporte.tipoReporte == 0)
				this.rep = "perdido";
			else
				this.rep = "encontrado";
			axios.post(this.url + "Reportes_controller/agregarReportes", formData).then(function (response) {

				if (response.data.error) {
					//self.formValidate = response.data.msg;
					self.dialogCargandoImagen = false;
					self.errorMSG = "";
					if (response.data.msg) {
						if (response.data.msg.sexo != '' && response.data.msg.sexo != null)
							self.errorMSG = self.errorMSG + " Debe seleccionar el género de la mascota. ";
						if (response.data.msg.caractEsp != '' && response.data.msg.caractEsp != null)
							self.errorMSG = self.errorMSG + " Debe agregar una descripción. ";
						if (response.data.msg.ciudad != '' && response.data.msg.ciudad != null)
							self.errorMSG = self.errorMSG + " Debe seleccionar la ciudad. ";
						if (typeof response.data.msg === 'string')
							self.errorMSG = response.data.msg;
					} else {
						self.errorMSG = self.errorMSG + response.data.message;
						//self.dialog_destacar = true;
					}
					self.error = true;
					swal({
						//title: "Agregar Usuaio",
						text: self.errorMSG,
						icon: "error",
						buttons: false,
						timer: 3000
					});
				} else {

					self.successMSG = response.data.msg;
					self.idLastRep = response.data.id_reporte;
					if (self.rep == "perdido") {
						swal({
							title: "Reporte agregado con éxito",
							text: "¿Desea destacar el reporte?",
							//text: self.errorMSG,
							icon: "success",
							buttons: [
								'No',
								'Si'
							],
							//timer: 3000
						}).then(function (isConfirm) {

							if (isConfirm) {
								$('#btnAgregar').attr('disabled', true);
								self.dialog_destacar = true;
								self.dialogCargandoImagen = false;
								/*axios.post(this.url + "Reportes_controller/vistaDestacar", formData).then(function(response) {

								});*/
								window.location.href = self.url + "Reportes_controller/vistaDestacar" + "?r=" + self.idLastRep;
							} else {
								$('#btnAgregar').attr('disabled', true);
								self.dialog_destacar = true;
								self.dialogCargandoImagen = false;
								self.mostrarDatosFuncion();
								if (self.rep == "perdido")
									window.location.href = self.url + 'Reportes_controller/vistaPerdidos';
								if (self.rep == "encontrado")
									window.location.href = self.url + 'Reportes_controller/vistaEncontrados';
								self.clearAll();
								self.clearMSG();
							}
						});
					}
					if (self.rep == "encontrado")
					{
						swal({
							title: "Reporte agregado con éxito",
							text: "¿Desea donar a FindMyDog?",
							//text: self.errorMSG,
							icon: "success",
							buttons: [
								'No',
								'Si'
							],
							//timer: 3000
						}).then(function (isConfirm) {

							if (isConfirm) {
								$('#btnAgregar').attr('disabled', true);
								self.dialog_don = true;
								//self.dialogCargandoImagen = false;
								/*axios.post(this.url + "Reportes_controller/vistaDestacar", formData).then(function(response) {

								});*/
								//window.location.href = self.url + "Reportes_controller/vistaDestacar" + "?r=" + self.idLastRep;
							} else {
								window.location.href = self.url + 'Reportes_controller/vistaEncontrados';
							}
						});
					}

					$('#btnAgregar').attr('disabled', true);
					self.mostrarDatosFuncion();
					self.clearAll();
					self.clearMSG();
				}
			})
		},
		updateRep() {
			var self = this;
			if (self.nuevaFoto == true) {
				self.chooseReporte.foto = $('#foto').prop('files')[0]
			}
			var formData = self.formData(self.chooseReporte);
			axios.post(this.url + "Reportes_controller/actualizarReportes", formData).then(function (response) {
				
				if (response.data.error) {
					//self.formValidate = response.data.msg;
					self.errorMSG = response.data.msg;
					swal({
						//title: "Agregar Usuaio",
						text: self.errorMSG,
						icon: "error",
						buttons: false,
						timer: 3000
					});
				} else {
					self.successMSG = response.data.success;
					swal({
						//title: "Agregar Usuaio",
						text: self.successMSG,
						icon: "success",
						buttons: false,
						timer: 3000
					})
						.then(() => {
							self.clearAll();
							self.clearMSG();
						});
					/*self.clearAll();
					self.clearMSG();*/
				}
			})
		},
		deleteRep() {
			var self = this;
			var formData = self.formData(self.chooseReporte);
			axios.post(this.url + "Reportes_controller/eliminarReporte", formData).then(function (response) {
				if (!response.data.error) {
					self.successMSG = response.data.success;
					swal({
						//title: "Agregar Usuaio",
						text: self.successMSG,
						icon: "success",
						buttons: false,
						timer: 3000
					})
						.then(() => {
							self.clearAll();
							self.clearMSG();
						});
					/*self.clearAll();
					self.clearMSG();*/
				}
			})
		},
		campiarEstadoReportes(reportes) {
			var self = this;
			var formData = self.formData(reportes);
			axios.post(this.url + "Reportes_controller/ModificarEstadoReporte", formData).then(function (response) {
				if (!response.data.error) {
					self.successMSG = response.data.success;
					swal({
						//title: "Agregar Usuaio",
						text: self.successMSG,
						icon: "success",
						buttons: false,
						timer: 3000
					})
						.then(() => {
							self.clearAll();
							self.clearMSG();
						});
					/*self.clearAll();
					self.clearMSG();*/
				}
			})

		},
		obtenerCoord() {
			if (navigator.geolocation) {
				// geolocation IS available
				var self = this;

				navigator.geolocation.getCurrentPosition(position => {
					self.nuevoReporte.latitud = position.coords.latitude;
					self.nuevoReporte.longitud = position.coords.longitude;
				});
			} else {
				// geolocation IS NOT available
				alert("No esta disponible la geolocalización");
			}
		},
		MostrarRecompensa(event) {
			if (event.target.value == 1) {
				$("#divCantRecompensa").css("display", "block");
			} else {
				$("#divCantRecompensa").css("display", "none");
			}

		},
		mostrarContacto(event) {
			if (event.target.value == 0) {
				$("#divTelContacto").css("display", "block");
				$("#divEmailContacto").css("display", "block");

			} else {

				$("#divTelContacto").css("display", "none");
				$("#divEmailContacto").css("display", "none");
			}

		},
		mostrarMasInfo(event) {
			var mostrarInfo = document.getElementById('mostrarMasInfo').checked;
			if (mostrarInfo == true) {
				$("#masInfo").css("display", "block");

			} else {
				$("#masInfo").css("display", "none");

			}

		},
		detallesVistos(notificacion) {
			var self = this;
			//self.chooseNotificacion = notificacion;
			var formData = self.formData(notificacion);
			axios.post(this.url + "Notificacion_controller/obtenerDetallesVistos", formData).then(function (response) {
				if (response.data.notificacion == null) {
					self.emptyResult = true;
					self.chooseNotificacion = null;
				} else {
					self.chooseNotificacion = response.data.notificacion;
					
					//self.refresh()
				}
			})
		},
		addNotificacion() {
			var self = this;
			if (navigator.geolocation) {
				// geolocation IS available
				navigator.geolocation.getCurrentPosition(function (position) {
					self.nuevaNotificacion.latitud = position.coords.latitude;
					self.nuevaNotificacion.longitud = position.coords.longitude;

					console.log("Found your location nLat : " + position.coords.latitude + " nLang :" + position.coords.longitude);
				});
			} else {
				// geolocation IS NOT available
				alert("No esta disponible la geolocalización");
			}
			var formData = self.formData(self.nuevaNotificacion);
			axios.post(this.url + "Notificacion_controller/agregarVisto", formData).then(function (response) {
				
				if (response.data.error) {
					self.formValidate = response.data.msg;
				} else {
					self.successMSG = response.data.msg;
					self.clearAll();
					self.clearMSG();
				}
			})

		},
		guardarReporte(idReporte) {
			var self = this;
			self.nuevaNotificacion.mascota = idReporte;
			
		},
		guardarIdReporte(idReporte) {
			var self = this;
			self.contactarDuenno.mascota = idReporte;
			
		},
		duennoContactar() {
			var self = this;

			var formData = self.formData(self.contactarDuenno);
			axios.post(this.url + "Notificacion_controller/duennoContactar", formData).then(function (response) {
				
				if (response.data.error) {
					//self.formValidate = response.data.msg;
					self.errorMSG = response.data.msg;
					swal({
						//title: "Agregar Usuaio",
						text: self.errorMSG,
						icon: "error",
						buttons: false,
						timer: 3000
					});
				} else {
					self.successMSG = response.data.msg;
					swal({
						//title: "Agregar Usuaio",
						text: self.successMSG,
						icon: "success",
						buttons: false,
						timer: 3000
					})
						.then(() => {
							self.clearAll();
							self.clearMSG();
						});
					/*self.clearAll();
					self.clearMSG();*/
				}
			})
		},
		formData(obj) {

			var formData = new FormData();
			for (var key in obj) {
				formData.append(key, obj[key]);
			}
			return formData;
		},
		/*getData(reportes) {
			var self = this;
			self.emptyResult = false; // become false if has a record
			self.totalReportes = reportes.length //get total of histroia
			self.reportes = reportes.slice(self.currentPage * self.rowCountPage, (self.currentPage * self.rowCountPage) + self.rowCountPage); //slice the result for pagination

			// if the record is empty, go back a page
			if (self.reportes.length == 0 && self.currentPage > 0) {
				self.pageUpdate(self.currentPage - 1)
				self.clearAll();
			}
		},*/
		select(reporte) {
			var self = this;
			/*var dirfoto = this.url+"assets/img/mascotas/"+reporte.foto;
			reporte.foto = dirfoto;*/
			var url = 'url';

			self.chooseReporte = reporte;
			self.chooseReporte[url] = this.url + "assets/img/";
			if (self.chooseReporte.sexo == 'Hembra') {
				self.chooseReporte.sexo = 1;
			} else {
				self.chooseReporte.sexo = 2;
			}
			//self.chooseReporte={'url':this.url+"assets/img/mascotas/"};

		},
		selectComercio(comercio) {
			var self = this;
			self.chooseComercio = comercio;

		},
		clearMSG() {
			var self = this;
			setTimeout(function () {
				self.successMSG = ''
			}, 3000); // disappearing message success in 2 sec
		},
		clearAll() {
			var self = this;
			self.nuevoReporte = {
				nombreMascota: '',
				caractEsp: '',
				foto: '',
				sexo: '',
				tipoMascota: 1,
				fechaReporte: fecha,
				fechaEvento: '',
				direccion: '',
				permitirContacto: '',
				telContacto: '',
				emailContacto: '',
				tipoReporte: 0,
				estadoReporte: 1,
				recompensa: '',
				cantRecompensa: '',
				latitud: '',
				longitud: '',
				ciudad: ''
			};
			self.chooseReporte = {};
			self.formValidate = false;
			self.addModal = false;
			self.editModal = false;
			self.deleteModal = false;
			self.detallesModal = false;
			self.addVisto = false;
			dialog = false;
			self.nuevaFoto = '';
			self.chooseNotificacion = {};
			self.emptyResult = false;
			self.refresh();
			self.contactar = false;
			self.contactarDuenno = {
				lugar: '',
				descripcion: '',
				fechaEncontrado: '',
				telefonoContacto: '',
				correoContacto: ''
			}

		},
		noResult() {
			var self = this;
			self.emptyResult = true;  // become true if the record is empty, print 'No Record Found'

			//self.totalReportes = 0; //remove current page if is empty


		},
		pageUpdate(pageNumber) {
			var self = this;
			self.currentPage = pageNumber; //receive currentPage number came from pagination template
			self.refresh()
		},
		refresh() {
			var self = this;
			self.mostrarDatosFuncion(); //for preventing
			//self.mostrarPerdidosUsuarios();
		},
		obtenerPlanes() {
			var self = this;
			axios.post(this.url + "Reportes_controller/obtenerPlanes").then(function (response) {
				if (response.data.planes != null) {
					self.planes = response.data.planes;
				}
			});

		},
		async checkout(amount) {
			// token - is the token object
			// args - is an object containing the billing and shipping address if enabled
			const { token, args } = await this.$refs.checkoutRef.open();
		},
		done({token, args}) {
			// token - is the token object
			// args - is an object containing the billing and shipping address if enabled
			// do stuff...
			let datos = [];
			stripeToken = token;

			datos['amount'] = this.amount;
			datos['currency'] = this.currency;
			if (this.amount>=100)
				this.amount = this.amount/100;
			formData = new FormData();
			formData.append('amount', this.amount);
			formData.append('currency', this.currency);
			formData.append('stripeToken', JSON.stringify(token));
			formData.append('idReporte', this.idLastRep);
			formData.append('idPlan', this.selected.idPlan);
			formData.append('donacion', this.dialog_don);
			// formData.append('stripeToken',token);
			var self = this;
			axios.post(this.url + "Reportes_controller/pagarStripe", formData).then(function (response) {
				
				if (response.data.error) {
					swal({
						text: response.data.mensaje,
						icon: "error",
						buttons: false,
						timer: 10000
					});
				} else {
					swal({
						text: response.data.mensaje,
						icon: "success",
						buttons: false,
						timer: 10000
					});
				}
				//self.addModal= true;
				if (self.dialog_dest)
					self.dialog_dest = false;
				if (self.dialog_don)
					self.dialog_don = false;
				window.location.href = self.url;
			});
		},
		opened() {
			// do stuff
		},
		closed() {
			// do stuff
		},
		canceled() {
			// do stuff
		},
		seleccionarPlan(plan) {
			this.amount = plan.cantDias * plan.costo*100;
			this.name = plan.nombrePlan;
			//this.checkout(this.amount);
			//var elmnt = document.getElementById("pay");
			//elmnt.scrollIntoView();

		},
		verificarDest(id) {
			var self = this;
			formData = new FormData();
			formData.append('idReporte', id);
			axios.post(this.url + "Reportes_controller/estaDestacado", formData).then(function (response) {
				
			});

		},
		compartirFace(reporte) {
			formData = new FormData();
			formData.append('reporte', JSON.stringify(reporte));
			axios.post('reporte_ver', formData).then(function (response) {
				
				//self.addModal= true;
				if (self.dialog_dest)
					self.dialog_dest = false;
				if (self.dialog_don)
					self.dialog_don = false;
			});
		},
		/*crear_ATHM_Checkout() {
			var self = this;
			ATHM_Checkout = {
				/*env: 'env',
				publicToken: '5e0867cc5a5c97628c2efdf0462c0ecbde44e593',*/
				/*env: 'sandbox',
				publicToken: 'sandboxtoken01875617264',
				timeout: 600,
				theme: 'btn',
				lang: 'es',
				total: 1.00,
				tax: 1.00,
				subtotal: 1.00,
				metadata1: 'metadata1 test',
				metadata2: 'metadata2 test',
			}
		},*/
		obtenerDatos(total, donar = false) {
			var self = this;
			var idReporte = self.idLastRep;
			var idPlan = self.selected.idPlan;
			if(donar == true){
				window.location.href = self.url + 'Reportes_controller/vistaDestacarATH' + '?total='+total+'&donar='+donar;
			}else {
				window.location.href = self.url + 'Reportes_controller/vistaDestacarATH' + '?idRep=' + idReporte+ '&idPlan=' + idPlan+'&total='+total+'&donar='+donar;
			}



			//var total = total;
			/*ATHM_Checkout.total = total;
			ATHM_Checkout.subtotal = total;*/
			/*self.dialogATH = true;
			var idReporte = self.idLastRep;
			var idPlan = self.selected.idPlan;
			var url = this.url;
			ATHM_Checkout.onCompletedPayment = function (response) {
				if (donar != true) {
					formData = new FormData();
					formData.append('idReporte', idReporte);
					formData.append('idPlan', idPlan);
					axios.post(url + "Reportes_controller/pagarATHM", formData).then(function (response) {
						if (response.data.error) {
							swal({
								text: response.data.mensaje,
								icon: "error",
								buttons: false,
								timer: 5000
							});
						} else {
							swal({
								text: response.data.mensaje,
								icon: "success",
								buttons: false,
								timer: 5000
							});
						}
						if (self.dialogATH)
							self.dialogATH = false;
						window.location.href = self.url;
					});
				} else {
					swal({
						text: "Gracias por su donación",
						icon: "success",
						buttons: false,
						timer: 5000
					});
					if (self.dialogATH)
						self.dialogATH = false;
					window.location.href = self.url;
				}

			}
			ATHM_Checkout.onCancelledPayment = function (response) {
				swal({
					text: "El pago fue cancelado",
					icon: "error",
					buttons: false,
					timer: 5000
				});
			}
			ATHM_Checkout.onExpiredPayment = function (response) {
				swal({
					text: "Su sesión ha expirado",
					icon: "error",
					buttons: false,
					timer: 5000
				});
			}*/
		}
	}
})
