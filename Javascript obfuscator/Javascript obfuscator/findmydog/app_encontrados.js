Vue.component('modal',{ //modal
	template:`
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
})
const reportes = new Vue({
	el:'#formReportes',
	data:{
		url:dir,
		addModal: false,
		editModal:false,
		deleteModal:false,
		detallesModal:false,
		reportes:[],
		search: {text: ''},
		emptyResult:false,
		dialogTipoReporte:false,
		dialogCargandoImagen:false,
		nuevoReporte: {
			nombreMascota: '',
			caractEsp: '',
			foto:'',
			sexo:'',
			tipoMascota:1,
			fechaReporte: fecha,
			fechaEvento:'',
			direccion:'',
			permitirContacto:'',
			telContacto:'',
			emailContacto:'',
			tipoReporte:'',
			estadoReporte:1,
			recompensa:'',
			cantRecompensa:'',
			latitud:'',
			longitud:'',
			ciudad:''
		},
		chooseReporte:{},
		formValidate:[],
		successMSG:'',
		errorMSG:'',
		error:false,
		tipoMascotas:[],
		ciudades:[],
		nuevaFoto:false,
		//pagination
		currentPage: 0,
		rowCountPage:5,
		totalReportes:0,
		pageRange:2,
		contactar:false,
		contactarDuenno:{
			lugar:'',
			descripcion:'',
			fechaEncontrado:'',
			telefonoContacto:'',
			correoContacto:''
		}
	},
	created(){
		this.mostrarEncontrados();
	},
	computed: {
		MostarComponentes() {
			var self = this;
			if (self.editModal == true) {
				document.getElementById("divCantRecompensa")
				if (event.target.value == 1){
					$("#divCantRecompensa").css("display","block");
				}
				else{
					$("#divCantRecompensa").css("display","none");
				}
			}

			return this.editModal
		}
	},
	methods:{
		mostrarEncontrados(){
			var self = this;
			self.obtenerCoord();
			self.getTipoMascota();
			self.getCiudades();
			axios.get(this.url+"Reportes_controller/obtenerEncontrados").then(function(response){
				if(response.data.reportes == null){
					self.noResult();
				}else{
					self.getData(response.data.reportes);

				}

			})
		},
		getCiudades(){
			var self = this;
			axios.post(this.url+"Referencias_controller/obtenerCiudades").then(function(response){
				self.ciudades = response.data.ciudades;
				//self.addModal= true;
			});
		},
		getTipoMascota(){
			var self = this;
			axios.post(this.url+"Referencias_controller/obtenerTipoMascotas").then(function(response){
				self.tipoMascotas = response.data.tipoMascotas;
				//self.addModal= true;
			});
		},
		/*searchHistoria(){
			var self = this;
			var formData = app.formData(app.search);
			axios.post(this.url+"Historia_controller/buscar_historia", formData).then(function(response){
				if(response.data.historias == null){
					app.noResult()
				}else{
					app.getData(response.data.historias);

				}
			})
		},*/
		addRep(){
			var self = this;
			this.nuevoReporte.foto = $('#foto').prop('files')[0];
			var formData = self.formData(this.nuevoReporte);
			axios.post(this.url+"Reportes_controller/agregarReportes", formData).then(function(response){
				console.log(response.data);
				if (response.data.error) {
					//self.formValidate = response.data.msg;
					self.dialogCargandoImagen = false;
					self.errorMSG = "";
					if (response.data.msg){
						if (response.data.msg.sexo != '' && response.data.msg.sexo != null)
							self.errorMSG = self.errorMSG + " Debe seleccionar el género de la mascota. ";
						if (response.data.msg.caractEsp != '' && response.data.msg.caractEsp != null)
							self.errorMSG = self.errorMSG +  " Debe agregar una descripción. ";
						if (response.data.msg.ciudad != '' && response.data.msg.ciudad != null)
							self.errorMSG = self.errorMSG + " Debe seleccionar la ciudad. ";
						if (typeof response.data.msg === 'string')
							self.errorMSG = response.data.msg;
					}
					else{
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
					self.buscar();
					swal({
						//title: "Agregar Usuaio",
						text: self.successMSG,
						icon: "success",
						buttons: false,
						timer: 3000
					})
						.then(() => {

							$('#btnAgregar').attr('disabled',true);
							//self.mostrarDatosFuncion();
							self.clearAll();
							self.clearMSG();
							self.addModal = false;
						});
				}
			})
		},

		updateRep(){
		var self = this;
		if(self.nuevaFoto == true){
			self.chooseReporte.foto = $('#foto').prop('files')[0]
		}
		var formData = self.formData(self.chooseReporte);
			axios.post(this.url+"Reportes_controller/actualizarReportes", formData).then(function(response){
				console.log(response.data);
				if(response.data.error){
					self.formValidate = response.data.msg;
					self.errorMSG = response.data.msg;
					self.error = true;
					self.dialogCargandoImagen = false;
				}else{
					self.successMSG = response.data.success;
					self.clearAll();
					self.clearMSG();
				}
			})
		},
		deleteRep(){
			var self = this;
			var formData = self.formData(self.chooseReporte);
			axios.post(this.url+"Reportes_controller/eliminarReporte", formData).then(function(response){
				if(!response.data.error){
					self.successMSG = response.data.success;
					self.clearAll();
					self.clearMSG();
				}
			})
		},

		obtenerCoord(){
			if (navigator.geolocation) {
				// geolocation IS available
				var self = this;
				navigator.geolocation.getCurrentPosition(position =>{
					self.nuevoReporte.latitud = position.coords.latitude;
					self.nuevoReporte.longitud = position.coords.longitude;
				});
			} else {
				// geolocation IS NOT available
				alert("No esta disponible la geolocalización");
			}
		},

		MostarRecompensa(event) {
			if (event.target.value == 1){
				$("#divCantRecompensa").css("display","block");
			}
			else{
				$("#divCantRecompensa").css("display","none");
			}
			console.log()
		},
		mostrarContacto(event) {
			if (event.target.value == 0){
				$("#divTelContacto").css("display","block");
				$("#divEmailContacto").css("display","block");
			}
			else{
				$("#divTelContacto").css("display","none");
				$("#divEmailContacto").css("display","none");
			}
			console.log()
		},
		formData(obj){

			var formData = new FormData();
			for ( var key in obj ) {
				formData.append(key, obj[key]);
			}
			return formData;
		},
		getData(reportes){
			var self = this;
			self.emptyResult = false; // become false if has a record
			self.totalReportes = reportes.length //get total of histroia
			self.reportes = reportes.slice(self.currentPage * self.rowCountPage, (self.currentPage * self.rowCountPage) + self.rowCountPage); //slice the result for pagination

			// if the record is empty, go back a page
			if(self.reportes.length == 0 && self.currentPage > 0){
				self.pageUpdate(self.currentPage - 1)
				self.clearAll();
			}
		},

		select(reporte){
			var self = this;
			/*var dirfoto = this.url+"assets/img/mascotas/"+reporte.foto;
			reporte.foto = dirfoto;*/
			var url='url';

			self.chooseReporte = reporte;
			self.chooseReporte[url]= this.url+"assets/img/mascotas/";
			//self.chooseReporte={'url':this.url+"assets/img/mascotas/"};
			console.log(self.chooseReporte);

		},
		clearMSG(){
			var self = this;
			setTimeout(function(){
				self.successMSG=''
			},3000); // disappearing message success in 2 sec
		},
		clearAll(){
			var self = this;
			self.nuevoReporte = {
				nombreMascota: '',
				caractEsp: '',
				foto:'',
				sexo:'',
				tipoMascota:1,
				fechaReporte: fecha,
				fechaEvento:'',
				direccion:'',
				permitirContacto:'',
				telContacto:'',
				emailContacto:'',
				tipoReporte:'',
				estadoReporte:1,
				recompensa:'',
				cantRecompensa:'',
				latitud:'',
				longitud:'',
				ciudad:''
			};
			self.dialogCargandoImagen=false;
			self.error=false;
			self.chooseReporte = {};
			self.formValidate = false;
			self.addModal= false;
			self.editModal=false;
			self.deleteModal=false;
			self.detallesModal=false;
			self.nuevaFoto='';
			self.refresh()

		},
		noResult(){
			var self = this;
			self.emptyResult = true;  // become true if the record is empty, print 'No Record Found'
			self.reportes = null
			self.totalReportes = 0 //remove current page if is empty

		},

		pageUpdate(pageNumber){
			var self = this;
			self.currentPage = pageNumber; //receive currentPage number came from pagination template
			self.refresh()
		},
		refresh(){
			var self = this;
			self.mostrarEncontrados(); //for preventing

		},
		buscar(){
			var self = this;
			var formData = new FormData();
			formData.append('ciudad', '');
			formData.append('search', '');
			formData.append('fecha', '');
			formData.append('tipoReporte',1);
			axios.post(self.url+"Reportes_controller/buscarReporte", formData).then(function(response){

				if(response.data.reportes == null){
					self.alerta = true;
				}
				else{
					self.alerta = false;
					self.reportes = response.data.reportes;
					for(var i=0;i<self.reportes.length;i++){
						if(self.reportes[i].sexo == 1){
							self.reportes[i].sexo = 'Hembra';
						}
						else{
							self.reportes[i].sexo = 'Macho';
						}

					}

				}
			})
		},


	}
})
