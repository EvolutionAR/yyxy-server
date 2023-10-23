const mongoose = require('mongoose')
mongoose.connect('mongodb://123.126.105.49:27017/seatom', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(function(){
	console.log('mongodb启动成功')
}).catch(function(e){
	console.log(e)
});