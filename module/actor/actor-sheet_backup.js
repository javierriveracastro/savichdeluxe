/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class SavichDeluxeActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["savichdeluxe", "sheet", "actor"],
      template: "systems/savichdeluxe/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData().data;
    data.dtypes = ["String", "Number", "Boolean"];
    for (let attr of Object.values(data.data.attributes)) {
      attr.isCheckbox = attr.dtype === "Boolean";
    }
    if (this.actor.data.type == 'character') {
      console.log ("TIPO DE ACTOR");
      console.log (this.actor.data.type);
      this._prepareCharacterItems(data);
    }
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const objeto_a_borrar = this.actor.items.get(li.data("itemId"));
      objeto_a_borrar.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
     html.find('.rollable').click(this._onRoll.bind(this));
     html.find('.Atributodialog').click(this._onAtributoDialog.bind(this));
     html.find('.Ataquedialog').click(this._onAtaqueDialog.bind(this));
     
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
//     return this.actor.createOwnedItem(itemData);
       return Item.create(itemData, {parent: this.actor});
  }

  _prepareCharacterItems(sheetData) {
    const actorData = sheetData;

    // Initialize containers.
    const gear = [];
    const Habilidades = [];
     const Armas = [];
     const Armaduras = [];
//     const Ventajas = [];
//     const Desventajas = [];
    // Iterate through items, allocating to containers
    // let totalWeight = 0;
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === 'habilidad') {
        Habilidades.push(i);
      }
       else if (i.type === "arma") {
         Armas.push(i);
       }
       else if (i.type === "armadura") {
         Armaduras.push(i);
       }
//       else if (i.type === "Ventaja") {
//         Ventajas.push(i);
//       }
//       else if (i.type === "Desventaja") {
//         Desventajas.push(i);
//       }

    }
        // Assign and return
    console.log ("ACTORDATA");
    console.log (actorData);
    actorData.gear = gear;
    actorData.Habilidades = Habilidades;
    console.log ("HABILIDADES");
    console.log (Habilidades);
     actorData.Armas = Armas;
     actorData.Armaduras = Armaduras;
