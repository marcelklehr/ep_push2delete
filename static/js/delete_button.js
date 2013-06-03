function sendDeletionRequest(){
  var myAuthorId = pad.getUserId();
  var padId = pad.getPadId();
  // Send chat message to send to the server
  var message = {
    type : 'ep_push2delete',
    action : 'deletePad',
    padId : padId
  }
  pad.collabClient.sendMessage(message);
}

exports.documentReady = function(hook_name, args, cb) {
  $('#deletePadButton').click(function() {
    sendDeletionRequest()
  })
  cb()
}