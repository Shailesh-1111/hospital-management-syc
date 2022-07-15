//jshint esversion:6

const express= require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const { append } = require("express/lib/response");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-shailesh:test123@cluster0.chvctea.mongodb.net/testDB",{useNewUrlParser: true});



app.set('view engine','ejs');



app.get("/", function(req,res){
  res.render("index",{

  });
});


app.listen(process.env.PORT || 5500, function(req,res){
 console.log("Server is Running at Port");
});











// ..........................................Today Date Function .............................//

var today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); 
let yyyy = today.getFullYear();
today = dd + '-' + mm + '-' + yyyy;


// ..........................................Today Date Function .............................//









// ........................................... set mongoDB ...................................................//



const roomSchema=new mongoose.Schema({
  roomNo:{
    type: String
  },

  bedNo:{
    type: String
  },

  typeIcu:{
    type: String,
    default: "no"
  },

  occupied:{
    type: String,
    default: "no"
  }

});


const personSchema= new mongoose.Schema({

  ptName:{
    type: String,
    required: [true, "Please enter Patient Name"]
  },

  ptAge:{
      type: Number,
      required: [true, "Please enter Patient Age"] 
  },

  aadharNumber: {
      type: Number,
      required: [true, "Please enter Aadhar Number"]
  },

  contactNumber:{
    type: Number,
    required: [true, "Please enter Contact Number"]
  },

  dateOfAllot:{
      type: String
  },

  dateOfDischarge:{
    type: String,
    default: "Not Discharged"
  },

  roomNumber:{
    type: String
  },

  bedNumber:{
    type: String
  },

  bedType:{
    type: String
  }
});






const Room = mongoose.model("Room", roomSchema);
const Person= mongoose.model("Person", personSchema);
const Discharged= mongoose.model("Discharged", personSchema);

// const room1= new Room({
//     roomNo:"101",
//     bedNo:"1"
// });

// const room2= new Room({
//   roomNo:"101",
//   bedNo:"2"
// });

// const room3= new Room({
//   roomNo:"101",
//   bedNo:"3",
//   typeIcu:"yes"
// });

// const room4= new Room({
//   roomNo:"102",
//   bedNo:"1"
// });

// const room5= new Room({
//   roomNo:"102",
//   bedNo:"2",
//   typeIcu:"yes"
// });

// const room6= new Room({
//   roomNo:"102",
//   bedNo:"3"
// });


// Room.insertMany([room1,room2,room3,room4,room5,room6], function(err){
//   if(err) console.log(err);
//   else console.log("Data added Successfully");
// });


// ........................................... set mongoDB ...................................................//












//............................................. Take Input in Database ...................................................//



let name;
let age;
let aadhar;
let contact;
let type;
let roomGot;
let bedGot;
let size;
let dateall;


app.get("/add_result", function(req,res){
  
  res.render("add_result",{
   vw_name: name,
   vw_age: age,
   vw_aadhar: aadhar,
   vw_contact: contact,
   vw_type: type=="yes"?"ICU":"NoN-ICU",
   vw_room: roomGot,
   vw_bed: bedGot,
   vw_date: dateall
  });


  if(size>0){
    Person.create({
      ptName: name,
      ptAge: age,
      aadharNumber: aadhar,
      contactNumber: contact,
      roomNumber: roomGot,
      bedNumber: bedGot,
      bedType: type=="yes"?"ICU":"NoN-ICU",
      dateOfAllot: today
    },

    function(err){
      if(err) console.log(err);
      else console.log("Data inserted successfully");
    });


    Room.updateOne({roomNo: roomGot, bedNo: bedGot},{occupied: "yes"}, function(err){
      if(err) console.log(err);
      else console.log("Room Data Updated Successfully");
    });


  }

});


app.post("/add", function(req,res){

  name=req.body.in_name;
  age=req.body.in_age;
  aadhar=req.body.in_aadhar;
  contact=req.body.in_contact;
  type=req.body.in_type=="on"?"yes":"no";
  
  //console.log(name, age, aadhar, contact, type);


  Room.find({occupied:"no", typeIcu: type}, function(err,room){
    
    size=room.length;
   // console.log("size:"+size);

    if(err){
      console.log(err);
    }
    else if(size==0){
      res.redirect("/error_page");
    }
    else if(size>0){
        roomGot=room[0].roomNo;
        bedGot=room[0].bedNo;
        dateall=today;
       // console.log(roomGot+" "+bedGot);
        res.redirect("/add_result");
    }

  });

});

