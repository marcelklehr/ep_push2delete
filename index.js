var eejs = require('ep_etherpad-lite/node/eejs')

/*
* Handle incoming delete requests from clients
*/
exports.handleMessage = function(hook_name, context, callback){
  var Pad = require('ep_etherpad-lite/node/db/Pad.js').Pad

  // Firstly ignore any request that aren't about chat
  var isDeleteRequest = false;
  if(context) {
    if(context.message && context.message){
      if(context.message.type === 'COLLABROOM'){
        if(context.message.data){
          if(context.message.data.type){
            if(context.message.data.type === 'ep_push2delete'){
              isDeleteRequest = true;
            }
          }
        }
      }
    }
  }
  if(!isDeleteRequest){
    callback(false);
    return false;
  }
  
  console.log('DELETION REQUEST!')

  var packet = context.message.data;
  /***
    What's available in a packet?
    * action -- The action IE chatPosition
    * padId -- The padId of the pad both authors are on
    ***/
  if(packet.action === 'deletePad'){
    var pad = new Pad(packet.padId)
    pad.remove(function(er) {
      if(er) console.warn('ep_push2delete', er)
      callback([null]);
    })
  }
}

exports.eejsBlock_editbarMenuRight = function(hook_name, args, cb) {
  if(!args.renderContext.req.url.match(/^\/(p\/r\..{16})/)) {
    args.content = eejs.require('ep_push2delete/templates/delete_button.ejs') + args.content;
  }
  cb();
};
