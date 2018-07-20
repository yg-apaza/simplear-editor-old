import { Support } from "../../interfaces/support";
import { sprintf } from "sprintf-js";

export class BlocksDefinition {

    Blockly: any;
    eventBlocks: any;
    actionBlocks: any;

    toolbox: string =
    `<xml id="toolbox" style="display: none">
      <category name="Events"> %s </category>
      <category name="Actions"> %s </category>
    </xml>`;
    
    constructor(Blockly: any) {
        this.Blockly = Blockly;

        Blockly.Blocks['start'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(new Blockly.FieldImage("http://icons.iconarchive.com/icons/icons8/ios7/128/Sports-Finish-Flag-icon.png", 20, 20, "*"))
                    .appendField("START");
                this.appendStatementInput("EVENTS")
                    .setCheck("EVENT");
                this.setInputsInline(false);
                this.setColour(160);
                this.setTooltip("Main block");
                this.setHelpUrl("");
            }
        }

        Blockly.Blocks['marker_is_detected'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField("On")
                    .appendField(new Blockly.FieldTextInput("MARKER"), "MARKER_NAME")
                    .appendField("detected");
                this.appendStatementInput("ACTION_INPUT")
                    .setCheck("ACTION");
                this.setInputsInline(false);
                this.setPreviousStatement(true, "EVENT");
                this.setNextStatement(true, "EVENT");
                this.setColour(120);
                this.setTooltip("Event when a marker is detected");
                this.setHelpUrl("");
            }
        }

        Blockly.Blocks['augment_resource'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField("augment")
                    .appendField(new Blockly.FieldTextInput("RESOURCE"), "RESOURCE_NAME");
                this.setInputsInline(true);
                this.setPreviousStatement(true, "ACTION");
                this.setColour(210);
                this.setTooltip("Augment a resource");
                this.setHelpUrl("");
            }
        }

        this.eventBlocks = {
            marker_is_detected:
                `<block type="marker_is_detected">
                    <field name="MARKER_NAME">MARKER</field>
                </block>`
        };

        this.actionBlocks = {
            augment_resource:
                `<block type="augment_resource">
                    <field name="RESOURCE_NAME">RESOURCE</field>
                </block>`
        }
    }

    createToolbox(frameworkSupport: Support) {
        let events_toolbox: string = '';
        let actions_toolbox: string = '';
        
        for (let name in frameworkSupport.events) {
            if(frameworkSupport.events[name])
                events_toolbox += this.eventBlocks[name];
        }

        for (let name in frameworkSupport.actions) {
            if(frameworkSupport.actions[name])
                actions_toolbox += this.actionBlocks[name];
        }

        return sprintf(this.toolbox, events_toolbox, actions_toolbox);
    }

}