app.get("/add",function(req,res){
  res.render("add",{});
});

app.get("/error_page",function(req,res){
  res.render("error_page",{});
});

app.post("/error_page",function(req,res){
  res.redirect("/add");
})


//............................................. Take Input in Database ...................................................//









//..............................................Input from update form...................................................//
let find_name;
let find_contact;
let size_query;


app.get("/update1", function(req,res){
  res.render("update1",{});
});



app.get("/update2", function(req,res){
  
    res.render("update2",{
      vw_pt_name: name,
      vw_pt_age: age,
      vw_pt_contact: contact,
      vw_pt_aadhar:aadhar,
      vw_pt_bedno:bedGot,
      vw_pt_roomno:roomGot,
      vw_pt_type:type,
      vw_pt_date:dateall
    });

});

app.get("/not_found", function(req,res){
 res.render("not_found",{});
})



app.post("/update1",function(req,res){

  find_name=req.body.in_pt_name;
  find_contact=req.body.in_pt_contact;

 // console.log(find_name+" "+find_contact);

  Person.find({pt_name:find_name , contactNumber:find_contact}, function(err,person){
    size_query=person.length;
    //console.log(size_query);

    if(err){
      console.log(err);
      res.redirect("/err");
    }else if(size_query==0){
      console.log("No Data Found");
      res.redirect("/not_found");
    }else{
      name=person[0].ptName;
      age=person[0].ptAge;
      contact=person[0].contactNumber;
      aadhar=person[0].aadharNumber;
      bedGot=person[0].bedNumber;
      roomGot=person[0].roomNumber;
      type=person[0].bedType;
      dateall=person[0].dateOfAllot;
      res.redirect("/update2");
    }  

  });
});

//..............................................Input from update form...................................................//L




app.post("/update2", function(req,res){

  
  Person.find({pt_name:find_name, contactNumber:find_contact}, function(err,person){
    //console.log("find: "+size);

    if(err){
      console.log(err);
    }else{
      //console.log(person[0].roomNumber+" "+person[0].bedNumber);
      Room.updateOne({roomNo:person[0].roomNumber, bedNo:person[0].bedNumber},{occupied: "no"}, function(err){
        if(err) console.log(err);
        else console.log("Room Data Updated Successfully");
      });

      Person.updateOne({pt_name:find_name, contactNumber:find_contact},{dateOfDischarge: today},function(err){
        if(err) console.log(err);
        else console.log("Person Data updated Successfully");
      });


      //....................insert in discharge............................//

      const dis1= new Discharged({
        ptName: person[0].ptName,
        ptAge:person[0].ptAge,
        aadharNumber:person[0].aadharNumber,
        contactNumber:person[0].contactNumber,
        dateOfAllot:person[0].dateOfAllot,
        dateOfDischarge:today,
        roomNumber:person[0].roomNumber,
        bedNumber:person[0].bedNumber,
        bedType:person[0].bedType
      });
      //....................insert in discharge............................//

      Discharged.insertMany([dis1], function(err){
        if(err) console.log(err);
        else console.log("Discharged Data inserted Successfully");
      });

      Person.deleteMany({_id: person[0]._id},function(err){
        if(err) console.log(err);
        else console.log("Person Discharged Successfully");
      });
    }

   });
   setTimeout(function(){
   res.redirect("/update1");
   },2000);
});







// --------------------------------------------insert data on database creation - begin----------------------------------------------//


// Room.find().count(function(err,count){
//   if(err) console.log(err);
//   else if(count==0){
//     let tot=0;

//     for(let i=101;i<=400;i++){
//       for(let j=1;j<=5;j++){

//         tot++;

//         const room1= new Room({
//           roomNo:String(i),
//           bedNo:String(j),
//           typeIcu: (tot%6==0)?"yes":"no"
//         });

//         Room.insertMany([room1], function(err){
//             if(err) console.log(err);
//             // else 
//         });

//       }
//     }

//     console.log("DataBase initialized Successfully");
//   }
// });




// --------------------------------------------insert data on database creation - end----------------------------------------------//


