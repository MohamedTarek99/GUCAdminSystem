import { makeStyles } from '@material-ui/core/styles';
import React, { useState ,useEffect} from "react";
import axios from "axios";
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

 function ViewProfile(){
  const classes = useStyles();
  const [profile,setProfile] = useState({})
 
  useEffect(async () => {
    let res=await axios.get("http://localhost:3000/viewProfile")
    const profileData = res.data
    console.log(profileData)
    setProfile(profileData)
    },[])
     
      return(
        <div
        align = "center"
        >
      <Card className={classes.root} 
            align= "center"
      >
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="https://www.guc.edu.eg//img/content/about_guc/48.jpg" 
          title="Profile picture"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
          {profile.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          <Chip label={"Id: "+ profile.id} />
         <br/>
         <Chip label={"Email: "+ profile.email} />
         <br/>
         <Chip label={"Department: "+ profile.department }/>
         <br/>
         <Chip label={"Faculty: "+ profile.faculty }/>
         <br/>
         <Chip label={"Dayoff: "+ profile.dayoff} />
         <br/>
         <Chip label={"Office: "+ profile.office} />
         <br/>
         <Chip label={"Extra info: "+ profile.ExtraInfo} />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    </div>
  );     
      }    

export default ViewProfile;