//     actorData.Ventajas = Ventajas;
//     actorData.Desventajas = Desventajas;
  }
  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      let roll = new Roll(dataset.roll, this.actor.data.data);
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }
  _onAtributoDialog(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    console.log ("ENTRO EN DIALOGO");
    let dialogContent = `
	            <div>
                   Objetivo: <input id="objetivo" value="4" size=1>
		        </div>
		        <div> 
		           <label class="resource-label">Modificadores</label>
                   <select id="modificadores">
                      <option value="-4">-4</option>
		              <option value="-3">-3</option>
                      <option value="-2">-2</option>
                      <option value="-1">-1</option>
                      <option value=" 0" selected>0</option>
                      <option value="1">+1</option>
		              <option value="2">+2</option>
		              <option value="3">+3</option>
		              <option value="4">+4</option>
                   </select>
		        </div>`;
    let d = new Dialog({
      title: `Nueva tirada de ${dataset.label}`,
      content: dialogContent,
      buttons: {
         Lanzar: {
            icon: '<i class="fas fa-check"></i>',
            label: "Lanzar",
            callback: () => {
               var resultado = "";
               var margen = 0;
               var aumentos = 0;
               var heridas = 0;
               var fatiga = 0;
               var objetivo = document.getElementById("objetivo").value;
               var modificadores = document.getElementById("modificadores").value;
               var tirada_con_bonos = "";
//                tirada_con_bonos = tirada_con_bonos.concat ("{1d", dataset.dado, "x",dataset.dado,"+",dataset.bono,",1d6x6}kh","+", modificadores);
               if (dataset.bono > 0){
                  tirada_con_bonos = tirada_con_bonos.concat ("{1d", dataset.dado, "x",dataset.dado,"+",dataset.bono,",1d6x6}kh");   
               }
               else {
                  tirada_con_bonos = tirada_con_bonos.concat ("{1d", dataset.dado, "x",dataset.dado,",1d6x6}kh");
               }
               if (modificadores != 0){
                  if (modificadores > 0){
                     tirada_con_bonos = tirada_con_bonos.concat ("+", modificadores);
                  }
                  else {
                     tirada_con_bonos = tirada_con_bonos.concat (modificadores);
                  }
               }
               heridas = this.actor.data.data.heridas.valor;
               fatiga = this.actor.data.data.fatiga.valor;
               if (heridas != 0){
                 tirada_con_bonos = tirada_con_bonos.concat ("-", heridas);
               }
               if (fatiga != 0){
                 tirada_con_bonos = tirada_con_bonos.concat ("-", fatiga);
               }
               console.log ("TIRADA CON BONOS");
               console.log (tirada_con_bonos);
               console.log ("ACTOR");
               console.log (this.actor);
               let tirada = new Roll (tirada_con_bonos, this.actor.data.data);
//                let tirada = new Roll ("1d6", this.actor.data.data);
               tirada.roll();
               if (tirada.total >= objetivo){
                  margen = tirada.total - objetivo;
                  aumentos = Math.floor(margen / 4);
                  if (aumentos > 0){
                     if (aumentos == 1)
                     {
                        resultado = "<div style=\"color:blue;\">" + aumentos + " AUMENTO" + "</div>";
                     }
                     else
                     {
                        resultado = "<div style=\"color:blue;\">" + aumentos + " AUMENTOS" + "</div>";
                     }
                  }
                  else
                  {
                     resultado = "<div style=\"color:green;\">ÉXITO</div>";
                  }
               }
               else
               {
                  resultado = "<div style=\"color:orange;\">FALLO</div>";
               }
               var tirada_limpia = 0;
               tirada_limpia = tirada.total - modificadores;
               console.log ("TIRADA LIMPIA");
               console.log (tirada_limpia);
               if (tirada_limpia == 1)
               {
                  resultado = "<div style=\"color:red;\"> PIFIA</div>";
               }
               let label = dataset.label ? `Lanzando ${dataset.label}` : '';
               let flavor = "<b>" + label + " VS: " + objetivo + "<br>" + resultado + "</b>";
               console.log ("DADO TOTAL:");
               console.log (tirada.total);
               tirada.toMessage({
                  speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                  flavor: flavor
               });
            }
		 }
         },
      render: html => console.log("Register interactivity in the rendered dialog"),
      close: html => console.log("This always is logged no matter which option is chosen")
    }); 
    d.render(true);
  }

    _onAtaqueDialog(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    console.log ("ENTRO EN DIALOGO DE ATAQUE");
    let dialogContent = `
	            <div>
                   Objetivo: <input id="objetivo" value="4" size=1>
		        </div>
		        <div> 
		           <label class="resource-label">Modificadores</label>
                   <select id="modificadores">
                      <option value="-4">-4</option>
		              <option value="-3">-3</option>
                      <option value="-2">-2</option>
                      <option value="-1">-1</option>
                      <option value=" 0" selected>0</option>
                      <option value="1">+1</option>
		              <option value="2">+2</option>
		              <option value="3">+3</option>
		              <option value="4">+4</option>
                   </select>
		        </div>`;
    let d = new Dialog({
      title: `Nueva tirada de ${dataset.label}`,
      content: dialogContent,
      buttons: {
         Atacar: {
            icon: '<i class="fas fa-check"></i>',
            label: "Atacar",
            callback: () => {
               var resultado = "";
               var margen = 0;
               var aumentos = 0;
               var heridas = 0;
               var fatiga = 0;
               const HabilidadArma = this.actor.items.find((k) => k.type === "habilidad" && k.name === dataset.habilidad);
               var objetivo = document.getElementById("objetivo").value;
               var modificadores = document.getElementById("modificadores").value;
               let listaObjetivos = game.user.targets;
               let token_id;
               if (listaObjetivos.size) {
                   console.log ("NUMERO DE ENEMIGOS");
                   console.log (listaObjetivos.size);
                   token_id = Array.from(listaObjetivos)[0];
                   console.log("TOKEN ID");               
                   console.log(token_id);
                   let target = token_id.actor;
                   console.log("ACTOR");
                   console.log(target);
                   console.log ("PARADA");
                   console.log (target.data.data.parada.valor);
                   objetivo = target.data.data.parada.valor;
               }
               
               var tirada_con_bonos = "";
               if (dataset.bono > 0){
                  tirada_con_bonos = tirada_con_bonos.concat ("{1d", HabilidadArma.data.data.dado, "x",HabilidadArma.data.data.dado,"+",HabilidadArma.data.data.bono,",1d6x6}kh");   
               }
               else {
                  tirada_con_bonos = tirada_con_bonos.concat ("{1d", HabilidadArma.data.data.dado, "x",HabilidadArma.data.data.dado,",1d6x6}kh");
               }
               if (modificadores != 0){
                  if (modificadores > 0){
                     tirada_con_bonos = tirada_con_bonos.concat ("+", modificadores);
                  }
                  else {
                     tirada_con_bonos = tirada_con_bonos.concat (modificadores);
                  }
               }
               heridas = this.actor.data.data.heridas.valor;
               fatiga = this.actor.data.data.fatiga.valor;
               if (heridas != 0){
                 tirada_con_bonos = tirada_con_bonos.concat ("-", heridas);
               }
               if (fatiga != 0){
                 tirada_con_bonos = tirada_con_bonos.concat ("-", fatiga);
               }
               let tirada = new Roll (tirada_con_bonos, this.actor.data.data);
               tirada.roll();
               
               if (tirada.total >= objetivo){
                  margen = tirada.total - objetivo;
                  aumentos = Math.floor(margen / 4);
                  if (aumentos > 0){
                     if (aumentos == 1)
                     {
                        resultado = "<div style=\"color:blue;\">" + aumentos + " AUMENTO" + "</div>";
                     }
                     else
                     {
                        resultado = "<div style=\"color:blue;\">" + aumentos + " AUMENTOS" + "</div>";
                     }
                  }
                  else
                  {
                     resultado = "<div style=\"color:green;\">ÉXITO</div>";
                  }
               }
               else
               {
                  resultado = "<div style=\"color:orange;\">FALLO</div>";
               }
               var tirada_limpia = 0;
               tirada_limpia = tirada.total - modificadores;
               if (tirada_limpia == 1)
               {
                  resultado = "<div style=\"color:red;\"> PIFIA</div>";
               }
               let label = dataset.label ? `Ataque con ${dataset.label}` : '';
               let flavor = "<b>" + label + " VS: " + objetivo + "<br>" + resultado + "</b>";
               tirada.toMessage({
                  speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                  flavor: flavor
               });
            }
		 },
         Daño: {
            icon: '<i class="fas fa-check"></i>',
            label: "Daño",
            callback: () => {
               var resultado = "";
               var margen = 0;
               var aumentos = 0;
               var objetivo = document.getElementById("objetivo").value;
               var modificadores = document.getElementById("modificadores").value;
               let listaObjetivos = game.user.targets;
               let token_id;
               if (listaObjetivos.size) {
                   token_id = Array.from(listaObjetivos)[0];
                   let target = token_id.actor;
                   objetivo = target.data.data.dureza.valor;
               }
               var tirada_con_bonos = "";
                  tirada_con_bonos = tirada_con_bonos.concat (dataset.dano);
               switch (dataset.bono_atributo_dano) {
                   case "Fuerza": tirada_con_bonos = tirada_con_bonos.concat ("+ 1d", this.actor.data.data.abilities.Fuerza.value,"x",this.actor.data.data.abilities.Fuerza.value);
                   if (this.actor.data.data.abilities.Fuerza.bonus > 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat ("+",this.actor.data.data.abilities.Fuerza.bonus);
                   }
                   else if (this.actor.data.data.abilities.Fuerza.bonus < 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat (this.actor.data.data.abilities.Fuerza.bonus);
                   }
                   break;
                   
                   case "Agilidad": tirada_con_bonos = tirada_con_bonos.concat ("+ 1d", this.actor.data.data.abilities.Agilidad.value,"x",this.actor.data.data.abilities.Agilidad.value);
                   if (this.actor.data.data.abilities.Agilidad.bonus > 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat ("+",this.actor.data.data.abilities.Agilidad.bonus);
                   }
                   else if (this.actor.data.data.abilities.Agilidad.bonus < 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat (this.actor.data.data.abilities.Agilidad.bonus);
                   }
                   break;
                   
                   case "Vigor": tirada_con_bonos = tirada_con_bonos.concat ("+ 1d", this.actor.data.data.abilities.Vigor.value,"x",this.actor.data.data.abilities.Vigor.value);
                   if (this.actor.data.data.abilities.Vigor.bonus > 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat ("+",this.actor.data.data.abilities.Vigor.bonus);
                   }
                   else if (this.actor.data.data.abilities.Vigor.bonus < 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat (this.actor.data.data.abilities.Vigor.bonus);
                   }
                   break;
                   
                   case "Astucia": tirada_con_bonos = tirada_con_bonos.concat ("+ 1d", this.actor.data.data.abilities.Astucia.value,"x",this.actor.data.data.abilities.Astucia.value);
                   if (this.actor.data.data.abilities.Astucia.bonus > 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat ("+",this.actor.data.data.abilities.Astucia.bonus);
                   }
                   else if (this.actor.data.data.abilities.Astucia.bonus < 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat (this.actor.data.data.abilities.Astucia.bonus);
                   }
                   break;
                   
                   case "Espíritu": tirada_con_bonos = tirada_con_bonos.concat ("+ 1d", this.actor.data.data.abilities.Espíritu.value,"x",this.actor.data.data.abilities.Espíritu.value);
                   if (this.actor.data.data.abilities.Espíritu.bonus > 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat ("+",this.actor.data.data.abilities.Espíritu.bonus);
                   }
                   else if (this.actor.data.data.abilities.Espíritu.bonus < 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat (this.actor.data.data.abilities.Espíritu.bonus);
                   }
                   break;
                   
               }
               if (modificadores != 0){
                  if (modificadores > 0){
                     tirada_con_bonos = tirada_con_bonos.concat ("+", modificadores);
                  }
                  else {
                     tirada_con_bonos = tirada_con_bonos.concat (modificadores);
                  }
               }
               let tirada = new Roll (tirada_con_bonos, this.actor.data.data);
               tirada.roll();
               
               if (tirada.total >= objetivo){
                  margen = tirada.total - objetivo;
                  aumentos = Math.floor(margen / 4);
                  if (aumentos > 0){
                     if (aumentos == 1)
                     {
                        resultado = "<div style=\"color:blue;\">" + aumentos + " HERIDA" + "</div>";
                     }
                     else
                     {
                        resultado = "<div style=\"color:blue;\">" + aumentos + " HERIDAS" + "</div>";
                     }
                  }
                  else
                  {
                     resultado = "<div style=\"color:green;\">ATURDIDO</div>";
                  }
               }
               else
               {
                  resultado = "<div style=\"color:orange;\">FALLO</div>";
               }
               let label = dataset.label ? `Daño de ${dataset.label}` : '';
               let flavor = "<b>" + label + " VS: " + objetivo + "<br>" + resultado + "</b>";
               tirada.toMessage({
                  speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                  flavor: flavor
               });
            }
		 },
         Aumento: {
            icon: '<i class="fas fa-check"></i>',
            label: "Daño con Aumento",
            callback: () => {
               var resultado = "";
               var margen = 0;
               var aumentos = 0;
               var objetivo = document.getElementById("objetivo").value;
               var modificadores = document.getElementById("modificadores").value;
               let listaObjetivos = game.user.targets;
               console.log ("LISTA OBJETIVOS");
               console.log (listaObjetivos);
               let token_id;
               if (listaObjetivos.size) {
                   token_id = Array.from(listaObjetivos)[0];
                   console.log("TOKEN ID");               
                   console.log(token_id);
                   let target = token_id.actor;
                   console.log("ACTOR");
                   console.log(target);
                   console.log ("PARADA");
                   console.log (target.data.data.dureza.valor);
                   objetivo = target.data.data.dureza.valor;
               }
               
               var tirada_con_bonos = "";
                  tirada_con_bonos = tirada_con_bonos.concat (dataset.dano,"+ 1d6x6");
                  switch (dataset.bono_atributo_dano) {
                   case "Fuerza": tirada_con_bonos = tirada_con_bonos.concat ("+ 1d", this.actor.data.data.abilities.Fuerza.value,"x",this.actor.data.data.abilities.Fuerza.value);
                   if (this.actor.data.data.abilities.Fuerza.bonus > 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat ("+",this.actor.data.data.abilities.Fuerza.bonus);
                   }
                   else if (this.actor.data.data.abilities.Fuerza.bonus < 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat (this.actor.data.data.abilities.Fuerza.bonus);
                   }
                   break;
                   
                   case "Agilidad": tirada_con_bonos = tirada_con_bonos.concat ("+ 1d", this.actor.data.data.abilities.Agilidad.value,"x",this.actor.data.data.abilities.Agilidad.value);
                   if (this.actor.data.data.abilities.Agilidad.bonus > 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat ("+",this.actor.data.data.abilities.Agilidad.bonus);
                   }
                   else if (this.actor.data.data.abilities.Agilidad.bonus < 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat (this.actor.data.data.abilities.Agilidad.bonus);
                   }
                   break;
                   
                   case "Vigor": tirada_con_bonos = tirada_con_bonos.concat ("+ 1d", this.actor.data.data.abilities.Vigor.value,"x",this.actor.data.data.abilities.Vigor.value);
                   if (this.actor.data.data.abilities.Vigor.bonus > 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat ("+",this.actor.data.data.abilities.Vigor.bonus);
                   }
                   else if (this.actor.data.data.abilities.Vigor.bonus < 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat (this.actor.data.data.abilities.Vigor.bonus);
                   }
                   break;
                   
                   case "Astucia": tirada_con_bonos = tirada_con_bonos.concat ("+ 1d", this.actor.data.data.abilities.Astucia.value,"x",this.actor.data.data.abilities.Astucia.value);
                   if (this.actor.data.data.abilities.Astucia.bonus > 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat ("+",this.actor.data.data.abilities.Astucia.bonus);
                   }
                   else if (this.actor.data.data.abilities.Astucia.bonus < 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat (this.actor.data.data.abilities.Astucia.bonus);
                   }
                   break;
                   
                   case "Espíritu": tirada_con_bonos = tirada_con_bonos.concat ("+ 1d", this.actor.data.data.abilities.Espíritu.value,"x",this.actor.data.data.abilities.Espíritu.value);
                   if (this.actor.data.data.abilities.Espíritu.bonus > 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat ("+",this.actor.data.data.abilities.Espíritu.bonus);
                   }
                   else if (this.actor.data.data.abilities.Espíritu.bonus < 0)
                   {
                      tirada_con_bonos = tirada_con_bonos.concat (this.actor.data.data.abilities.Espíritu.bonus);
                   }
                   break;
                   
               }
               if (modificadores != 0){
                  if (modificadores > 0){
                     tirada_con_bonos = tirada_con_bonos.concat ("+", modificadores);
                  }
                  else {
                     tirada_con_bonos = tirada_con_bonos.concat (modificadores);
                  }
               }
               console.log ("TIRADA CON BONOS");
               console.log (tirada_con_bonos);
               console.log ("ACTOR");
               console.log (this.actor);
               let tirada = new Roll (tirada_con_bonos, this.actor.data.data);
//                let tirada = new Roll ("1d6", this.actor.data.data);
               tirada.roll();
               
               if (tirada.total >= objetivo){
                  margen = tirada.total - objetivo;
                  aumentos = Math.floor(margen / 4);
                  if (aumentos > 0){
                     if (aumentos == 1)
                     {
                        resultado = "<div style=\"color:blue;\">" + aumentos + " HERIDA" + "</div>";
                     }
                     else
                     {
                        resultado = "<div style=\"color:blue;\">" + aumentos + " HERIDAS" + "</div>";
                     }
                  }
                  else
                  {
                     resultado = "<div style=\"color:green;\">ATURDIDO</div>";
                  }
               }
               else
               {
                  resultado = "<div style=\"color:orange;\">FALLO</div>";
               }
               let label = dataset.label ? `Daño con Aumento de ${dataset.label}` : '';
               let flavor = "<b>" + label + " VS: " + objetivo + "<br>" + resultado + "</b>";
               console.log ("DADO TOTAL:");
               console.log (tirada.total);
               tirada.toMessage({
                  speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                  flavor: flavor
               });
            }
		 }
         },
      render: html => console.log("Register interactivity in the rendered dialog"),
      close: html => console.log("This always is logged no matter which option is chosen")
    }); 
    d.render(true);
  }
}
