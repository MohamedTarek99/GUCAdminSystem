import React, { useState ,useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {message}  from "antd";
import "antd/dist/antd.css";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1)
  }
}));
export default function ViewProfile(){
    const [email, setEmail] = useState('');
    const [office, setOffice] = useState('');
    const classes = useStyles();

    const handleEmailChange = (evt) => {
        setEmail(evt.target.value) 
    }

    const handleOfficeChange = (evt) => {
        setOffice(evt.target.value)
    }

    const updateEmail= async () => {
        const updatemail=await axios.put("http://localhost:3000/updateProfile",{"newEmail":email})
        if(updatemail.data=="profile updated successfully"){
            message.success(updatemail.data)
        }
        else{
            message.error(updatemail.data)
        }
    }

    const updateOffice= async () => {
        const updateoffice=await axios.put("http://localhost:3000/updateProfile",{"office":office})
        if(updateoffice.data=="profile updated successfully"){
            message.success(updateoffice.data)
        }
        else{
            message.error(updateoffice.data)
        }
    }
    
  return (
    <div align="center">
      <FormControl className={classes.margin}>
        <InputLabel htmlFor="input-with-icon-adornment">
          Insert new Email
        </InputLabel>
        <Input
          onChange={handleEmailChange}
        />
      </FormControl>

      <br />
      <Button
        variant="contained"
        size="small"
        color="primary"
        className={classes.margin}
        onClick={updateEmail}
      >
        Update
      </Button>
      <br />
      <br />
      <FormControl className={classes.margin}>
        <InputLabel htmlFor="input-with-icon-adornment">
          Insert new office
        </InputLabel>
        <Input
          onChange={handleOfficeChange}
        />
      </FormControl>
      <br />
      <Button
        variant="contained"
        size="small"
        color="primary"
        className={classes.margin}
        onClick={updateOffice}
      >
        Update
      </Button>
    </div>
  );


}

