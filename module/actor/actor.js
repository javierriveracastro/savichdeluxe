/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class SavichDeluxeActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;
    console.log ("ACTORDATA");
    console.log (actorData);
    setProperty(this.data, 'data.parada.valor', this.CalcParada(this));
    setProperty(this.data, 'data.dureza.valor', this.CalcDureza(this));
    setProperty(this.data, 'data.dureza.armadura', this.CalcArmadura(this));
        
  }
  
  CalcParada (actor){
     var Parada = 0;
     var PelearValorDado =0;
     var PelearValorBono =0;
     const Pelear = actor.items.find((i) => i.type === "habilidad" && i.name === "Pelear");
     PelearValorDado = getProperty(Pelear, 'data.data.dado') || 0;
     PelearValorBono = getProperty(Pelear, 'data.data.bono') || 0;
     Parada = (Math.floor(PelearValorDado/2)) + (Math.floor(PelearValorBono/2)) + 2;
     return Parada; 
  }
  CalcDureza (actor){
     var Dureza = 0;
     var ArmaduraVal = 0;
     var VigorValorDado = actor.data.data.abilities.Vigor.value || 0;
     var VigorValorBono = actor.data.data.abilities.Vigor.bonus || 0;
     const Armadura = actor.items.find((i) => i.type === "armadura"  && i.data.data.equipada == "Si");
     ArmaduraVal = getProperty(Armadura, 'data.data.bono') || 0;
     Dureza = (Math.floor(VigorValorDado/2)) + (Math.floor(VigorValorBono/2)) + 2 + ArmaduraVal;
     return Dureza; 
  }
  CalcArmadura (actor){
     var ArmaduraVal = 0;
     const Armadura = actor.items.find((i) => i.type === "armadura" && i.data.data.equipada == "Si");
     ArmaduraVal = getProperty(Armadura, 'data.data.bono') || 0;
     return ArmaduraVal; 
  }
}
