import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function Selector(props) {
  const classes = useStyles();
  const availableSelects = props.selects;
  const name = props.name;
  const text = props.helperText;
  const [selected, setSelected] = React.useState("");

  const handleChange = (event) => {
    setSelected(event.target.value);
    props.setSelector(event.target.value);
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id="outlined-select-currency-native"
          select
          label= {name} 
          value={selected}
          onChange={handleChange}
          SelectProps={{
            native: true,
          }}
          helperText= {text}
          variant="outlined"
        >
          {availableSelects.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </TextField>
      </div>
    </form>
  );
}
