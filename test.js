const mongoose = require('mongoose');
var db = mongoose.connect('mongodb://127.0.0.1:27017/test');

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'jiayosdu' });
kitty.save()
console.log('ok')