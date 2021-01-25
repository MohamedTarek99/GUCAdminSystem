import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));

export default function TxtField(props) {
    const classes = useStyles();

    const handleChange = (event) => {
        props.setText(event.target.value)
    };
    
    return (
        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <TextField
                    label={props.name}
                    helperText={props.helperText}
                    variant="outlined"
                    type={props.type}
                    onChange = {handleChange}
                />
            </div>
        </form>
    );
}
