const {app}=require('./app');
const mongoose=require('mongoose');
require('dotenv').config();// without it we will not able to access process.env
mongoose.connect('mongodb+srv://user:Montasser99@cluster0.ceb0e.mongodb.net/M1?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true });
app.listen(3000);
//'mongodb+srv://user:Montasser99@cluster0.ceb0e.mongodb.net/M1?retryWrites=true&w=majority'


