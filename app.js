const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser());

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'project_purwadhika'
});

checkEmail=(email,callback)=>{
    let sql1 = "Select id from customer where email=?";
    db.query(sql1,email,(err,result)=>{
        if(err){
            console.log(err);
            return err;
        }
        if(result.length>0){
            callback(null,false);
        }else{
            callback(null,true);
        }
    })
}

insertCustomer=(data,callback)=>{
    let sql2 = "Insert into customer set ?";
    db.query(sql2,data,(err,result)=>{
        if(err){
            console.log(err);
            return err;
        }else{
            console.log(result);
            callback(null,true);
        }
    })
}

app.get('/', (req,res)=>{
    res.send({
        message:"Hello Student"
    })
})

app.get('/customer/',(req,res)=>{
    let sql = "Select id,name,email,alamat,phone from customer";
    db.query(sql,(err,result)=>{
        if(err){
            res.send({
                message:"Error",
                result:[]
            })
        }
        res.send({
            message:"Success",
            result:result
        })
    })
})

app.get('/cart/',(req,res)=>{
    let sql = "Select id,email,product_id,product_name,qty,harga from cart";
    db.query(sql,(err,result)=>{
        if(err){
            res.send({
                message:"Error",
                result:[]
            })
        }
        res.send({
            message:"Success",
            result:result
        })
    })
})

app.post('/cart/',(req,res)=>{
    let sql = "Insert into cart(email,product_id,product_name,qty,harga) values ?";
    let body = req.body.cart;
    let values = [];
    body.map((v,i)=>{
        let values2 = [];
        for (let [key, value] of Object.entries(v)){
            values2.push(value);
        }
        values.push(values2);
    })

    db.query(sql,[values],(err,result)=>{
        if(err){
            res.send({
                message:"Fail Insert Cart",
                result:[]
            })
        }else{
            res.send({
                message:"Success Insert Cart",
                result:result.affectedRows
            })
        }
    })
})

app.post('/customer/', (req,res)=>{
    let body = req.body;
    let email = req.body.email;
    checkEmail(email,(err,length)=>{
        if(err){
            res.send({
                message:"Fail Check"
            })
        }
        if(length){
            insertCustomer(body,(err,asd)=>{
                if(asd){
                    res.send({
                        message:"Insert Success"
                    })
                }else{
                    res.send({
                        message:"Insert Failed"
                    })
                }
            })
        }else{
            res.send({
                message:"Duplicate Email"
            })
        }
    })
});

app.listen(3000, ()=>{
    console.log("Server Listen on Port 3000");
})