Blockly.JSON = new Blockly.Generator('JSON');

Blockly.JSON.start = function(block) {
  var statements_events = Blockly.JSON.statementToCode(block, 'EVENTS');
  var code = `{ "interactions": [ ${statements_events} ]}`;
  return code;
};

var eventJSONTemplate = '{ "_event": %d , "event_inputs": [%s] , %s }';

Blockly.JSON.marker_is_detected = function(block) {
  var text_marker_name = block.getFieldValue('MARKER_NAME');
  var statements_action_input = Blockly.JSON.statementToCode(block, 'ACTION_INPUT');
  var code = sprintf(eventJSONTemplate, 1, `"${text_marker_name}"`, statements_action_input);
  var nextStatement = "";
  // TODO: Ignore events without action or give a default value.
  if(block.getNextBlock()){
    nextStatement = ", " + Blockly.JSON[block.getNextBlock().type](block.getNextBlock());
  }
  return code + nextStatement;
};

Blockly.JSON.resource_is_selected = function(block) {
  var text_resource_name = block.getFieldValue('RESOURCE_NAME');
  var statements_action_input = Blockly.JSON.statementToCode(block, 'ACTION_INPUT');
  var code = sprintf(eventJSONTemplate, 2, `"${text_resource_name}"`, statements_action_input);
  var nextStatement = "";
  // TODO: Ignore events without action or give a default value.
  if(block.getNextBlock()){
    nextStatement = ", " + Blockly.JSON[block.getNextBlock().type](block.getNextBlock());
  }
  return code + nextStatement;
};


var actionJSONTemplate = '"_action": %d , "action_inputs": [%s]';

Blockly.JSON.augment_resource = function(block) {
  var text_resource_name = block.getFieldValue('RESOURCE_NAME');
  var code = sprintf(actionJSONTemplate, 1, `"${text_resource_name}"`);
  return code;
};

Blockly.JSON.rotate_resource = function(block) {
  var text_resource_name = block.getFieldValue('RESOURCE_NAME');
  var code = sprintf(actionJSONTemplate, 2, `"${text_resource_name}"`);
  return code;
};