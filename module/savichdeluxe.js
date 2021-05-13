// Import Modules
import { SavichDeluxeActor } from "./actor/actor.js";
import { SavichDeluxeActorSheet } from "./actor/actor-sheet.js";
import { SavichDeluxeItem } from "./item/item.js";
import { SavichDeluxeItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.savichdeluxe = {
    SavichDeluxeActor,
    SavichDeluxeItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity classes
//   CONFIG.Actor.entityClass = SavichDeluxeActor;
//   CONFIG.Item.entityClass = SavichDeluxeItem;
  CONFIG.Actor.documentClass = SavichDeluxeActor;
  CONFIG.Item.documentClass = SavichDeluxeItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("savichdeluxe", SavichDeluxeActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("savichdeluxe", SavichDeluxeItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});
