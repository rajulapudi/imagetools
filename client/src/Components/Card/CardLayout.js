import React from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
        position: "relative"
    },
    cardContent: {
        flexGrow: 1,
    }
}));
export default function CardLayout({ card }) {
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Link to={`${card.url}`}>
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.cardMedia}
                        image="https://source.unsplash.com/random"
                        title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {card.toolName}
                        </Typography>
                        <Typography>
                            {card.desc}
                        </Typography>
                    </CardContent>
                </Card>
            </Link>
        </Grid>
    )
}
