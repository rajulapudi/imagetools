import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import CardLayout from '../Card/CardLayout'

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
}));

const cards = [
    {
        toolName: 'compress',
        desc: 'compress images to desired file size',
        url: 'compress'
    },
    {
        toolName: 'resize',
        desc: 'compress images to desired file Dimensions',
        url: 'resize'
    },
    {
        toolName: 'crop',
        desc: 'crop images to desired pixels',
        url: 'crop'
    },
    {
        toolName: 'convert',
        desc: 'convert images to desired formats',
        url: 'convert'
    },
    {
        toolName: 'Image Editor',
        desc: 'Edit images ',
        url: 'image-editor'
    },
    {
        toolName: 'Watermark',
        desc: 'Watermark images ',
        url: 'watermark'
    },
    {
        toolName: 'Rotate Image',
        desc: 'Rotate images ',
        url: 'rotate'
    },
    {
        toolName: 'Convert to WebP',
        desc: "Google's WebP images",
        url: 'convert-webp'
    },
];

export default function Home() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <NavBar />
            <main>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            Image Formater
            </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Covert various image formats and sizes to your desired Image
            </Typography>

                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {cards.map((card, i) => <CardLayout card={card} key={i} />)}
                    </Grid>
                </Container>
            </main>
            <Footer />
        </React.Fragment>
    );
}