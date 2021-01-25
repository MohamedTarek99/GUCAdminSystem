import React, { useState ,useEffect} from "react";
import axios from "axios";
import { message } from "antd";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import "antd/dist/antd.css";

async function signedIn(){
    let res = await axios.post("http://localhost:3000/signIn")
    if (res.data == "sign in recorded successfully"){
    message.success("sign in recorded successfully")
    }
    else{
        message.error(res.data)
    }
}

async function signedOut(){
    let res = await axios.post("http://localhost:3000/signOut")
    if (res.data == "sign out recorded successfully"){
    message.success("sign out recorded successfully")
    }
    else{
        message.error(res.data)
    }
}

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1)
    }
  }));

export default function StaffWelcomePage(){
    const classes = useStyles();
    const [name,setName] = useState({})
    useEffect(async () => {
        let res=await axios.get("http://localhost:3000/viewProfile")
        const profileData = res.data
        console.log(profileData)
        setName(profileData)
        },[])

    return(
        <div
        align="center">
            <h1>Welcome {name.name}</h1>
            <div align = "center">
                
              <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes.margin}
        onClick={signedIn}
      >
        Sign in
      </Button>
      <br/>
      <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes.margin}
        onClick={signedOut}
      >
        Sign out
      </Button>

        </div>

        </div>

    );
}