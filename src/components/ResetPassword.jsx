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

export default function ResetPassword() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setOldPassword] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });
  const [newPassword, setNewPassword] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const handleEmailChange = (evt) => {
    setEmail(evt.target.value) 
}

const handleOldPasswordChange = (evt) => {
    setOldPassword(evt.target.value)
}

const handleNewPasswordChange = (evt) => {
    setNewPassword(evt.target.value)
}

const updatePassword= async () => {
    const updatePass=await axios.put("http://localhost:3000/resetPassword", {
    email,
    password,
    newPassword,
  });
    if(updatePass.data=="Password reseted successfully"){
        message.success(updatePass.data)
    }
    else{
        message.error(updatePass.data)
    }
}


  return (
    <div align="center">
      <FormControl className={classes.margin}>
        <InputLabel htmlFor="Email">
          Insert Email
        </InputLabel>
        <Input
        onChange={handleEmailChange}
         />
      </FormControl>
      <br />
      <FormControl className={classes.margin}>
        <InputLabel htmlFor="Old password">
          Insert old password
        </InputLabel>
        
        <Input
        onChange={handleOldPasswordChange}
         />
      </FormControl>
      <br />
      <FormControl className={classes.margin}>
        <InputLabel htmlFor="New password">
          Insert new password
        </InputLabel>
        <Input
        onChange={handleNewPasswordChange} 
        />
        
      </FormControl>
      <br />
      <Button
        variant="contained"
        size="small"
        color="primary"
        className={classes.margin}
        onClick={updatePassword}
      >
        Update
      </Button>
    </div>
  );
}
