import React, { useState, useEffect } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
    const [src, setsrc] = useState()
    const classes = useStyles('');
    useEffect(() => {
        setsrc(require(`../../assets/${card.src}`))
    }, []);
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Link to={`${card.url}`}>
                <Card className={classes.card} style={{ textAlign: 'center' }}>
                    <img src={src}
                        width={`40%`}
                        style={{ marginLeft: '30%', marginTop: '10px' }}
                        onMouseOver={() => { setsrc(require(`../../assets/${card.src}`)) }}
                        onMouseOut={() => { setsrc(require(`../../assets/${card.hover}`)) }}
                        alt={card.toolName}
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
